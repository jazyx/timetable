import React, { useContext } from 'react';
import styled from "styled-components"
import { TimetableContext } from '../../contexts/TimetableContext';
import {
  translucify,
  toneColor
} from '/imports/tools/utilities.js'



const StyledSession = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 1;

  height: ${props => (props.height * 100 + "%")};

  // Colours depend on whether session is scheduled
  background-color: ${props => (
    props.unscheduled
    ? translucify(props.bg_colour, 0.33)
    : props.bg_colour
  )};
  color: ${props => (
    props.unscheduled
    ? translucify(props.bg_colour, 0.5)
    : "inherit"
  )};

  ${props => props.scheduled
           ? "border: none;"
           : `border: inset 2px #999};`
  }
  pointer-events: all;
  cursor: grab;

  &.dragged {
    opacity: 0.3333;
  }
`

export const Session = (props) => {
  console.log("Session props:", props);
  // _id:               <string session id>
  // class_id:          <string id>
  // contract_id:       <string id>
  // name:              <class name>
  // students:          [<student name>, ...]
  //
  // bg_colour:         <hex string>
  // index:             <integer session in week>
  // column:            <integer days since monday>
  // row:               <integer 5-minute slots since day_begin>
  // duration:          <integer minutes>
  // height:            <duration / 5>
  //
  // repeat_from_date:  <Date>
  // scheduled:         <Date>
  // day:               <integer day number>
  // weekIndex:         <integer index of weeks since monday>
  // OR
  // date:              <Date>
  // start_date:        <Date>
  // end_date:          <"" | Date>
  //
  // link:              <url for online meeting>
  // location:          <url for meeting address>
  // travelling_time:   <minutes from previous location></minutes>
  // proposal:          <true if set by School>

  const { height, _id, scheduled, weekIndex, day } = props
  if (!height) {
    return ""
  }


  const {
    dragStart,
    dragEnd
  } = useContext(TimetableContext)


  const updateTimetable = () => {
    dragEnd(_id, scheduled, weekIndex, day)
  }


  return (
    <StyledSession
      { ...props }
      draggable
      onDragStart={dragStart}
      onDragEnd={updateTimetable}
      className="session"
    >
      {props.name}
    </StyledSession>
  );
};
