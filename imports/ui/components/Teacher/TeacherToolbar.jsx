import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import styled from "styled-components"


import { UserContext } from '/imports/ui/contexts/UserContext';
import { TimetableContext } from '/imports/ui/contexts/TimetableContext';

import { TimeZones } from '../Timetable/TimeZones'
import { Planner } from '../Planner/Planner'

import storage from '/imports/api/storage.js'



const StyledBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #003;
  padding: 0.5em 0;

  & span {
    padding: 0 1em;
  }

  & span.name {
    font-size: 1.5em
  }
`


export const TeacherToolbar = ({teacher_name}) => {
  const navigate = useNavigate()
  const { setIdData } = useContext(UserContext)
  const {
    showPlanner,
    setShowPlanner
  } = useContext(TimetableContext)
  

  const planner = showPlanner
                ? <Planner />
                : ""

  const logOut = () => {
    setIdData( previous => {
      delete previous.autoLogin
      delete previous._id
      return { ...previous }
    })

    storage.setItem("autoLogin", false)

    navigate("/login", {replace: true})
  }

  return (
    <StyledBar>
      <span className="name">{teacher_name} </span>

      <button
        onClick={() => setShowPlanner(true)}
      >
        Organizer
      </button>

      <div>
        <TimeZones />
        <button
          onClick={logOut}
        >
          Log Out
        </button>
      </div>

      {planner}
    </StyledBar>
  );
};
