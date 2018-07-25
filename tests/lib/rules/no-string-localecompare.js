/**
 * @fileoverview Prevents usage of String.localCompare()
 * @author Gord Tanner
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule       = require('../../../lib/rules/no-string-localecompare');
const RuleTester = require('eslint').RuleTester;


// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------
const ruleTester = new RuleTester({ parserOptions : { ecmaVersion : 2017 } });

const errors = [ {
	message : 'please use `_.areEqualCaseless(string1, string2)` instead of `String.localeCompare()`',
	type    : 'CallExpression',
} ];

ruleTester.run('no-string-localecompare', rule, {
	valid : [
	],

	invalid : [
		{
			code   : 'a.prop.localeCompare(b.prop, {sensitiviy : \'base\' })',
			errors,
			output : '_.areEqualCaseless(a.prop, b.prop)',
		},
		{
			code   : 'a.localeCompare(\'const\', {sensitiviy : \'base\' })',
			errors,
			output : '_.areEqualCaseless(a, \'const\')',
		},
		{
			code   : '\'foo\'.localeCompare(\'const\', {sensitiviy : \'base\' })',
			errors,
			output : '_.areEqualCaseless(\'foo\', \'const\')',
		},
		{
			code   : 'a.prop.localeCompare(b.prop.stuff, {sensitiviy : \'base\' })',
			errors,
			output : '_.areEqualCaseless(a.prop, b.prop.stuff)',
		},
		{
			code : `str.localeCompare(\`one ${2} three\`, {sensitiviy : 'base' })`,
			errors,
			// TODO: enable this
			// output : `_.areEqualCaseless(str, \`one ${2} three\`)`,
		},
		{
			code : '_.get(foo, \'bar.baz\').localeCompare(b.prop.stuff, {sensitiviy : \'base\' })',
			errors,
			// TODO: enable this
			// output : `_.areEqualCaseless(_.get(foo, 'bar.baz'), b.prop.stuff)`,
		},
		{
			code : `const usedBy = _([ _.get(this.usageCountMetadata, 'roadmaps', []), _.get(this.usageCountMetadata, 'masters', []) ])
										.map(tables => tables.sort((a, b) => a.title.localeCompare(b.title, { sensitiviy : 'base' })))
										.flatten()
										.value();`,
			errors,
			output : `const usedBy = _([ _.get(this.usageCountMetadata, 'roadmaps', []), _.get(this.usageCountMetadata, 'masters', []) ])
										.map(tables => tables.sort((a, b) => _.areEqualCaseless(a.title, b.title)))
										.flatten()
										.value();`,
		},
	],
});
