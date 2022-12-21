// import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'

import {
  User
} from '../collections/'

import {
  jwt_sign,
  jwt_verify
} from '../jwt'

import { createAccount } from './accounts'



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
      password: { type: String },
      role:     { type: String }
    }).validate(userData)
  }

, run(userData) {
    let { name, email, password, role } = userData

    if (!name || !email || !password || !role ) {
      return { error: "Missing data", userData }
    }

    email = userData.email = email.toLowerCase()
    const query = { email }
    const existingUser = User.findOne(query)

    if (existingUser) {
      return { message: `The email address ${email} is already registered. Log in?`}
    }

    const _id = User.insert(userData)
    const jwt = jwt_sign({ role, name, email })

    // TODO:
    // * Send a message to the given email address
    // * Return { awaiting_confirmation: true, email }

    return { email, jwt }
  }
}


export const confirmEmail = {
  name: "user.confirmEmail"

, call(confirmationData, callback) {
    const options = {
      returnStubValue: true
    , throwStubExceptions: true
    }

    Meteor.apply(this.name, [confirmationData], options, callback)
  }

, validate(confirmationData) {
    new SimpleSchema({
      token:    { type: String }
    }).validate(confirmationData)
  }

, run(confirmationData) {
    const { token } = confirmationData

    const payload = jwt_verify(token)
    const { role, name, email } = payload
    // email will be in lower case, by definition

    if (email) {
      const $set = { email_confirmed: true }
      const query = { role, name, email }
      const success = User.update( query, { $set })

      if (success) { // should be 1 and idempotent
        const fields = {
          "name": 1,
          "role": 1
        }
        const user = User.findOne(query, { fields })
        createAccount(user)

        return user
      }
    }

    return payload
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
    const fields = {
      name: 1,
      role: 1,
      email_confirmed: 1
    }
    const user = User.findOne(query, { fields })

    if (user) {
      if (user.email_confirmed) {
        delete user.email_confirmed // not needed in client
        return user

      } else {
        return { message: "Please confirm your email address"}
      }

    } else {
      return { fail: "Invalid email or password"}
    }
  }
}