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

    console.log("idDetails:", idDetails);
    console.log("idData:", idData);
    
    
    
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


  if (!renderedOnce) {
    return <></>
  }


  return (
    <Form />
  )
}
