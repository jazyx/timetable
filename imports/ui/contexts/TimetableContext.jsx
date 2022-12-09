import React, {
  createContext,
  useState,
  useEffect,
  useRef
} from 'react'

import collections from '/imports/api/collections'
import {
  removeFrom,
  getTimeValues,
} from '/imports/tools/utilities'

import methods from '/imports/api/methods/'
const { addTimeZone } = methods



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

  // <<< DRAG // DRAG // DRAG // DRAG // DRAG // DRAG //
  const dragItem = useRef()
  const dragGhost = useRef()
  const dragItemHeight = useRef()

  const dragStart = (event) => {
    const target = event.target
    target.classList.add("dragged")

    dragItem.current = target
    const ghost = dragGhost.current = target.cloneNode(true)
    dragItemHeight.current = getComputedStyle(target)
                            .getPropertyValue("height")

    document.body.append(ghost)

    // Allow empty cells to react to drag events
    document.getElementById("grid").classList.add("dragging")

    // Hide the default drag image
    event.dataTransfer.setDragImage(new Image(),0,0)
  }


  const showDragImage = (event) => {
    const {
      left,
      top,
      width,
    } = event.target.getBoundingClientRect()
    dragGhost.current.style = `
      position: fixed;
      left: ${left}px;
      top: ${top}px;
      width: ${width}px;
      height: ${dragItemHeight.current};
      opacity: 0.75;
      pointer-events: none;
    `
  }

  const dragOver = (event) => {
    showDragImage(event)
    event.preventDefault() // enables `drop` event
    // event.target.classList.add("over")
  }

  const dragLeave = (event) => {
    // event.target.classList.remove("over")
  }

  const drop = (event) => {
    event.target.classList.remove("over")
    document.getElementById("grid").classList.remove("dragging")

    dragGhost.current.remove()
    dragGhost.current = undefined
    dragItem.current.classList.remove("dragged")
    dragItem.current = undefined
  }
  // DRAG // DRAG // DRAG // DRAG // DRAG // DRAG >>>//



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
        setTimeZone,
        dragStart,
        dragOver,
        dragLeave,
        drop
      }}
    >
      {children}
    </TimetableContext.Provider>
  )
}