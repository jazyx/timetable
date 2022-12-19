/**
 * RequireLogin
 */

import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '/imports/ui/contexts/UserContext.jsx';

export const RequireLogin = ({ children, redirectTo }) => {
  const { token } = useContext(UserContext);
  
  console.log("token:", token);
  
     
  return token
       ? children
       : <Navigate to={redirectTo} />;
}


