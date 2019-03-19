/**
 * @fileoverview Prevents use of log.info
 * @author Watandeep Sekhon
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule       = require('../../../lib/rules/no-log-info');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const errors = [ {
	message : 'info a deprecated log method. Use user or sys instead',
	type    : 'CallExpression',
} ];

const ruleTester = new RuleTester();
ruleTester.run('no-log-info', rule, {
	valid : [
		'log.sys("test")',
		'log.user("test")',
	],

	invalid : [
		{
			code : "log.info('hello');",
			errors,
		},
	],
});

