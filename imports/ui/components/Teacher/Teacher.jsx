/**
 * Teacher.jsx
 *
 * Displays:
 * + [New...] button, to create
 *   - New student
 *   - New company
 *   - New school
 * + Date button to show widget to jump to a specific date
 * + Calendar for the current week
 *   - Can scroll to show future weeks
 *   - Times shown every 2/3 columns
 *   - Earliest and latest times depend on expected session times
 */

import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data'

import { TimetableContext } from '../../contexts/TimetableContext';

import { TeacherTracker } from './TeacherTracker'
import { TeacherToolbar } from './TeacherToolbar'
import { Grid } from '../Timetable/Grid'


export const Teacher = () => {
  const { teacher_name } = useParams()

  const context = useContext(TimetableContext)
  context.teacher_name = teacher_name
  // {
  //   monday,
  //   endTime,
  //   timeZone,
  //   teacher_name
  // }
  const { monday, setWeekStart } = context


  const props = useTracker(() => TeacherTracker(context))
  // {
  //   blocked, <<<<
  //   firstHour,
  //   hourLine,
  //   rows,
  //   sessions,
  //   daysToDisplay
  // OR
  //   error
  // }
  if (!props.sessions) {
    return <h1>{props.error || "Loading..."}</h1>
  }


  // Tell the TimetableContext when this teacher's week started
  const { day_begin } = props
  useEffect(() => {
    const weekStart = new Date(monday)
    weekStart.setHours(day_begin.getHours())
    weekStart.setMinutes(day_begin.getMinutes())
    setWeekStart(weekStart)
  }, []) // Dependency array required to prevent circular calls


  return (
    <>
      <TeacherToolbar
        teacher_name={teacher_name}
      />
      <Grid
        {...props}
      />
    </>
  );
};
