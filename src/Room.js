const fetch = require('node-fetch');
const { toISOString, now, PT30M } = require('./Time');
const StatusRoom = require('./StatusRoom');
const { getAccessToken } = require('./OutlookAuth');
const Config = require('../config');

const get = async device => Config.device2Room[device];

const reserve = async roomId => {
  const accessToken = await getAccessToken();
  const start = now();
  const url = `https://graph.microsoft.com/beta/users/${roomId}/events`;
  const headers =  {
    ['authorization']: `Bearer ${accessToken}`,
    ['content-type'] : 'application/json'
  };
  const payload = {
    subject: 'Scheduled meeting through Agendador',
    start: {
      dateTime: toISOString(start),
      timeZone: 'UTC'
    },
    end: {
      dateTime: toISOString(start + PT30M),
      timeZone: 'UTC'
    },
    responseRequested: false,
  };
  const result = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  return roomId;
};

module.exports = {
  get,
  reserve,
};
