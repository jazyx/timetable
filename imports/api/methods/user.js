// import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'

import { User } from '../collections/'



export const registerUser = {
  name: "user.register"

, call(userData, callback) {
    const options = {
      returnStubValue: true
    , throwStubExceptions: true
    }

    Meteor.apply(this.name, [userData], options, callback)
  }

, validate(userData) {
    new SimpleSchema({
      name:     { type: String },
      email:    { type: String },
      password: { type: String }
    }).validate(userData)
  }

, run(userData) {
    let { name, email, password } = userData

    if (!name || !email || !password) {
      return { error: "Missing data", userData }
    }

    email = email.toLowerCase()
    const query = { email }
    const existingUser = User.findOne(query)

    if (existingUser) {
      return { message: `The email address ${email} is already registered. Log in?`}
    }

    const _id = User.insert(userData)

    return { _id }
  }
}


export const logUserIn = {
  name: "user.login"

, call(userData, callback) {
    const options = {
      returnStubValue: true
    , throwStubExceptions: true
    }

    Meteor.apply(this.name, [userData], options, callback)
  }

, validate(userData) {
    new SimpleSchema({
      email:    { type: String },
      password: { type: String }
    }).validate(userData)
  }

, run(query) {
    query.email = query.email.toLowerCase()
    const user = User.findOne(query)

    if (user) {
      return { success: user._id }
    } else {
      return { error: "Invalid email or password"}
    }
  }
}