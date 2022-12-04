import React, {
  createContext,
  useState,
  useEffect
} from 'react'

import collections from '/imports/api/collections'
import {
  removeFrom,
  getTimeValues,
} from '/imports/tools/utilities'

import methods from '/imports/api/methods/'
const { addTimeZone } = methods


let renders = 0


export const TimetableContext = createContext()


export const TimetableProvider = ({children}) => {
  const [ ready, setReady ] = useState(false)

  // Prepare to get 00:00 this morning, and 00:00 on Monday
  // in the timezone of the OS. Use placeholder dates until
  // setDateValues() useEffect is triggered.
  const [ timeZone, setTimeZone ] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  ) // "Europe/Moscow"
  const [ midnight, setMidnight ] = useState(new Date())
  const [ monday, setMonday ] = useState(new Date())
  const [ day, setDay ] = useState(0)

  const [ endTime, setEndTime ] = useState(new Date())

  const [ daysToDisplay, setDaysToDisplay ] = useState(8)

  // <<< TIMEZONE // TIMEZONE // TIMEZONE // TIMEZONE //
  const setDateValues = () => {
    const { midnight, monday, day} = getTimeValues(timeZone)
    setMidnight(midnight)
    setMonday(monday)
    setDay(day)

    const addMS = daysToDisplay * 24 * 60 * 60 * 1000
    const endTime = new Date(midnight.getTime() + addMS)
    setEndTime(endTime)
    // console.log("renders:", renders++);
    // console.log("timeZone:", timeZone);
    // console.log("midnight:", midnight);
    // console.log("monday:", monday);
  }

  useEffect(setDateValues, [ timeZone ])
  // TIMEZONE // TIMEZONE // TIMEZONE // TIMEZONE >>> //


  // <<< SUBSCRIBE / SUBSCRIBE / SUBSCRIBE / SUBSCRIBE //

  const unReady = []
  const subscriptions = {}

  const isReady = collectionName => {
    removeFrom(unReady, collectionName)

    if (!unReady.length) {
      setReady(true)
      addTimeZone.call({ timeZone })
    }
  }

  const subscribeToCollections = () => {
    for (let collectionName in collections) {
      unReady.push(collectionName)

      const collection = collections[collectionName]
      const callback = () => isReady(collectionName)
      const handle   = Meteor.subscribe(collection._name, callback)
      subscriptions[collectionName] = handle
    }
  }

  useEffect(subscribeToCollections, [])

  // SUBSCRIBE / SUBSCRIBE / SUBSCRIBE / SUBSCRIBE >>> //


  return (
    <TimetableContext.Provider
      value={{
        ready, // set to true when core collections are online
        midnight,
        monday,
        day,
        endTime,
        daysToDisplay,
        setDaysToDisplay,
        timeZone,
        setTimeZone
      }}
    >
      {children}
    </TimetableContext.Provider>
  )
}