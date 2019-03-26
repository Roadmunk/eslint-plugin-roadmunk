/**
 * @fileoverview Prevents usage of _.isUndefined method
 * @author Watandeep Sekhon
 */
'use strict';

const { lodashAutofix, hasPropsWithValues } = require('../helper');
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
	meta : {
		docs : {
			description : "Prevents the use of lodash's isUndefined method",
			category    : 'Best Practices',
			recommended : false,
		},
		fixable : 'code',
	},

	create : function(context) {
		return {
			MemberExpression(node) {
				if (hasPropsWithValues(node, { 'object.name' : '_', 'property.name' : 'isUndefined' })) {
					context.report({
						node,
						message : 'Use native JavaScript to check for undefined',
						fix     : lodashAutofix.bind(null, node, context, 'undefined'),
					});
				}
			},
		};
	},
};
