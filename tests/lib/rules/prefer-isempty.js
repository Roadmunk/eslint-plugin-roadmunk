/**
 * @fileoverview Enforces the use of _.isEmpty instead of checking length
 * @author Steven McConomy
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule       = require('../../../lib/rules/prefer-isempty');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const errors = [ {
	message : 'Prefer _.isEmpty',
	type    : 'BinaryExpression',
} ];

const ruleTester = new RuleTester();
ruleTester.run('prefer-isempty', rule, {

	valid : [
		'array.length === 1',
		'array.length !== 1',
		'array.length < 0',
		'array.length > 1',
		'0 > array.length',
		'1 < array.length',
	],

	invalid : [
		{
			code   : 'array.length === 0',
			errors,
			output : '_.isEmpty(array)',
		},
		{
			code   : 'array.length !== 0',
			errors,
			output : '!_.isEmpty(array)',
		},
		{
			code   : 'array.length > 0',
			errors,
			output : '!_.isEmpty(array)',
		},
		{
			code   : '0 < array.length',
			errors,
			output : '!_.isEmpty(array)',
		},
		{
			code   : 'Object.keys(object).length === 0',
			errors,
			output : '_.isEmpty(object)',
		},
	],
});
