import React from 'react';
import { Link } from "react-router-dom";
import styled from "styled-components"


const StyledNav = styled.ul`
display: flex;
margin: 0;
padding: 0;
text-align: center;
background-color: #ccc;
list-style-type: none;

& li {
  flex: 1;
  border: 2px outset #999;
  color: #666;
}

& li:hover {
  border-style: solid;
  color: #333;
}

& li:active {
  border-style: inset;
  color: #000;
}

a {
  display: inline-block;
  height: 100%;
  width: 100%;
  color: inherit;
}
`

export const NavBar = () => {
  const showLink = (event) => {
    console.log("event.target.innerText:", event.target.innerText);
  }


  return (
    <StyledNav>
      <li ><Link to="/">Home</Link></li>
      <li ><Link to="/n/school/school">School</Link></li>
      <li ><Link to="/n/teacher/James">Teacher</Link></li>
      <li ><Link to="/n/student/student/teacher">Student</Link></li>
      <li ><Link to="/n/observer/Александра/James">Observer</Link></li>
      <li ><Link to="/not-found">Not Found</Link></li>
    </StyledNav>
  );
};
