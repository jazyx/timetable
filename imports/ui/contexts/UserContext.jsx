/**
 * UserContext.jsx
 */

import React, { createContext, useState } from 'react'

import { useTracker } from 'meteor/react-meteor-data'

import { AccountTracker } from '/imports/api/trackers/AccountTracker'



export const UserContext = createContext()



export const UserProvider = ({children}) => {
  const [ idData, setIdData ] = useState({})
  // Before login | registration:
  // { name, email, password, role, remember, autoLogin }
  // After registration, before confirmation:
  // { [jwt,] [awaiting_confirmation,] email }
  //
  // After login:
  // { _id, name, role }

  const [ useLog, setUseLog ] = useState(true)
  // used by Login to decide whether to show Log In or Register

  const { setUpComplete } = useTracker(() => AccountTracker(idData))
  console.log("setUpComplete:", setUpComplete);


  return (
    <UserContext.Provider
      value ={{
        idData,
        setIdData,
        useLog,
        setUseLog,
        setUpComplete
      }}
    >
      {children}
    </UserContext.Provider>
  )
 }
