/**
 * @fileoverview Prevent usage of deprecated lodash methods
 * @author Steven McConomy
 */
'use strict';
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

// See https://github.com/lodash/lodash/wiki/Deprecations
const DEPRECATED_FUNCTIONS = {
	// old    : new
	// ARRAY
	first     : 'head',
	object    : 'zipObject',
	rest      : 'tail',
	unique    : 'uniq',
	// COLLECTIONS
	all       : 'every',
	any       : 'some',
	collect   : 'map',
	contains  : 'includes',
	detect    : 'find',
	each      : 'forEach',
	eachRight : 'forEachRight',
	foldl     : 'reduce',
	foldr     : 'reduceRight',
	include   : 'includes',
	inject    : 'reduce',
	pluck     : 'map',
	select    : 'filter',
	// FUNCTION
	backflow  : 'flowRight',
	compose   : 'flowRight',
	// LANG
	eq        : 'isEqual',
	// OBJECT
	extend    : 'assign',
	methods   : 'functions',
	// UTILITY
	callback  : 'iteratee',
};

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
				const fixedName = DEPRECATED_FUNCTIONS[node.property.name];
				if (node.object.name === '_' && fixedName) {
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
