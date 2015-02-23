var compareEquals = function compareEquals (a, b) { return a == b; };
var compareLessThan = function compareLessThan (a, b) { return a < b; };
var compareGreaterThan = function compareGreaterThan (a, b) { return a > b; };
var compareLessThanEquals = function compareLessThanEquals (a, b) { return a <= b; };
var compareGreaterThanEquals = function compareGreaterThanEquals (a, b) { return a >= b; };

var _isNaN = function (v) { return v !== v; };

var equals = function (a, b) {
  if (type(a) === 'number' && type(a) === type(b)) return +a === +b;
  return a.valueOf() === b.valueOf();
};

var type = function (v) {
  // null is not object. constructor types. builtin objects.
  return ({}).toString.call(v).match(/\s([a-zA-Z]+)/)[1].toLowerCase(); 
};

var num = function num (v) {
  if (type(v) === 'array') return v.length;
  if (type(v) === 'date') return + v;
  if (type(v) === 'boolean') return v ? 1 : 0;
  if (v === null) return 0; // ???
  return isNaN(v) ? NaN : parseFloat(v);
};

var len = function len (v) { return v.length; };

var noop = function noop (v) { return v; };

var bool = function bool (v) {
  // todo builtin objects?
  if (type(v) === 'number') {
    return +v === 0 ? false : +v === 1 ? true : undefined;
  } else if (type(v) === 'string') {
    var s = ('' + v).toLowerCase();
    return (s === 'f' || s === '0' || s === 'false' || s === 'no' || s === 'n') ? false :
      (s === 't' || s === '1' || s === 'true' || s === 'yes' || s === 'y') ? true :
      undefined;
  } else if (type(v) === 'array') {
    return v.length > 0;
  } else if (type(v) === 'date') {
    return +v === 0 ? false : +v === 1 ? true : undefined;
  } else if (type(v) === 'boolean') {
    return v;
  } else {
    return v === null ? false : undefined;
  }
};

var compareLessThanNoStrings = function compareLessThanNoStrings (a, b) {
  return a < b && type(a) !== 'string' && type(b) !== 'string';
};

var compareGreaterThanNoStrings = function compareGreaterThanNoStrings (a, b) {
  return a > b && type(a) !== 'string' && type(b) !== 'string';
};

var compareNumbery = function (compare) {
  return function (a, b) {
    // this also properly handles dates, since dates greater than the maximum (8640000000000000) are NaN
    return compare(a.num(), b.num());
  };
};

var compareBooleany = function (compare) {
  return function (a, b) {
    return compare(a.bool(), b.bool()) && a.bool() !== undefined && b.bool() !== undefined;
  };
};

var compareNumberyThenBooleany = function (compare, booleanCompare) {
  return function (a, b) {
    // catch strings but no other reference types
    return (a.isNumbery() && b.isNumbery()) ? compareNumbery(compare)(a, b) :
      (a.bool() !== undefined && b.bool() !== undefined) ? (booleanCompare || compareBooleany)(compare)(a, b) :
      (type(a.valueOf()) === 'string' && type(b.valueOf()) === 'string' && !(a.isNumbery() || b.isNumbery() || a.bool() !== undefined || b.bool() !== undefined)) && compare(a + '', b + '');
  };
};

var boolGreaterThan = function (a, b) { return a.bool() && b.bool() === false; };

var boolLessThan = function (a, b) { return a.bool() === false && a.bool(); };

var augmentValue = function (v) {
  return {
    valueOf: function () { return v; },
    isFalsy: function () { return bool(v) === false; },
    isTruthy: function () { return bool(v) === true; },
    isNumbery: function () { return !!(num(v) || num(v) === 0); },
    isInfinite: function () { return v === -Infinity || v === Infinity; },
    iaInfinity: function () { return v === Infinity; },
    iaNegativeInfinity: function () { return v === -Infinity; },
    isSpecialTruthy: function () { return (num(v) || num(v) === 0) && type(v) === 'string' && v !== '1'; },
    isSpecialFalsy: function () { return (num(v) || num(v) === 0) && type(v) === 'string' && v !== '0'; },
    isSpecialNumbery: function () { return type(v) === 'date' || type(v) === 'array' || v === null; },
    bool: function () { return bool(v); },
    num: function () { return num(v); }
  };
};

var customOperation = function (config, defaultOperation) {
  return function (a, b) {
    var aVal = augmentValue(a);
    var bVal = augmentValue(b);

    var notFlipped = config[type(a) + '_' + type(b)];
    var flipped = config[type(b) + '_' + type(a)];
    // TODO this operationOrConfig thing is nasty
    var operationOrConfig = notFlipped || flipped || defaultOperation || function () {};
    if (type(operationOrConfig) == 'array') {
      aVal = augmentValue((operationOrConfig[flipped ? 1 : 0] || noop)(a));
      bVal = augmentValue((operationOrConfig[flipped ? 0 : 1] || noop)(b));
      return operationOrConfig[2](aVal, bVal);
    }
    return operationOrConfig(aVal, bVal);
  };
};

