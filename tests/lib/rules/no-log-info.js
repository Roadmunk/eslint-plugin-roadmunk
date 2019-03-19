/**
 * @fileoverview Prevents use of log.info
 * @author Watandeep Sekhon
 */
'use strict';

const RuleTester = require('eslint').RuleTester;
const rule       = require('../../../lib/rules/no-log-info');

const errors = [ {
	message : 'info is a deprecated log method. Use user or sys instead',
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

