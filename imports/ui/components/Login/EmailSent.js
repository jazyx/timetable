import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from "styled-components"




export const StyledSent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  font-size: 3.6vw;

  & > div {
    max-width: 30em;
    text-align: center;
  }

  & p {
    margin: 2em;
  }

  & .email {
    font-family: monospace;
    font-style: italic;
  }

  & button {
    display: block;
    font-size: inherit;
    width: 20em;
    margin: 0.5em auto;
  }


  /* Limit scaling on wider screens */
  @media (min-aspect-ratio: 1/2) {
    & {
      font-size: 1.8vh;
    }
  }
`


export default function EmailSent({ jwt, email }) {
  const navigate = useNavigate()


  const sendAgain = () => {

  }


  const sim = (() => {
    if (!jwt) {
      return ""
    }

    const url = (withOrigin) => {
      let url = `/confirm/${jwt}`
      if (withOrigin) {
        return location.origin + url
      }

      return url
    }


    const pretend = () => {
      window.location.assign(url(true))
    }


    const copyURL = () => {
      navigator.clipboard.writeText(url(true))
    }


    return (
      <>
        <button
          onClick={pretend}
        >
          Pretend
        </button>

        <button
          onClick={copyURL}
          style={navigator.clipboard ? {} : {display: "none"}}
        >
          Copy Confirmation URL to Clipboard
        </button>
      </>
    )
  })()


  return (
    <StyledSent>
      <div>
        <h1>Confirm your email address</h1>
        <p>
          <span>A confirmation message has been sent to </span>
          <span className="email">{email}</span>
          <span>. Before you can start using this app, please click on the link in that message.</span>
        </p>
        <button
          onClick={sendAgain}
          disabled
        >
          Send Confirmation Message Again
        </button>
        {sim}
      </div>
    </StyledSent>
  )
}