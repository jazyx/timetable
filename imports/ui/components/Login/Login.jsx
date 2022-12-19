import React, { useContext } from 'react'
import styled from "styled-components"

import { UserContext } from  '/imports/ui/contexts/UserContext.jsx'



const StyledLogin = styled.div`
  font-size: 8vw;
  text-align: center;

  @media (min-aspect-ratio: 1/2) {
    & {
      font-size: 4vh;
    }
  } 
`

import Form from './Form'
import LogOut from './LogOut'


export const Login = () => {
  const { loggedIn } = useContext(UserContext)

  
  if (loggedIn) {
    return (
      <>
        <p>You are already logged in</p>
        <LogOut />
      </>
    )
  }


  return (
    <StyledLogin>
      <h1>Timetable</h1>
      <Form />
    </StyledLogin>
  )
}
