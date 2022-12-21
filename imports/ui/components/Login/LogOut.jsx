import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from  '/imports/ui/contexts/UserContext.jsx'


export default function LogOut() {
  const { setIdData } = useContext(UserContext)
  const navigate = useNavigate()

  const logOut = (event) => {
    event.preventDefault()
    setIdData({})
    navigate("/", {replace: true})
  }

  const goBack = (event) => {
    navigate(-1)
  }

  return (
    <>
      <p>You are already logged in</p>
      <button
        className="out"
        onClick={logOut}
      >
        Log Out
      </button>
      <button
        className="back"
        onClick={goBack}
      >
        Go Back
      </button>
    </>
  )
}