var customEquals = customOperation({
  // array_array: non-comparable
  // array_date: non-comparable
  // date_boolean: non-comparable
  boolean_boolean: compareBooleany(compareEquals),
  array_boolean: compareBooleany(compareEquals),
  array_string: compareBooleany(compareEquals),
  boolean_number: compareBooleany(compareEquals),
  string_boolean: compareBooleany(compareEquals),
  number_number: compareNumbery(compareEquals),
  array_number: compareNumbery(compareEquals),
  date_date: compareNumbery(compareEquals),
  date_number: compareNumbery(compareEquals),
  date_string: compareNumbery(compareEquals),
  string_number: compareNumberyThenBooleany(compareEquals),
  string_string: compareNumberyThenBooleany(compareEquals)
}, equals);

var customNotEquals = function (a, b) { return !customEquals(a, b); };

var customGreaterThan = customOperation({
  // array_array: non-comparable
  // array_boolean: non-comparable -- [] > true ?
  // array_date: non-comparable
  // boolean_number: non-comparable -- it makes no sense that true > -1 and 2 > true. boolean and number is equality-comparable however
  // date_boolean: non-comparable
  boolean_boolean: boolGreaterThan,
  boolean_number: boolGreaterThan,
  string_boolean: boolGreaterThan,
  number_number: compareNumbery(compareGreaterThan),
  date_date: compareNumbery(compareGreaterThan),
  array_string: [len, num, compareNumbery(compareGreaterThan)],
  array_number: [len, noop, compareNumbery(compareGreaterThan)],
  date_number: [num, noop, compareNumbery(compareGreaterThan)],
  date_string: [num, num, compareNumbery(compareGreaterThan)],
  string_number: [noop, noop, compareNumberyThenBooleany(compareGreaterThan, function () { return boolGreaterThan; })],
  string_string: compareNumberyThenBooleany(compareGreaterThanNoStrings, function () { return boolGreaterThan; })
});

var customLessThan = customOperation({
  // array_array: non-comparable
  // array_boolean: non-comparable -- [] < true ?
  // array_date: non-comparable
  // boolean_number: non-comparable -- it makes no sense that true > -1 and 2 > true. boolean and number is equality-comparable however
  // date_boolean: non-comparable
  boolean_boolean: boolLessThan,
  boolean_number: boolLessThan,
  string_boolean: boolLessThan,
  number_number: compareNumbery(compareLessThan),
  date_date: compareNumbery(compareLessThan),
  array_string: [len, num, compareNumbery(compareLessThan)],
  array_number: [len, noop, compareNumbery(compareLessThan)],
  date_number: [num, noop, compareNumbery(compareLessThan)],
  date_string: [num, num, compareNumbery(compareLessThan)],
  string_number: [noop, noop, compareNumberyThenBooleany(compareLessThan, function () { return boolLessThan; })],
  string_string: compareNumberyThenBooleany(compareLessThanNoStrings, function () { return boolLessThan; })
});

var comparesWithGreaterThan = function (a, b) {
  // TODO confusing logic
  // TODO arrays and boolean
  // TODO null and objects
  var isGreaterThanOrLessThanA = a === true || a === false || (type(a) === 'string' && bool(a) !== undefined && a !== '1' && a !== '0');
  var isGreaterThanOrLessThanB = b === true || b === false || (type(b) === 'string' && bool(b) !== undefined && b !== '1' && b !== '0');
  var isFromEqualsA = (bool(a) !== undefined) && (type(a) === 'string' || type(a) === 'number' || type(a) === 'boolean');
  var isFromEqualsB = (bool(b) !== undefined) && (type(b) === 'string' || type(b) === 'number' || type(b) === 'boolean');
  var isFromEquals = isFromEqualsA && isFromEqualsB;
  var isGreaterThanOrLessThan = !(isGreaterThanOrLessThanA || isGreaterThanOrLessThanB);
  return isGreaterThanOrLessThan || isFromEquals;
};

var customGreaterThanEquals = function defaultGreaterThanEquals (a, b) {
  return customGreaterThan(a, b) || (customEquals(a, b) && comparesWithGreaterThan(a, b));
};

var customLessThanEquals = function (a, b) {
  return customLessThan(a, b) || (customEquals(a, b) && comparesWithGreaterThan(a, b));
};

module.exports = {};
module.exports.eq = module.exports.equals = customEquals;
module.exports.ne = module.exports.notEquals = customNotEquals;
module.exports.gt = module.exports.greaterThan = customGreaterThan;
module.exports.lt = module.exports.lessThan = customLessThan;
module.exports.lte = module.exports.lessThanEquals = customLessThanEquals;
module.exports.gte = module.exports.greaterThanEquals = customGreaterThanEquals;
module.exports.bool = bool;
module.exports.type = type;
