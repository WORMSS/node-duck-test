/**
 * ...
 * @author Colin Richardson
 */

(function() {
	var DuckTest = require('../index').DuckTest;
	DuckTest.defaults.throwErrors = true;
	ID = 0;
	var d = {'throwErrors': true};
	function TestClass () {};
	
	TEST(	1,	false,	DuckTest.require('test').test({}) );
	TEST(	2,	true,	DuckTest.require('test').test({'test': 'test'}) );
	TEST(	3,	true,	DuckTest.require('test', 'string').test({'test': 'test'}) );
	TEST(	4,	false,	DuckTest.require('test', 'number').test({'test': 'test'}) );
	TEST(	5,	true,	DuckTest.require('test', ['number', 'string']).test({'test': 'test'}));
	TEST(	6,	true,	DuckTest.require('test', TestClass).test({'test': new TestClass()}));
	TEST(	7,	true,	DuckTest.require('test', TestClass).require('test2', 'number').require('test3', 'string').test({'test': new TestClass(), 'test2': 123.5, 'test3': 'hello'}));
	TEST(	8,	true,	DuckTest.require('test', null, 'test').test({'test': 'test'}));
	TEST(	9,	false,	DuckTest.require('test', null, 'stuff').test({'test': 'test'}));
	TEST(	10,	true,	DuckTest.require('test', null, 123.0).test({'test': 123}));
	TEST(	11,	false,	DuckTest.require('test', null, 123.1).test({'test': 123}));
	TEST(	12,	false,	DuckTest.require('test', null, [123, 124]).test({'test': 125}));
	TEST(	13,	true,	DuckTest.require('test', null, DuckTest.gt(0)).test({'test': 123}));
	TEST(	14,	false,	DuckTest.require('test', null, DuckTest.lt(0)).test({'test': 123}));
	TEST(	15,	false,	DuckTest.require('test', null, [DuckTest.lt(0)]).test({'test': 123}));
	TEST(	16,	true,	DuckTest.require('test', null, [DuckTest.gt(0)]).test({'test': 123}));
	TEST(	17,	true,	DuckTest.require('test', null, [DuckTest.gt(0), DuckTest.lt(124)]).test({'test': 123}));
	TEST(	18,	false,	DuckTest.require('test', null, [DuckTest.gte(123), DuckTest.lt(123)]).test({'test': 123}));
	try {
		TEST(	19,	'throw',	DuckTest.require('test', null, [DuckTest.gte(123), DuckTest.lt(123)]).test({'test': '123'}));
	} catch ( err ) {
		TEST(	19, 'throw', 'throw');
	}
	TEST(	20,	true,	DuckTest.optional('test').test({}) );
	TEST(	21,	true,	DuckTest.optional('test').test({'test': 'test'}) );
	TEST(	22,	true,	DuckTest.optional('test', 'string').test({'test': 'test'}) );
	TEST(	23,	true,	DuckTest.optional('test', ['string']).test({'test': 'test'}) );
	TEST(	24,	false,	DuckTest.optional('test', ['number']).test({'test': 'test'}) );
	TEST(	25,	true,	DuckTest.optional('test', ['string'], 'test').test({'test': 'test'}) );
	TEST(	26,	false,	DuckTest.optional('test', ['number'], 'test').test({'test': 'test'}) );
	TEST(	27,	true,	DuckTest.optional('test', ['string'], ['stuff', 'test']).test({'test': 'test'}) );
	TEST(	28,	true,	DuckTest.optional('test', null, ['stuff', 'test']).test({'test': 'test'}) );
	
	TEST(	29,	true,	DuckTest.block('test').test({}) );
	TEST(	30,	true,	DuckTest.block('test').test({'stuff': 'test'}) );
	TEST(	31,	false,	DuckTest.block('test').test({'test': 'test'}) );
	TEST(	32,	true,	DuckTest.block('test', 'number').test({'test': 'test'}) );
	TEST(	33,	false,	DuckTest.block('test', 'number').test({'test': 123}) );
	TEST(	34,	false,	DuckTest.block('test', null, 123).test({'test': 123}) );
	TEST(	35,	true,	DuckTest.block('test', null, 123).test({'test': 123.1}) );
	
	TEST(	36, true,	DuckTest.require('test').block('test', null, [123, 124]).test({'test': 125}) );
	
	function TEST(id, expected, result) {
		var id = (id < 10 ? ' ' : '') + id.toString();
		var mark = expected == result ? 'Passed' : 'Failed';
		var er = '';
		if ( expected != result ) {
			er = expected.toString() + ' ' + result.toString();
		}
		
		console.log(id, mark, er);
	}
})();