/**
 * @fileoverview Ensures that the require statements are in a specific order
 * @author Watandeep Sekhon
 */
'use strict';

const _ = require('lodash');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
const defaultOrder = [ '@roadmunk/', 'lib/', 'common/lib/', 'models/', 'common/models/', 'views/', 'common/views/', 'tests/', 'common/tests', 'text!' ];

function isRequire(node) {
	return node
		&& node.callee.type === 'Identifier'
		&& node.callee.name === 'require'
		&& node.arguments.length === 1
		&& node.arguments[0].type === 'Literal';
}

function isRelativeRequire(moduleName) {
	return moduleName.startsWith('.');
}

function isSubModule(moduleName) {
	return moduleName.includes('/');
}

function computeRank(name) {
	// Find which item in order matches the module name
	const match = defaultOrder.filter(order => name.includes(order));
	let rank = 0; // If no match is found, we will assume that it's a top level require


	if (match.length === 0) {
		// We don't know about this so just push it to the bottom
		// Multiply by two because each match can have two different ranks (one for relative requires)
		if (isSubModule(name)) {
			rank = (defaultOrder.length + 1) * 2;
		}
		// Relative requires belong at the bottom, even under the unknown requires
		else if (isRelativeRequire(name)) {
			rank = ((defaultOrder.length + 1) * 2) + 2;
		}

	}
	else {
		// If module name matches multiple things then take the highest rank
		rank = defaultOrder.indexOf(match[match.length - 1]) + 1;

		// Multi by two to accomodate for relative requires they will be slotted after this (rank + 1)
		rank *= 2;

		// Place relative requires at the end
		if (isRelativeRequire(name)) {
			rank++;
		}
	}

	return rank;
}

function registerNode(node, name, imported) {
	const rank = computeRank(name);
	imported.push({ name, rank, node });
}

function detectOutOfOrder(imported) {
	let maxRank = 0;

	// "imported" is an array corresponding to require statements. Each element in the array has a rank which hints to us about where it needs to be
	// Eg: If @roadmunk/test module has rank 1 & models/test has rank 2 & @roadmunk/test comes after models then it'll be added to outOfOrderNodes
	const outOfOrderNodes = imported.filter(function(importedModule) {
		// We found something that has been required lower than where it should have been
		if (importedModule.rank < maxRank) {
			return true;
		}

		maxRank = importedModule.rank;
		return false;
	});

	return outOfOrderNodes;
}

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

function isTopLevelRequire(node) {
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
		const imported = [];

		function report(nodeInfo, higherRankedNodeInfo) {
			context.report({
				node    : nodeInfo.node,
				message : `${nodeInfo.name} was not required in the correct order`,
				fix     : function(fixer) {
					const sourceCode = context.getSourceCode();

					// firstRoot refers to the node that is out of order. We will move this to another location
					const firstRoot      = findRootNode(nodeInfo.node);
					const firstRootStart = firstRoot.start;
					let firstRootEnd     = firstRoot.end;
					const comments       = context.getComments(firstRoot);

					// If a trailing there is a trailing comment then change the firstRootEnd to that
					if (comments.trailing.length > 0) {
						comments.trailing.forEach(comment => {
							if (comment.loc.start.line === firstRoot.loc.end.line) {
								firstRootEnd = Math.max(firstRootEnd, comment.end);
							}
						});
					}

					const oldCode        = `${sourceCode.text.substring(firstRootStart, firstRootEnd)}\n`;

					// secondRoot refers to the node above which the firstRoot belongs
					const secondRoot      = findRootNode(higherRankedNodeInfo.node);
					const secondRootStart = secondRoot.start;
					const secondRootEnd   = secondRoot.end;
					const newCode         = `${sourceCode.text.substring(secondRootStart, secondRootEnd)}`;

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
				if (!isRequire(node) || !isTopLevelRequire(node)) {
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
