/**
 * @fileoverview Ensures that the require statements are in a specific order
 * @author Watandeep Sekhon
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------


const defaultOrder = [ 'lib', 'common/lib', 'views', 'common/views', 'models', 'common/models' ];

function isRequire(node) {
	return node
		&& node.callee.type === 'Identifier'
		&& node.callee.name === 'require'
		&& node.arguments.length === 1
		&& node.arguments[0].type === 'Literal';
}

function isVariableDeclarator(node) {
	return node && node.type === 'VariableDeclarator';
}

function computeRank(name) {
	// Find which item in order matches the module name
	const match = defaultOrder.filter(order => name.includes(order));
	let rank = 0;

	// If no match was found, assume that it's a top level require
	if (!match) {
		rank = 1;
	}

	// If module name matches multiple things then take the highest rank
	rank = defaultOrder.indexOf(match[match.length - 1]) + 1;

	return rank;
}

function registerNode(node, name, imported) {
	const rank = computeRank(name);
	imported.push({ name, rank, node });
}

function detectOutOfOrder(imported) {
	const outOfOrderNodes = [];
	let maxRank = 0;

	imported.filter(function(importedModule) {
		if (importedModule.rank < maxRank) {
			outOfOrderNodes.push(importedModule);
		}

		maxRank = importedModule.rank;
	});

	return outOfOrderNodes;
}


module.exports = {
	meta : {
		docs : {
			description : 'Ensures that the require statements are in a specific order',
			category    : 'Fill me in',
			recommended : false,
		},
		fixable : null,
	},
	create : function(context) {
		let imported = [];

		function report(nodeInfo) {
			context.report(nodeInfo.node, `${nodeInfo.name} was not required in the correct order`);
		}

		function generateReport(imported) {
			const outOfOrderNodes = detectOutOfOrder(imported);
			if (!outOfOrderNodes.length) {
				return;
			}

			outOfOrderNodes.forEach(report);
		}

		return {
			CallExpression(node) {
				if (!isRequire(node) || !isVariableDeclarator(node.parent)) {
					return;
				}

				const moduleName = node.arguments[0].value;
				registerNode(node, moduleName, imported);
			},
			'Program:exit' : function() {
				generateReport(imported);
				imported = [];
			},
		};
	},
};
