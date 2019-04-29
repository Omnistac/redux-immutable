import Immutable from 'immutable';
import {
  getUnexpectedInvocationParameterMessage,
  validateNextState
} from './utilities';

export default (reducers: Object, getDefaultState: ?Function = Immutable.Map): Function => {
  const reducerKeys = Object.keys(reducers);

  // eslint-disable-next-line space-infix-ops
  return (inputState: ?Function = getDefaultState(), action: Object): Immutable.Map => {
    // eslint-disable-next-line no-process-env
    if (process.env.NODE_ENV !== 'production') {
      const warningMessage = getUnexpectedInvocationParameterMessage(inputState, reducers, action);

      if (warningMessage) {
        // eslint-disable-next-line no-console
        console.error(warningMessage);
      }
    }

    const ret = inputState
      .withMutations((temporaryState) => {
        reducerKeys.forEach((reducerName) => {
          const reducer = reducers[reducerName];
          const currentDomainState = temporaryState.get(reducerName);
          const nextDomainState = reducer(currentDomainState, action);

          validateNextState(nextDomainState, reducerName, action);

          temporaryState.set(reducerName, nextDomainState);
        });
      });

    // This is a hack to serve Trumid during the transitional period
    // from Omnistac-UI to trumid-fe.
    // Because we used redux-immutable in Omnistac-UI and plain javascript
    // in trumid-fe, we depend on destructuring state in the latter.
    // By tacking on plain field references to the Immutable.Map, this will work
    // without having to make a special selector depending on app platform.
    reducerKeys.forEach(reducerName => {
      ret[reducerName] = ret.get(reducerName);
    });

    return ret;
  };
};
