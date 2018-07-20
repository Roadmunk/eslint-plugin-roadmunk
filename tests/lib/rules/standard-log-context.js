/**
 * @fileoverview Enforce standard context in log messages
 * @author Gord Tanner
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/standard-log-context');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

function errors(context) {
	return [ {
		message : `Ensure the context starts the log message {${context}}`,
		type    : 'CallExpression',
	} ];
}

const ruleTester = new RuleTester({ parserOptions : { ecmaVersion : 2017 } });
ruleTester.run('standard-log-context', rule, {

	valid : [
		{
			code     : 'log.info("filename")',
			filename : 'filename.js',
		},
		{
			code     : 'log.warn("filename.extra is awesome")',
			filename : 'filename.extra.jsx',
		},
		{
			code     : 'log.error("file is awesome")',
			filename : 'file',
		},
		{
			code     : 'notlog("i can do anything")',
			filename : 'javascript.js',
		},
		{
			code     : 'log.unknown("i can do anything")',
			filename : 'javascript.js',
		},
		{
			code     : 'log.info("lib/server/file")',
			filename : 'lib/server/file.js',
		},
		{
			code     : 'function stuff(a,b,c) { log.info("Clazz.stuff is loggin"); }',
			filename : 'Clazz.js',
		},
		{
			code     : 'var stuff = function(a,b,c) { log.info("Clazz.stuff is loggin"); };',
			filename : 'Clazz.js',
		},
		{
			code     : 'fs.readFile("foo.txt", function(err) { log.error(err); });',
			filename : 'Clazz.js',
		},
		{
			code     : 'let foo = { bar : function () { log.error("Clazz.bar"); } };',
			filename : 'Clazz.js',
		},
		{
			code     : 'const bar = function () { log.error("Clazz.bar"); };',
			filename : 'Clazz.js',
		},
		{
			code     : 'const myfunc = (arg1, arg2) => { log.error("Clazz.myfunc"); };',
			filename : 'Clazz.js',
		},
		{
			code     : 'const action = arg => log.error("Clazz.action");',
			filename : 'Clazz.js',
		},
		{
			code     : 'function module() { var foo = fs.readFile("asdf", err => { log.error("Clazz.module failed"); }); }',
			filename : 'Clazz.js',
		},
		{
			code     : 'const a = { doit() { log.error("Clazz.doit is happening"); } };',
			filename : 'Clazz.js',
		},

		{
			code     : 'function stuff(a,b,c) { log.info(`Clazz.stuff is loggin ${1+1}`); }',
			filename : 'Clazz.js',
		},
	],

	invalid : [
		{
			code     : 'log.info("wrong");',
			filename : 'filename.js',
			errors   : errors('filename'),
		},
		{
			code     : 'function foo() { log.info("lib/server/file") }',
			filename : 'lib/server/file.js',
			errors   : errors('lib/server/file.foo'),
		},
		{
			code     : 'log.info("wrongname");',
			filename : 'wrong.name.js',
			errors   : errors('wrong.name'),
		},
	],
});
