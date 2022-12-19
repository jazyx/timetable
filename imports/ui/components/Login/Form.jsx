import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"

import { UserContext } from  '/imports/ui/contexts/UserContext.jsx'



const StyledForm = styled.div`
  --font-size:    7vw;
  --input-width:  12em;
  --peek-width:   1.5em;
  --pass-width:   calc(var(--input-width) - var(--peek-width));
  --button-width: calc(var(--pass-width) / 2);
  --green:        #090;
  --red:          #c00;

  position: absolute;
  height: 100vh;
  width: 100vw;
  top: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;

  font-size: var(--font-size);

  & * {
    box-sizing: border-box;
  }

  /* Rules for the Please log in or register message */
  & .instructions {
    margin-bottom: 0.5em;
    text-align: center;

    /* Current action word shown in bold and green */
    & strong {
      color: var(--green);
    }

    /* Alternative action shown as a subtle button */
    & button {
      background-color: transparent;
      border: #fff6 outset 2px;
      border-radius: 0.25em;
      color: inherit;
      cursor: pointer;
    }

    & button:hover {
      border-style: solid;
      background-color: #222;
    }

    & button:active {
      border-style: inset;
      background-color: #000;
    }

    /* Rules for As a teacher / school radio buttons */
    & label {
      width: 10em;
      margin-top: 0.25em;
    
      & input {
        width: 1em;
        height: 1em;
        accent-color: var(--green);
      }

      & span {
        display: inline-block;
        text-align: left;
        width: 6em;
        margin-left: 0.5em;
      }
    }
  }

  /* Rules for input fields and their labels */
  & label {
    display: block;
    vertical-align: bottom;

    /* Show label span above the input field*/
    & span {
      display: block;
      margin-top: 0.5em;
    }

    & input {
      width: var(--input-width);
      height: 1.4em;
    }

    /* Shorten password field to give room for peek button */
    & input#password {
      width: var(--pass-width);
    }

    /* Show a red border around fields that are empty */
    & input.invalid {
      border: 1px solid var(--red);
    }

    /* Show invalid email address */
    & input:invalid {
      background-color: #fcc;
    }

    /* Peek at password button */
    & button {
      width: var(--peek-width);
      height: 1.4em;
      padding: 0;
      border-radius: 1em;
    }
  }

  /* Log in | Register button */
  & .action {
    margin-top: 2em;
    width: var(--input-width);
    background-color: var(--green);
    border-color: var(--green);
  }

  & .action[disabled] {
    color: #666;
    background-color: #333;
    border-style: solid;
    border-color: #050;
  }

  & input,
  & button {
    font-size: inherit;
  }

  & ul.errors {
    position: absolute;
    margin-top: 0.5em;
    width: var(--input-width);
    min-height: 3em;
    color: var(--red);
    background-color: #111c;
    padding: 0;

    & li {
      font-size: 0.67em;
      margin: 0;
      position: relative;
      left: 1em;
    }

    & li:first-child {
      list-style-type: none;
      padding: 0;
      margin: 0;
      left: 0;
    }
  }

  @media (min-aspect-ratio: 1/2) {
    & {
      font-size: 3.5vh;
    }
  } 
`


import { register, logIn } from '/imports/api/user.js'



export default function Form() {
  const {
    useLog,
    setUseLog
  } = useContext(UserContext)

  const [ showPassword, setShowPassword ] = useState(false)
  const [ name, setName ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ isTeacher, setIsTeacher ] = useState(true)
  
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
      const lines = []
      passwordErrors = "Your password must"

      if (errorCount === 1) {
        lines.push(<li>{passwordErrors} {errors[0]}</li>)

      } else {
        lines.push(<li>{passwordErrors}:</li>)
        errors.forEach( error => (
          lines.push(<li>{error}</li>)
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


  const updateName = (event) => {
    setName(event.target.value)
  }

  const updateEmail = (event) => {
    setEmail(event.target.value)
  }

  const updatePassword = (event) => {
    setPassword(event.target.value)
  }


  const toggleVisibility = (event) => {
    event.preventDefault()
    setShowPassword(!showPassword)
  }


  const prepareToRegister = async (event) => {
    event.preventDefault()

    const formData = {
      name,
      email,
      password
    }

    const callback = (response) => {
      // { error: "Missing data", userData }
      // { _id: <string> }
      // { message: "email address ... is registered. Log in?" }

      const { _id, message, error } = response
      if (error) {
        let { name, email, password } = error.userData
      }
      console.log("response:", response);
    }

    const message = register(formData, callback)
    console.log("message:", message);
  }


  const prepareToLogIn = async (event) => {
    event.preventDefault()

    const formData = {
      email,
      password
    }

    const result = await logIn(formData)

    const { token, text } = result
    if (token) {
      setToken(result.token)
      navigate(preLoginURL, { replace: true })

    } else {
      console.log("Login", text)
    }
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
          Please <strong>log in</strong> or&nbsp;
          <button
            onClick={(event) => {
              event.preventDefault()
              setUseLog(false)
            }}
          >
            register
          </button>:
        </div>
      )
    }
    
    return (
      <div
        className="instructions"
      >
        Please&nbsp;
        <button
          onClick={(event) => {
            event.preventDefault()
            setUseLog(true)
          }}
        >
          log in
        </button>
        &nbsp;or <strong>register</strong>
        <label htmlFor="as-teacher">
          <input
            type="radio"
            name="role"
            id="as-teacher"
            defaultChecked
            onChange={toggleIsTeacher}
          />
          <span>As a teacher</span>
        </label>
        <label htmlFor="as-school">
          <input
            type="radio"
            name="role"
            id="as-school"
            onChange={toggleIsTeacher}
          />
          <span>As a school</span>
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
          onClick={prepareToLogIn}
          disabled={!enabled}
        >
          Log in
        </button>
      )
    }

    return (
      <button
        className="action"
        onClick={prepareToRegister}
        disabled={!enabled}
      >
        Register
      </button>
    )
  })()


  const nameInput = (() => {
    if (!useLog) {
      return (
        <label htmlFor="name">
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
      )
    }
  })()


  return (
    <StyledForm>
      <form
        className="register"
        method="POST"
      >
        {instructions}

        {nameInput}

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
          {password && passwordErrors}
        </label>

        {button}
      </form>
    </StyledForm>
  );
}