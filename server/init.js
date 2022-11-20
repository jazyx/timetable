/**
 * init.js
 *
 * Populates MongoDB with initial data from /private/json/
 */

import collections from '/imports/api/collections';

const fs = require("fs")
const path = require("path");

// <<< HARD-CODED file location during development
const localPath = "/Users/james/Documents/Repos/Personal/Timetable/private"
// HARD-CODED >>>

// Calculate file location in build
const knownFile   = "private"
const privatePath = Assets.absoluteFilePath(knownFile)
                          .replace(knownFile, "")

// Insert data from local JSON files into MongoDB
const sources = ["School", "Teacher", "Company"]

sources.forEach(populateFromJSON)

function populateFromJSON(name) {
  const collection = collections[name]
  const fileName   = `json/${name}.json`
  const localName  = `${localPath}/${fileName}`
  const buildPath   = path.join(privatePath, fileName)

  // Read the file in the build folder
  const text = fs.readFileSync(buildPath, "utf-8")

  try { // JSON.parse() might fail
    const docs = JSON.parse(text)  

    // Drop the existing collection (if it exists)
    collection.rawCollection()
              .drop()  // returns a promise
              .catch() // there may be no collection to drop
              .finally(insertRecords)
              
      function insertRecords() {
        console.log(`Inserting records into ${name} collection from ${fileName}`);
        
        docs.forEach( doc => {
          doc._id = collection.insert(doc)      
        })

        // Update files in development folder with _id values 
        if (fs.existsSync(localPath)) {
          // We could also check if we are in development mode
          const json = JSON.stringify(docs, null, "  ")
          fs.writeFileSync(localName, json)
        }
      }

    } catch {
      console.log(`Can't parse text from private/${fileName}`)  
    }
}