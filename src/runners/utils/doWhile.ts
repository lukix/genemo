/* eslint-disable no-await-in-loop */

const doWhile = async <T, U>(
  loopBody: (state: T | U) => Promise<U>,
  predicate: (state: U) => boolean,
  initialState: T,
): Promise<U> => {
  let state = await loopBody(initialState);
  while (!(await predicate(state))) {
    state = await loopBody(state);
  }
  return state;
};

// const doWhile = async <T>(
//   loopBody: (state: T) => T,
//   predicate: (state: T) => boolean,
//   initialState: T,
// ) => {
//   let state = initialState;
//   do {
//     state = await loopBody(state);
//   } while (!(await predicate(state)));
//   return state;
// };

export default doWhile;
