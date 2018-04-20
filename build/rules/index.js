"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lengthRule = exports.requiredRule = void 0;

var requiredRule = function requiredRule(value) {
  return !!value;
};

exports.requiredRule = requiredRule;

var lengthRule = function lengthRule(l) {
  return function (v) {
    return !!v && v.length >= l;
  };
};

exports.lengthRule = lengthRule;