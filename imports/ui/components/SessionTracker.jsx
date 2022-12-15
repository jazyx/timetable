 /**
 * SessionTracker.js
 *
 * SessionTracker is called each time a component that uses it is
 * (re-)rendered.
 *
 * For now, this is just Teacher.jsx.
 *
 * It generates an object containing data that is used by Grid to
 * display a calendar
 *
 * return {
 *   day_begin:     used by the calling component to calculate
 *                  weekStart, which will be set in
 *                  TimetableContext
 *   firstHour:     integer hour in which day_begin occurs.
 *                  Used by Grid as the starting point for the
 *                  ::before entries for the timed cells
 *   hourLine:      integer number of slots before the first
 *                  complete hour in the teacher's day. Used by
 *                  Grid to calculate where to draw hour cells
 *   rows:          integer total number of 5-minutes time slots.
 *                  Used by StyledGrid to calculate the height of
 *                  each slot div, in order to fill the page
 *                  height
 *   sessions:      array of day/column arrays. Each day/column
 *                  array will start with a date string. There
 *                  may be session objects later in the array.
 *   daysToDisplay: integer total number of days between the
 *                  `monday` of the current week and the last day
 *                  to show in the calendar
 *   createDated:   array. May contain session objects which will
 *                  be used to generate dated session records for
 *                  scheduled repeating sessions which are now in
 *                  the past.
 * }
 *
 * The SessionTracker requires the following input from the
 * component that calls it:
 *
 * - teacher_name: from URL params
 * - monday:    \
 * - endTime:    > imported from TimetableContext
 * - timeZone   /
 *
 * 1. Finds the appropriate Teacher document, to use:
 *    - teacher_id: to obtain contract records for the teacher
 *    - day_begin and _end: to calculate rows needed for grid
 *    - language: to determine what language to display the date
 *      headers in the calendar
 * 2. Uses teacher_id to find all the current Contracts for this
 *    teacher
 * 3. Uses the array of contract_ids to find all the currently
 *    active Classes for each Contract
 * 4. Uses the class_ids to find all the Sessions that:
 *    - Are dated within the period between monday and endTime
 *    - Repeat every week at a specific time
 * 5. Orders sessions:
 *    - Dated sessions
 *    - Unschedule sessions (with a specific date)
 *    - Repeating sessions
 * 6. Places each session in the appropriate place in the sessions
 *    array
 * 7. If any repeating sessions are scheduled for some time in the
 *    past, these are added to the createDated, so that the
 *    calling component can call the createDatedSession() Meteor
 *    method on useEffect. This will cause a re-render which will
 *    cause SessionTracker to be called again
 */


import collections from '/imports/api/collections/'

const {
  Teacher,
  Contract,
  Class,
  Session,
} = collections

import {
  getTimeBetween,
  getTimeSlot,
  getMinuteSlot,
  getZoneTime,
  getLocalDate,
  reschedule
} from '/imports/tools/utilities'


export const SessionTracker = (props) => {
  const {
    teacher_name,
    monday,
    endTime,
    timeZone,
    hidePast
  } = props
  let daysToDisplay
  const now = new Date()
  const createDated = []
  

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
    _id: teacher_id,
    day_begin,
    day_end,
    language,
    unavailable,
    inconvenient
  } = teacherData


  // Get _ids of contracts signed with the current teacher
  const getContracts = () => {
    const query = { teacher_id }
    const fields = { _id: 1 }
    const contracts = Contract.find(query, { fields })
                              .fetch()
                              .map( contract => contract._id )
    return contracts
  }


  const getClasses = () => {
    const contracts = getContracts() // for current teacher

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
    // OUTPUT:
    // { treated: [
    //     <week integer>: {
    //       <class_id>: [<integer index>, ...]
    //     },
    //     ...
    //   ],
    //   sessions: [
    //      [[<Date>]],
    //      ...
    //   ]
    // }

    const treated = []
    const sessions = []

    ;({ days: daysToDisplay } = getTimeBetween(monday, endTime))

    const weeks = Math.ceil(daysToDisplay / 7)

    for(let ii = 0; ii < weeks; ii += 1) {
      treated[ii] = {}
    }

    for(let ii = 0; ii < daysToDisplay; ii += 1) {
      const date = getLocalDate(monday, ii, timeZone, language)
      sessions[ii] = [date]
    }

    return {
      treated,
      sessions
    }
  }


  const getSessions = () => {
    const classes = getClasses()
    const { treated, sessions } = getTreatedSessionsMap()
    // Map all sessions since monday
    const sessionMap = classes.reduce(getSessionMap, sessions)

    if (hidePast) {
      // Remove day/column arrays for days before today
      const { days: yesterday } = getTimeBetween(monday, now)
      sessionMap.splice(0, yesterday)
      daysToDisplay -= yesterday
    }

    return sessionMap

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
        const daySlot  = sessionMap[column]
                      || (sessionMap[column] = {})
        // + 1 allows for a header cell
        const row = getTimeSlot(day_begin, date) + 1
        daySlot[row] = {
          ...classDoc,
          ...session,
          column,
          row,
          height
        }

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

            const scheduled = reschedule(monday, column, repeat_from_date)

            if (scheduled < now) {
              createDated.push({ ...session, scheduled })
            }

            const daySlot = sessionMap[column] // may not exist

            if (daySlot) {
              const row = getTimeSlot(day_begin,repeat_from_date)+1

              daySlot[row] = {
                ...classDoc,
                ...session,
                column,
                row,
                height,
                // additional properties for repeating sessions
                scheduled,
                day,
                weekIndex
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

  return {
    day_begin,
    firstHour,
    hourLine,
    rows,
    sessions,
    daysToDisplay,
    hidePast,
    createDated
  }
}