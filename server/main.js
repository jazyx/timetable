import { Meteor } from 'meteor/meteor';
import collections from '/imports/api/collections';

// Run init.js and publisher.js as side-effects
import './init.js'
import '/imports/api/collections/publisher.js'