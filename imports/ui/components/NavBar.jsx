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

  return (
    <StyledNav>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/s/school">School</Link></li>
      <li><Link to="/c/company">Company</Link></li>
      <li><Link to="/t/James">Teacher</Link></li>
      <li><Link to="/s/student/teacher">Student</Link></li>
      <li><Link to="/o/observer/James">Observer</Link></li>
      <li><Link to="/not-found">Not Found</Link></li>
    </StyledNav>
  );
};
