/**
 * Grid.jsx
 *
 * Displays a calendar
 * - Can scroll to show future weeks
 * - Times shown every 2/3 columns
 * - Earliest and latest times depend on expected session times
 */

import React from 'react';
 
import {
  StyledWeek,
  StyledTime,
  StyledCell
} from '../Timetable/Styles'
import { Session } from '../Timetable/Session'
 
 
export const Grid = (props) => {
  const {
    midnight,
    monday,
    day,
    day_begin,
    day_end,
    daysToDisplay,
    weekdays,
    sessions,
    blocked={}
  } = props
 
  const today = 1 // HARD-CODED to start week on Monday
  const period = new Array(daysToDisplay).fill(0)
                                .map((_, index) => (
                                  weekdays[(today + index) % 7]
                                ))

  const hourLine = (12 - (day_begin[1] || 12))
 
  const rows = (day_end[0] - day_begin[0]) * 12
             - (day_begin[1] || 0)
             + (day_end[1] || 0)
             || 0


  console.log("Grid sessions:", sessions);
  
  const grid = period.reduce(buildGrid, [])
 
 
  return (
    <StyledWeek
     hourLine={hourLine}
     rows={rows}
     columns={7}
   >
     {grid}
   </StyledWeek>
  );
 
 
  function buildGrid(grid, day, dayIndex) {
    const weekDay = dayIndex % 7
    const daySessions  = sessions[weekDay] || []
    const blockedCells = blocked[weekDay] || {}
    
    // console.log("day:", day, "daySessions:", daySessions);
    // day: <Abbr>
    // daySessions: {
    //   <line number> {
    //     _id:           <id string>
    //     bg_colour:     <string Class hex colour>
    //     billed:        <boolean>
    //     column:        <number>
    //     date:          <string date-time or empty string.
    //     day:           <integer 0 - 6 or undefined>
    //     forfeited:     <boolean>
    //     height:        <integer>
    //     index:         <integer>
    //     link:          <url for meeting>
    //     name:          <string Class.name>
    //     row:           <number>
    //     session_begin: <decimal number 0.0 - 24.0>
    //     session_end:   <decimal number 0.0 - 24.0>
    //     supplement:    <boolean
    //     tentative:     <boolean
    //     unscheduled:   <boolean
    // }, ...}
 
    const useStart = !hourLine
    let hour = day_begin[0] + !useStart
    const timelessColumn = (dayIndex + 1) % 3
 
    const lines = new Array(rows + 1).fill(0).map((_, index) => {
      const key     = `${day}_${index}`
      const time    = ((index - hourLine) % 12 || timelessColumn)
                    ? ""
                    : hour++
      const content = index
                    ? ""
                    : day
      const sessionData = daySessions[index] || 0
      const sessionChild = sessionData
                         ? (
                             <Session
                               {...sessionData}
                             />
                           )
                         : ""
 
      // if (sessionChild) {
      //   console.log("sessionChild:", sessionChild);
      // }
 
      if (content) {
        return (
          <div
            key={key}
          >{content}</div>
        )
 
      } else if (time) {
        return (
          <StyledTime
            key={key}
            before={time}
          >
            {sessionChild}
          </StyledTime>
        )
 
      } else  {
        return (
          <StyledCell
            key={key}
          >
            {sessionChild}
          </StyledCell>
        )
      }
    })
 
    const dayLines = (
      <div
        key={day+dayIndex} // TODO: Use date
      >
        {lines}
      </div>
    )
 
    grid.push(dayLines)
    return grid
  }
};
 