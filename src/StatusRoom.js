const fetch = require('node-fetch');
const { acceptOnly200, fromJSON } = require('./Http');
const { fromISOString, toISOString, now, PT30M } = require('./Time');
const { getAccessToken } = require('./OutlookAuth');
const { Range, TimeRange, quote, isBetween } = require('./OutlookFilter');

const UNDEFINED       = 0;
const FREE            = 1;
const IN_MEETING      = 2;
const IN_MEETING_SOON = 3;

const NAMES = {
  [UNDEFINED]      : 'UNDEFINED',
  [FREE]           : 'FREE',
  [IN_MEETING]     : 'IN_MEETING',
  [IN_MEETING_SOON]: 'IN_MEETING_SOON',
};

const get = async roomId => {
  const accessToken = await getAccessToken();
  const start = now();
  const end = start + PT30M;
  return fetch(
    createGetConflictEventsUrl(start, end, roomId),
    { method: 'GET', headers: createHeaders(accessToken) }
  )
  .then(acceptOnly200)
  .then(fromJSON)
  .then(eventsLenses)
  .then(filterByNotDeclidedRoomId(roomId))
  .then(defineStatusRoomByEvents(start));
};

const getName = status => NAMES[status];

const createGetConflictEventsUrl = (start, end, roomId) =>
  `https://graph.microsoft.com/beta/users/${roomId}/events?$filter=${createConflictEventsFilter(start, end)}`;

const createConflictEventsFilter = (eventStart, eventEnd) => {
  const eventTimeRange = TimeRange(eventStart, eventEnd);
  const isBetweenCurrentEvent = isBetween(eventTimeRange);
  const isBetweenConflictEvent = isBetween(Range('start/dateTime', 'end/dateTime'));
  return `${isBetweenCurrentEvent('end/dateTime')} \
  or ${isBetweenCurrentEvent('start/dateTime')} \
  or ${isBetweenConflictEvent(eventTimeRange)}`;
};

const createHeaders = token => ({
  ['authorization'] : `Bearer ${token}`,
  ['content-type' ] : `application/json`
});

const eventsLenses = json => json.value;

const filterByNotDeclidedRoomId = roomId => events =>
  events.filter(
    event => event.attendees.filter(
      attendee => attendee.emailAddress.address === roomId
                  && attendee.status.response !== 'declined'
    ).length
    || event.organizer.emailAddress.address === roomId
    || event.location.locationUri === roomId

  );

const defineStatusRoomByEvents = start => events =>
  events.length === 0 ?
    FREE :
    getMinEventStartTimestamp(events) < start ? IN_MEETING : IN_MEETING_SOON;

const getMinEventStartTimestamp = events =>
  events.map(
    event => fromISOString(getEventStartDateTime(event))
  );

const getEventStartDateTime = event => event.start.dateTime;

module.exports = {
  UNDEFINED,
  FREE,
  IN_MEETING,
  IN_MEETING_SOON,
  get,
  getName,
};
