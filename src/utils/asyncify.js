const runAsynchronously = typeof setImmediate !== 'undefined'
  ? setImmediate
  : (func => setTimeout(func, 0));

const asyncify = func => (...args) => new Promise((res, rej) => {
  runAsynchronously(() => {
    try {
      const result = func(...args);
      res(result);
    } catch (e) {
      rej(e);
    }
  });
});

export default asyncify;
