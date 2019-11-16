const cyclicProvider = <T>(values: Array<T>) => {
  let index = 0;
  return () => {
    const result = values[index];
    index = (index + 1) % values.length;
    return result;
  };
};

export default cyclicProvider;
