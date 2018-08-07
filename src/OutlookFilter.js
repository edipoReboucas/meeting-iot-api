const { toISOString } = require('./Time');

const Range = (start, end) => ({ isRange: true, start, end });

const TimeRange = (start, end) => Range(quote(toISOString(start)), quote(toISOString(end)));

const quote = value => `'${value}'`;

const isBetween = range => value =>
  value.isRange ? `${range.start} le ${value.start} and ${range.end} ge ${value.end}`
  : `${value} ge ${range.start} and ${value} le ${range.end}`;

module.exports = {
  Range,
  TimeRange,
  quote,
  isBetween,
};
