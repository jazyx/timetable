/**
 * Observer.jsx
 */

import React from 'react';
import { useParams } from 'react-router-dom';

import { Calendar } from '../Timetable/Calendar'
import { ObserverToolbar } from './ObserverToolbar'




export const Observer = () => {
  const { observer_id, teacher_name } = useParams()
  
  const props = {
    teacher_name,
    daysToShow: 2,
    hidePast:   true,
    dragState:  "none"
  }

  return (
    <>
      <ObserverToolbar
        teacher_name={teacher_name}
        observer_id={observer_id}
      />
      <Calendar
        {...props}
      />
    </>
  )
};
