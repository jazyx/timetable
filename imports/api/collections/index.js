import { Mongo } from 'meteor/mongo';

export const L10n        = new Mongo.Collection("l10n");
export const School      = new Mongo.Collection("school");
export const Company     = new Mongo.Collection("company");
export const Teacher     = new Mongo.Collection("teacher");
export const Contract    = new Mongo.Collection("contract");
export const Class       = new Mongo.Collection("class");
export const Student     = new Mongo.Collection("student");
export const Session     = new Mongo.Collection("session");
export const Spreadsheet = new Mongo.Collection("spreadsheet");
export const TimeZone    = new Mongo.Collection("timezone");

// You can use either:
//
// import collections from '/imports/api/collections'
// const { School, Company } = collections
// OR
// import { School } from '/imports/api/collections'
// import { Company } from '/imports/api/collections'