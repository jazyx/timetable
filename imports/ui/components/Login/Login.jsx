import React, { useContext } from 'react'

import { UserContext } from  '/imports/ui/contexts/UserContext.jsx'



import Form from './Form'
import LogOut from './LogOut'
import ConfirmEmail from './EmailSent'


export const Login = () => {
  const { idData } = useContext(UserContext) // will be an object
  const { _id, awaiting_confirmation, jwt } = idData


  if (_id) {
    return <LogOut />
  }


  if (awaiting_confirmation || jwt) { // TODO: remove jwt (twice)
    return <ConfirmEmail
      {...idData}
    />
  }


  return (
    <Form />
  )
}
