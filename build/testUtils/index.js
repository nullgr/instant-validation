"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createValidator = createValidator;
exports.ERROR_EMPTY = exports.LENGTH_ERROR = void 0;

var _rules = require("../rules");

var LENGTH_ERROR = 'Length should be minimum 5 characters';
exports.LENGTH_ERROR = LENGTH_ERROR;
var ERROR_EMPTY = 'This field should be filled';
exports.ERROR_EMPTY = ERROR_EMPTY;

function createValidator(publicApi) {
  var Validator = publicApi ? require('../index').default : require('../validator').default; // return new Validator(3);

  return new Validator({
    login: [{
      rule: _rules.requiredRule,
      message: ERROR_EMPTY
    }, {
      rule: (0, _rules.lengthRule)(5),
      message: LENGTH_ERROR
    }],
    password: [{
      rule: (0, _rules.lengthRule)(8),
      message: LENGTH_ERROR
    }, {
      id: 'repeatRule',
      rule: function rule(val, state) {
        return state.repeatPass === val || !val || !state.repeatPass;
      },
      message: ''
    }],
    repeatPass: [{
      rule: (0, _rules.lengthRule)(8),
      message: LENGTH_ERROR
    }, {
      id: 'repeatRule',
      rule: function rule(val, state) {
        return val === state.newPass || !val || !state.newPass;
      },
      message: ''
    }],
    accept: {
      rule: _rules.requiredRule,
      message: ERROR_EMPTY
    }
  });
}