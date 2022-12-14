/**
 * TimeZones.jsx
 *
 * Creates a selector for choosing a timeZone.
 */


import React, { useContext } from 'react';
import { useTracker } from 'meteor/react-meteor-data'

import { TimetableContext } from '/imports/ui/contexts/TimetableContext'


// <<< TRACKER // TRACKER // TRACKER // TRACKER // TRACKER //
import collections from '/imports/api/collections/'
const {
  TimeZone
} = collections


const TimeZoneTracker = () => {
  const timeZones = TimeZone.find({}).fetch() || []

  return {
    timeZones
  }
}
// TRACKER // TRACKER // TRACKER // TRACKER // TRACKER >>> //



export const TimeZones = () => {
  const { timeZone, setTimeZone } = useContext(TimetableContext)
  const { timeZones } = useTracker(TimeZoneTracker)
  // console.log("TimeZones props:", props);
  // [ { _id: "5YAwQg8mG5c8652wb",
  //     timeZone: "Europe/Moscow"
  //   }, ...
  // ]

  // Sort timeZones
  const continents = []
  const now = new Date()
  const zones = []

  const rawZones = timeZones.map(({ timeZone }) => {
    const zoneString = now.toLocaleString(
      'en-GB', { timeZone }
    );

    return { zoneString, timeZone}
  }).sort(byTimeAndZoneName)

  // Insert unselectable continent entries

  rawZones.forEach(({ timeZone }) => {
    const [ continent, city ] = timeZone.split("/")
    if (continents.indexOf(continent) < 0) {
      continents.push(continent)
      zones.push(
        <option
          key={continent}
          disabled={true}
        >
          {continent}
        </option>
      )
    }

    zones.push(
      <option
        key={timeZone}
        value={timeZone}
      >
        {city}
      </option>
    )
  })

  if (continents.length === 1) {
    zones.shift()
  }


  const updateTimeZone = (event) => {
    const value = event.target.value
    setTimeZone(value)
  }


  return (
    <select
      value={timeZone}
      onChange={updateTimeZone}
    >
      { zones }
    </select>
  )
}


// Sorting time zones
function byTimeAndZoneName(a, b) {
  const aString = a.zoneString
  const bString = b.zoneString

  if (aString === bString) {
    // Time zones are identical; sort alphabetically by zone name
    if (a.timeZone < b.timeZone) {
      return -1
    } else {
      return 1
    }
  } else {
    // Sort by time
    if (aString < bString) {
      return -1
    } else {
      return 1
    }
  }
}