const asyncify = func => (...args) => new Promise((res, rej) => {
  setTimeout(() => {
    try {
      const result = func(...args);
      res(result);
    } catch (e) {
      rej(e);
    }
  }, 0);
});

module.exports = asyncify;
