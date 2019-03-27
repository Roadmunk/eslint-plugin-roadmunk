/* eslint-disable no-console */
/**
 * @fileoverview Prevent require statements with paths ending in `.js`
 * @author Watandeep Sekhon
 */
'use strict';

const _ = require('lodash');
const { isRequireCall, getLiteralModuleNamesFromRequireCall } = require('../helper');

module.exports = {
	meta : {
		docs : {
			description : 'Prevent require statements with paths ending in `.js`',
			category    : 'Best Practices',
			recommended : false,
		},
		fixable : 'code',
	},

	create : function(context) {
		/**
		 * Returns a string representation of all module names but with the `.js` extension stripped off
		 * @param {ASTNode[]} - An array of all the nodes that have values ending with `.js`
		 * @returns {String}
		 */
		function getFixedNodes(offendingNodes) {
			return _.map(offendingNodes, node => ({
				start     : node.start,
				end       : node.end,
				fixedName : `'${getFixedModuleName(node.value)}'`,
			}));
		}

		/**
		 * Strips off the `.js` extension from the module name if it exists
		 * @param {String} moduleName
		 */
		function getFixedModuleName(moduleName) {
			return moduleName.endsWith('.js') ? moduleName.substring(0, moduleName.length - 3) : moduleName;
		}

		function generateReport(moduleNodes, node) {
			const offendingNodes = _.filter(moduleNodes, node => node.value.endsWith('.js'));

			if (_.isEmpty(offendingNodes)) {
				return;
			}

			const fixedNodes = getFixedNodes(offendingNodes);

			context.report({
				node,
				message : `${node.type === 'ImportDeclaration' ? 'Import' : 'Require'} statements with paths ending in ".js" are not allowed`,
				fix(fixer) {
					return _.map(fixedNodes, node => fixer.replaceTextRange([ node.start, node.end ], node.fixedName));
				},
			});
		}

		return {
			CallExpression(node) {
				if (!isRequireCall(node)) {
					return;
				}

				const moduleNodes = getLiteralModuleNamesFromRequireCall(node);
				generateReport(moduleNodes, node);
			},

			ImportDeclaration(node) {
				const nodes = [ node.source ];
				generateReport(nodes, node);
			},
		};
	},
};
