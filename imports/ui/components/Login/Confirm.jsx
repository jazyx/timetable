import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import methods from '/imports/api/methods/'
const {
  confirmEmail
} = methods

import { UserContext } from  '/imports/ui/contexts/UserContext.jsx'



export const Confirm = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { setIdData } = useContext(UserContext)


  const callback = (error, data) => {
    if (data) {
      // { name, role, _id }
      const { role, name } = data
      const url = `/n/${role}/${name}`
      console.log("url:", url);
      
      setIdData(data)
      navigate(url)
    }
  }


  const confirm = () => {
    confirmEmail.call({ token }, callback)
  }


  useEffect(confirm, [])


  return (
    <>
      <h1>Confirming:</h1>
      <p>{token}</p>
    </>
  );
};
