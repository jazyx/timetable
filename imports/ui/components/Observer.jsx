import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export const Observer = () => {
  const { observer_id, teacher_id } = useParams()

  return (
      <h1>Observer {observer_id} of teacher {teacher_id} </h1>
  );
};
