import React, { useContext, useEffect, useState } from 'react'

import { UserContext } from  '/imports/ui/contexts/UserContext.jsx'

import storage from '/imports/api/storage.js'



import Form from './Form'
import LogOut from './LogOut'
import ConfirmEmail from './EmailSent'


export const Login = () => {
  const {
    idData,
    setIdData
  } = useContext(UserContext) // idData will be an object
  const { _id, awaiting_confirmation, jwt } = idData
  const [ renderedOnce, setRenderedOnce ] = useState(false)


  const autoLogin = () => {
    const idDetails = storage.get()

    if (idDetails.remember) {
      setIdData(idDetails)
    }

    setRenderedOnce(true)
  }


  useEffect(autoLogin, [])


  if (_id) {
    return <LogOut />
  }


  if (awaiting_confirmation || jwt) { // TODO: remove jwt (twice)
    return <ConfirmEmail
      {...idData}
    />
  }

  // HACK: Render nothing the first time so that useEffect will
  // be called to set autoLogin details before Form is shown.
  if (!renderedOnce) {
    return <></>
  }


  return (
    <Form />
  )
}
