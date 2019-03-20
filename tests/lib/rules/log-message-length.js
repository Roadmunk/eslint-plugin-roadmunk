/**
 * @fileoverview Enforces a specified max length on log messages
 * @author Watandeep Sekhon
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule       = require('../../../lib/rules/log-message-length');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('log-message-length', rule, {
	valid : [
		'log.debug("Valid message")',
		'log.info("Valid message")',
		'log.warn("Valid message")',
		'log.error("Valid message")',
		'log.command("Valid message")',
		'log.command("Valid message", { testing : true })',
		'log.random("This is a string that is long enough that it goes over the limit")',
		'console.log("This is a string that is long enough that it goes over the limit")',
		'console.log(ThisIsAReallyLongFunctionNameThatThisRuleShouldntThrowLintingErrorAbout())',
	],

	invalid : [
		{
			code   : 'log.debug("This is a string that is long enough that it goes over the limit")',
			errors : [ {
				message : 'Log messages cannot be more than 50 characters long',
				type    : 'CallExpression',
			} ],
		},
		{
			code   : 'log.info("This is a string that is long enough that it goes over the limit")',
			errors : [ {
				message : 'Log messages cannot be more than 50 characters long',
				type    : 'CallExpression',
			} ],
		},
		{
			code   : 'log.warn("This is a string that is long enough that it goes over the limit")',
			errors : [ {
				message : 'Log messages cannot be more than 50 characters long',
				type    : 'CallExpression',
			} ],
		},
		{
			code   : 'log.error("This is a string that is long enough that it goes over the limit")',
			errors : [ {
				message : 'Log messages cannot be more than 50 characters long',
				type    : 'CallExpression',
			} ],
		},
		{
			code   : 'log.command("This is a string that is long enough that it goes over the limit")',
			errors : [ {
				message : 'Log messages cannot be more than 50 characters long',
				type    : 'CallExpression',
			} ],
		},
	],
});
