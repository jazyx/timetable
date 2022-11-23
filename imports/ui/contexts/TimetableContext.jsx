import React, {
  createContext,
  useState,
  useEffect
} from 'react'

import collections from '/imports/api/collections'
import { removeFrom } from '/imports/tools/utilities'



export const TimetableContext = createContext()


export const TimetableProvider = ({children}) => {
  const [ ready, setReady ] = useState(false)

  // <<< SUBSCRIBE / SUBSCRIBE / SUBSCRIBE / SUBSCRIBE //

  const unReady = []
  const subscriptions = {}

  const isReady = collectionName => {
    removeFrom(unReady, collectionName)

    if (!unReady.length) {
      setReady(true)
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
        ready // set to true when core collections are online
      }}
    >
      {children}
    </TimetableContext.Provider>
  )
}