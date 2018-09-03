/**
 * @fileoverview Uses the correct assertion method to check for length of an array
 * @author Watandeep Sekhon
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule       = require('../../../lib/rules/assert-length');
const RuleTester = require('eslint').RuleTester;


// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('assert-length', rule, {

	valid : [
		'expect(something).to.equal(x)',
		'expect(something).to.be(x)',
		'expect(something).a.equal(x)',
		'expect(something).to.have.length(x)',
		'expect(something.something).to.equal(x)',
	],

	invalid : [
		{
			code   : 'expect(something.length).to.equal(x)',
			output : 'expect(something).to.have.length(x)',
			errors : [ {
				message : 'Use to.have.length to check the length of an array',
				type    : 'MemberExpression',
			} ],
		},
		{
			code   : 'expect(something.length).to.equal(x, \'random text\')',
			output : 'expect(something).to.have.length(x, \'random text\')',
			errors : [ {
				message : 'Use to.have.length to check the length of an array',
				type    : 'MemberExpression',
			} ],
		},
	],
});
