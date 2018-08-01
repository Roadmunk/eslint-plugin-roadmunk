/**
 * @fileoverview Ensures that the require statements are in a specific order
 * @author Watandeep Sekhon
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------


const defaultOrder = [ '@roadmunk', 'lib', 'common/lib', 'models', 'common/models', 'views', 'common/views', 'tests' ];

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
	let rank    = 0;

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
	let maxRank           = 0;

	imported.filter(function(importedModule) {
		if (importedModule.rank < maxRank) {
			outOfOrderNodes.push(importedModule);
		}
		else {
			maxRank = importedModule.rank;
		}
	});

	return outOfOrderNodes;
}

function findRootNode(node) {
	let parent = node;

	while (parent.parent != null && parent.parent.body == null) {
	  parent = parent.parent;
	}

	return parent;
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
		const imported = [];

		function report(nodeInfo, higherRankedNodeInfo) {
			const sourceCode = context.getSourceCode();

			// firstRoot refers to the node that is out of order. We will move this to another location
			const firstRoot      = findRootNode(nodeInfo.node);
			const firstRootStart = firstRoot.start;
			const firstRootEnd   = firstRoot.end;
			const oldCode        = `${sourceCode.text.substring(firstRootStart, firstRootEnd)}\n`;

			// secondRoot refers to the node abov which the firstRoot belongs
			const secondRoot      = findRootNode(higherRankedNodeInfo.node);
			const secondRootStart = secondRoot.start;
			const secondRootEnd   = secondRoot.end;
			const newCode         = `${sourceCode.text.substring(secondRootStart, secondRootEnd)}`;

			context.report({
				node    : nodeInfo.node,
				message : `${nodeInfo.name} was not required in the correct order`,
				fix     : function(fixer) {
					// Remove the first root since it'll be moved to another place anyway
					// Removing until firstRootEnd + 1 to avoid leaving behind a blank line
					const removeNode = fixer.removeRange([ firstRootStart, firstRootEnd + 1 ]);

					// Replace the second root's range with autofixed code
					const fix = fixer.replaceTextRange([ secondRootStart, secondRootEnd ], oldCode + newCode);

					// Since we're doing two things in this autofix return both of them
					return [ fix, removeNode ];
				},
			});
		}

		function generateReport(imported) {
			const outOfOrderNodes = detectOutOfOrder(imported);
			if (!outOfOrderNodes.length) {
				return;
			}

			// For each out of order require, find the one before which it belongs
			outOfOrderNodes.forEach(outOfOrder => {
				const found = imported.find(importedModule => importedModule.rank > outOfOrder.rank);
				report(outOfOrder, found);
			});
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
			},
		};
	},
};