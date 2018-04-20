export var requiredRule = function (value) { return !!value; };
export var lengthRule = function (l) { return function (v) {
    return !!v && v.length >= l;
}; };
