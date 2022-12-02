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



export const TeacherTracker = (teacher_name) => {
  const {
    today,
    daysToDisplay,
  } = useContext(TimetableContext)

  const teacherData = Teacher.findOne({ name: teacher_name })
  // {
  //   "name":        "James",
  //   "password":    "TIiudhtm11LE",
  //   "language":    "en",
  //   "rate":        2000,
  //   "day_begin":   7.3,
  //   "day_end":     20.3,
  //   "_id":         "AiuEdtgtGJXXSZDak"
  //   "unavailable": { <day>: [[<start_time>, <end_time>], ...], ...}
  //   "inconvenient":{ <day>: [[<start_time>, <end_time>], ...], ...}
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


  const getContracts = () => {
    const query = { teacher_id: _id }
    const fields = { _id: 1 }
    const contracts = Contract.find(query, { fields })
                              .fetch()
                              .map( contract => contract._id )
    return contracts
  }


  const onlyCurrentClasses = (classDoc) => {
    const { start_date=0, end_date=0 } = classDoc
    const now = new Date()

    if (!start_date) {
      return false
    } else if (new Date(start_date) > now) {
      return false
    } else if (end_date && new Date(end_date) < now ) {
      return false
    }

    return true
  }


  const getClasses = () => {
    const contracts = getContracts()
    const query = { contract_id: { $in: contracts }}
    const classes = Class.find(query)
                         .fetch()
                         .filter(onlyCurrentClasses)
    return classes
  }


  const getSessions = () => {
    const classes = getClasses()
    return classes.reduce(getSessionMap, {})

    function getSessionMap(sessionMap, classDoc) {
      // { "name":            <string>
      //   "contract_id":     <id string>,
      //   "start_date":      <date string>,
      //   "end_date":        <date or empty string>,
      //   "students":        [<student_id>, ...],
      //   "colour":          <hex string>,
      //   "link":            <url>,
      //   "location":        <empty or gps string>,
      //   "travelling_time": <number | 0>,
      //   "regularity":      <"regular" | "variable">,
      //   "scheduled":       [<session_id>, ...]
      //   "proposal":        <true if set by school or student>
      //   "_id":             <string>
      // }

      const {
        _id: class_id,
        name,
        bg_colour,
        scheduled,
        link
      } = classDoc

      const query = { class_id }
      const sessions = Session.find(query)
                              .fetch()
                              .filter(removeForfeited)
      // Order chronologically, with precisely dated sessions first
                              .sort(byDateBeginDay)
      // console.log("sessions", JSON.stringify(sessions, null, '  '));

                          // .map(optimizeSessionData)
                          // .forEach(placeSessionInColumn)
      return sessionMap


      function removeForfeited(session) {
        // forfeited records are only needed for calculating salary
        return !session.forfeited
      }


      function byDateBeginDay(a, b) {
        if (a.date && b.date) {
          if (a.date === b.date) {
            // sort by start time
            return a.session_begin - b.session_begin
          }

          // sort by date
          return a.date < b.date ? -1 : 1
        }

        if (a.date) { // b defines a day
          // sort dates before days
          return -1
        } else if (b.date) { // a defines a day
          // ditto
          return 1
        }

        if (a.day === b.day) {
          // sort by session_begin
          return a.session_begin - b.session_begin
        }

        // sort by day
        return a.day < b.day ? -1 : 1
      }


      function optimizeSessionData(session) {
        const { day, session_begin, session_end } = session

        const begin  = getTimeArray(session_begin) // [17, 0]
        const end    = getTimeArray(session_end)
        const row    = (begin[0] - day_begin[0]) * 12
                     + begin[1] - day_begin[1] + 1
        const height = (end[0] - begin[0]) * 12
                     + end[1] - begin[1]
        // Start on Monday
        const column = (day + 6) % 7 // Mon becomes 0, Sun => 6
        return {
          ...session,
          name,
          column,
          row,
          height,
          bg_colour,
          link
        }
      }


      function placeSessionInColumn(session) {
        const { column } = session
        const colMap = sessionMap[column]
                   || (sessionMap[column] = {})
        colMap[session.row] = session
      }
    }
  }


  const getBlocked = (unavailable, inconvenient) => {

  }


  day_begin   = getTimeArray(day_begin)
  day_end     = getTimeArray(day_end)
  weekdays    = getWeekdays(language)
  const blocked  = getBlocked(unavailable, inconvenient)
  const sessions = getSessions()

  // We want to know:
  // * which day-column and
  // * which time-line each session should appear in
  // * what colour it should be
  // * what text it should show
  // * what link url it should open

  // console.log("sessions:", sessions);
  // _id:          "C3jRYE8B44iGSyXSr"
  // billed:       false
  // colour:       "#909"
  // column:       3
  // date:         ""
  // day:          4
  // height:       10
  // index:        2
  // row:          114
  // session_begin: 17.2
  // session_end:   18.1
  // supplement:   false
  // tentative:    false
  // link:         <url>

  return {
    day_begin,
    day_end,
    weekdays,
    sessions,
    // today,
    daysToDisplay
  }
}