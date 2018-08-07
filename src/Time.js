/**
 * Periods ISO8601
 */
const PT1S = 1000;
const PT1M = 60 * PT1S;
const PT30M = 30 * PT1M;

/**
 * Functions
 */
const now = () => Date.now();
const toISOString = time => (new Date(time)).toISOString();
const fromISOString = isoString => (new Date(`${isoString}Z`)).getTime();

module.exports = {
  PT1S,
  PT1M,
  PT30M,
  now,
  toISOString,
  fromISOString,
}
