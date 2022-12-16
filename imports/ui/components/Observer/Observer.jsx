


/**
 * Observer.jsx
 */

import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data'

import { TimetableContext } from '/imports/ui/contexts/TimetableContext.jsx';

import { SessionTracker } from '../SessionTracker'
import { ObserverToolbar } from './ObserverToolbar'
import { Grid } from '../Timetable/Grid'

import methods from '/imports/api/methods/'
const {
  createDatedSession
} = methods



export const Observer = () => {
  const { observer_id, teacher_name } = useParams()
  
  const context = useContext(TimetableContext)
  context.teacher_name = teacher_name
  // {
  //   monday,
  //   endTime,
  //   timeZone,
  //   setWeekStart,
  //   setDaysToShow,
  //   setHidePast,
  //   +
  //   teacher_name
  //   + other unused properties
  // }
  const {
    monday,
    setWeekStart,
    setDaysToShow,
    setHidePast,
    setDragState
  } = context


  const props = useTracker(() => SessionTracker(context))
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

    setDaysToShow(2)
    setHidePast(true)
    setDragState("none")
  }, []) // Dependency array required to prevent circular calls



  // return <h1>{teacher_name}</h1>

  return (
    <>
      <ObserverToolbar
        observer_name={observer_id}
        teacher_name={teacher_name}
        />
      <Grid
        {...props}
      />
    </>
  );
};
