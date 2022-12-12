/**
 *
 */

import { useContext, useEffect } from 'react';
import { TimetableContext } from '../../contexts/TimetableContext';

import collections from '/imports/api/collections/'
const {
  Teacher,
  Contract,
  Class,
  Session,
  L10n
} = collections

import {
  getTimeBetween,
  getTimeSlot,
  getMinuteSlot,
  getZoneTime,
  getLocalDate
} from '/imports/tools/utilities'



export const TeacherTracker = (teacher_name) => {
  const {
    monday,
    endTime,
    timeZone,
    setWeekStart
  } = useContext(TimetableContext)
  let daysToDisplay

  const teacherData = Teacher.findOne({ name: teacher_name })
  // {
  //   "_id":         "AiuEdtgtGJXXSZDak",
  //   "name":        "James",
  //   "password":    "TIiudhtm11LE",
  //   "language":    "en",
  //   "rate":        2000,
  //   "day_begin":   <Date string, time with day>,
  //   "day_end":     <Date string, only time used>,
  //   "unavailable": [
  //     [
  //       <Date string (start)>,
  //       <Date string (end)>,
  //       <string description>
  //     ], ...
  //   ]
  //   "inconvenient":[
  //     [
  //       <Date string (start)>,
  //       <Date string (end)>,
  //       <string description>
  //     ], ...
  //   ]
  // }

  if (!teacherData) {
    return { error: `Teacher ${teacher_name} not found` }
  }


  let {
    _id,
    day_begin,
    day_end,
    language,
    unavailable,
    inconvenient
  } = teacherData


  // Get _ids of contracts signed with the current teacher
  const getContracts = () => {
    const query = { teacher_id: _id }
    const fields = { _id: 1 }
    const contracts = Contract.find(query, { fields })
                              .fetch()
                              .map( contract => contract._id )
    return contracts
  }


  const getClasses = () => {
    const contracts = getContracts() // for current teacher
    // console.log("contracts:", contracts);
    // [ <contract_id>, ... ]

    // Find all classes associated with active contracts,
    // starting any time before the end of the period to
    // display, and ending no earlier than the beginning.
    const contract_id = { $in: contracts }
    const start_date = { $lte: endTime}
    const end_date = [
      { end_date: { $exists: false } },
      { end_date: "" },
      { end_date: { $gte: monday } }
    ]
    const query = {
      $and: [
        { contract_id },
        { start_date },
        { $or: end_date }
      ]
    }

    const classes = Class.find(query)
                         .fetch()
    return classes
  }


  const getTreatedSessionsMap = () => {
    // [<week integer>: {
    //   <class_id>: [<integer index>, ...]
    // }, ...]
    const treated = []
    const sessions = []

    const { days } = getTimeBetween(monday, endTime)

    daysToDisplay = days
    const weeks = Math.ceil(days / 7)

    for(let ii = 0; ii < weeks; ii += 1) {
      treated[ii] = {}
    }

    for(let ii = 0; ii < days; ii += 1) {
      const localDate = getLocalDate(monday, ii, timeZone)
      sessions[ii] = [localDate]
    }

    return {
      treated,
      sessions
    }
  }


  const getSessions = () => {
    const classes = getClasses()
    const { treated, sessions } = getTreatedSessionsMap()
    return classes.reduce(getSessionMap, sessions)

    function getSessionMap(sessionMap, classDoc) {
      // { "name":            <string>
      //   "contract_id":     <id string>,
      //   "start_date":      <date string>,
      //   "end_date":        <date or empty string>,
      //   "students":        [<student_id>, ...],
      //   "bg_colour":       <hex string>,
      //   "link":            <url>,
      //   "location":        <empty or gps string>,
      //   "travelling_time": <number | 0>,
      //   "proposal":        <true if set by school or student>
      //   "_id":             <string>
      // }

      const { _id: class_id } = classDoc
      // Find all sessions with this class_id, which either
      // are repeated_from_(an earlier)_date
      // or
      // fall in the period from monday to endTime
      const query = { $and: [
        { class_id },
        { forfeited: { $exists: 0 } },
        { $or: [
          { repeat_from_date: { $exists: 1 } },
          { date: {
            $gte: monday,
            $lte: endTime
          }}
        ]}
      ]}
      Session.find(query)
             .fetch()
      // Order chronologically, with precisely dated sessions first
             .sort(byDateBeginDay)
             .forEach(placeSession) // updates sessionMap

      return sessionMap



      function byDateBeginDay(a, b) {
        if (a.date && b.date) {
          return a.date - b.date
        }

        if (a.date) { // b defines repeat_from_date
          // sort dates before days
          return -1
        } else if (b.date) { // a defines repeat_from_date
          // ditto
          return 1
        }

        // The order of repeat_from_dates is not really important
        return a.repeat_from_date - b.repeat_from_date
      }



      function placeSession(session) {
        if (session.date) {
          placeDatedSession(session)
        } else if (session.repeat_from_date) {
          placeRepeatingSessions(session)
        }
      }


      function placeDatedSession(session) {
        const {
          date,
          duration,
          index,
        } = session

        // HACK
        // height will be passed as a prop to the Session
        // component, and will thus be added as an attribute to
        // the Session div element. Its value can therefore be
        // retrieved and used to calculate the number of slots
        // required before the next session while dragging.
        const height = duration / 5

        // Place this dated session
        const { days: column } = getTimeBetween(monday, date)
        // <<< WET // WET // WET // WET // WET // WET //
        const daySlot  = sessionMap[column]
                      || (sessionMap[column] = {})
        // + 1 allows for a header cell
        const row = getTimeSlot(day_begin, date) + 1
        daySlot[row] = {
          ...session,
          ...classDoc,
          column,
          row,
          height,
          dated: true
        }
        // WET // WET // WET // WET // WET // WET >>>//

        // Remember which week it was placed in.
        const week      = parseInt(column / 7)
        const weekSlot  = treated[week] || (treated[week] = {})
        const classSlot = weekSlot[class_id]
                      || (weekSlot[class_id] = [])
        classSlot.push(index)
      }


      function placeRepeatingSessions(session) {
        // Place this session repeatedly, during the period from
        // monday to endTime. This means determining which columns
        // represent the

        const {
          repeat_from_date,
          duration,
          index,
        } = session

        const height = duration / 5
        // Determine which day of the week the repeating session
        // is expected
        const { day } = getZoneTime(repeat_from_date, timeZone)
        const offset = (day + 6) % 7 // 0 for Monday

        treated.forEach((week, weekIndex) => {
          const datedSessionIndices = week[class_id] || []
          if (datedSessionIndices.indexOf(index) < 0) {
            const column  = weekIndex * 7 + offset

            const daySlot = sessionMap[column] // may not exist

            if (daySlot) {
              const row = getTimeSlot(day_begin,repeat_from_date)+1
              daySlot[row] = {
                ...session,
                ...classDoc,
                column,
                row,
                height,
              }
            }
          }
         })
      }
    }
  }


  const hourLine = getMinuteSlot(day_begin, timeZone)
  let { hour: firstHour } = getZoneTime(day_begin, timeZone)
  firstHour += !!hourLine

  const rows = getTimeSlot(day_begin, day_end)
  const sessions = getSessions() || []

  // Tell the TimetableContext when this teacher's week started
  useEffect(() => {
    const weekStart = new Date(monday)
    weekStart.setHours(day_begin.getHours())
    weekStart.setMinutes(day_begin.getMinutes())
    setWeekStart(weekStart)
  }, []) // Dependency array required to prevent circular calls


  return {
    firstHour,
    hourLine,
    rows,
    sessions,
    daysToDisplay
  }
}