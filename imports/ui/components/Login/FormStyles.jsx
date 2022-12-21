import styled from "styled-components"


/* The mask and alternative button colours below assume that the
   body background-color is #111.
*/



export const StyledForm = styled.div`
  --font-size:     7.5vw;
  --input-width:   12em;
  --input-height:  1.4em;
  --peek-size:    1.5em;
  --pass-width:    calc(var(--input-width) - var(--peek-size));
  --button-width:  calc(var(--pass-width) / 2);

  --a-color:       #666;
  --a-hover:       #fff;
  --green:         #090;
  --red:           #c00;
  --mask:          #111d;
  --toggle-hover:  #222;
  --toggle-active: #000;

  --smaller:       0.6667em;
  --action-margin: 1.5em;
  --errors-height: 6em;

  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: var(--font-size);

  & * {
    box-sizing: border-box;
    position: relative
  }

  /* Rules for the Please log in or register message */
  & .instructions {
    height: 6em;

    /* Current action word shown and registered role in green */
    & .choice {
      color: var(--green);
    }

    /* Rules for As a teacher/school radio buttons */
    & label {
      margin-top: 0.25em;

      & input {
        width: 1em;
        height: 1em;
        accent-color: var(--green);
      }

      & span {
        display: inline-block;
        margin-left: 0.5em;
      }
    }
  }

  /* Rules for input fields and their labels */
  & label {
    display: block;

    /* Show label span above the input field */
    & span {
      display: block;
      margin-top: 0.5em;
    }

    & input {
      width: var(--input-width);
      height: var(--input-height);
    }

    /* Shorten password field to give room for peek button */
    & input#password {
      width: var(--pass-width);
    }

    /* Show a red border around fields that are empty */
    & input.invalid {
      border: 2px solid var(--red);
    }

    /* Show invalid email address */
    & input:invalid {
      background-color: #fcc;
    }

    /* Peek at password button */
    & button {
      width: var(--peek-size);
      height: var(--peek-size);
      padding: 0;
      border-radius: 1em; /* to hide slight size differences */
    }

    /* Forgot Password link */
    & a {
      display: block;
      font-size: var(--smaller);
      color: var(--a-color);
      height: 1.5em;
      padding-top: 0.5em;
    }

    & a:hover {
      color: var(--a-hover)
    }
  }

  /* Action button: Log in | Register */
  & .action {
    margin-top: var(--action-margin);
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

  /* Ensure inputs and buttons share a common font-size */
  & input,
  & button {
    font-size: inherit;
  }

  /* "Email already registered" message; covers Register button */
  & div.already-registered {
    position: absolute;
    bottom: 0;
    width: var(--input-width);

    & p {
      background-color: var(--mask);
      font-size: var(--smaller);
      line-height: 1.5em;
      margin: 0;
    }

    & span.email {
      font-family: monospace;
      display: inline;
      font-style: italic;
      font-size: var(--smaller);
    }
  }

  /* Details for a strong password */
  & ul.errors {
    position: absolute;
    margin-top: 0.5em;
    width: var(--input-width);
    min-height: var(--errors-height);
    z-index: 1;
    color: var(--red);
    background-color: var(--mask);
    padding: 0;

    /* The first li element in the ul has no bullet point
       so we need to cheat by moving the subsequent items
       to the right, so their bullet points align with the
       first item...
    */
    & li {
      font-size: var(--smaller);
      position: relative;
      left: 1em;
      margin: 0;
    }

    /* ... and remove the bullet and the offset from the
       first item
    */
    & li:first-child {
      list-style-type: none;
      left: 0;
    }
  }

  /* Auto Login */
  & div.autologin {
    font-size: var(--smaller);
    margin-top: 1em;

    & input {
      width: 1em;
      height: 1em;
      accent-color: var(--green);
    }

    & input:disabled + span {
      color: var(--a-color);
    }

    & span {
      display: inline;
      margin-left: 0.5em;
    }
  }

  /* Hide the Name label for Log In
     and Forgot Password for Register
  */
  .hidden {
    visibility: hidden;
  }

  /* Alternative action shown as a subtle button */
  & button.toggle-log {
    background-color: transparent;
    border: #fff6 outset 2px;
    border-radius: 0.25em;
    color: inherit;
    cursor: pointer;
  }

  & button.toggle-log:hover {
    border-style: solid;
    background-color: var(--toggle-hover);
  }

  & button.toggle-log:active {
    border-style: inset;
    background-color: var(--toggle-active);
  }

  /* Limit scaling on wider screens */
  @media (min-aspect-ratio: 1/2) {
    & {
      font-size: 3.75vh;
    }
  }
`