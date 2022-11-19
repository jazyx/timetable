import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export const Student = () => {
  const { student_id, teacher_id } = useParams()

  return (
      <h1>Student {student_id} of teacher {teacher_id}</h1>
  );
};
