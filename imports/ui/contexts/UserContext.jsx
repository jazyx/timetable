/**
 * UserContext.jsx
 */

import React, { createContext, useState } from 'react'


export const UserContext = createContext()


export const UserProvider = ({children}) => {
  const [ idData, setIdData ] = useState({})
  // { [jwt,] [awaiting_confirmation,] email, _id, name, role }
  const [ useLog, setUseLog ] = useState(true)
  // used by Login to decide whether to show Log In or Register


  return (
    <UserContext.Provider
      value ={{
        idData,
        setIdData,
        useLog,
        setUseLog
      }}
    >
      {children}
    </UserContext.Provider>
  )
 }
