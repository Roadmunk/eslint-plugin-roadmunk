/**
 * @fileoverview Prevent usage of deprecated lodash methods
 * @author Steven McConomy
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule       = require("../../../lib/rules/no-lodash-deprecated");
const RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [{
	message : "Use _.includes instead of the deprecated _.contains",
	type    : "MemberExpression"
}];

const ruleTester = new RuleTester();
ruleTester.run("no-lodash-deprecated", rule, {
	valid : [
		"_.includes(a, list, of, arguments)",
		"_.containsWithMoreThingsHere()"
	],
	invalid : [
		{
				code : "_.contains([ 1 ], 1)",
				errors,
				output : "_.includes([ 1 ], 1)",
		},
	],
});
