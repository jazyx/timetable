import SimpleSchema from 'simpl-schema'


import collections from '../collections'
const {
  Session
 } = collections


 import {
  reschedule
} from '/imports/tools/utilities'



export const rescheduleSession = {
  name: "timetable.rescheduleSession"

, call(sessionData, callback) {
    const options = {
      returnStubValue: true
    , throwStubExceptions: true
    }

    Meteor.apply(this.name, [sessionData], options, callback)
  }

, validate(sessionData) {
    new SimpleSchema({
      _id:           { type: String },
      scheduled:     { type: Date,   optional: true },
      weekStart:     { type: Date,   optional: true },
      day:           { type: Number, optional: true},
      date:          { type: Date}
    }).validate(sessionData)
  }

, run(sessionData) {
    let {
      _id,
      scheduled,
      weekStart,
      day,
      date
    } = sessionData;
    // _id        of original dated or repeating session
    // class_id   id of class the repeating session belongs to
    // scheduled: date of repeating session
    // weekStart: undefined if drag and drop dates are in the
    //            same week
    //            midnight on Monday of the drop week, if not
    // date:      new date for this session

    if (scheduled) {
      // Create a new dated record with the data from the
      // Session document with the given _id
      const session = Session.findOne({ _id })
      // _id:              <string id>
      // class_id:         <string id>
      // repeat_from_date: <Date>
      // duration:         <minutes>
      // index:            <integer session in week>

      const { repeat_from_date } = session
      delete session._id
      delete session.repeat_from_date
      delete session.name_remove_later // REMOVE LATER

      if (weekStart) {
        // The rescheduled date is in a different week from the
        // original repeating session.
        // 1. If a repeating session with the same index appears
        //    in the target week, convert that to a dated session
        //    so that it is not overwritten by the rescheduled
        //    session with the same index. A repeating session
        //    will appear if a _dated_ session with the same
        //    index does not exist in that week.
        //    So first we check that such a dated session does
        //    not exist...

        const weekEnd = reschedule(weekStart, 7)
        let query = { $and: [
          { class_id: session.class_id },
          { index:    session.index },
          { date:     { $exists: true }},
          { date:     { $gte: weekStart }},
          { date:     { $lte: weekEnd }}
        ]}

        let datedSession = Session.findOne(query)

        if (!datedSession) {
          // Create a dated session for the repeating session.
          const daysLater = (day + 6) % 7 // adjust for monday
          datedSession = { ...session }
          datedSession.date = reschedule(weekStart, daysLater, repeat_from_date)
          Session.insert(datedSession)
        }

        // 2. Replace the original scheduled repeating session
        //    with an unscheduled dated session, to indicate
        //    that the original session has moved
        const unscheduled = { ...session }
        unscheduled.date = scheduled
        unscheduled.unscheduled = true
        Session.insert(unscheduled)
      }

      // Create a new dated session
      session.date = date
      Session.insert(session)

    } else {
      // Simply change the date of the session
      const $set = { date }
      Session.update({ _id }, { $set })
    }
  }
}

/**
 * Adds a dated Session record, using the date-time for which
 * a specific repeating session was scheduled. This is called
 * by Teacher.jsx as a useEffect when the given repeating
 * session is already in the past.
 */
export const createDatedSession = {
  name: "timetable.createDatedSession"

, call(sessionData, callback) {
    const options = {
      returnStubValue: true
    , throwStubExceptions: true
    }

    Meteor.apply(this.name, [sessionData], options, callback)
  }

, validate(sessionData) {
    new SimpleSchema({
      _id:               { type: String, optional: true },
      class_id:          { type: String },
      duration:          { type: Number },
      index:             { type: Number },
      repeat_from_date:  { type: Date },
      scheduled:         { type: Date },
      name_remove_later: { type: String, optional: true }
    }).validate(sessionData)
  }

, run(sessionData) {
    sessionData = { ...sessionData }
    sessionData.date = sessionData.scheduled
    delete sessionData._id
    delete sessionData.scheduled
    delete sessionData.repeat_from_date
    delete sessionData.name_remove_later // REMOVE LATER

    Session.insert(sessionData)
  }
}