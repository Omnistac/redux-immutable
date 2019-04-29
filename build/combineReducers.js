'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _utilities = require('./utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (reducers) {
  var getDefaultState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _immutable2.default.Map;

  var reducerKeys = Object.keys(reducers);

  // eslint-disable-next-line space-infix-ops
  return function () {
    var inputState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getDefaultState();
    var action = arguments[1];

    // eslint-disable-next-line no-process-env
    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = (0, _utilities.getUnexpectedInvocationParameterMessage)(inputState, reducers, action);

      if (warningMessage) {
        // eslint-disable-next-line no-console
        console.error(warningMessage);
      }
    }

    var ret = inputState.withMutations(function (temporaryState) {
      reducerKeys.forEach(function (reducerName) {
        var reducer = reducers[reducerName];
        var currentDomainState = temporaryState.get(reducerName);
        var nextDomainState = reducer(currentDomainState, action);

        (0, _utilities.validateNextState)(nextDomainState, reducerName, action);

        temporaryState.set(reducerName, nextDomainState);
      });
    });

    // This is a hack to serve Trumid during the transitional period
    // from Omnistac-UI to trumid-fe.
    // Because we used redux-immutable in Omnistac-UI and plain javascript
    // in trumid-fe, we depend on destructuring state in the latter.
    // By tacking on plain field references to the Immutable.Map, this will work
    // without having to make a special selector depending on app platform.
    reducerKeys.forEach(function (reducerName) {
      ret[reducerName] = ret.get(reducerName);
    });

    return ret;
  };
};

module.exports = exports['default'];
//# sourceMappingURL=combineReducers.js.map