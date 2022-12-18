import React from 'react';
import styled from "styled-components"

// import { TimetableContext } from '/imports/ui/contexts/TimetableContext.jsx';


const StyledIndex = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 10em;
  height: 100vh;

  background-color: #0006;
  border-right: 1px solid #333;

  -webkit-box-shadow: 5px 0px 15px 0px rgba(0,0,0,1);
  -moz-box-shadow: 5px 0px 15px 0px rgba(0,0,0,1);
  box-shadow: 5px 0px 15px 0px rgba(0,0,0,1);

  & hr {
    margin-bottom: 4em;
  }
`

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 4em;

  & li {
    border: 2px outset #fff9;
    border-radius: 0.25em;
    padding: 0.5em;
    box-sizing: border-box;
    margin: 0.5em 5%;
    width: 90%;
    color: #999;

    &:hover {
      color: #ccc;
    }

    &.selected {
      color: #fff;
      border-style: inset;
      background-color: #000;
    }

    &[disabled] {
      color: #444;
      border-color: #444;
      border-style: solid;
    }
  }
`

export const Index = () => {

  return (
    <StyledIndex>
      <StyledList>
        <li>My Teacher Profile</li>
        <li>My Schools</li>
        <li className="selected">My Clients</li>
        <li>Assignments</li>
        <li>My Classes</li>
        <li disabled>My Proposals</li>
        <li>My Observers</li>
      </StyledList>

      <hr/>

      <StyledList>
        <li>Our School</li>
        <li className="selected">Our Teachers</li>
        <li>Our Clients</li>
        <li>Assignments</li>
        <li>Proposals</li> 
        <li>Classes</li>
        <li>Zoom Reservations</li>
      </StyledList>
   </StyledIndex>
  );
};
