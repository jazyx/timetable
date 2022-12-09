/**
 * Grid.jsx
 *
 * Displays a calendar
 * - Can scroll to show future weeks
 * - Times shown every 2/3 columns
 * - Earliest and latest times depend on expected session times
 */

import React, { useContext } from 'react';
import { TimetableContext } from '../../contexts/TimetableContext';


import {
  StyledGrid,
  StyledTime,
  StyledCell
} from '../Timetable/Styles'
import { Session } from '../Timetable/Session'



export const Grid = (props) => {
  const {
    dragOver,
    dragLeave,
    drop
  } = useContext(TimetableContext)

  const {
    firstHour,
    hourLine,
    rows,
    sessions,
    daysToDisplay,

    blocked={}
  } = props

  // console.log("Grid sessions:", sessions);

  const grid = sessions.reduce(buildGrid, [])


  return (
    <StyledGrid
     id="grid"
     hourLine={hourLine}
     rows={rows}
     columns={daysToDisplay}
   >
     {grid}
   </StyledGrid>
  );


  function buildGrid(grid, daySessions, dayIndex) {
    // console.log("daySessions:", daySessions);
    // daySessions: [
    //   "Mon 5 Dec",
    //   ...,
    //   {
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
    // }, ...]

    // const blockedCells = blocked[weekDay] || {}

    const date = daySessions[0]

    let hour = firstHour

    const timelessColumn = (dayIndex + 1) % 3

    const lines = new Array(rows + 1).fill(0)
                                     .map((_, index) => {
      const key     = `${date}_${index}`
      const time    = ((index - hourLine) % 12 || timelessColumn)
                    ? ""
                    : (hour ++) % 24

      const content = index
                    ? ""
                    : date
      const sessionData = daySessions[index] || 0
      const sessionChild = sessionData
                         ? (
                             <Session
                               {...sessionData}
                             />
                           )
                         : ""

      if (content) {
        return (
          <div
            key={key}
          >{content}</div>
        )

      } else if (time !== "") {
        return (
          <StyledTime
            key={key}
            before={time}
            onDragOver={dragOver}
            onDragLeave={dragLeave}
            onDrop={drop}
          >
            {sessionChild}
          </StyledTime>
        )

      } else  {
        return (
          <StyledCell
            key={key}
            onDragOver={dragOver}
            onDragLeave={dragLeave}
            onDrop={drop}
          >
            {sessionChild}
          </StyledCell>
        )
      }
    })

    const dayLines = (
      <div
        key={date}
      >
        {lines}
      </div>
    )

    grid.push(dayLines)
    return grid
  }
};
