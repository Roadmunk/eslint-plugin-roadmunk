/**
 * @fileoverview Prevent usage of lodash's isNull method
 * @author Watandeep Sekhon
 */
"use strict";

const { lodashAutofix } = require('../helper.js');
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta : {
        docs    : {
            description : "Prevents the use of lodash's isNull method",
            category    : "Best Practices",
            recommended : false
        },
        fixable : 'code',
    },

    create : function(context) {
        return {
          MemberExpression(node) {
            if (node.object.name === "_" && node.property.name === "isNull") {
              context.report({
                node,
                message : "Use native JavaScript to check for null",
                fix     : lodashAutofix.bind(null, node, context, 'null'),
              });
            }
          }
        };
    }
};
