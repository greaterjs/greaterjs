var cmp = require('./greater');
var Qty = require('js-quantities');

cmp.convert(function (v) {
  var that = {
    num: function () { return Qty(v).toBase().scalar; }
  };
  return that;
});
console.log(cmp.gt('2m','4ft'));
console.log(cmp.gt('1 m','4 ft'));
