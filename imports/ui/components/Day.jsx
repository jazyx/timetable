import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TimeTable } from '../api/timetable';

export const Day = () => {
  const timetable = useTracker(() => {
    return TimeTable.find().fetch();
  });

  return (
    <div>
      <ul>{timetable.map(
        day => <li key={day._id}>
          <a href={day.url} target="_blank">{day.title}</a>
        </li>
      )}</ul>
    </div>
  );
};
