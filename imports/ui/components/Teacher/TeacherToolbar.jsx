import React, { useContext } from 'react';
import styled from "styled-components"

import { TimetableContext } from '/imports/ui/contexts/TimetableContext.jsx';

import { TimeZones } from '../Timetable/TimeZones'
import { Planner } from '../Planner/Planner'



const StyledBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #003;
  padding: 0.5em 0;

  & span {
    padding: 0 1em;
  }

  & span.name {
    font-size: 1.5em
  }
`


export const TeacherToolbar = ({teacher_name}) => {
  const {
    showPlanner,
    setShowPlanner
  } = useContext(TimetableContext)
  

  const planner = showPlanner
                ? <Planner />
                : ""

  return (
    <StyledBar>
      <span className="name">{teacher_name} </span>
      <button
        className="organizer"
        onClick={() => setShowPlanner(true)}
      >
        Organizer
      </button>
      <TimeZones />
      {planner}
    </StyledBar>
  );
};
