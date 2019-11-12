const runAsynchronously = typeof setImmediate !== 'undefined'
  ? setImmediate
  : ((func: (...args: any) => void) => setTimeout(func, 0));

const asyncify = (func: (...args: any) => void) => (
  (...args: any) => new Promise((res, rej) => {
    runAsynchronously(() => {
      try {
        const result = func(...args);
        res(result);
      } catch (e) {
        rej(e);
      }
    });
  })
);

export default asyncify;
