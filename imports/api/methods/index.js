import { Meteor } from 'meteor/meteor'



import * as timeZones from './timeZones'
import * as timeTable from './timeTable'
import * as accounts  from './accounts'
import * as user      from './user'



const methodObjects = {
  ...timeZones,
  ...timeTable,
  ...accounts,
  ...user
}



const methods = Object.values(methodObjects)



methods.forEach(method => {
  Meteor.methods({
    [method.name]: function (args) {
      method.validate.call(this, args)
      return method.run.call(this, args)
    }
  })
})


export default methodObjects
