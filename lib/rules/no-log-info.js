/**
 * @fileoverview Prevents use of log.info
 * @author Watandeep Sekhon
 */
'use strict';
const { isPropertyAnIdentifierWithName, isObjectAnIdentifierWithName } = require('../helper');

module.exports = {
	meta : {
		docs : {
			description : 'Prevents use of log.info',
			category    : 'Best Practices',
			recommended : false,
		},
		fixable : null,
	},

	create : function(context) {
		return {
			CallExpression(node) {
				if (isObjectAnIdentifierWithName(node.callee, 'log') && isPropertyAnIdentifierWithName(node.callee, 'info')) {
					context.report(node, 'info is a deprecated log method. Use user or sys instead');
				}
			},
		};
	},
};
