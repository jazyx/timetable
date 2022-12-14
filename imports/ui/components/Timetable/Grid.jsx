/**
 * Grid.jsx
 *
 * Displays a calendar
 * - Times shown every 2 columns
 * - Can scroll to show coming week
 * - Earliest and latest times depend on teacher availability
 * - Allows any user to reschedule sessions
 *
 * The grid is a series of day/column divs each containing the
 * same number of 5-minute time-slot divs.
 *
 * Certain time-slot divs will contain a child div whose height
 * will cover the following time-slot divs, because it has a
 * greater z-index. Such "session" child divs will:
 * - Display details of a session
 * - Contain dragStart and dragEnd event listeners
 * - Add a `locked` class to each of the time-slot divs that are
 *   covered by the "session" div.
 *
 * + Session objects are created (and styled) in Session.jsx
 * + Styles for Grid and Slot are imported from a separate
 *   Styles.jsx file in the same directory
 * + Every 12th time-slot div will display an hour time via a
 *   ::before pseudo element
 * + Alternating rows have slightly different background colours
 * + All time-slot divs contain dragEnter, dragOver and drop
 *   listeners
 */

import React, { useContext } from 'react';
import { TimetableContext } from '/imports/ui/contexts/TimetableContext.jsx';


// Styled Components
import {
  StyledGrid,
  StyledSlot
} from '../Timetable/Styles'
import { Session } from '../Timetable/Session'



export const Grid = (props) => {
  console.log("Grid component called:", props)
  const {
    dragEnter,
    dragOver,
    drop,
    dragStart,
    dragEnd
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
    //     _id:              <id string>
    //     class_id:         <id string>
    //     contract_id:      <id string>
    //     name:             <string Class.name>
    //     students:         [<string student name>, ...]
    //     index:            <integer class number in week>
    //
    //     bg_colour:        <string Class hex colour>
    //     billed:           <boolean>
    //     column:           <number>
    //     row:              <number>
    //
    //     date:             <date>
    //     OR
    //     repeat-from_date: <date used just for day and time>
    //     scheduled:        <precise date of repeating session>
    //     day:              <integer 0 - 6 or undefined>
    //     weekIndex:        <integer of weeks since monday>
    //
    //     duration:         <integer number of minutes>
    //     height:           <integer: duration / 5>
    //     link:             <url for online meeting>
    //     location:         <url for meeting location>
    //     travelling_time:  <minutes to get from last location>
    //     start_date:       <date>
    //     end_date:         <date or empty string>
    //     proposal:         <true if set by School>
    //     unscheduled:      <true if cancelled well in advance>
    //     forfeited:        <true if cancelled after limit>
    //     supplement:       <true if additional session in week>
    //     tentative:        <true if rescheduled by student>
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
        sessionChild = <Session
                         {...sessionData}
                         dragStart={dragStart}
                         dragEnd={dragEnd}
                       />
        lockedSlots = sessionData.height
      }

      // Set class to "locked", if covered by a Session element
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

      } else {
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
