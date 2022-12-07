/**
 *
 */

import { useContext } from 'react';
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
  getZoneTime
} from '/imports/tools/utilities'



export const TeacherTracker = (teacher_name) => {
  const {
    midnight,
    monday,
    day,
    endTime,
    daysToDisplay,
    timeZone
  } = useContext(TimetableContext)

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



  const getTimeArray = (decimal) => {
    const hour = parseInt(decimal, 10)
    const line = Math.round((decimal % 1 * 100) % 60 / 5)

    return [ hour, line ]
  }


  const getWeekdays = () => {
    const l10n = L10n.findOne({ code: language }, { d: 1 })
    if ( l10n && l10n.d ) {
      return l10n.d

    } else { // use English by default, starting with Monday
      return [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
      ]
    }
  }


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


  const getSessions = () => {
    const classes = getClasses()
    const treated = {}
    return classes.reduce(getSessionMap, {})

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
      const sessions = Session.find(query)
                              .fetch()
      // Order chronologically, with precisely dated sessions first
                              .sort(byDateBeginDay)
                              .forEach(placeSession)

      // console.log("treated:", treated);
      // console.log("sessions", JSON.stringify(sessions, null, '  '));
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
        const {
          _id,
          date,
          repeat_from_date,
          duration,
          index,
        } = session

        const height = duration / 5

        if (date) {
          // Place this dated session
          const { days: column } = getTimeBetween(monday, date)
          const daySlot  = sessionMap[column]
                       || (sessionMap[column] = {})
          const row = getTimeSlot(day_begin, date) + 1
          daySlot[row] = {
            ...session,
            ...classDoc,
            column,
            row,
            height,
          }

          // Remember which week it was placed in.
          const week      = parseInt(column / 7)
          const weekSlot  = treated[week] || (treated[week] = {})
          const classSlot = weekSlot[class_id]
                        || (weekSlot[class_id] = [])
          classSlot.push(index)
        }
      }
    }
  }


  const hourLine = getMinuteSlot(day_begin, timeZone)
  let { hour: firstHour } = getZoneTime(day_begin, timeZone)
  firstHour += !!hourLine

  const rows = getTimeSlot(day_begin, day_end)
  const sessions = getSessions() || []
  const weekdays = getWeekdays()
  // console.log("sessions:", sessions);


  return {
    firstHour,
    hourLine,
    rows,
    sessions,
    weekdays,
    daysToDisplay,

    midnight,
    monday,
    day
  }
}