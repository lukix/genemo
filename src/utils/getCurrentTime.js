const hrtime = require('browser-process-hrtime');

/**
 * Returns current time in milliseconds
 */
const getCurrentTime = () => {
  const [seconds, nanoseconds] = hrtime();
  return seconds * 1e3 + nanoseconds * 1e-6;
};

module.exports = getCurrentTime;
