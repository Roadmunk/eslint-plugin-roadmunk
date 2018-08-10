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

const errors = [
	{
		message : 'please use `_.areEqualCaseless(string1, string2)` instead of `String.localeCompare()`',
		type    : 'CallExpression',
	},
	{
		message : 'please use `_.areEqualCaseless(string1, string2)` instead of `string1.toLowerCase() == string2.toLowerCase()`',
		type    : 'BinaryExpression',
	},
	{
		message : 'please use `_.areEqualCaseless(string1, string2)` instead of `string1.toLowerCase() === string2.toLowerCase()`',
		type    : 'BinaryExpression',
	},
];

ruleTester.run('no-string-localecompare', rule, {
	valid : [
		{ code : 'a.prop.localeCompare(b.prop, {})' },
		{ code : 'a.prop.localeCompare(b.prop)' },
		{ code : 'a.prop.localeCompare(b.prop, { awesome : true })' },
		{ code : 'a.prop.localeCompare(b.prop, { sensitivity : "notbase" })' },
		{ code : 'a.prop.localeCompare(b.prop, { sensitivity : "notbase" })' },
		{ code : 'const value = arg.name.toLowerCase() !== thing.toLowerCase();' },
		{ code : 'const value = arg.name.toLowerCase() >= thing.toLowerCase();' },
		{ code : 'const value = arg.name.toLowerCase() <= thing.toLowerCase();' },
		{ code : 'const value = arg.name.toLowerCase() > thing.toLowerCase();' },
		{ code : 'const value = arg.name.toLowerCase() < thing.toLowerCase();' },
	],

	invalid : [
		{
			code   : 'a.prop.localeCompare(b.prop, {sensitivity : \'base\' })',
			output : '_.areEqualCaseless(a.prop, b.prop)',
			errors : [ errors[0] ],
		},
		{
			code   : 'a.localeCompare(\'const\', {sensitivity : \'base\' })',
			output : '_.areEqualCaseless(a, \'const\')',
			errors : [ errors[0] ],
		},
		{
			code   : '\'foo\'.localeCompare(\'const\', {sensitivity : \'base\' })',
			output : '_.areEqualCaseless(\'foo\', \'const\')',
			errors : [ errors[0] ],
		},
		{
			code   : 'a.prop.localeCompare(b.prop.stuff, {sensitivity : \'base\' })',
			output : '_.areEqualCaseless(a.prop, b.prop.stuff)',
			errors : [ errors[0] ],
		},
		{
			code   : 'str.localeCompare(`one ${2} three`, {sensitivity : \'base\' })',
			output : '_.areEqualCaseless(str, `one ${2} three`)',
			errors : [ errors[0] ],
		},
		{
			code   : '_.get(foo, \'bar.baz\').localeCompare(b.prop.stuff, {sensitivity : \'base\' })',
			output : '_.areEqualCaseless(_.get(foo, \'bar.baz\'), b.prop.stuff)',
			errors : [ errors[0] ],
		},
		{
			code   : '`wow`.localeCompare(_.get(obj, "stuff"), {sensitivity : \'base\' });',
			output : '_.areEqualCaseless(`wow`, _.get(obj, "stuff"));',
			errors : [ errors[0] ],
		},
		{
			code   : 'string1.localeCompare(null, {sensitivity : \'base\' });',
			output : '_.areEqualCaseless(string1, null);',
			errors : [ errors[0] ],
		},
		{
			code   : 'string1.localeCompare(undefined, {sensitivity : \'base\' });',
			output : '_.areEqualCaseless(string1, undefined);',
			errors : [ errors[0] ],
		},
		{
			code   : 'string1.localeCompare(string2.trim(), {sensitivity : \'base\' });',
			output : '_.areEqualCaseless(string1, string2.trim());',
			errors : [ errors[0] ],
		},
		{
			code   : 'const func = arg => arg.name.toLowerCase() == thing.toLowerCase();',
			output : 'const func = arg => _.areEqualCaseless(arg.name, thing);',
			errors : [ errors[1] ],
		},
		{
			code   : 'const value = arg.name.toLowerCase() === thing.toLowerCase();',
			output : 'const value = _.areEqualCaseless(arg.name, thing);',
			errors : [ errors[2] ],
		},
		{
			code : `const usedBy = _([ _.get(this.usageCountMetadata, 'roadmaps', []), _.get(this.usageCountMetadata, 'masters', []) ])
										.map(tables => tables.sort((a, b) => a.title.localeCompare(b.title, { sensitivity : 'base' })))
										.flatten()
										.value();`,
			output : `const usedBy = _([ _.get(this.usageCountMetadata, 'roadmaps', []), _.get(this.usageCountMetadata, 'masters', []) ])
										.map(tables => tables.sort((a, b) => _.areEqualCaseless(a.title, b.title)))
										.flatten()
										.value();`,
			errors : [ errors[0] ],
		},
	],
});
