import React, { useState } from 'react';
import styled from "styled-components"



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
  return (
    <StyledBar>
      <span className="name">{teacher_name} </span>
      <span className="tools">(tools will go here)</span>
    </StyledBar>
  );
};
