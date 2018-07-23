/**
 * @fileoverview Prevent usage of lodash&#39;s isNull method
 * @author Watandeep Sekhon
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-lodash-isnull');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const errors = [ {
	message : 'Use native JavaScript to check for null',
	type    : 'MemberExpression',
} ];

const ruleTester = new RuleTester();
ruleTester.run('no-lodash-isnull', rule, {

	valid : [
		'valid = 5;',
		'valid = _.isNil(5);',
		'valid = 5 === null;',
		'test2 = function(opts) { return _.forEach([1, 2], function(v){ return v + 1}) }',
		"test = function() { if(test === 'something'){ return; } }",
		'obj = { method1 : function(){} }',
		'test = function() { return test ? 1 : 2 }',
		'test = true ? 1 : 2',
		'test = function(){ var test2 = {}; test2 === null ? 1 : 2 }',
	],

	invalid : [
		// Simple tests with multiple data types
		{
			code   : 'test = _.isNull(5)',
			errors,
			output : 'test = 5 === null',
		},
		{
			code   : 'test = !!_.isNull(5)',
			errors,
			output : 'test = 5 === null',
		},
		{
			code   : 'test = !_.isNull(5)',
			errors,
			output : 'test = 5 !== null',
		},
		{
			code   : 'test = _.isNull(5) ? 1 : 2',
			errors,
			output : 'test = 5 === null ? 1 : 2',
		},
		{
			code   : 'test = !!_.isNull(5) ? 1 : 2',
			errors,
			output : 'test = 5 === null ? 1 : 2',
		},
		{
			code   : 'test = !_.isNull(5) ? 1 : 2',
			errors,
			output : 'test = 5 !== null ? 1 : 2',
		},
		{
			code   : "test = _.isNull('5')",
			errors,
			output : "test = '5' === null",
		},
		{
			code   : "test = _.isNull('') ? 1 : 2",
			errors,
			output : "test = '' === null ? 1 : 2",
		},
		{
			code   : "test = !_.isNull('') ? 1 : 2",
			errors,
			output : "test = '' !== null ? 1 : 2",
		},
		{
			code   : 'test = _.isNull(true)',
			errors,
			output : 'test = true === null',
		},
		{
			code   : 'test = !_.isNull(true)',
			errors,
			output : 'test = true !== null',
		},
		{
			code   : 'test = _.isNull(false) ? 1 : 2',
			errors,
			output : 'test = false === null ? 1 : 2',
		},
		{
			code   : 'test = !!_.isNull(false) ? 1 : 2',
			errors,
			output : 'test = false === null ? 1 : 2',
		},
		{
			code   : 'test = _.isNull([])',
			errors,
			output : 'test = [] === null',
		},
		{
			code   : 'test = !_.isNull([])',
			errors,
			output : 'test = [] !== null',
		},
		{
			code   : 'test = _.isNull([1,2]) ? 1 : 2',
			errors,
			output : 'test = [1,2] === null ? 1 : 2',
		},
		{
			code   : 'test = !!_.isNull([1,2]) ? 1 : 2',
			errors,
			output : 'test = [1,2] === null ? 1 : 2',
		},
		{
			code   : 'test = _.isNull(function(){})',
			errors,
			output : 'test = function(){} === null',
		},
		{
			code   : 'test = !_.isNull(function(){})',
			errors,
			output : 'test = function(){} !== null',
		},
		{
			code   : 'test = _.isNull(function(){}) ? 1 : 2',
			errors,
			output : 'test = function(){} === null ? 1 : 2',
		},
		{
			code   : 'test = !!_.isNull(function(){}) ? 1 : 2',
			errors,
			output : 'test = function(){} === null ? 1 : 2',
		},
		{
			code   : 'test = _.isNull(null)',
			errors,
			output : 'test = null === null',
		},
		{
			code   : 'test = !_.isNull(null)',
			errors,
			output : 'test = null !== null',
		},
		{
			code   : 'var condition = null; test = _.isNull(condition) ? 1 : 2',
			errors,
			output : 'var condition = null; test = condition === null ? 1 : 2',
		},
		{
			code   : 'var condition = null; test = !_.isNull(condition) ? 1 : 2',
			errors,
			output : 'var condition = null; test = condition !== null ? 1 : 2',
		},
		{
			code   : 'var condition = {}; test = _.isNull(condition) ? 1 : 2',
			errors,
			output : 'var condition = {}; test = condition === null ? 1 : 2',
		},
		{
			code   : 'var condition = {}; test = !!_.isNull(condition) ? 1 : 2',
			errors,
			output : 'var condition = {}; test = condition === null ? 1 : 2',
		},
		{
			code   : 'var condition = function(){}; test = _.isNull(condition) ? 1 : 2',
			errors,
			output : 'var condition = function(){}; test = condition === null ? 1 : 2',
		},
		// Testing object methods
		{
			code   : 'obj = { method1 : function(){ _.isNull(5) ? 1 : 2 } }',
			errors,
			output : 'obj = { method1 : function(){ 5 === null ? 1 : 2 } }',
		},
		{
			code   : 'obj = { method1 : function(){ !!_.isNull(5) ? 1 : 2 } }',
			errors,
			output : 'obj = { method1 : function(){ 5 === null ? 1 : 2 } }',
		},
		{
			code   : 'obj = { method1 : function(){ !_.isNull(5) ? 1 : 2 } }',
			errors,
			output : 'obj = { method1 : function(){ 5 !== null ? 1 : 2 } }',
		},
		{
			code   : "obj = { method1 : function(){ _.isNull('5') ? 1 : 2 } }",
			errors,
			output : "obj = { method1 : function(){ '5' === null ? 1 : 2 } }",
		},
		{
			code   : 'obj = { method1 : function(){ _.isNull([1,2]) ? 1 : 2 } }',
			errors,
			output : 'obj = { method1 : function(){ [1,2] === null ? 1 : 2 } }',
		},
		{
			code   : 'obj = { method1: null, method2 : function(){ _.isNull(this.method1) ? 1 : 2 } }',
			errors,
			output : 'obj = { method1: null, method2 : function(){ this.method1 === null ? 1 : 2 } }',
		},
		{
			code   : 'obj = { method1: null, method2 : function(){ !_.isNull(this.method1) ? 1 : 2 } }',
			errors,
			output : 'obj = { method1: null, method2 : function(){ this.method1 !== null ? 1 : 2 } }',
		},
		{
			code   : 'obj = { method1: null, method2 : function(){ var val = _.isNull(this.method1) ? 1 : 2; var val2 = null; } }',
			errors,
			output : 'obj = { method1: null, method2 : function(){ var val = this.method1 === null ? 1 : 2; var val2 = null; } }',
		},
		{
			code   : 'obj = { method1: null, method2 : function(){ var val = !!_.isNull(this.method1) ? 1 : 2; var val2 = null; } }',
			errors,
			output : 'obj = { method1: null, method2 : function(){ var val = this.method1 === null ? 1 : 2; var val2 = null; } }',
		},
		{
			code   : 'obj = { outer : { inner : function(arg){ return _.isNull(arg); } } }',
			errors,
			output : 'obj = { outer : { inner : function(arg){ return arg === null; } } }',
		},
		// Testing functions
		{
			code   : 'test2 = function(opt) { return _.isNull(opt) }',
			errors,
			output : 'test2 = function(opt) { return opt === null }',
		},
		{
			code   : 'test2 = function() { if(_.isNull(opt)) { return false; } }',
			errors,
			output : 'test2 = function() { if(opt === null) { return false; } }',
		},
		{
			code   : 'test2 = function() { return function(){ if(_.isNull(opt)) { return false; } } }',
			errors,
			output : 'test2 = function() { return function(){ if(opt === null) { return false; } } }',
		},
		{
			code   : 'test = function(){ var test2 = {}; _.isNull(test2) ? 1 : 2 }',
			errors,
			output : 'test = function(){ var test2 = {}; test2 === null ? 1 : 2 }',
		},
		{
			code   : 'test = function(test2){ if(_.isNull(test2)) { return 1 } }',
			errors,
			output : 'test = function(test2){ if(test2 === null) { return 1 } }',
		},
		{
			code   : 'test = function(){ if(_.isNull([])) { return 1 } }',
			errors,
			output : 'test = function(){ if([] === null) { return 1 } }',
		},
		// Mixing in logical & binary expressions
		{
			code   : 'test = testVar === _.isNull(5)',
			errors,
			output : 'test = testVar === (5 === null)',
		},
		{
			code   : 'test = testVar !== _.isNull(5)',
			errors,
			output : 'test = testVar !== (5 === null)',
		},
		{
			code   : 'test = testVar !== !_.isNull(5)',
			errors,
			output : 'test = testVar !== (5 !== null)',
		},
		{
			code   : 'test = testVar !== !!_.isNull(5)',
			errors,
			output : 'test = testVar !== (5 === null)',
		},
		{
			code   : 'test = testVar === _.isNull(testVar2)',
			errors,
			output : 'test = testVar === (testVar2 === null)',
		},
		{
			code   : 'test = _.isNull(5) === testVar',
			errors,
			output : 'test = (5 === null) === testVar',
		},
		{
			code   : 'test = !_.isNull(5) === testVar',
			errors,
			output : 'test = (5 !== null) === testVar',
		},
		{
			code   : 'test = !!_.isNull(5) === testVar',
			errors,
			output : 'test = (5 === null) === testVar',
		},
		{
			code   : 'test4 = _.isNull(5) && 8 ? true : false;',
			errors,
			output : 'test4 = 5 === null && 8 ? true : false;',
		},
		{
			code   : 'test4 = 8 && _.isNull(5) ? true : false;',
			errors,
			output : 'test4 = 8 && 5 === null ? true : false;',
		},
		// Multiple errors on same line & weird mixes of logical & binary expressions
		{
			code   : '_.isNull(5) === _.isNull(10) && _.isNull(15)',
			errors : [
				{
					message : 'Use native JavaScript to check for null',
					type    : 'MemberExpression',
				},
				{
					message : 'Use native JavaScript to check for null',
					type    : 'MemberExpression',
				},
				{
					message : 'Use native JavaScript to check for null',
					type    : 'MemberExpression',
				},
			],
			output : '(5 === null) === (10 === null) && 15 === null',
		},
		{
			code   : '_.isNull(null) || _.isNull(10) && _.isNull(15)',
			errors : [
				{
					message : 'Use native JavaScript to check for null',
					type    : 'MemberExpression',
				},
				{
					message : 'Use native JavaScript to check for null',
					type    : 'MemberExpression',
				},
				{
					message : 'Use native JavaScript to check for null',
					type    : 'MemberExpression',
				},
			],
			output : 'null === null || 10 === null && 15 === null',
		},
		{
			code   : '_.isNull(undefined) || _.isNull(10) && _.isNull(null)',
			errors : [
				{
					message : 'Use native JavaScript to check for null',
					type    : 'MemberExpression',
				},
				{
					message : 'Use native JavaScript to check for null',
					type    : 'MemberExpression',
				},
				{
					message : 'Use native JavaScript to check for null',
					type    : 'MemberExpression',
				},
			],
			output : 'undefined === null || 10 === null && null === null',
		},
		{
			code   : '_.isNull(undefined) || _.isNull(null) && _.isNull(10)',
			errors : [
				{
					message : 'Use native JavaScript to check for null',
					type    : 'MemberExpression',
				},
				{
					message : 'Use native JavaScript to check for null',
					type    : 'MemberExpression',
				},
				{
					message : 'Use native JavaScript to check for null',
					type    : 'MemberExpression',
				},
			],
			output : 'undefined === null || null === null && 10 === null',
		},
		// Confirm that if the user stores isNull in a variable, autofix will not be applied
		{
			code   : 'test = _.isNull',
			errors,
			output : 'test = _.isNull',
		},
		{
			code   : 'test = !_.isNull',
			errors,
			output : 'test = !_.isNull',
		},
	],
});
