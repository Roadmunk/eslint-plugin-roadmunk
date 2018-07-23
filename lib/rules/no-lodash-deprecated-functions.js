/**
 * @fileoverview Prevent usage of deprecated lodash methods
 * @author Steven McConomy
 */
'use strict';
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const DEPRECATED_FUNCTIONS = [
	// ARRAY
	{
		old : 'first',
		new : 'head',
	},
	{
		old : 'object',
		new : 'zipObject',
	},
	{
		old : 'tail',
		new : 'rest',
	},
	{
		old : 'unique',
		new : 'uniq',
	},
	// COLLECTIONS
	{
		old : 'all',
		new : 'every',
	},
	{
		old : 'any',
		new : 'some',
	},
	{
		old : 'collect',
		new : 'map',
	},
	{
		old : 'contains',
		new : 'includes',
	},
	{
		old : 'detect',
		new : 'find',
	},
	{
		old : 'each',
		new : 'forEach',
	},
	{
		old : 'eachRight',
		new : 'forEachRight',
	},
	{
		old : 'foldl',
		new : 'reduce',
	},
	{
		old : 'foldr',
		new : 'reduceRight',
	},
	{
		old : 'include',
		new : 'includes',
	},
	{
		old : 'inject',
		new : 'reduce',
	},
	{
		old : 'select',
		new : 'filter',
	},
	// FUNCTION
	{
		old : 'backflow',
		new : 'flowRight',
	},
	{
		old : 'compose',
		new : 'flowRight',
	},
	// LANG
	{
		old : 'eq',
		new : 'isEqual',
	},
	// OBJECT
	{
		old : 'extend',
		new : 'assign',
	},
	{
		old : 'methods',
		new : 'functions',
	},
	// UTILITY
	{
		old : 'iteratee',
		new : 'callback',
	},
];

// `new` is not a valid variable name
const NAMES_MAP = new Map(DEPRECATED_FUNCTIONS.map(({ old, new : newName }) => [ old, newName ]));

module.exports = {
	meta : {
		docs : {
			description : 'Prevents the use of deprecated lodash methods',
			category    : 'Best Practices',
			recommended : false,
		},
		fixable : 'code',
	},

	create : function(context) {
		return {
			MemberExpression(node) {
				if (node.object.name === '_' && NAMES_MAP.has(node.property.name)) {
					const fixedName = NAMES_MAP.get(node.property.name);
					context.report({
						node,
						message : `Use _.${fixedName} instead of the deprecated _.${node.property.name}`,
						fix     : fixer => fixer.replaceText(node.property, fixedName),
					});
				}
			},
		};
	},
};
