const randomFromRange = random => (from, to) => from + Math.floor(random() * (to - from + 1));

module.exports = randomFromRange;
