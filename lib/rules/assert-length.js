/**
 * @fileoverview Uses the correct assertion method to check for length of an array
 * @author Watandeep Sekhon
 */
'use strict';
const _ = require('lodash');
const { hasPropsWithValues, isPropertyAnIdentifierWithName } = require('../helper');
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
	meta : {
		docs : {
			description : 'Uses the correct assertion method to check for length of an array',
			category    : 'Best practices',
			recommended : false,
		},
		fixable : 'code',
	},

	create : function(context) {
		return {
			MemberExpression(node) {
				/**
				 * When we have a line of code that looks like `expect(something.length).to.equal(x)`
				 * node is a MemberExpression that looks something like this
				 * node.property - .equal
				 * node.object - .to
				 * node.object.object - CallExpression with `something.length` as it's argument
				 */
				if (isPropertyAnIdentifierWithName(node, 'equal') && isPropertyAnIdentifierWithName(node.object, 'to') && hasPropsWithValues(node, { 'object.object.type' : 'CallExpression' })) {
					// Arguments passed into the expect() call expression
					const expectCallArgs = node.object.object.arguments;

					// Arguments passed into the equal() call expression
					const equalCallArgs = node.parent.arguments;

					// If multiple things were passed in then ignore
					// Also ignore if the user isn't checking for length in the argument
					if (expectCallArgs.length > 1 || expectCallArgs[0].type !== 'MemberExpression' || !isPropertyAnIdentifierWithName(expectCallArgs[0], 'length')) {
						return;
					}

					// The array whose length is being checked
					const array = expectCallArgs[0].object;

					context.report({
						node,
						message : 'Use to.have.length to check the length of an array',
						fix(fixer) {
							const sourceCode               = context.getSourceCode();
							const arraySourceCode          = sourceCode.getText(array);
							const expectedLengthSourceCode = _.map(equalCallArgs, arg => sourceCode.getText(arg)).join(', ');
							const fixedCode                = `expect(${arraySourceCode}).to.have.length(${expectedLengthSourceCode})`;

							return fixer.replaceText(node.parent, fixedCode);
						},
					});
				}
			},
		};
	},
};
