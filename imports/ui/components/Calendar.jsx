/** 
 * Calendar.jsx
 *
 * Displays a calendar for the the period defined by:
 * - today
 * - hidePast:      shows days back to Monday this week if false
 * - daysToDisplay: number of total days to show
 * 
 * - Times are shown every 2 columns
 * - Earliest and latest times depend on availability of
 *     current teacher
 *
 * Future:
 * + Can scroll to show future and past weeks
 *
 * 1. The teacher's name is read in from props
 * 2. The period of the current display (monday - endTime) and
 *    the selected timeZone are read in from TimetableContext
 * 3. These data are passed to the SessionTracker, which returns
 *    { blocked:     <<< not yet implemented >>>
 *      day_begin:   (date)Time when teacher starts
 *      firstHour:   integer number of first hour to display
 *      hourLine:    row on which to display the first hour
 *      rows:        total number of rows (used in Grid.jsx >
 *                   Styles.jsx to calculate the height of the
 *                   row divs)
 *      sessions:    array of day column arrays, each day column
 *                   having at least one a item: the name and date
 *                   of the day. Column arrays may also contain
 *                   session objects
 *      createDated: array of scheduled repeating sessions which
 *                   occurred in the past, and which need to be
 *                   converted to a date session.
 *    }
 * 4. Calls <Grid /> with the above data to create the calendar
 * 5. Calls setWeekStart to tell TimetableContext what time the
 *    current teacher starts the day
 * 6. Possibly calls the createDatedSession Meteor method (in
 *    /imports/api/methods/timeTable.js) to convert any
 *    scheduled repeating sessions to dated sessions, if they
 *    have already occurred.
 */

import React, { useContext, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data'

import { TimetableContext } from '/imports/ui/contexts/TimetableContext.jsx';

import { SessionTracker } from './SessionTracker'
import { Grid } from './Timetable/Grid'

import methods from '/imports/api/methods/'
const {
  createDatedSession
} = methods



export const Calendar = (props) => {
  const {
    teacher_name,
    daysToShow,
    hidePast,
    dragState,
  } = props

  console.log("props:", props);
  

  const context = useContext(TimetableContext)
  context.teacher_name = teacher_name
  // {
  //   monday,
  //   endTime,
  //   timeZone,
  //   setWeekStart,
  //   + teacher_name from props
  //   + other unused properties
  // }
  const {
    monday,
    setWeekStart,
    setDaysToShow,
    setHidePast,
    setDragState
  } = context


  const gridProps = useTracker(() => SessionTracker(context))
  // {
  //   blocked, <<<<
  //   day_begin,
  //   firstHour,
  //   hourLine,
  //   rows,
  //   sessions,
  //   createDated
  // OR
  //   error
  // }
  if (!props.sessions) {
    return <h1>{props.error || "Loading..."}</h1>
  }

  console.log("gridProps:", gridProps);
  


  const { day_begin, createDated } = props
  useEffect(() => {
    // Tell the TimetableContext when this teacher's week started
    const weekStart = new Date(monday)
    weekStart.setHours(day_begin.getHours())
    weekStart.setMinutes(day_begin.getMinutes())
    setWeekStart(weekStart)

    // Convert any past repeating sessions to dated sessions
    createDated.forEach(session => {
      createDatedSession.call(session)
    })

    setDaysToShow(daysToShow)
    setHidePast(hidePast)
    setDragState(dragState)
  }, []) // Dependency array required to prevent circular calls



  // return <h1>{teacher_name}</h1>

  return (
    <Grid
      {...gridProps}
    />
  );
};
