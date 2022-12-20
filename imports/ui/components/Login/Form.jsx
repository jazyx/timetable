import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from  '/imports/ui/contexts/UserContext.jsx'

import methods from '/imports/api/methods/'
const {
  registerUser,
  logUserIn
} = methods

import { StyledForm } from './FormStyles'



export default function Form() {
  const {
    setIdData,
    useLog,
    setUseLog
  } = useContext(UserContext)
  const navigate = useNavigate()

  const [ showPassword, setShowPassword ] = useState(false)
  const [ name, setName ] = useState("James")
  const [ email, setEmail ] = useState("james@lexogram.com")
  const [ password, setPassword ] = useState("TIiudhtm1!LE")
  const [ isTeacher, setIsTeacher ] = useState(true)
  const [ logInstead, setLogInstead ] = useState(false)


  // Check if any fields are empty ...
  const fields = { name, email, password }
  const invalid = Object.entries(fields).map( entry => {
    if (!entry[1]) {
      return entry[0]
    }
  }).filter( fieldName => !!fieldName)

  // ... and check email and strength of password
  let passwordErrors = (() => {
    const errors = []

    if (password.length < 8) {
      errors.push(" be 8 characters or more");
    }
    if (password.search(/[a-z]/) < 0) {
      errors.push(" contain at least one lowercase letter");
    }
    if (password.search(/[A-Z]/) < 0) {
      errors.push(" contain at least one uppercase letter")
    }
    if (password.search(/[0-9]/) < 0) {
      errors.push(" contain at least one digit");
    }
    if (!password.replace(/[A-Za-z0-9]/g, "").length) {
      errors.push(" contain at least one special character");
    }

    const errorCount = errors.length


    let passwordErrors = ""
    if (errorCount) {
      invalid.push("password")

      const lines = []
      passwordErrors = "Your password should"

      if (errorCount === 1) {
        lines.push(
          <li
            key="error"
          >
            {passwordErrors} {errors[0]}.
          </li>)

      } else {
        lines.push(
          <li
            key="title"
          >
            {passwordErrors}:
          </li>
        )
        errors.forEach( error => (
          lines.push(
            <li
              key={error}
            >
              {error}
            </li>
          )
        ))
      }

      passwordErrors = (
        <ul className="errors">
          {lines}
        </ul>
      )
    }

    return passwordErrors
  })()


  // Check if action button should be enabled
  const enabled = (() => {
    let enabled = !passwordErrors

    if (enabled) {
      enabled = !document.querySelector(":invalid")
    }

    if (enabled) {
      const invalidCount = invalid.length
      enabled = !(invalidCount)
              || ( useLog
                && invalidCount === 1
                && invalid.includes("name")
                 )
    }

    return enabled
  })()


  // const navigate = useNavigate()

  // const setMessage = (source, text) => {
  //   setRegisterMessage({
  //     source,
  //     text
  //   })
  // }


  // Editing input fields
  const reset = () => {
    if (logInstead) {
      setLogInstead(false)
    }
  }


  const updateName = (event) => {
    reset()
    setName(event.target.value)
  }


  const updateEmail = (event) => {
    reset()
    setEmail(event.target.value)
  }


  const updatePassword = (event) => {
    reset()
    setPassword(event.target.value)
  }


  const toggleVisibility = (event) => {
    reset()
    event.preventDefault()
    setShowPassword(!showPassword)
  }


  const sendPasswordLink = (event) => {
    event.preventDefault()
    console.log("TODO: use email to send passwordreset link");

  }


  const registerNewUser = async (event) => {
    event.preventDefault()

    const formData = {
      name,
      email,
      password,
      role: (isTeacher) ? "teacher" : "school"
    }

    const callback = (fail, response) => {
      if (fail) {
        return console.log("Error in Register:", fail);
      }

      // console.log("response:", response)
      // // Will be one of:
      // { error: "Missing data", userData }
      // { _id: <string> }
      // { message: "email address ... is registered. Log in?" }

      const { email, message, error } = response
      if (error) {
        let { name, email, password } = error.userData
        console.log("error:", error.userData);
        console.log("THIS SHOULDN'T HAPPEN")

      } else if (message) {
        setLogInstead(true)

      } else if (email) { // jwt also in response
        // Update idData to include jwt, to trigger the  Login
        // component to show the EmailSent page.
        // TODO: set idData to
        // { awaitingConfirmation: true, email }
        setIdData(response)
      }
    }

    registerUser.call(formData, callback)
  }


  const login = async (event) => {
    event.preventDefault()

    const callback = (error, data) => {
      if (data) {
        const { fail, role, name, message } = data

        if (role) {
          setIdData(data)
          const url = `/n/${role}/${name}`
          navigate(url)

        } else if (message) {
          setIdData({ awaiting_confirmation: true })

        } else if (fail) {
          console.log("fail:", fail);
        }
      }
    }

    const formData = {
      email,
      password
    }

    logUserIn.call(formData, callback)
  }


  const instructions = (() => {
    const toggleIsTeacher = () => {
      setIsTeacher(!isTeacher)
    }

    if (useLog) {
      return (
        <div
          className="instructions"
        >
          <span>Please </span>
          <strong
            className="choice"
          >
            log in
          </strong>
          <span> or </span>
          <button
            className="toggle-log"
            onClick={(event) => {
              event.preventDefault()
              setUseLog(false)
            }}
          >
            <span> register</span>
          </button>:
        </div>
      )
    }

    return (
      <div
        className="instructions"
      >
        <span>Please </span>
        <button
          className="toggle-log"
          onClick={(event) => {
            event.preventDefault()
            setUseLog(true)
          }}
        >
          log in
        </button>
        <span> or </span>
          <strong
            className="choice"
          >
            register
          </strong>
        <label htmlFor="as-teacher">
          <input
            type="radio"
            name="role"
            id="as-teacher"
            checked={isTeacher}
            onChange={toggleIsTeacher}
          />
          <span
            className={isTeacher ? "choice" : ""}
          >
            As a teacher
          </span>
        </label>
        <label htmlFor="as-school">
          <input
            type="radio"
            name="role"
            id="as-school"
            checked={!isTeacher}
            onChange={toggleIsTeacher}
          />
          <span
            className={isTeacher ? "" : "choice"}
          >
            As a school
          </span>
        </label>
      </div>
    )
  })()


  const nameTitle = (() => {
    if (isTeacher) {
      return "Name"
    }

    return "School name"
  })()


  const button = (() => {
    if (useLog) {
      return (
        <button
          className="action"
          onClick={login}
          disabled={!enabled}
        >
          Log in
        </button>
      )

    }

    let alreadyRegistered = ""
    if (logInstead) {
      alreadyRegistered = (
        <div
          className="already-registered"
        >
          <p>
            <span>The email address </span>
            <span className="email">{email}</span>
            <span> is already registered. Would you like to </span>
            <button
              className="toggle-log"
              onClick={() => setUseLog(true)}
            >
              log in
            </button>
            <span> instead?</span>
          </p>
        </div>
      )
    }

    return (
      <div
        className="register"
      >
        <button
          className="action"
          onClick={registerNewUser}
          disabled={!enabled}
        >
          Register
        </button>
        {alreadyRegistered}
      </div>
    )
  })()


  const forgotPassword = (() => (
    <a
      className={useLog ? "" : "hidden"}
      onClick={sendPasswordLink}
      href="#"
    >
      Forgot password?
    </a>
  ))()


  return (
    <StyledForm>
      <form
        className="register"
        method="POST"
      >
        {instructions}

        <label
          htmlFor="name"
          className={useLog ? "hidden" : ""}
        >
          <span>{nameTitle}:</span>
          <input
            type="text"
            id="name"
            className={invalid.includes("name") ? "invalid" : ""}
            name="name"
            value={name}
            onChange={updateName}
          />
        </label>

        <label htmlFor="email">
          <span>Email address:</span>
          <input
            type="email"
            id="email"
            className={invalid.includes("email") ? "invalid" : ""}
            name="email"
            value={email}
            onChange={updateEmail}
          />
        </label>

        <label htmlFor="password">
          <span>Password:</span>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className={invalid.includes("password") ? "invalid" : ""}
            name="password"
            value={password}
            onChange={updatePassword}
          />
          <button
            onClick={toggleVisibility}
          >
            {showPassword ? "🙉" :"🙈"}
          </button>
          {!useLog ? (password && passwordErrors) : ""}
          {forgotPassword}
        </label>

        {button}
      </form>
    </StyledForm>
  );
}