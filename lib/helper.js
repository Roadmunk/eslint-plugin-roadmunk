"use strict";

module.exports = {
  /**
   * node : The node on which lint rule has fired. (MemberExpression)
   * context : context object
   * type : the type of fix to apply ('null' or 'undefined')
   * fixer : the fixer object which has helper methods to apply code fixes
   */
  lodashAutofix : function (node, context, type, fixer) {
    /**
     * node is MemberExpression (_.isNull or _.isUndefined)
     * node.parent is CallExpression (_.isNull() or _.isUndefined())
     */

     //The scope to which auto fix will be applied. Most of the times, this will be the call expression
     //unless it's preceded by UnaryExpression(s)
     let scope = node.parent;

    // If initial scope isn't a call expression something isn't right.
    // Shouldn't happen but let's be defensive
    // Also, if more than one argument was passed to isNull then don't attempt to autofix
    if (scope.type !== 'CallExpression' || scope.arguments.length > 1) {
      return;
    }

    // Grab the argument that was passed to the isNull function
    const arg = scope.arguments[0];
    let negate = false;

    // Call expression's parent influences the way autofixing works.
    // If it is a UnaryExpression with operator ! then our fix has to check for inequality
    // Unless it is preceded by another ! operator
    if (isUnaryExpression(scope, '!')) {
      negate = !negate;
      scope = scope.parent;
    }

    if (isUnaryExpression(scope, '!')) {
        negate = !negate;
        scope = scope.parent;
    }

    const fixToAppend = negate ? ` !== ${type}` : ` === ${type}`;

    // Get an instance of `SourceCode` so we can convert the argument to source code
    // & append the fix to it
    const sourceCode = context.getSourceCode();
    let fixedCode = sourceCode.getText(arg) + fixToAppend;

    // If the scope's parent is a BinaryExpression (eg ===) or LogicalExpression (eg &&)
    // then wrap the fixedCode in brackets to avoid inadvertently changing the result
    // Eg: We don't want to turn `testVar === _.isNull(5)` to `testVar === 5 === null`
    // It should be turned into `testVar === (5 === null)`
    if (scope.parent.type === 'BinaryExpression' || scope.parent.type === 'LogicalExpression') {
      fixedCode = `(${fixedCode})`;
    }

    return fixer.replaceText(scope, fixedCode);
  }
}

function isUnaryExpression(scope, operator) {
  return scope.parent.type === 'UnaryExpression' && scope.parent.operator === operator;
}