const _ = require('lodash');

/**
 * @typedef {Object} ImportData
 * @property {ASTNode} node
 * @property {ASTNode} rootNode
 * @property {String}  moduleName
 * @property {Number}  rank
 */

const defaultOrder = [
	'@roadmunk/',
	'lib/',
	'common/lib/',
	'models/',
	'common/models/',
	'views/',
	'common/views/',
	'tests/',
	'common/tests',
	'text!',
];

/**
 * @param {ASTNode}      node
 * @param {ASTNode}      rootNode
 * @param {String}       moduleName
 * @param {ImportData[]} list
 */
function registerNode(node, rootNode, moduleName, list) {
	const rank = computeRank(moduleName);
	list.push({ node, rootNode, moduleName, rank });
}

/**
 * @param {String} moduleName
 * @returns {Boolean}
 */
function isRelativeRequire(moduleName) {
	return moduleName.startsWith('.');
}

/**
 * @param {String} moduleName
 * @returns {Boolean}
 */
function isSubModule(moduleName) {
	return moduleName.includes('/');
}

/**
 * @param {String} moduleName
 * @returns {Number}
 */
function computeRank(moduleName) {
	// Find which item in order matches the module name
	const match = defaultOrder.filter(order => moduleName.includes(order));
	let rank    = 0; // If no match is found, we will assume that it's a top level require

	if (match.length === 0) {
		// We don't know about this so just push it to the bottom
		// Multiply by two because each match can have two different ranks (one for relative requires)
		if (isSubModule(moduleName)) {
			rank = (defaultOrder.length + 1) * 2;
		}
		// Relative requires belong at the bottom, even under the unknown requires
		else if (isRelativeRequire(moduleName)) {
			rank = ((defaultOrder.length + 1) * 2) + 2;
		}

	}
	else {
		// If module name matches multiple things then take the highest rank
		rank = defaultOrder.indexOf(match[match.length - 1]) + 1;

		// Multi by two to accommodate for relative requires they will be slotted after this (rank + 1)
		rank *= 2;

		// Place relative requires at the end
		if (isRelativeRequire(moduleName)) {
			rank++;
		}
	}

	return rank;
}

/**
 * @callback MessageFunction
 * @param {ImportData} nodeInfo
 * @returns {String}
 */

/**
 * @param {RuleContext} context
 * @param {ImportData} nodeInfo
 * @param {ImportData} higherRankedNodeInfo
 * @param {MessageFunction} messageFunc
 */
function reportOutOfOrderNode(context, nodeInfo, higherRankedNodeInfo, messageFunc) {
	context.report({
		node    : nodeInfo.node,
		message : messageFunc(nodeInfo),
		fix     : fixer => {
			const sourceCode = context.getSourceCode();

			// firstRoot refers to the node that is out of order. We will move this to another location
			const firstRoot      = nodeInfo.rootNode;
			const firstRootStart = firstRoot.start;
			let firstRootEnd     = firstRoot.end;
			const comments       = context.getComments(firstRoot);

			// If there is a trailing comment then change the firstRootEnd to that
			if (comments.trailing.length > 0) {
				comments.trailing.forEach(comment => {
					if (comment.loc.start.line === firstRoot.loc.end.line) {
						firstRootEnd = Math.max(firstRootEnd, comment.end);
					}
				});
			}

			const oldCode = `${sourceCode.text.substring(firstRootStart, firstRootEnd)}\n`;

			// secondRoot refers to the node above which the firstRoot belongs
			const secondRoot      = higherRankedNodeInfo.rootNode;
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

/**
 * @param {RuleContext}     context
 * @param {ImportData[]}    list
 * @param {MessageFunction} messageFunc
 */
function generateReport(context, list, messageFunc) {
	const outOfOrderNodes = detectOutOfOrder(list);
	if (!outOfOrderNodes.length) {
		return;
	}

	// For each out of order require, find the one before which it belongs
	outOfOrderNodes.forEach(outOfOrder => {
		const found = list.find(importedModule => importedModule.rank > outOfOrder.rank);
		reportOutOfOrderNode(context, outOfOrder, found, messageFunc);
	});
}

/**
 * @param {ImportData[]} list
 * @returns {ImportData[]} modules that are not in the right order
 */
function detectOutOfOrder(list) {
	let maxRank           = 0;
	const outOfOrderNodes = [];

	// "list" is an array corresponding to require statements. Each element in the array has a rank
	// which hints to us about where it needs to be
	// Eg: If @roadmunk/test module has rank 1 & models/test has rank 2 & @roadmunk/test comes after
	// models then it'll be added to outOfOrderNodes
	_.forEach(list, importedModule => {
		if (importedModule.rank < maxRank) {
			outOfOrderNodes.push(importedModule);
		}
		else {
			maxRank = importedModule.rank;
		}
	});

	return outOfOrderNodes;
}

module.exports = {
	registerNode,
	generateReport,
};
