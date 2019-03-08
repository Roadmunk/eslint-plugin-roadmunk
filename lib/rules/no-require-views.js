/**
 * @fileoverview Prevent require statements from requiring views from outside the 'views/' folder
 * @author Brandon Mubarak
 */
'use strict';

const _             = require('lodash');
const { isRequire } = require('../helper.js');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

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
				if (!isRequire(node)) {
					return;
				}

				const moduleName = node.arguments[0].value;
				if (_.includes(moduleName, 'views/')) {
					context.report({
						node,
						message : 'Use an on-demand require statement to import views',
					});
				}
			},
		};
	},
};
