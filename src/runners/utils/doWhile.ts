/* eslint-disable no-await-in-loop */

const doWhile = async (
  loopBody: (any) => any,
  predicate: (any) => boolean,
  initialState: any,
) => {
  let state = initialState;
  do {
    state = await loopBody(state);
  } while (!(await predicate(state)));
  return state;
};

export default doWhile;
