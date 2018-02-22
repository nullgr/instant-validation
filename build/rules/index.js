"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var requiredRule = exports.requiredRule = function requiredRule(value) {
  return !!value;
};
var requiredRuleBool = exports.requiredRuleBool = function requiredRuleBool(value) {
  return value;
};
var lengthRule = exports.lengthRule = function lengthRule(l) {
  return function (v) {
    return !!v && v.length >= l;
  };
};