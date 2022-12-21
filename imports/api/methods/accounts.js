// import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'

import {
  Teacher,
  School
} from '../collections/'


export const updateOrganizer = {
  name: "accounts.update"

, call(organizeData, callback) {
    const options = {
      returnStubValue: true
    , throwStubExceptions: true
    }

    Meteor.apply(this.name, [organizeData], options, callback)
  }

, validate(organizeData) {
    // new SimpleSchema({
    //   name:     { type: String },
    //   email:    { type: String },
    //   password: { type: String },
    //   role:     { type: String }
    // }).validate(organizeData)
  }

, run(organizeData) {
    const { role, _id } = organizeData

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
      const $set = { setup_complete: true }
      collection.update(query, { $set })
    }
  }
}