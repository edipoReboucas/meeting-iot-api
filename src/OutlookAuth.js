const fetch = require('node-fetch');
const qs = require('querystring');
const Http = require('./Http');
const Config = require('../config');

const getAccessToken = async () =>
  fetch(createTokenRequestURL(Config.auth.tenant), createTokenRequestBody(Config.auth.tokenParams))
  .then(Http.acceptOnly200)
  .then(Http.fromJSON)
  .then(accessTokenLenses);

const createTokenRequestURL = tenant => `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;

const createTokenRequestBody = tokenParams => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  body: qs.stringify(tokenParams)
});

const accessTokenLenses = tokenResponse =>  tokenResponse.access_token;

module.exports = {
  getAccessToken,
  createTokenRequestURL,
  createTokenRequestBody,
  accessTokenLenses,
};
