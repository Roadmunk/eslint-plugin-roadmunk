/**
 * @fileoverview Ensures that the require statements are in a specific order
 * @author Watandeep Sekhon
 */
'use strict';

const _ = require('lodash');
const { generateReport, registerNode } = require('../order-common');
const { isRequireCallLiteral }         = require('../helper');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function findRootNode(node) {
	let parent = node;

	while (!_.isNil(parent.parent) && _.isNil(parent.parent.body)) {
	  parent = parent.parent;
	}

	return parent;
}

function findVariableDeclaration(node) {
	let parent = node;

	while (parent && parent.type !== 'VariableDeclaration') {
		parent = parent.parent;
	}

	return parent;
}

function isTopLevelDeclaration(node) {
	const declaration = findVariableDeclaration(node);
	return _.get(declaration, 'parent.type') === 'Program';
}

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
			CallExpression(node) {
				if (!isRequireCallLiteral(node) || !isTopLevelDeclaration(node)) {
					return;
				}

				const moduleName = node.arguments[0].value;
				const rootNode   = findRootNode(node);
				registerNode(node, rootNode, moduleName, list);
			},

			'Program:exit' : function() {
				generateReport(context, list, nodeInfo => `${nodeInfo.moduleName} was not required in the correct order`);
			},
		};
	},
};
