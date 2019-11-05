const cyclicProvider = (values) => {
  let index = 0;
  return () => {
    const result = values[index];
    index = (index + 1) % values.length;
    return result;
  };
};

export default cyclicProvider;
