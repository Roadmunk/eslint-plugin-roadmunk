/**
 * @fileoverview Align assignment statements on their equals signs
 * @author Steven McConomy
 */
'use strict';
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
	meta : {
		docs : {
			description : 'Align assignment statements on their equals signs',
			category    : 'Best Practices',
			recommended : false,
		},
		fixable : 'code',
	},

	create : function(context) {
		return {
			BlockStatement : checkFunction,
			Program        : checkFunction,
		};

		function checkFunction(node) {
			// Make blocks out of statements that could be aligned
			const alignBlocks = [];
			let blockEnd      = null;
			const sourceCode  = context.getSourceCode();
			node.body.forEach((childNode, index) => {
				if (
					// Make sure the node actually an assignment
					(
						childNode.type === 'VariableDeclaration'
						|| (childNode.type === 'ExpressionStatement' && childNode.expression.type === 'AssignmentExpression')
					)
					// Make sure there are no comments before the node on the same line as the node
					&& (sourceCode.getCommentsBefore(childNode).every(comment => comment.loc.end.line !== childNode.loc.start.line))

					// Make sure node is not on the same line that the block starts on
					&& (node.type !== 'BlockStatement' || node.loc.start.line !== childNode.loc.start.line)

					// Make sure node is all on one line
					&& (childNode.loc.start.line === childNode.loc.end.line)

					// Make sure node is on its own line
					&& (index + 1 >= node.body.length || node.body[index + 1].loc.start.line > childNode.loc.end.line)
					&& (index - 1 < 0 || node.body[index - 1].loc.end.line < childNode.loc.start.line)
				) {
					// If this node is right after the previous one, it should be aligned in the same block
					// so push it into the last align block in the list
					if (childNode.loc.start.line === blockEnd + 1) {
						alignBlocks[alignBlocks.length - 1].push(childNode);
					}
					// Otherwise it is time to start a new block!
					else {
						alignBlocks.push([ childNode ]);
					}
					blockEnd = childNode.loc.start.line;
				}
			});

			// Figure out where the equals sign should go
			const equalsPositions = [];
			alignBlocks.forEach((block, index) => {
				equalsPositions[index] = 0;
				block.forEach(blockNode => {
					let tokenBeforeEquals = null;
					if (blockNode.type === 'VariableDeclaration') {
						tokenBeforeEquals = blockNode.declarations[0].id;
					}
					else {
						tokenBeforeEquals = blockNode.expression.left;
					}
					equalsPositions[index] = Math.max(tokenBeforeEquals.loc.end.column + 1, equalsPositions[index]);
				});
			});

			// Make sure all the equals signs are in the right places
			alignBlocks.forEach((block, index) => {
				const equalsPosition = equalsPositions[index];
				block.forEach(blockNode => {
					const currentEqualsPos = sourceCode.getText(blockNode).indexOf('=') + blockNode.loc.start.column;
					const numSpacesNeeded  = equalsPosition - currentEqualsPos;
					if (numSpacesNeeded !== 0) {
						context.report({
							node,
							loc : {
								start : {
									line   : blockNode.loc.start.line,
									column : currentEqualsPos + blockNode.loc.start.column,
								},
								end : {
									line   : blockNode.loc.start.line,
									column : currentEqualsPos + blockNode.loc.start.column + 1,
								},
							},
							message : 'Assignments should be aligned',
							fix(fixer) {
								let tokenBeforeEquals = null;
								if (blockNode.type === 'VariableDeclaration') {
									tokenBeforeEquals = blockNode.declarations[0].id;
								}
								else {
									tokenBeforeEquals = blockNode.expression.left;
								}
								if (numSpacesNeeded > 0) {
									return fixer.insertTextAfter(tokenBeforeEquals, [ ...new Array(numSpacesNeeded + 1) ].join(' '));
								}
								return fixer.removeRange([ tokenBeforeEquals.end, tokenBeforeEquals.end - numSpacesNeeded ]);
							},
						});
					}
				});
			});
		}
	},
};
