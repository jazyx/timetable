import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export const School = () => {
  const { school_id } = useParams()

  return (
      <h1>School {school_id}</h1>
  );
};
