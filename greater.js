/*
because we're greater than this.
npm module greater.js

the world always seems like they're moving too fast for me, so i like projects like this that help us qustion our assumptions and solidify our footing

null sql semantics

http://plnkr.co/edit/OWU6eIS3l6uD7QLIAlEc?p=preview

at 1:00 am i started seeing rochart charts

emit -1 for less-than (for sorting)

shadow-dom => select | greater => js_greater_than_operator


strings 'f', '0', 'false', 'no', and 'n' should be falsy, the rest should be truthy
arrays of length 0 should be falsy when compared with booleans
boolean 



bool < -- 0 == false, Infinity != false
true != -1, Infinity, MAX_VALUE
"0" == [], ['x'] == '1'
NaN should not equal things
objects -- deep equal
be more aggressive with gt and lt, not enough things are being compared
 t > f, t > 0, [] > f, [] > 'f' or [] > '0', 't' > 0, 't' > false, -- don't do this
  "1" "0" "-1" uncomparable?


  
  don't make js look better than it is

  the things people make fun of in js are {} + {} and similar type operations

  too much type-checking code, this allows you to use more objects in more common contexts

  primitives are everywhere, so why not make them behave how you want?



  nothing compares with NaN, numbers, everything not falsy is truthy


  bool undefined vs bool false.

 what would 140 Proof be without any proofs?

do it as part of your es6 upgrade

a fair amount of freedom in designing operator semantics
 */
var compareEquals = function(a, b) { return a == b; };
var compareLessThan = function(a, b) { return a < b; };
var compareGreaterThan = function(a, b) { return a > b; };
var compareLessThanEquals = function(a, b) { return a <= b; };
var compareGreaterThanEquals = function(a, b) { return a >= b; };
var compareNotEquals = function(a, b) { return a != b; };

var isInfinity = function (v) {
  return v === Infinity || v === -Infinity;
};

var _isNaN = function (v) { return v !== v; };

// from moment.js
var isDate = function (input) {
  return Object.prototype.toString.call(input) === '[object Date]' || input instanceof Date;
};

var equals = function (a, b) {
  if (type(a) === 'number' && type(a) === type(b)) return +a === +b;
  return a.valueOf() === b.valueOf();
};

var numberGt = function (a, b) {
  return (type(a) === 'number' && type(a) === type(b)) && (+a > +b && !(_isNaN(a) || _isNaN(b)));
};

var numberNotEquals = function (a, b) {
  return (type(a) === 'number' && type(a) === type(b)) && +a !== +b;
};

