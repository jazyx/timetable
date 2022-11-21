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

import React from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data'

import { TeacherTracker } from './TeacherTracker'
import { TeacherToolbar, ToolBar } from './TeacherToolbar'
import { Grid } from '../Timetable/Grid'


export const Teacher = () => {
  const { teacher_name } = useParams()


  const props = useTracker(() => TeacherTracker(teacher_name))
  // {
  //   day_begin,
  //   day_end,
  //   weekdays,
  //   sessions,
  //   OR
  //   error
  // }
  if (!props.weekdays) {
    return <h1>{props.error || "Loading..."}</h1>
  }


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
