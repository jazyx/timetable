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
  const dragData = useRef()
  // { session, ghost, height, lockCount, locked }

  const dragStart = (event) => {
    const session = event.target
    const ghost = session.cloneNode(true)
    const height = getComputedStyle(session)
                  .getPropertyValue("height")
    // HACK: height is provided as a prop to the Session component
    // so a "height" attribute is added to the Session element.
    // This allows us to retrieve it here.
    const lockCount = session.getAttribute("height") * 1

    dragData.current = {
      session,
      ghost,
      height,
      lockCount
    }

    session.classList.add("dragged")
    ghost.classList.remove("session")
    document.body.append(ghost)

    // Allow empty cells to react to drag events
    document.getElementById("grid").classList.add("dragging")

    // Hide the default drag image
    event.dataTransfer.setDragImage(new Image(),0,0)
    showDragGhost(event, true)
  }


  const dragEnter = (event) => {
    showDragGhost(event)
  }


  const dragOver = (event) => {
    if (!dragData.current.locked) {
      event.preventDefault() // enables `drop` event
    }
  }


  const dragEnd = (event) => {
    const { session, ghost } = dragData.current

    ghost.remove()
    session.classList.remove("dragged")
    dragData.current = {}

    document.getElementById("grid").classList.remove("dragging")
  }


  const drop = (event) => {
    console.log("Can drop")
  }


  function showDragGhost(event, ignoreLock) {
    if (!ignoreLock) {
      event.preventDefault() // enables `drop` event
    }

    let { session, ghost, height, lockCount } = dragData.current

    const target = event.target
    let locked = target.classList.contains("locked")

    if (!locked && !ignoreLock) {
      // Check if the target is too close above a session, or to
      // the end of the day, to be dropped there
      let nextCell = target.nextSibling
      while (--lockCount)
      {
        if (!nextCell || nextCell.querySelector(".session")) {
          locked = true
          break
        }

        nextCell = nextCell.nextSibling // undefined if last in day
      }
    }

    let style = `display:none;`
    if (locked) {
      session.classList.remove("dragged")

    } else {
      const {
        left,
        top,
        width,
      } = target.getBoundingClientRect()

      style += `
        display: flex;
        position: fixed;
        left: ${left}px;
        top: ${top}px;
        width: ${width}px;
        height: ${height};
        opacity: 0.75;
        pointer-events: none;
        border: 1px solid white;
        box-sizing: border-box;
      `
      session.classList.add("dragged")
    }

    ghost.style = style

    dragData.current.locked = locked
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
        dragEnter,
        dragOver,
        dragEnd,
        drop
      }}
    >
      {children}
    </TimetableContext.Provider>
  )
}