var notEquals = function (a, b) {
  return numberNotEquals(a, b) || a !== b;
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
    return (a.isNumbery() && b.isNumbery()) ? compareNumbery(compare)(a, b) :
      (a.bool() !== undefined && b.bool() !== undefined) ? (booleanCompare || compareBooleany)(compare)(a, b) :
      (type(a.valueOf()) === 'string' && type(b.valueOf()) === 'string' && !(a.isNumbery() || b.isNumbery() || a.bool() !== undefined || b.bool() !== undefined)) && compare(a + '', b + '');
    /* catch strings but no other reference types */
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
      // if ((a === Infinity && type(b) === 'array' && b.length  === 1) || (b === Infinity && type(a) === 'array' && a.length  === 1)) console.log('want: array_boolean', 'saw: '+ type(a) + '_' + type(b), flipped ? 'flipped' : 'not flipped', a, b, aVal.valueOf(), bVal.valueOf(), operationOrConfig, operationOrConfig[2], operationOrConfig[2](flipped ? bVal : aVal, flipped ? aVal : bVal), operationOrConfig[2](aVal, bVal));
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

// var notEq = function (a, b) { return a !== b; };
//
// var customNotEquals = customOperation({
//   // array_array: non-comparable
//   // array_date: non-comparable
//   number_number: compareNumbery(numberNotEquals),
//   boolean_boolean: compareBooleanyNegated(notEquals),
//   boolean_number: compareNumberyThenBooleany(notEq, compareBooleanyNegated),
//   array_array: compareReference(notEq),
//   array_number: compareNumbery(notEq),
//   array_boolean: compareBooleanyNegated(notEq),
//   array_string: compareNumberyThenBooleany(notEq, compareBooleanyNegated),
//   string_string: compareNumberyThenBooleany(notEq, compareBooleanyNegated),
//   string_number: compareNumberyThenBooleany(notEq, compareBooleanyNegated), 
//   string_boolean: compareBooleanyNegated(notEq),
//   date_date: compareNumbery(notEq),
//   date_number: compareNumbery(notEq)
// }, notEq);//function (a, b) { return _isNaN(a) || _isNaN(b); });

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

var perlNumericalComparison = function (a, b) {}; // more falsy, everything converted to integers and those are compared

// todo custom function that throws type errors

var any = function () { return true; };
var eq = compareEquals;
var lt = compareLessThan;
var gt = compareGreaterThan;
var le = compareLessThanEquals;
var ge = compareGreaterThanEquals;
var ne = compareNotEquals;

var greaterThan = function (a, b) {
  var isOrderableType = type(a) === 'number' || type(a) === 'string';
  return type(a) === type(b) && isOrderableType && a > b;
};
var lessThan = function (a, b) {
  var isOrderableType = type(a) === 'number' || type(a) === 'string';
  return type(a) === type(b) && isOrderableType && a < b;
};
var greaterThanEquals = function (a, b) {
  // a >= a false if a is undefined. this corrects.
  return greaterThan(a, b) || equals(a, b);  
};

var lessThanEquals = function (a, b) {
  // a >= a false if a is undefined. this corrects.
  return lessThan(a, b) || equals(a, b);  
};

eq = equals;
lt = lessThan;
gt = greaterThan;
le = lessThanEquals;
ge = greaterThanEquals;

eq = customEquals;
lt = customLessThan;
gt = customGreaterThan;
le = customLessThanEquals;
ge = customGreaterThanEquals;

ne = customNotEquals;

var exclusive = function (include, exclude) {
  return function (a, b) {
    var isIncluded = include.reduce(function (memo, fn) { return memo && fn(a, b); }, true);
    var isExcluded = exclude.reduce(function (memo, fn) { return memo || fn(a, b); }, false);
    return isIncluded && !isExcluded;
  };
};

var validEquals = exclusive([eq], [lt]);//[lt, gt, ne]);
var validLessThan = exclusive([lt], [eq, gt, ge]);
var validGreaterThan = exclusive([gt], [eq, lt, le]);
var isNonComparable = exclusive([any], [ge, le]);
var isBrokenEquals = exclusive([eq], [ne, lt, gt, le, ge]);
var isBrokenNonComparable = exclusive([le, ge, ne], [eq, lt, gt]);
var isBrokenEqualsAndNotGreaterThanEquals = exclusive([eq], [le, ge]);
var isBrokenGreaterThanAndNotGreaterThanEquals = exclusive([gt], [ge]);
var isBrokenGreaterThanAndEquals = exclusive([gt], [eq]); // none

var isDiffersFromEverythingIncludingItself = function (v) {};
var isCoercesViaToStringAndValueOf = function (v) {};
var isNullOrUndefined = function (a) {};
var isNumericallyCoerced = function (a, b) {};

var vals = {
  '[]': function () { return []; },
  "'0'": function () { return '0'; },
  'false': function () { return false; },
  'new Number(0)': function () { return new Number(0); },
  '0': function () { return 0; },
  "'false'": function () { return 'false'; },
  'Number.MAX_VALUE': function () { return Number.MAX_VALUE; },
  'Infinity': function () { return Infinity; },
  '-Infinity': function () { return -Infinity; },
  'null': function () { return null; },
  'undefined': function () { return undefined; },
  '{}': function () { return {}; },
  'new ArrayBuffer(0)': function () { return new ArrayBuffer(0); },
  'function (){}': function () { return function (){}; },
  '-1': function () { return -1; },
  'new Number(-1)': function () { return new Number(-1); },
  '[-1]': function () { return [-1]; },
  "['-1']": function () { return ['-1']; },
  '[[]]': function () { return [[]]; },
  '[null]': function () { return [null]; },
  '[undefined]': function () { return [undefined]; },
  "['']": function () { return ['']; },
  '[0]': function () { return [0]; },
  "['0']": function () { return ['0']; },
  '[1]': function () { return [1]; },
  "['1']": function () { return ['1']; },
  '[NaN]': function () { return [NaN]; },
  "'-1'": function () { return '-1'; },
  "'2'": function () { return '2'; },
  "''": function () { return ''; },
  "'NaN'": function () { return 'NaN'; },
  "'[object ArrayBuffer]'": function () { return '[object ArrayBuffer]'; },
  "'true'": function () { return 'true'; },
  "'[object Object]'": function () { return '[object Object]'; },
  "'function (){}'": function () { return 'function (){}'; },
  'true': function () { return true; },
  "'1'": function () { return '1'; },
  '1':function () { return 1; },
  'new Number(1)': function () { return new Number(1); },
  'NaN': function () { return NaN; }
};

// // order for equals
// var valsOrder = [
//   '1',
//   'new Number(1)',
//   "'1'",
//   'true',
//   "'true'",
//   '[1]',
//   "['1']",
//   '[0]',
//   "['0']",
//   '[-1]',
//   "['-1']",
//   "['']",
//   '[[]]',
//   '[null]',
//   '[undefined]',
//   '[NaN]',
//   '0',
//   'new Number(0)',
//   "'0'",
//   'false',
//   "'false'",
//   '[]',
//   "'-1'",
//   '-1',
//   'new Number(-1)',
//   'Number.MAX_VALUE',
//   'Infinity',
//   '-Infinity',
//   'null',
//   'undefined',
//   "'2'",
//   "''",
//   "'NaN'",
//   "'[object ArrayBuffer]'",
//   "'[object Object]'",
//   "'function (){}'",
//   '{}',
//   'new ArrayBuffer(0)',
//   'function (){}',
//   'NaN'
// ];

// order for >, <, >=, and <=
var valsOrder = [
  'Infinity',
  'Number.MAX_VALUE',
  "'2'",
  "'1'",
  '1',
  'new Number(1)',
  '[NaN]',
  "['1']",
  '[1]',
  "['0']",
  '[0]',
  "['']",
  '[undefined]',
  '[null]',
  '[[]]',
  "['-1']",
  '[-1]',
  '[]',
  "'0'",
  '0',
  'new Number(0)',
  "'-1'",
  '-1',
  'new Number(-1)',
  '-Infinity',
  'true',
  "'true'",
  "'false'",
  'false',
  'null',
  'undefined',
  "''",
  "'NaN'",
  "'[object ArrayBuffer]'",
  "'[object Object]'",
  "'function (){}'",
  '{}',
  'new ArrayBuffer(0)',
  'function (){}',
  'NaN'
];

// // order for ordinary javascript
// var valsOrder = [
//   'false',
//   '0',
//   "''",
//   '[[]]',
//   '[]',
//   "'0'",
//   '[0]',
//   '[1]',
//   "'1'",
//   '1',
//   'true',
//   '-1',
//   "'-1'",
//   'null',
//   'undefined',
//   'Infinity',
//   '-Infinity',
//   "'false'",
//   "'true'",
//   '{}',
//   'NaN'
// ];

// // order for greater >
// var valsOrder = [
//   '0',
//   'false',
//   "'0'",
//   "'false'",
//   '[]',
//   '1',
//   'true',
//   "'1'",
//   "'true'",
//   '[0]',
//   '[1]',
//   '[[]]',
//   '-1',
//   "'-1'",
//   'Infinity',
//   '-Infinity',
//   "''",
//   'null',
//   'undefined',
//   '{}',
//   'NaN'
// ];


var draw = function (title, xs, ys, comparison, styleClass) {
  var n = xs.length;
  var r = 16; // width of grid squares
  var baselineOffset = -2;
  var cellPad = 0;
  var cellSize = r + (2 * cellPad);
  var cellOverlap = 1;
  var labelWidth = 120; // TODO determine automatically
  var labelPadding = cellSize - cellOverlap;
  styleClass = styleClass || 'gridGray';

  // heading

  var heading = document.createElement('h3');
  document.body.appendChild(heading);
  heading.innerHTML = title;

  // container

  var absoluteEl = document.createElement('div');
  absoluteEl.classList.add('matrixContainer');
  absoluteEl.style.width = labelWidth + labelPadding + (n * (cellSize - cellOverlap)) + cellPad + 'px';
  absoluteEl.style.height = labelWidth + labelPadding + (n * (cellSize - cellOverlap)) + cellPad + 'px';
  document.body.appendChild(absoluteEl);

  // cells

  for (var i = 0; i < n; i++) {
    var v1 = xs[i];
    for (var j = 0; j < n; j++) {
      var cellEl = document.createElement('div');
      var v2 = ys[j];
      cellEl.classList.add('matrixCell');
      if (cellOverlap > 0) {
        cellEl.classList.add('matrixCellOverlapping');
      }
      cellEl.classList.add(comparison(v1, v2) ? styleClass : 'gridGray');
      cellEl.style.left = labelWidth + labelPadding + (i * (cellSize - cellOverlap)) + cellPad + 'px';
      cellEl.style.top = labelWidth + labelPadding + (j * (cellSize - cellOverlap)) + cellPad + 'px';
      cellEl.style.width = r + 'px';
      cellEl.style.height = r + 'px';
      cellEl.classList.add('corner' +
                           (i === 0 && j === 0 ? 'TopLeft' :
                           i === 0 && j === n - 1 ? 'BottomLeft' :
                           i === n - 1 && j === 0 ? 'TopRight' :
                           i === n - 1 && j === n - 1 ? 'BottomRight' :
                           ''));
      absoluteEl.appendChild(cellEl);
    }
  }
  
  // labels

  for (var j = 0; j < n; j++) {
    var labelEl = document.createElement('div');
    labelEl.innerHTML = ys[j];
    labelEl.classList.add('matrixLabel');
    labelEl.style.width = labelWidth + labelPadding + 'px';
    labelEl.style.paddingRight = labelPadding + 'px';
    labelEl.style.top = labelWidth + labelPadding + baselineOffset + (j * (cellSize - cellOverlap)) + cellPad + 'px';
    absoluteEl.appendChild(labelEl);
  }
  for (var i = 0; i < n; i++) {
    var labelEl = document.createElement('div');
    labelEl.innerHTML = xs[i];
    labelEl.classList.add('matrixLabel');
    labelEl.classList.add('vertical');
    labelEl.style.width = labelWidth + labelPadding + 'px';
    labelEl.style.paddingLeft = labelPadding + 'px';
    labelEl.style.top = labelWidth + labelPadding + 'px';
    labelEl.style.left = labelWidth + labelPadding + baselineOffset + (i * (cellSize - cellOverlap)) + cellPad + 'px';
    absoluteEl.appendChild(labelEl);
  }
};

// less-verbose valueOf and toString
var val = function (v) { return function () { return v; }; };

var pairs = function (a, b) {
  var out = [];
  if (!b) b = a;
  Object.keys(a).forEach(function (v1) {
    Object.keys(b).forEach(function (v2) {
      out.push([
        { valueOf: val(a[v1]), toString: val(v1)},
        { valueOf: val(b[v2]), toString: val(v2)}
      ]);
    });
  });
  return out;
};

var deleteAt = function (p, a, b) {
  var index = p.reduce(function (memo, pair, i) { return '' + pair[0] === a && '' + pair[1] === b ? i : memo; }, NaN);
  return p.splice(index, 1);
};

var subtract = function (a, b) {
  var i, acc=[], diff=[];
  for (i = 0; i < a.length; i++)
    acc[a[i]] = a[i];
  for (i = 0; i < b.length; i++)
    if(acc[b[i]]) delete acc[b[i]];
    else acc[b[i]] = b[i];
  for (var k in acc)
   diff.push(acc[k]);
  return diff;
};

var comparePairs = function (p, compare) {
  return p.reduce(function (memo, pair) {
    // I'm representing the values strangely re:valueOf. it works, just strange. TODO.
    var isValid = compare(pair[0].valueOf(), pair[1].valueOf());
    !isValid && error(pair[0], pair[1]); // side effect
    // !isValid && !console.log('error on "' + runName + '", "' + testName + '":', compare, ''+pair[0], ''+pair[1], pair[0].valueOf(), pair[1].valueOf());
    return memo && isValid;
  }, true);
};

var analysis = function (lists) {
  var marked = lists.map(function (l) { return l[0]; });
  var errored = lists.map(function (l) { return l[1]; });
  var markedPairs = [].concat.apply([], marked);
  var erroredPairs = [].concat.apply([], errored);
  var xs = Object.keys(markedPairs.reduce(function (memo, pair) { memo[pair[0]] = 1; return memo; }, {}));
  var ys = Object.keys(markedPairs.reduce(function (memo, pair) { memo[pair[1]] = 1; return memo; }, {}));
  var resultTable = {};
  marked.forEach(function (batch, i) {
      var errorTable = {};
      errored[i].forEach(function (p) {
          errorTable[p[0]] = errorTable[p[0]] || {};
          errorTable[p[0]][p[1]] = true;
      });
      marked[i].forEach(function (p) {
          resultTable[p[0]] = resultTable[p[0]] || {};
          // mark the cell if an expect was false in any "it"
          // TODO show the tested region too
          // table[p[0]][p[1]] = (p[1] in table[p[0]]) ? table[p[0]][p[1]] && (l[1] && l[1].length) : true;
          resultTable[p[0]][p[1]] = (resultTable[p[0]] && resultTable[p[0]][p[1]]) || (errorTable[p[0]] && errorTable[p[0]][p[1]]);
      });
  });
  return [xs, ys, function (a, b) {
    return resultTable[a] && !!resultTable[a][b]; // TODO undefined
  }];
};

var runName, results;
var describe = function (name, fn) {
  runName = name;
  results = [];
  fn();
  var a = analysis(results);
  // draw(name, a[0], a[1], a[2], 'darkgray');
};

var testName, marking, errored;
var it = function (name, fn) {
  testName = name;
  marking = [];
  errored = [];
  fn();
  results.push([marking, errored]);
};

var mark = function (p) { marking = p; };

var error = function (a, b) {
  errored.push([a, b]);
  // TODO message
}; 

/* all values for copy/paste
    var all = {
      '[]': [],
      "'0'": '0',
      'false': false,
      'new Number(0)': new Number(0),
      '0': 0,
      "'false'": 'false',
      'Number.MAX_VALUE': Number.MAX_VALUE,
      'Infinity': Infinity,
      '-Infinity': -Infinity,
      'null': null,
      'undefined': undefined,
      '{}': {},
      'new ArrayBuffer(0)': new ArrayBuffer(0),
      'function (){}': function (){},
      '-1': -1,
      'new Number(-1)': new Number(-1),
      '[-1]': [-1],
      "['-1']": ['-1'],
      '[[]]': [[]],
      '[null]': [null],
      '[undefined]': [undefined],
      "['']": [''],
      '[0]': [0],
      "['0']": ['0'],
      '[1]': [1],
      "['1']": ['1'],
      '[NaN]': [NaN],
      "'-1'": '-1',
      "''": '',
      "'NaN'": 'NaN',
      "'[object ArrayBuffer]'": '[object ArrayBuffer]',
      "'true'": 'true',
      "'[object Object]'": '[object Object]',
      "'function (){}'": 'function (){}',
      'true': true,
      "'1'": '1',
      '1': 1,
      'new Number(1)': new Number(1),
      'NaN': NaN
    };
*/

describe("equals", function() {
  var all = function () {
    return {
      '[]': [], "'0'": '0', 'false': false, 'new Number(0)': new Number(0), '0': 0, "'false'": 'false', 'Number.MAX_VALUE': Number.MAX_VALUE, 'Infinity': Infinity, '-Infinity': -Infinity, 'null': null, 'undefined': undefined, '{}': {}, 'new ArrayBuffer(0)': new ArrayBuffer(0), 'function (){}': function (){}, '-1': -1, 'new Number(-1)': new Number(-1), '[-1]': [-1], "['-1']": ['-1'], '[[]]': [[]], '[null]': [null], '[undefined]': [undefined], "['']": [''], '[0]': [0], "['0']": ['0'], '[1]': [1], "['1']": ['1'], '[NaN]': [NaN], "'-1'": '-1', "''": '', "'NaN'": 'NaN', "'[object ArrayBuffer]'": '[object ArrayBuffer]', "'true'": 'true', "'[object Object]'": '[object Object]', "'function (){}'": 'function (){}', 'true': true, "'1'": '1', "'2'": '2', '1': 1, 'new Number(1)': new Number(1), 'NaN': NaN
    };
  };
  var noNaN = function () {
    var a = all();
    delete a['NaN'];
    return a;
  };
  var falsy = function () { return {'[]': [], "'0'": '0', 'false': false, 'new Number(0)': new Number(0), "'false'": 'false'}; };

  var compareFunction = customEquals; //function (a, b) { return a == b; };
  
  it('empty arrays not equal', function() {
    var empty = function () { return {'[]': []}; };
    var a = empty(), b = empty();
    mark(pairs(a, b));
    comparePairs(pairs(a, b), function (a, b) { return !compareFunction(a, b); });
  });

  it('falsy values equal', function() {
    var first = falsy();
    var second = falsy();
    mark(pairs(first, second));
    var tests = pairs(first, second);
    deleteAt(tests, '[]', '[]');
    comparePairs(tests, compareFunction);
  });
    
  it('NaN should not equal anything', function () {
    var NaNPairs = subtract(pairs(all(), all()), pairs(noNaN(), noNaN()));
    mark(NaNPairs);
    comparePairs(NaNPairs, function (a, b) { return !compareFunction(a, b); });
  });

  it('NaN should be not equal to everything', function () {
    var NaNPairs = subtract(pairs(all(), all()), pairs(noNaN(), noNaN()));
    mark(NaNPairs);
    comparePairs(NaNPairs, function (a, b) { return customNotEquals(a, b); });
  });
});


(function () {
  var c = function (f) {
    return function (a, b) {
      return f(vals[a](), vals[b]());
    };
  };

  var grids = [
    ['All ==', c(eq), 'gridGreen'],
    ['All ≠', c(ne), 'gridGreen'],
    ['All >', c(gt), 'gridGreen'],
    ['All <', c(lt), 'gridGreen'],
    ['All ≥', c(ge), 'gridGreen'],
    ['All ≤', c(le), 'gridGreen'],
    ['Valid ==', c(validEquals), 'gridOrange'],
    ['Valid <', c(validLessThan), 'gridOrange'],
    ['Valid >', c(validGreaterThan), 'gridOrange'],
    ['Non-comparable', c(isNonComparable), 'gridOrange'],
    ['Broken: ==', c(isBrokenEquals), 'gridOrange'],
    ['Broken: Non-comparable', c(isBrokenNonComparable), 'gridOrange'],
    ['Broken: == but not ≥', c(isBrokenEqualsAndNotGreaterThanEquals), 'gridOrange'],
    ['Broken: > but not ≥', c(isBrokenGreaterThanAndNotGreaterThanEquals), 'gridOrange']
  ];

  // var grids = [
  //   ['Equality with JavaScript Comparison', c(compareEquals), 'gridGreen'],
  //   ['Equality with Enhanced Comparison', c(eq), 'gridGreen']
  // ];

  grids.forEach(function (grid) {
   draw(grid[0], valsOrder, valsOrder, grid[1], grid[2]);
  });
  // draw(grids[0][0], valsOrder, valsOrder, grids[0][1], grids[0][2]);
}());
