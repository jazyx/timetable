/**
 * Teacher.jsx
 */

import React from 'react';
import { useParams } from 'react-router-dom';

import { Calendar } from '../Calendar'
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
