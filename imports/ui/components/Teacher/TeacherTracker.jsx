/**
 * 
 */

 import collections from '/imports/api/collections/'
 const {
  Teacher,
  Contract,
  Class,
  Lesson,
  L10n
} = collections
 
 
 
 export const TeacherTracker = (teacher_name) => {
  const teacherData = Teacher.findOne({ name: teacher_name })
  // {
  //   "name":       "James",
  //   "password":   "TIiudhtm11LE",
  //   "language":   "en",
  //   "rate":       2000,
  //   "day_begin":  7.3,
  //   "day_end":    20.3,
  //   "_id":        "AiuEdtgtGJXXSZDak"
  // }

  if (!teacherData) {
    return { error: `Teacher ${teacher_name} not found` }
  }


  let { 
    _id,
    day_begin,
    day_end,
    language
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
  
    } else { // use English by default
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


  const getLessons = () => {
    const classes = getClasses()
    return classes.reduce(getLessonList, [])

    function getLessonList(lessonList, classDoc) {
      // {
      //   "contract_id":     "6dHpTJMSjejzne6XA",
      //   "start_date":      <date string>,
      //   "end_date":        <date or empty string>,
      //   "students":        [<student_id>, ...],
      //   "colour":          <hex string>,
      //   "zoom":            <url>,
      //   "location":        <empty or gps string>,
      //   "travelling_time": <number | 0>,
      //   "regularity":      <"regular" | "variable">,
      //   "scheduled":       [<lesson_id>, ...]
      //   "proposal":        <true if set by school or student>
      //   "_id":             <string>
      // }

      const {
        colour,
        scheduled,
        zoom
      } = classDoc

      const query = { _id: { $in: scheduled }}
      const lessons = Lesson.find(query).fetch()
                            .filter(removeCancelled)
                            .map(optimizeLessonData)
      return [...lessonList, ...lessons]

  
      function removeCancelled(lesson) {
        return !lesson.unscheduled && !lesson.forfeited
      }
    

      function optimizeLessonData(lesson) {
        const { day, lesson_begin, lesson_end } = lesson
        const column = (day + 6) % 7 // Mon becomes 0, Sun => 6 
        return { 
          ...lesson,
          colour,
          zoom,
          column
        }
      }
    }
  }


  day_begin = getTimeArray(day_begin)
  day_end   = getTimeArray(day_end)
  weekdays  = getWeekdays(language)
  const lessons = getLessons()

  // We want to know:
  // * which day-column and 
  // * which time-line each lesson should appear in
  // * what colour it should be
  // * what text it should show
  // * what Zoom url it should open
  console.log("lessons:", lessons);
  // _id:          "C3jRYE8B44iGSyXSr"
  // billed:       false
  // colour:       "#909"
  // date:         ""
  // day:          4
  // index:        2
  // lesson_begin: 17.2
  // lesson_end:   18.1
  // supplement:   false
  // tentative:    false
  // zoom:         <url>
  
  

  return { 
    day_begin,
    day_end,
    weekdays,
    lessons
  }
 }