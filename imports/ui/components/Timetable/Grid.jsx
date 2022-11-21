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
     day_begin,
     day_end,
     weekdays,
     sessions,
   } = props
 
   // Start on Monday
   weekdays.push(weekdays.shift())
 
   const hourLine = (12 - (day_begin[1] || 12))
 
   const rows = (day_end[0] - day_begin[0]) * 12
              - (day_begin[1] || 0)
              + (day_end[1] || 0)
 
   const grid = weekdays.reduce(buildGrid, [])
 
 
   return (
     <StyledWeek
      hourLine={hourLine}
      rows={rows}
      columns={7}
    >
      {grid}
    </StyledWeek>
   );
 
 
   function buildGrid(week, day, dayIndex) {
     const daySessions = sessions[dayIndex] || []
 
     // console.log("day:", day, "daySessions:", daySessions);
 
 
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
 
       if (time) {
         return (
           <StyledTime
             key={key}
             before={time}
           >
             {sessionChild}
           </StyledTime>
         )
 
       } else if (content) {
         return (
           <div
             key={key}
           >{content}</div>
         )
 
       } else {
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
         key={day}
       >
         {lines}
       </div>
     )
 
     week.push(dayLines)
     return week
   }
 };
 