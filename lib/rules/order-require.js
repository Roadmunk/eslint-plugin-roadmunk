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
		else {
			maxRank = importedModule.rank;
		}
	});

	return outOfOrderNodes;
}

// function sortByRank(imported) {
// 	function compare(a, b) {
// 		if (a.rank < b.rank) {
// 			return -1;
// 		}

// 		if (a.rank > b.rank) {
// 			return 1;
// 		}

// 		return 0;
// 	  }

// 	  imported.sort(compare);
// }

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

			const firstRoot      = findRootNode(nodeInfo.node);
			const firstRootStart = firstRoot.start;
  			const firstRootEnd   = firstRoot.end;

			const secondRoot      = findRootNode(higherRankedNodeInfo.node);
			const secondRootStart = secondRoot.start;
			const secondRootEnd   = secondRoot.end;

			let newCode = '';

			// Append spaces
			for (let index = 0; index < nodeInfo.node.loc.start.column; index++) {
				// newCode += ' ';
			}

			newCode += sourceCode.text.substring(secondRootStart, secondRootEnd);

			const testCode = sourceCode.text.substring(firstRootStart, firstRootEnd);

			console.log({ firstRootStart, firstRootEnd, secondRootStart, secondRootEnd });
			console.log({ newCode, testCode });

			context.report({
				node    : nodeInfo.node,
				message : `${nodeInfo.name} was not required in the correct order`,
				fix     : function(fixer) {
					// const node = nodeInfo.node;
					const anotherFix = fixer.remove(firstRoot);

					const oldCode = `${sourceCode.text.substring(firstRootStart, firstRootEnd)}\n`;

					// if(nodeInfo.node.loc.start.line - 1 !== higherRankedNodeInfo.node.loc.start.line) {
					// 	console.log('is this real')
					// 	let insertLineBreak = false;
					// 	const test1 = sourceCode.getLastToken(higherRankedNodeInfo.node);
					// 	let test = sourceCode.getTokenAfter(test1);
					// 	while(test && test.type === 'Punctuator'){ //should be a whi
					// 		test = sourceCode.getTokenAfter(test);
					// 	}

					// 	insertLineBreak = test && test.loc.start.line !== higherRankedNodeInfo.node.loc.start.line;

					// 	console.log({ testing : nodeInfo.node.loc.start, other : higherRankedNodeInfo.node.loc.start.line });

					// 	if (insertLineBreak) {
					// oldCode += '\n';
					// 	}
					// }

					// Replacing until secondRootEnd + 1 because for some reason we get an empty line after this
					const fix = fixer.replaceTextRange([ secondRootStart, secondRootEnd + 1 ], oldCode + newCode);

					// const tokenAfter = context.getTokenAfter(secondRoot);
					console.log('----------- WND ___________');
					return [ fix, anotherFix ];
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
