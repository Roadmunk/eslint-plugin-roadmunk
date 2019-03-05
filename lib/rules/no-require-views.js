/**
 * @fileoverview Prevent require statements from requiring views from outside the 'views/' folder
 * @author Brandon Mubarak
 */
'use strict';

const _ = require('lodash');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function isNonDemandRequire(node) {
	return node
		&& node.callee.type === 'Identifier'
		&& node.callee.name === 'require'
		&& node.arguments.length === 1
		&& node.arguments[0].type === 'Literal';
}

module.exports = {
	meta : {
		type : 'suggestion',
		docs : {
			description : 'Prevent require statements from requiring views from outside the \'views/\' folder',
			category    : 'Best Practices',
			recommended : true,
		},
	},
	create : function(context) {
		return {
			CallExpression(node) {
				if (!isNonDemandRequire(node)) {
					return;
				}

				const moduleName = node.arguments[0].value;
				if (_.includes(moduleName, 'views/')) {
					context.report({
						node,
						message : 'Prevent importing entire \'views\'. Instead, try on-demand requiring.',
					});
				}
			},
		};
	},
};
