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

import { Grid } from '../Timetable/Grid'
import { TeacherTracker } from './TeacherTracker'


export const Teacher = () => {
  const { teacher_name } = useParams()

  // <<< Simulated tracker data

  const props = useTracker(() => TeacherTracker(teacher_name))
  // {
  //   day_begin,
  //   day_end,
  //   weekdays=[],
  //   sessions,
  //   error
  // }
  if (!props.weekdays) {
    return <h1>{props.error || "Loading..."}</h1>
  }


  return (
    <>
      <h1>Teacher {teacher_name}</h1>
      <Grid
        {...props}
      />
    </>
  );
};
