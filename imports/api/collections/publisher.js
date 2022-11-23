/**
 * /imports/api/collections/publisher.js
 */

 import { Meteor } from 'meteor/meteor' 
 import collections from './index'
 

 
 if (Meteor.isServer) {
   for (name in collections) {
     const select = {} // TODO? CUSTOMIZE?
     const collection = collections[name]
  
     name = collection._name // name.toLowerCase()
 
     // The publication method is run each time a client subscribes to
     // the named collection. The subscription may be made directly or
     // through the /imports/api/methods/mint.js script
 
     Meteor.publish(name, function publish(caller, ...more) {
       // We need to use the classic function () syntax so that we can
       // use this to access the Meteor connection and use this.user_id
 
       let items = collection.find(select) // (customSelect || select)
 
       if (typeof caller === "string") {
         console.log(
           "Publishing", collection._name, "for", caller, ...more
         )
       }
 
       return items
     })
   }
 }
 
 
//  export default collections
 