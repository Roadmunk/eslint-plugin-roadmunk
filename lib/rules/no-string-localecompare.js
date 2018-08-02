/**
 * @fileoverview Prevent usage of String.localeCompare
 * @author Gord Tanner
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

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
				if (isLocaleCompare(node)) {
					return reportLocaleCompare(context, node);
				}
			},
			BinaryExpression(node) {
				if (isToLowerCaseCompare(node)) {
					return reportIsToLowerCaseCompare(context, node);
				}
			},
		};
	},
};

function isLocaleCompare(node) {
	return node.callee
		&& node.callee.property
		&& node.callee.property.name === 'localeCompare'
		&& node.arguments[1]
		&& node.arguments[1].type === 'ObjectExpression'
		&& node.arguments[1].properties.find(p => p.key.name === 'sensitivity' && p.value.value === 'base');
}

function reportLocaleCompare(context, node) {
	return context.report({
		node,
		message : 'please use `_.areEqualCaseless(string1, string2)` instead of `String.localeCompare()`',
		fix     : fixer => {
			let string1 = 'string1';
			let string2 = 'string2';

			string1 = toStr(context, node.callee);
			string2 = toStr(context, node.arguments[0]);

			return fixer.replaceText(node, `_.areEqualCaseless(${string1}, ${string2})`);
		},
	});
}

function isToLowerCaseCompare(node) {
	return node
		&& (node.operator === '===' || node.operator === '==')
		&& node.right
		&& node.right.type === 'CallExpression'
		&& node.right.callee
		&& node.right.callee.property
		&& node.right.callee.property.name === 'toLowerCase'
		&& node.left
		&& node.left.type === 'CallExpression'
		&& node.left.callee
		&& node.left.callee.property
		&& node.left.callee.property.name === 'toLowerCase';
}

function reportIsToLowerCaseCompare(context, node) {
	return context.report({
		node,
		message : `please use \`_.areEqualCaseless(string1, string2)\` instead of \`string1.toLowerCase() ${node.operator} string2.toLowerCase()\``,
		fix     : fixer => {
			let string1 = 'string1';
			let string2 = 'string2';

			string1 = toStr(context, node.left).replace('.toLowerCase()', '');
			string2 = toStr(context, node.right).replace('.toLowerCase()', '');

			return fixer.replaceText(node, `_.areEqualCaseless(${string1}, ${string2})`);
		},
	});
}

function toStr(context, node) {
	if (node.type === 'Literal'
		|| node.type === 'TemplateLiteral'
		|| node.type === 'CallExpression') {
		return context.getSourceCode().getText(node);
	}

	let str = '';

	if (node.object) {
		str += toStr(context, node.object);
	}

	if (node.property && node.property.name !== 'localeCompare') {
		str += `.${toStr(context, node.property)}`;
	}

	str += node.name || '';
	str += node.value || '';

	return str;
}
