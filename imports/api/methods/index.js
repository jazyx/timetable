import { Meteor } from 'meteor/meteor'



import * as timeZones from './timeZones'
import * as timeTable from './timeTable'



const methodObjects = {
  ...timeZones,
  ...timeTable
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
