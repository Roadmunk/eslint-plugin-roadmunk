/**
 * @fileoverview Enforce log messages have some context
 * @author Gord Tanner
 */
'use strict';
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const LEVELS = {
	info  : 1,
	warn  : 1,
	error : 1,
};

function isLogCallee(node) {
	return node
		&& node.type === 'MemberExpression'
		&& node.object.name === 'log'
		&& LEVELS[node.property.name];
}

function getNamedFunctionName(node) {
	if (node.type === 'FunctionDeclaration'
		&& node.id
		&& node.id.name) {
		return node.id.name;
	}
	else if ((node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression')
		&& node.parent.type === 'VariableDeclarator') {
		return node.parent.id.name;
	}
	else if (node.type === 'Property') {
		return node.key.name;
	}
	else if ((node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression')
		&& node.parent.type === 'AssignmentExpression') {
		return node.parent.left.name;
	}

	if (!node.parent) {
		return null;
	}

	return getNamedFunctionName(node.parent);
}

module.exports = {
	meta : {
		docs : {
			description : 'Enforces that log messages have some context',
			category    : 'Best Practices',
			recommended : false,
		},
		fixable : 'code',
		schema  : [],
	},

	create : function(context) {
		return {
			CallExpression(node) {
				if (!isLogCallee(node.callee)) {
					return;
				}

				// only if the first arg is a Literal
				if (node.arguments[0] && node.arguments[0].type !== 'Literal' && node.arguments[0].type !== 'TemplateLiteral') {
					return;
				}

				const fileName     = context.getFilename();
				const functionName = getNamedFunctionName(node);
				const firstArg     = node.arguments[0].value || node.arguments[0].quasis.map(q => q.value.raw).join(' ');
				const firstToken   = firstArg.toString().split(' ')[0];
				let expected       = fileName.split('.').slice(0, -1).join('.') || fileName;

				if (firstToken.indexOf('.') >= 0) {
					return;
				}

				if (functionName) {
					expected += `.${functionName}`;
				}

				if (expected !== firstToken) {
					context.report({
						node,
						message : `Ensure the some context starts the log message example: (${expected})`,
						fix     : fixer => {
							let context = expected;
							const arg   = node.arguments[0];
							const range = [
								arg.range[0] + 1, // start inside the quotes
								arg.range[1],
							];

							if (typeof arg.value === 'number') {
								// numbers dont have quotes, context is crafted a little differently
								range[0]--;
								context = `'${context} ' +`;
							}

							return fixer.insertTextBeforeRange(range, `${context} `);
						},
					});
				}
			},
		};
	},
};
