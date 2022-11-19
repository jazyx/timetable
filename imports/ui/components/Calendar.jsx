import React, { useState } from 'react';
import { Day } from './Day.jsx';

export const Calendar = () => {

  return (
    <div>
      <button onClick={increment}>Click Me</button>
      <p>You've pressed the button {counter} times.</p>
      <Day />
    </div>
  );
};
