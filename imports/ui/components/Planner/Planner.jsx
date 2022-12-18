import React, { useContext } from 'react';
import styled from "styled-components"

import { TimetableContext } from '/imports/ui/contexts/TimetableContext.jsx';
import { Index } from './Index';


const StyledPlanner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #333333f0;
  z-index: 3;

  & button.close {
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 1em;
  }
`


export const Planner = () => {
  const { 
    setShowPlanner
  } = useContext(TimetableContext)


  return (
      <StyledPlanner>
        <Index />
        <p>Organizer</p>
        <button
          className="close"
          onClick={() => setShowPlanner(false)}
        >
          Done
        </button>
      </StyledPlanner>
  );
};
