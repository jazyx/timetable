/**
 * Calendar.jsx
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

  let context = useContext(TimetableContext)
  context.teacher_name = teacher_name
  // {
  //   monday,
  //   endTime,
  //   timeZone,
  //   setWeekStart
  //   + props
  //   + other unused properties
  // }
  const {
    monday,
    setWeekStart,
    setDaysToShow,
    setHidePast,
    setDragState
  } = context


  props = useTracker(() => SessionTracker(context))
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
      {...props}
    />
  );
};
