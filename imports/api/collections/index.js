import { Mongo } from 'meteor/mongo';

export const School      = new Mongo.Collection("school");
export const Company     = new Mongo.Collection("company");
export const Teacher     = new Mongo.Collection("teacher");
export const Contract    = new Mongo.Collection("contract");
export const Class       = new Mongo.Collection("class");
export const Student     = new Mongo.Collection("student");
export const Lesson      = new Mongo.Collection("lesson");
export const Spreadsheet = new Mongo.Collection("spreadsheet");

// You can use either:
//
// import collections from '/imports/api/collections'
// const { School, Company } = collections
// OR
// import { School } from '/imports/api/collections'
// import { Company } from '/imports/api/collections'