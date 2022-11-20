/**
 * Teacher.jsx
 * 
 * Displays:
 * + [New...] button, to create
 *   - New student
 *   - New company
 *   - New school
 * + Date button to show widget to jump to a specific date
 * + Calendar for the current week
 *   - Can scroll to show future weeks
 *   - Times shown every 2/3 columns
 *   - Earliest and latest times depend on expected lesson times
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data'
import styled from "styled-components"

import { TeacherTracker } from './TeacherTracker'



const StyledWeek = styled.div`
  border: 2px solid black;
  display: flex;

  & * {
    box-sizing: border-box;
  }

  & div {
    border-left: 1px solid black;

    & div {
      height: calc(85vh / ${props => props.rows});
      width: 14vw;
    }

    & div:first-child {
      text-align: center;
      height: 1em;
      border-bottom: 2px solid black;
    }

    & div:nth-child(even) {
      background-color: #f6f6f6;
    }

    & div:nth-child(12n+${props => props.hourLine + 1}) {
      border-bottom: 1px solid grey;
    }
  }
`

const StyledTime = styled.div`
  position: relative; /* because ::before is absolute */

  &::before {
    content: "${props => props.before}:00";
    display: inline-block;
    position: absolute;
    width: 3em;
    left: -1.5em;
    font-family: monospace;
    text-align: center;
    background-color: #fffc;
  }
`

export const Teacher = () => {
  const { teacher_name } = useParams()

  // <<< Simulated tracker data

  const {
    day_begin,
    day_end,
    weekdays,
    lessons,
    error
  } = useTracker(() => TeacherTracker(teacher_name))
  // Simulated tracker data >>>

  if (error) {
    return <h1>{error}</h1>
  }
  
  const hourLine = (12 - (day_begin[1] || 12))

  const rows = (day_end[0] - day_begin[0]) * 12
             - (day_begin[1] || 0)
             + (day_end[1] || 0)

  const grid = weekdays.reduce(buildGrid, [])


  return (
    <>
      <h1>Teacher {teacher_name}</h1>
      <StyledWeek
        hourLine={hourLine}
        rows={rows}
      >
        {grid}
      </StyledWeek>
    </>
  );

  
  function buildGrid(week, day, dayIndex) {
    const useStart = !hourLine
    let hour = day_begin[0] + !useStart
    const timeCol = (dayIndex + 1) % 3
    
    const lines = new Array(rows + 1).fill(0).map((_, index) => {
      const time    = ((index - hourLine) % 12 || timeCol)
                    ? ""
                    : hour++
      const content = index
                    ? time
                    : day

      if (time) {
        return (
          <StyledTime
            key={`${day}_${index}`}
            before={time}
          ></StyledTime>
        )
      }

      return (      
        <div
          key={`${day}_${index}`}
        >{content}</div>
      )
    })

    const dayLines = (
      <div
        key={day}
      >
        {lines}
      </div>
    )

    week.push(dayLines)
    return week
  }
};
