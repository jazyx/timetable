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
import styled from "styled-components"


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
  const { teacher_id } = useParams()

  // <<< Simulated tracker data
  const start_time = [7, 6] // 7 a.m. + 6 * 5 min = 7:30
  const end_time   = [20,3]
  const weekdays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ]
  // Simulated tracker data >>>
  
  const hourLine = (12 - (start_time[1] || 12))

  const rows = (end_time[0] - start_time[0]) * 12
             - (start_time[1] || 0)
             + (end_time[1] || 0)

  const grid = weekdays.reduce(buildGrid, [])


  return (
    <>
      <h1>Teacher {teacher_id}</h1>
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
    let hour = start_time[0] + !useStart
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
