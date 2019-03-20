/**
 * @fileoverview Ensures that the import statements are in a specific order
 * @author Steven McConomy
 */
'use strict';

const { generateReport, registerNode } = require('../order-common');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
	meta : {
		docs : {
			description : 'Ensures that the require statements are in a specific order',
			category    : 'Best Practices',
			recommended : false,
		},
		fixable : 'code',
	},

	create : function(context) {
		const list = [];

		return {
			ImportDeclaration(node) {
				const moduleName = node.source.value;
				registerNode(node, node, moduleName, list);
			},

			'Program:exit' : function() {
				generateReport(context, list, nodeInfo => `${nodeInfo.moduleName} was not imported in the correct order`);
			},
		};
	},
};
