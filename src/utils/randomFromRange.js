// "from" and "to" are inclusive
const randomFromRange = random => (from, to) => from + Math.floor(random() * (to - from + 1));

module.exports = randomFromRange;
