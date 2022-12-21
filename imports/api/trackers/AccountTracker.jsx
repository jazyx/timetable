 /**
 * AccountTracker.js
 *
 * UseTracker is called by UserContext each time it is
 * (re-)rendered.
 */


import {
  Teacher,
  School
} from '/imports/api/collections/'



export const AccountTracker = (props) => {
  // console.log("props:", props);
  // Before login | registration:
  // { name, email, password, role, remember, autoLogin }
  // After registration, before confirmation:
  // { [jwt,] [awaiting_confirmation,] email }
  //
  // After login:
  // { _id, name, role }

  let setUpComplete = false


  const { _id, role } = props


  const collection = (() => {
    if ( _id ) {
      switch (role) {
        case "teacher":
          return Teacher
        case "school":
          return School
      }
    }

    return null // or undefined or whatever
  })()


  if (collection) {
    const query = { _id }
    const fields = { setup_complete: 1 }
    const settings = collection.findOne(query, fields)

    setUpComplete = !!(settings && settings.setup_complete)
  }


  return {
    setUpComplete
  }
}