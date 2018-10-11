/**
 * @fileoverview Enforces a specified max length on log messages
 * @author Watandeep Sekhon
 */
'use strict';

const _ = require('lodash');
const { isPropertyAnIdentifierWithName, isObjectAnIdentifierWithName } = require('../helper.js');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
const logMethods = [ 'info', 'debug', 'warn', 'error', 'command' ];
const MAX_LENGTH = 50;

// TODO: Use schema to pass in the max length
module.exports = {
	meta : {
		docs : {
			description : 'Enforces a specified max length on log messages',
			category    : 'Fill me in',
			recommended : false,
		},
		fixable : null,
		schema  : [],
	},

	create : function(context) {
		return {
			CallExpression(node) {
				const callee = node.callee;
				const argument = _.get(node, 'arguments[0].value');

				if (!argument) {
					return;
				}

				if (isObjectAnIdentifierWithName(callee, 'log')
					&& _.some(logMethods, method => isPropertyAnIdentifierWithName(node.callee, method))
					&& typeof argument === 'string' && argument.length > MAX_LENGTH
				) {
					context.report(node, 'Log messages cannot be more than 50 characters long');
				}
			},
		};
	},
};
