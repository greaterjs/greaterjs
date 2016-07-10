import cmp from './greater';
import test from 'ava';
import Qty from 'js-quantities';

let things = [0, new Number(0), '0', false, 'false', 1, true, '1', 'true', [0], [1], [[]], -1, '-1', Infinity, -Infinity, '', null, undefined, {}, NaN];
// leaving this here for testing
let unmatched = things.reduce((m, a, i) => {
    things.forEach((b, j) => {
        let p = i, q = j;
        if (j < i) {
            p = j;
            q = i;
        }
        if ((a == b) !== cmp.eq(a, b)) m[p+':'+q] = true;
    });
    return m;
}, {});

test('good js', t => {
    t.true(0 == false);
    t.true(cmp.eq(0, false));
    t.true(!([] == []));
    t.true(!cmp.eq([], []));
    t.true(true == '1');
    t.true(cmp.eq(true, '1'));
});

test('wtf js', t => {
    t.true(0 == [0]);
    t.true(!cmp.eq(0, [0]));
    t.true('0' == [0]);
    t.true(!cmp.eq('0', [0]));
    t.true(false == [0]);
    t.true(!cmp.eq(false, [0]));
    t.true(false == [[]]);
    t.true(!cmp.eq(false, [[]]));
    t.true(false == '');
    t.true(!cmp.eq(false, ''));
    t.true(0 == [] && new Number(0) != []);
    t.true(cmp.eq(0, []) && cmp.eq(new Number(0), []));
    t.true(0 == '');
    t.true(!cmp.eq(0, ''));
    t.true(!(1 == [0]) && (1 == [1]));
    t.true(cmp.eq(1, [0]) && cmp.eq(1, [1]));
    t.true(!(true == [[]]) && (true == [1]));
    t.true(cmp.eq(true, [[]]) && cmp.eq(true, [1]));
    t.true(!('1' == [[]]) && ('1' == [1]));
    t.true(cmp.eq('1', [[]]) && cmp.eq('1', [1]));
    t.true([] == '');
    t.true(!cmp.eq([], ''));
});

test('potential js', t => {
    t.true(!(1 == [0]));
    t.true(cmp.eq(1, [0]));
    t.true(!('false' == 0));
    t.true(cmp.eq('false', 0));
    t.true(!('false' == new Number(0)));
    t.true(cmp.eq('false', new Number(0)));
    t.true(!('false' == '0'));
    t.true(cmp.eq('false', '0'));
    t.true(!('false' == false));
    t.true(cmp.eq('false', false));
    t.true(!('false' == []));
    t.true(cmp.eq('false', []));
    t.true(!('0' == []));
    t.true(cmp.eq('0', []));
    t.true(!(true == 'true'));
    t.true(cmp.eq(true, 'true'));
    t.true(!('1' == 'true'));
    t.true(cmp.eq('1', 'true'));
    t.true(!('true' == [0]));
    t.true(cmp.eq('true', [0]));
    t.true(!('true' == [1]));
    t.true(cmp.eq('true', [1]));
    t.true(!('true' == [[]]));
    t.true(cmp.eq('true', [[]]));
});

test('reference types', t => {
    var oneRef = [];
    t.true(oneRef == oneRef);
    t.true(cmp.eq(oneRef, oneRef));
});

test('null and undefined', t => {
    t.true(null == null);
    t.true(cmp.eq(null, null));
    t.true(undefined == undefined);
    t.true(cmp.eq(undefined, undefined));
    t.true(null == undefined);
    t.true(cmp.eq(null, undefined));
});

test('plugins', (t) => {
    cmp.convert((v) => {
        var that = {
            num: () => Qty(v).toBase().scalar
        };
        return that;
    });
    t.true(cmp.gt('2m','4ft'));
    t.true(!cmp.gt('1 m','4 ft'));
});
