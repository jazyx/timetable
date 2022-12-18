import React from 'react';
import { useParams } from 'react-router-dom';

export const Client = () => {
  const { client_id } = useParams()

  return (
      <h1>Client {client_id}</h1>
  );
};
