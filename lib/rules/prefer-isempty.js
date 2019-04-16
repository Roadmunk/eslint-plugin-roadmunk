/**
 * @fileoverview Enforces the use of _.isEmpty instead of checking length
 * @author Steven McConomy
 */
'use strict';
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function isLiteralWithValue(node, value) {
	return node.type === 'Literal' && node.value === value;
}

function isMemberLength(node) {
	return node.type === 'MemberExpression'
		&& node.property.type === 'Identifier'
		&& node.property.name === 'length';
}

module.exports = {
	meta : {
		docs : {
			description : 'Prefer _.isEmpty for checking empty collections',
			category    : 'Best Practices',
			recommended : false,
		},
		fixable : 'code',
	},

	create : function(context) {
		return {
			BinaryExpression(node) {
				let lengthNode;
				let literalNode;
				let isNegated = false;

				if (node.operator === '===' || node.operator === '!==') {
					isNegated = node.operator === '!==';
					if (isLiteralWithValue(node.left, 0) && isMemberLength(node.right)) {
						literalNode = node.left;
						lengthNode  = node.right;
					}
					else if (isLiteralWithValue(node.right, 0) && isMemberLength(node.left)) {
						literalNode = node.right;
						lengthNode  = node.left;
					}
				}
				else if (node.operator === '>' && isMemberLength(node.left) && isLiteralWithValue(node.right, 0)) {
					literalNode = node.right;
					lengthNode  = node.left;
					isNegated   = true;
				}
				else if (node.operator === '<' && isMemberLength(node.right) && isLiteralWithValue(node.left, 0)) {
					literalNode = node.left;
					lengthNode  = node.right;
					isNegated   = true;
				}
				else if (node.operator === '>=' && isMemberLength(node.left) && isLiteralWithValue(node.right, 1)) {
					literalNode = node.right;
					lengthNode  = node.left;
					isNegated   = true;
				}
				else if (node.operator === '<=' && isMemberLength(node.right) && isLiteralWithValue(node.left, 1)) {
					literalNode = node.left;
					lengthNode  = node.right;
					isNegated   = true;
				}

				if (literalNode && lengthNode) {
					let collectionNode;
					if (
						lengthNode.object.type === 'CallExpression'
						&& lengthNode.object.callee.type === 'MemberExpression'
						&& lengthNode.object.callee.object.type === 'Identifier'
						&& lengthNode.object.callee.object.name === 'Object'
						&& lengthNode.object.callee.property.type === 'Identifier'
						&& lengthNode.object.callee.property.name === 'keys'
						&& lengthNode.object.arguments.length === 1
					) {
						collectionNode = lengthNode.object.arguments[0];
					}
					else {
						collectionNode = lengthNode.object;
					}

					context.report({
						node,
						message : 'Prefer _.isEmpty',
						fix(fixer) {
							const sourceCode           = context.getSourceCode();
							const collectionSourceCode = sourceCode.getText(collectionNode);
							const fixedCode            = `${isNegated ? '!' : ''}_.isEmpty(${collectionSourceCode})`;

							return fixer.replaceText(node, fixedCode);
						},
					});
				}
			},
		};
	},
};
