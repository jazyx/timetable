import React, { useContext } from 'react'

import { UserContext } from  '/imports/ui/contexts/UserContext.jsx'



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
    <Form />
  )
}
