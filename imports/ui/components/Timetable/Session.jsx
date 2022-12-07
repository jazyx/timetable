import React from 'react';
import styled from "styled-components"
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
  height: ${props => (props.height * 100 + "%")};
  border: none;
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
  ${props => props.dated
           ? `border: inset 2px #999};`
           : ""
  }
`

export const Session = (props) => {
  // const { height, colour, link } = props
  // console.log("SessionChild props:", props);
  

  if (!props.height) {
    return ""
  }

  return (
    <StyledSession
      { ...props }
    >
      {props.name}
    </StyledSession>
  );
};
