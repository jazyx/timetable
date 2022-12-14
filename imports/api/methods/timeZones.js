// import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'

import collections from '../collections/'
const {
  TimeZone,
  Session
 } = collections

 import {
  reschedule
} from '/imports/tools/utilities'

// Intl.supportedValuesOf('timeZone')
// https://stackoverflow.com/a/54500197/1927589

const aryIannaTimeZones = [
  'Africa/Abidjan',
  'Africa/Accra',
  'Africa/Algiers',
  'Africa/Bissau',
  'Africa/Cairo',
  'Africa/Casablanca',
  'Africa/Ceuta',
  'Africa/El_Aaiun',
  'Africa/Johannesburg',
  'Africa/Juba',
  'Africa/Khartoum',
  'Africa/Lagos',
  'Africa/Maputo',
  'Africa/Monrovia',
  'Africa/Nairobi',
  'Africa/Ndjamena',
  'Africa/Sao_Tome',
  'Africa/Tripoli',
  'Africa/Tunis',
  'Africa/Windhoek',

  'America/Adak',
  'America/Anchorage',
  'America/Araguaina',
  'America/Argentina/Buenos_Aires',
  'America/Argentina/Catamarca',
  'America/Argentina/Cordoba',
  'America/Argentina/Jujuy',
  'America/Argentina/La_Rioja',
  'America/Argentina/Mendoza',
  'America/Argentina/Rio_Gallegos',
  'America/Argentina/Salta',
  'America/Argentina/San_Juan',
  'America/Argentina/San_Luis',
  'America/Argentina/Tucuman',
  'America/Argentina/Ushuaia',
  'America/Asuncion',
  'America/Atikokan',
  'America/Bahia_Banderas',
  'America/Bahia',
  'America/Barbados',
  'America/Belem',
  'America/Belize',
  'America/Blanc-Sablon',
  'America/Boa_Vista',
  'America/Bogota',
  'America/Boise',
  'America/Cambridge_Bay',
  'America/Campo_Grande',
  'America/Cancun',
  'America/Caracas',
  'America/Cayenne',
  'America/Chicago',
  'America/Chihuahua',
  'America/Costa_Rica',
  'America/Creston',
  'America/Cuiaba',
  'America/Curacao',
  'America/Danmarkshavn',
  'America/Dawson_Creek',
  'America/Dawson',
  'America/Denver',
  'America/Detroit',
  'America/Edmonton',
  'America/Eirunepe',
  'America/El_Salvador',
  'America/Fort_Nelson',
  'America/Fortaleza',
  'America/Glace_Bay',
  'America/Godthab',
  'America/Goose_Bay',
  'America/Grand_Turk',
  'America/Guatemala',
  'America/Guayaquil',
  'America/Guyana',
  'America/Halifax',
  'America/Havana',
  'America/Hermosillo',
  'America/Indiana/Indianapolis',
  'America/Indiana/Knox',
  'America/Indiana/Marengo',
  'America/Indiana/Petersburg',
  'America/Indiana/Tell_City',
  'America/Indiana/Vevay',
  'America/Indiana/Vincennes',
  'America/Indiana/Winamac',
  'America/Inuvik',
  'America/Iqaluit',
  'America/Jamaica',
  'America/Juneau',
  'America/Kentucky/Louisville',
  'America/Kentucky/Monticello',
  'America/La_Paz',
  'America/Lima',
  'America/Los_Angeles',
  'America/Maceio',
  'America/Managua',
  'America/Manaus',
  'America/Martinique',
  'America/Matamoros',
  'America/Mazatlan',
  'America/Menominee',
  'America/Merida',
  'America/Metlakatla',
  'America/Mexico_City',
  'America/Miquelon',
  'America/Moncton',
  'America/Monterrey',
  'America/Montevideo',
  'America/Nassau',
  'America/New_York',
  'America/Nipigon',
  'America/Nome',
  'America/Noronha',
  'America/North_Dakota/Beulah',
  'America/North_Dakota/Center',
  'America/North_Dakota/New_Salem',
  'America/Ojinaga',
  'America/Panama',
  'America/Pangnirtung',
  'America/Paramaribo',
  'America/Phoenix',
  'America/Port_of_Spain',
  'America/Port-au-Prince',
  'America/Porto_Velho',
  'America/Puerto_Rico',
  'America/Punta_Arenas',
  'America/Rainy_River',
  'America/Rankin_Inlet',
  'America/Recife',
  'America/Regina',
  'America/Resolute',
  'America/Rio_Branco',
  'America/Santarem',
  'America/Santiago',
  'America/Santo_Domingo',
  'America/Sao_Paulo',
  'America/Scoresbysund',
  'America/Sitka',
  'America/St_Johns',
  'America/Swift_Current',
  'America/Tegucigalpa',
  'America/Thule',
  'America/Thunder_Bay',
  'America/Tijuana',
  'America/Toronto',
  'America/Vancouver',
  'America/Whitehorse',
  'America/Winnipeg',
  'America/Yakutat',
  'America/Yellowknife',

  'Antarctica/Casey',
  'Antarctica/Davis',
  'Antarctica/Macquarie',
  'Antarctica/Mawson',
  'Antarctica/Palmer',
  'Antarctica/Rothera',
  'Antarctica/Syowa',
  'Antarctica/Troll',
  'Antarctica/Vostok',

  'Asia/Almaty',
  'Asia/Amman',
  'Asia/Anadyr',
  'Asia/Aqtau',
  'Asia/Aqtobe',
  'Asia/Ashgabat',
  'Asia/Atyrau',
  'Asia/Baghdad',
  'Asia/Baku',
  'Asia/Bangkok',
  'Asia/Barnaul',
  'Asia/Beirut',
  'Asia/Bishkek',
  'Asia/Brunei',
  'Asia/Chita',
  'Asia/Choibalsan',
  'Asia/Colombo',
  'Asia/Damascus',
  'Asia/Dhaka',
  'Asia/Dili',
  'Asia/Dubai',
  'Asia/Dushanbe',
  'Asia/Famagusta',
  'Asia/Gaza',
  'Asia/Hebron',
  'Asia/Ho_Chi_Minh',
  'Asia/Hong_Kong',
  'Asia/Hovd',
  'Asia/Irkutsk',
  'Asia/Jakarta',
  'Asia/Jayapura',
  'Asia/Jerusalem',
  'Asia/Kabul',
  'Asia/Kamchatka',
  'Asia/Karachi',
  'Asia/Kathmandu',
  'Asia/Khandyga',
  'Asia/Kolkata',
  'Asia/Krasnoyarsk',
  'Asia/Kuala_Lumpur',
  'Asia/Kuching',
  'Asia/Macau',
  'Asia/Magadan',
  'Asia/Makassar',
  'Asia/Manila',
  'Asia/Nicosia',
  'Asia/Novokuznetsk',
  'Asia/Novosibirsk',
  'Asia/Omsk',
  'Asia/Oral',
  'Asia/Pontianak',
  'Asia/Pyongyang',
  'Asia/Qatar',
  'Asia/Qyzylorda',
  'Asia/Riyadh',
  'Asia/Sakhalin',
  'Asia/Samarkand',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Srednekolymsk',
  'Asia/Taipei',
  'Asia/Tashkent',
  'Asia/Tbilisi',
  'Asia/Tehran',
  'Asia/Thimphu',
  'Asia/Tokyo',
  'Asia/Tomsk',
  'Asia/Ulaanbaatar',
  'Asia/Urumqi',
  'Asia/Ust-Nera',
  'Asia/Vladivostok',
  'Asia/Yakutsk',
  'Asia/Yangon',
  'Asia/Yekaterinburg',
  'Asia/Yerevan',

  'Atlantic/Azores',
  'Atlantic/Bermuda',
  'Atlantic/Canary',
  'Atlantic/Cape_Verde',
  'Atlantic/Faroe',
  'Atlantic/Madeira',
  'Atlantic/Reykjavik',
  'Atlantic/South_Georgia',
  'Atlantic/Stanley',

  'Australia/Adelaide',
  'Australia/Brisbane',
  'Australia/Broken_Hill',
  'Australia/Currie',
  'Australia/Darwin',
  'Australia/Eucla',
  'Australia/Hobart',
  'Australia/Lindeman',
  'Australia/Lord_Howe',
  'Australia/Melbourne',
  'Australia/Perth',
  'Australia/Sydney',

  'Europe/Amsterdam',
  'Europe/Andorra',
  'Europe/Astrakhan',
  'Europe/Athens',
  'Europe/Belgrade',
  'Europe/Berlin',
  'Europe/Brussels',
  'Europe/Bucharest',
  'Europe/Budapest',
  'Europe/Chisinau',
  'Europe/Copenhagen',
  'Europe/Dublin',
  'Europe/Gibraltar',
  'Europe/Helsinki',
  'Europe/Istanbul',
  'Europe/Kaliningrad',
  'Europe/Kiev',
  'Europe/Kirov',
  'Europe/Lisbon',
  'Europe/London',
  'Europe/Luxembourg',
  'Europe/Madrid',
  'Europe/Malta',
  'Europe/Minsk',
  'Europe/Monaco',
  'Europe/Moscow',
  'Europe/Oslo',
  'Europe/Paris',
  'Europe/Prague',
  'Europe/Riga',
  'Europe/Rome',
  'Europe/Samara',
  'Europe/Saratov',
  'Europe/Simferopol',
  'Europe/Sofia',
  'Europe/Stockholm',
  'Europe/Tallinn',
  'Europe/Tirane',
  'Europe/Ulyanovsk',
  'Europe/Uzhgorod',
  'Europe/Vienna',
  'Europe/Vilnius',
  'Europe/Volgograd',
  'Europe/Warsaw',
  'Europe/Zaporozhye',
  'Europe/Zurich',

  'Indian/Chagos',
  'Indian/Christmas',
  'Indian/Cocos',
  'Indian/Kerguelen',
  'Indian/Mahe',
  'Indian/Maldives',
  'Indian/Mauritius',
  'Indian/Reunion',

  'Pacific/Apia',
  'Pacific/Auckland',
  'Pacific/Bougainville',
  'Pacific/Chatham',
  'Pacific/Chuuk',
  'Pacific/Easter',
  'Pacific/Efate',
  'Pacific/Enderbury',
  'Pacific/Fakaofo',
  'Pacific/Fiji',
  'Pacific/Funafuti',
  'Pacific/Galapagos',
  'Pacific/Gambier',
  'Pacific/Guadalcanal',
  'Pacific/Guam',
  'Pacific/Honolulu',
  'Pacific/Kiritimati',
  'Pacific/Kosrae',
  'Pacific/Kwajalein',
  'Pacific/Majuro',
  'Pacific/Marquesas',
  'Pacific/Nauru',
  'Pacific/Niue',
  'Pacific/Norfolk',
  'Pacific/Noumea',
  'Pacific/Pago_Pago',
  'Pacific/Palau',
  'Pacific/Pitcairn',
  'Pacific/Pohnpei',
  'Pacific/Port_Moresby',
  'Pacific/Rarotonga',
  'Pacific/Tahiti',
  'Pacific/Tarawa',
  'Pacific/Tongatapu',
  'Pacific/Wake',
  'Pacific/Wallis'
  // 'Antarctica/DumontDUrville', // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
  // 'Asia/Qostanay', // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
]

export const addTimeZone = {
  name: "timetable.addTimeZone"

, call(addTimeZoneData, callback) {
    const options = {
      returnStubValue: true
    , throwStubExceptions: true
    }

    Meteor.apply(this.name, [addTimeZoneData], options, callback)
  }

, validate(addTimeZoneData) {
    new SimpleSchema({
      timeZone:   { type: String }
    }).validate(addTimeZoneData)
  }

, run(addTimeZoneData) {
    const { timeZone } = addTimeZoneData
    if (aryIannaTimeZones.indexOf(timeZone) < 0) {
      return { error: `Invalid time zone name: ${timeZone}`}
    }

    const existingZone = TimeZone.findOne({ timeZone })

    if (!existingZone) {
      TimeZone.insert({ timeZone })
    }
  }
}


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
      const { repeat_from_date } = session

      console.log("Reschedule session:", {...session});
      // _id:              <string id>
      // class_id:         <string id>
      // repeat_from_date: <Date>
      // duration:         <minutes>
      // index:            <integer session in week>

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