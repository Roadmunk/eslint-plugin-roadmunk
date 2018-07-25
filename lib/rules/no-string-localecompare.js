/**
 * @fileoverview Prevent usage of String.localeCompare
 * @author Gord Tanner
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function toStr(node) {
	if (node.type === 'Literal') {
		return node.raw;
	}

	let str = '';

	if (node.object) {
		str += toStr(node.object);
	}

	if (node.property && node.property.name !== 'localeCompare') {
		str += `.${toStr(node.property)}`;
	}

	str += node.name || '';
	str += node.value || '';

	return str;
}

module.exports = {
	meta : {
		docs : {
			description : 'Prevents the use of String.localeCompare() and prefers our _.areEqualCaseless',
			category    : 'Best Practices',
			recommended : false,
		},
		fixable : 'code',
		schema  : [],
	},

	create : function(context) {
		return {
			CallExpression(node) {

				if (node.callee
					&& node.callee.property
				  && node.callee.property.name === 'localeCompare') {
					return context.report({
						node,
						message : 'please use `_.areEqualCaseless(string1, string2)` instead of `String.localeCompare()`',
						fix     : fixer => {
							let string1 = 'string1';
							let string2 = 'string2';

							string1 = toStr(node.callee);
							string2 = toStr(node.arguments[0]);

							return fixer.replaceText(node, `_.areEqualCaseless(${string1}, ${string2})`);
						},
					});
				}
			},
		};
	},
};
