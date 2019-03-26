/* eslint-disable no-console */
/**
 * @fileoverview Prevent require statements with paths ending in `.js`
 * @author Watandeep Sekhon
 */
'use strict';

const _ = require('lodash');
const { isRequireCall, getModuleNamesFromRequireCall } = require('../helper');

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
		 * Checks if the module being imported is a Literal require statement
		 * @param {ModuleInfo} - See helper.js for type definition
		 */
		function isModuleTypeLiteral(moduleInfo) {
			return moduleInfo.type === 'Literal';
		}

		/**
		 * Returns a string representation of all module names but with the `.js` extension stripped off
		 * @param {ModuleInfo} - See helper.js for type definition
		 * @returns {String}
		 */
		function getFixedModuleNames(moduleInfo) {
			if (isModuleTypeLiteral(moduleInfo) || moduleInfo.type === 'ImportDeclaration') {
				return `'${getFixedModuleName(moduleInfo.moduleNames[0])}'`;
			}

			return `[${moduleInfo.moduleNames.map(moduleName => `'${getFixedModuleName(moduleName)}'`)}]`;
		}

		/**
		 * Strips off the `.js` extension from the module name if it exists
		 * @param {String} moduleName
		 */
		function getFixedModuleName(moduleName) {
			return moduleName.endsWith('.js') ? moduleName.substring(0, moduleName.length - 3) : moduleName;
		}

		function generateReport(moduleInfo, node) {
			if (!_.some(moduleInfo.moduleNames, moduleName => moduleName.endsWith('.js'))) {
				return;
			}

			const fixedModuleNames = getFixedModuleNames(moduleInfo);
			const argToReplace     = node.type === 'ImportDeclaration' ? node.source : node.arguments[0];

			context.report({
				node,
				message : `${node.type === 'ImportDeclaration' ? 'Import' : 'Require'} statements with paths ending in ".js" are not allowed`,
				fix(fixer) {
					return fixer.replaceTextRange([ argToReplace.start, argToReplace.end ], fixedModuleNames);
				},
			});
		}

		return {
			CallExpression(node) {
				if (!isRequireCall(node)) {
					return;
				}

				const moduleNames = getModuleNamesFromRequireCall(node);
				generateReport(moduleNames, node);
			},

			ImportDeclaration(node) {
				const moduleNames = [ node.source.value ];
				generateReport({ type : node.type, moduleNames }, node);
			},
		};
	},
};
