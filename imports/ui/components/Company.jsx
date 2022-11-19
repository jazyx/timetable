import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export const Company = () => {
  const { company_id } = useParams()

  return (
      <h1>Company {company_id}</h1>
  );
};
