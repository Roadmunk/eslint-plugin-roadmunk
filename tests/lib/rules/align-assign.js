/**
 * @fileoverview Align assignment statements on their equals signs
 * @author Steven McConomy
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule       = require('../../../lib/rules/align-assign');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [{
	message : 'align',
	type    : 'ExpressionStatement'
}];

const ruleTester = new RuleTester();
ruleTester.run('align-assign', rule, {
	valid : [
		`
		var a    = 1;
		var b    = 3;
		var asdf = 4;
		b        = 4;`,
		`
		var a = b = c;
		a     = 3;`,
		`
		function f() {
			var a = 3;
			a     = 5;
		}`,
		`
		var a = 3, b = 5, c = 7;
		a     = 2;`,
		`
		var a = 3;

		a = 4;`,
		`
		var a = 3 /*who would make
		a comment like this anyways*/a = 5`,
		`
		var a = 4; // a comment
		a     = 3;`,
		`
		var a = 3; a = 3;
		a = 2;`,
		`
		{
			var a = 3;
			a     = 4;
		}`,
		`
		{ var a = 3;
			a = 4;
		}`,
		`
		a.b.c.d = 3;
		a.b     = 5;`,
	],
	invalid : [
		{
			code : `
			var a = 1;
			var b = 3;
			var asdf = 4;
			b = 4;`,
			errors : [{},{},{}],
			output : `
			var a    = 1;
			var b    = 3;
			var asdf = 4;
			b        = 4;`,
		},
		{
			code : `
			var a     = 1;
			var b     = 3;
			var asdf  = 4;
			b         = 4;`,
			errors : [{},{},{},{}],
			output : `
			var a    = 1;
			var b    = 3;
			var asdf = 4;
			b        = 4;`,
		},
		{
			code : `
			var a = 1;

			a     = 2;`,
			errors : [{}],
			output : `
			var a = 1;

			a = 2;`,
		},
		{
			code : `
			a.b.c.d = 4;
			a.b = 3;`,
			errors : [{}],
			output : `
			a.b.c.d = 4;
			a.b     = 3;`,
		},
		{
			code : `
			function f() {
				var a = 1;
				a = 2;
			}`,
			errors : [{}],
			output : `
			function f() {
				var a = 1;
				a     = 2;
			}`,
		},{
			code : `
			{ var a = 1;
				a     = 2;
			}`,
			errors : [{}],
			output : `
			{ var a = 1;
				a = 2;
			}`,
		},
	],
});
