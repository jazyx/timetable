/**
 * Teacher.jsx
 *
 * Displays:
 * + Toolbar with:
 *   - Teacher's name
 *   - Space for future tools
 *   - Time Zone selector
 * + Calendar for the current week and for one week from today
 * 
 * Future:
 * + [New...] button, to create
 *   - New student
 *   - New company
 *   - New school
 * + Date button to show widget to jump to a specific date
 */

import React from 'react';
import { useParams } from 'react-router-dom';

import { Calendar } from '../Timetable/Calendar'
import { TeacherToolbar } from './TeacherToolbar'


export const Teacher = () => {
  const { teacher_name } = useParams()
  
  
  const props = {
    teacher_name,
    daysToShow: 8,
    hidePast:   false,
    dragState:  "all"
  }

  
  return (
    <>
      <TeacherToolbar
        teacher_name={teacher_name}
      />
      <Calendar
        {...props}
      />
    </>
  )
};
