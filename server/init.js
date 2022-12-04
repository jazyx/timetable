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
const exo_collections = {
  "school_id":   "School",
  "teacher_id":  "Teacher",
  "company_id":  "Company",
  "contract_id": "Contract"
}
const isDevelopment = fs.existsSync(localPath)
// HARD-CODED >>>

// Calculate file location in build
const knownFile   = "private"
const privatePath = Assets.absoluteFilePath(knownFile)
                          .replace(knownFile, "")

// Insert data from local JSON files into MongoDB
const sources = [
  "L10n",
  "School",
  "Teacher",
  "Company",
  "Student",
  "Contract",
  "Session",
  "Class"
]
const exo_ids = Object.keys(exo_collections)

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
        // console.log(`Inserting records into ${name} collection from ${fileName}`);

        docs.forEach( doc => {
          if (isDevelopment) {
            insertProper_ids(doc)
            convertDates(doc)
          }
          doc._id = collection.insert(doc)
        })

        // Update files in development folder with _id values
        if (isDevelopment) {
          // We could also check if we are in development mode
          const json = JSON.stringify(docs, null, "  ")
          fs.writeFileSync(localName, json)
        }
      }

      function insertProper_ids(doc) {
        exo_ids.forEach( exo_id => {
          const name = doc[exo_id]
          if (name) {
            const collectionName = exo_collections[exo_id]
            const collection = collections[collectionName]
            const record = collection.findOne({ name }, {})
            if (record) {
              doc[exo_id] = record._id
            }
          }
        })
      }

      function convertDates(doc) {
        const keys = Object.keys(doc)
                           .filter( key => key.includes("date"))

        // const name = doc["name-remove-later"]

        keys.forEach( key => {
          let date = doc[key]
          if (date) {
            doc[key] = new Date(date)

            // if (name) {
            //   console.log("doc:", name);    
            //   console.log("date:", date);
            //   console.log("doc[key]:", doc[key]);
            //   console.log("")
            // }
          }
        })
      }

    } catch {
      console.log(`Can't parse text from private/${fileName}`)
    }
}