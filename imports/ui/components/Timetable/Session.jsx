import React from 'react';
import styled from "styled-components"

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
    ? "#ddd"
    : props.bg_colour
  )};
  color: #fff;
`

export const Session = (props) => {
  // const { height, colour, zoom } = props

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
