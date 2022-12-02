import React, {
  createContext,
  useState,
  useEffect
} from 'react'

import collections from '/imports/api/collections'
import { removeFrom } from '/imports/tools/utilities'
import methods from '/imports/api/methods/'
console.log("TimetableContext methods:", methods);


const { addTimeZone } = methods



export const TimetableContext = createContext()


export const TimetableProvider = ({children}) => {
  const [ ready, setReady ] = useState(false)
  const [ timeZone, setTimeZone ] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  ) // "Europe/Moscow"

  const [ daysToDisplay, setDaysToDisplay ] = useState(8)

  // Get 00:00 this morning, in the timezone of the OS
  const today = new Date()
  today.setHours(0, 0, 0, 0)



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
        today,
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