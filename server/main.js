import { Meteor } from 'meteor/meteor';
import collections from '/imports/api/collections';

// Run init.js publisher.js and methods for their side-effects
import './init.js'
import '/imports/api/collections/publisher.js'
import '/imports/api/methods'