import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from  '/imports/ui/contexts/UserContext.jsx'


export default function LogOut() {
  const { setToken } = useContext(UserContext)
  const navigate = useNavigate()

  const logOut = (event) => {
    event.preventDefault()
    setToken("")
    navigate("/", {replace: true})
  }

  const goBack = (event) => {
    navigate(-1)
  }

  return (
    <>
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