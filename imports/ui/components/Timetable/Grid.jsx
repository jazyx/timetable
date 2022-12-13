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


// Styled Components
import {
  StyledGrid,
  StyledSlot
} from '../Timetable/Styles'
import { Session } from '../Timetable/Session'



export const Grid = (props) => {
  const {
    dragEnter,
    dragOver,
    dragEnd,
    drop
  } = useContext(TimetableContext)

  const {
    firstHour,
    hourLine,
    rows,
    sessions,
    daysToDisplay,

    blocked={}
  } = props // from SessionTracker.jsx


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


  // BUILD GRID // BUILD GRID // BUILD GRID // BUILD GRID //


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
    //     supplement:    <boolean
    //     tentative:     <boolean
    //     unscheduled:   <boolean
    // }, ...]

    // const blockedCells = blocked[weekDay] || {}

    const date = daySessions[0] // Ex: Mon 5 Dec
    const timelessColumn = (dayIndex + 1) % 2

    let hour = firstHour
    let lockedSlots = 0

    // <<< DAY SLOTS // DAY SLOTS // DAY SLOTS // DAY SLOTS //
    // Create an array of time slots for a given day, one for
    // each 5-minute period from day_begin to day_end.
    const daySlots = new Array(rows + 1).fill(0)
                                        .map((_, index) => {
      const key     = `${date}_${index}`
      const time    = ((index - hourLine) % 12 || timelessColumn)
                    ? ""
                    : (hour++) % 24

      // Prepare sessionData ... if present in this cell
      const sessionData = daySessions[index] || 0
      let sessionChild
      if (sessionData) {
        sessionChild = <Session {...sessionData} />
        lockedSlots = sessionData.height
      }

      let className
      if (lockedSlots) {
        lockedSlots--
        className = "locked"
      }

      if (!index) { // first row shows date
        return (
          <div
            key={key}
          >{date}</div>
        )

      } else { // time slots
        return (
          <StyledSlot
            key={key}
            before={time}
            onDragOver={dragOver}
            onDragEnter={dragEnter}
            onDrop={drop}
            className={className}
          >
            {sessionChild}
          </StyledSlot>
        )
      }
    })
    // END OF DAY SLOTS // DAY SLOTS // DAY SLOTS >>> //

    const dayArray = (
      <div
        key={date}
      >
        {daySlots}
      </div>
    )

    grid.push(dayArray)

    return grid
  }
};
