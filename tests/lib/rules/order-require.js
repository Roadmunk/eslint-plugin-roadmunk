/**
 * @fileoverview Ensures that the require statements are in a specific order
 * @author Watandeep Sekhon
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
const rule       = require('../../../lib/rules/order-require');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------
const ruleTester = new RuleTester();
ruleTester.run('order-require', rule, {
	valid : [
		`
		var fs = require('fs');
		var async = require('async');
		var lib1 = require('lib/test');
		var lib2 = require('../lib/test');
		var lib2 = require('common/lib/test');
		var lib3 = require('../common/lib/test');
		var views1 = require('views/test');
		var views2 = require('../views/test');
		var views2 = require('common/views/test');
		var views3 = require('../common/views/test');
		var models1 = require('models/test');
		var models2 = require('../models/test');
		var models2 = require('common/models/test');
		var models3 = require('../common/models/test');
		`,
	],

	invalid : [
		// 		{
		// 			code :
		// 			`
		// var second = require('lib/test');
		// var first = require('first');
		// 			`,
		// 			errors : [ {
		// 				message : 'first was not required in the correct order',
		// 				type    : 'CallExpression',
		// 			} ],
		// 			output :
		// 			`
		// var first = require('first');
		// var second = require('lib/test');
		// 			`,
		// 		},
		// 		{
		// 			code :
		// 			`
		// var first = require('first');
		// var third = require('common/lib/test');
		// var second = require('lib/test');
		// 			`,
		// 			errors : [ {
		// 				message : 'lib/test was not required in the correct order',
		// 				type    : 'CallExpression',
		// 			} ],
		// 			output :
		// 			`
		// var first = require('first');
		// var second = require('lib/test');
		// var third = require('common/lib/test');
		// 			`,
		// 		},
		{
			code :
			`
var third = require('common/lib/test');
var first = require('first');
var second = require('lib/test');
			`,
			errors : [ {
				message : 'first was not required in the correct order',
				type    : 'CallExpression',
			},
			{
				message : 'lib/test was not required in the correct order',
				type    : 'CallExpression',
			} ],
			output :
			`
var first = require('first');
var second = require('lib/test');
var third = require('common/lib/test');
			`,
		},
	],
});
