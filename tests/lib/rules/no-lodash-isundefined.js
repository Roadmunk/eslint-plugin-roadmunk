/**
 * @fileoverview Prevents usage of _.isUndefined method
 * @author Watandeep Sekhon
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule       = require("../../../lib/rules/no-lodash-isundefined");
const RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

const errors = [{
    message : "Use native JavaScript to check for undefined",
    type    : "MemberExpression"
}];

ruleTester.run("no-lodash-undefined", rule, {
    valid: [
      "valid = 5;",
      "test2 = function(opts) { return _.forEach([1, 2], function(v){ return v + 1}) }",
      "test = function() { if(test){ return; } }",
      "obj = { method1 : function(){} }",
      "test = function() { return test ? 1 : 2 }",
      "test = true ? 1 : 2",
      "test = test2 === undefined",
      "test = test2 !== undefined",
      "test = test2 == undefined",
      "test = test2 != undefined",
      "test2 = typeof test === 'undefined'",
      "test2 = typeof test == 'undefined'",
      "test2 = typeof test !== 'undefined'",
      "test2 = typeof test != 'undefined'",
    ],

    invalid: [
        {
            code: "test = _.isUndefined(5)",
            errors,
            output: "test = 5 === undefined",
        },
        {
            code: "test = !!_.isUndefined(5)",
            errors,
            output: "test = 5 === undefined",
        },
        {
            code: "test = !_.isUndefined(5)",
            errors,
            output: "test = 5 !== undefined",
        },
        {
            code: "test = _.isUndefined(5) ? 1 : 2",
            errors,
            output: "test = 5 === undefined ? 1 : 2",
        },
        {
            code: "test = !!_.isUndefined(5) ? 1 : 2",
            errors,
            output: "test = 5 === undefined ? 1 : 2",
        },
        {
            code: "test = !_.isUndefined(5) ? 1 : 2",
            errors,
            output: "test = 5 !== undefined ? 1 : 2",
        },
        {
            code: "test = _.isUndefined(true)",
            errors,
            output : "test = true === undefined",
        },
        {
            code: "test = !_.isUndefined(true)",
            errors,
            output : "test = true !== undefined",
        },
        {
            code: "test = _.isUndefined(false) ? 1 : 2",
            errors,
            output: "test = false === undefined ? 1 : 2",
        },
        {
            code: "var condition = null; test = _.isUndefined(condition) ? 1 : 2",
            errors,
            output: "var condition = null; test = condition === undefined ? 1 : 2",
        },
        {
            code: "var condition = null; test = !_.isUndefined(condition) ? 1 : 2",
            errors,
            output: "var condition = null; test = condition !== undefined ? 1 : 2",
        },
        {
            code: "var condition = {}; test = _.isUndefined(condition) ? 1 : 2",
            errors,
            output: "var condition = {}; test = condition === undefined ? 1 : 2",
        },
        {
            code: "var condition = {}; test = !!_.isUndefined(condition) ? 1 : 2",
            errors,
            output: "var condition = {}; test = condition === undefined ? 1 : 2",
        },
        {
            code: "var condition = function(){}; test = _.isUndefined(condition) ? 1 : 2",
            errors,
            output: "var condition = function(){}; test = condition === undefined ? 1 : 2",
        },
        //Testing object methods
        {
            code: "obj = { method1 : function(){ _.isUndefined(5) ? 1 : 2 } }",
            errors,
            output: "obj = { method1 : function(){ 5 === undefined ? 1 : 2 } }",
        },
        {
            code: "obj = { method1 : function(){ !!_.isUndefined(5) ? 1 : 2 } }",
            errors,
            output: "obj = { method1 : function(){ 5 === undefined ? 1 : 2 } }",
        },
        {
            code: "obj = { method1 : function(){ !_.isUndefined(5) ? 1 : 2 } }",
            errors,
            output: "obj = { method1 : function(){ 5 !== undefined ? 1 : 2 } }",
        },
        {
            code: "obj = { method1 : function(){ _.isUndefined('5') ? 1 : 2 } }",
            errors,
            output: "obj = { method1 : function(){ '5' === undefined ? 1 : 2 } }",
        },
        {
            code: "obj = { method1 : function(){ _.isUndefined([1,2]) ? 1 : 2 } }",
            errors,
            output: "obj = { method1 : function(){ [1,2] === undefined ? 1 : 2 } }",
        },
        {
            code: "obj = { method1: null, method2 : function(){ _.isUndefined(this.method1) ? 1 : 2 } }",
            errors,
            output: "obj = { method1: null, method2 : function(){ this.method1 === undefined ? 1 : 2 } }",
        },
        {
            code: "obj = { method1: null, method2 : function(){ !_.isUndefined(this.method1) ? 1 : 2 } }",
            errors,
            output: "obj = { method1: null, method2 : function(){ this.method1 !== undefined ? 1 : 2 } }",
        },
        {
            code: "obj = { method1: null, method2 : function(){ var val = _.isUndefined(this.method1) ? 1 : 2; var val2 = null; } }",
            errors,
            output: "obj = { method1: null, method2 : function(){ var val = this.method1 === undefined ? 1 : 2; var val2 = null; } }",
        },
        {
            code: "obj = { method1: null, method2 : function(){ var val = !!_.isUndefined(this.method1) ? 1 : 2; var val2 = null; } }",
            errors,
            output: "obj = { method1: null, method2 : function(){ var val = this.method1 === undefined ? 1 : 2; var val2 = null; } }",
        },
        {
            code: "obj = { outer : { inner : function(arg){ return _.isUndefined(arg); } } }",
            errors,
            output: "obj = { outer : { inner : function(arg){ return arg === undefined; } } }",
        },
        //Testing functions
        {
            code: "test2 = function(opt) { return _.isUndefined(opt) }",
            errors,
            output : "test2 = function(opt) { return opt === undefined }"
        },
        {
            code: "test2 = function() { if(_.isUndefined(opt)) { return false; } }",
            errors,
            output: "test2 = function() { if(opt === undefined) { return false; } }",
        },
        {
            code: "test2 = function() { return function(){ if(_.isUndefined(opt)) { return false; } } }",
            errors,
            output: "test2 = function() { return function(){ if(opt === undefined) { return false; } } }",
        },
        {
          code: "test = function(){ var test2 = {}; _.isUndefined(test2) ? 1 : 2 }",
          errors,
          output: "test = function(){ var test2 = {}; test2 === undefined ? 1 : 2 }"
        },
        {
          code: "test = function(test2){ if(_.isUndefined(test2)) { return 1 } }",
          errors,
          output : "test = function(test2){ if(test2 === undefined) { return 1 } }",
        },
        {
          code: "test = function(){ if(_.isUndefined([])) { return 1 } }",
          errors,
          output : "test = function(){ if([] === undefined) { return 1 } }",
        },
        // Mixing in logical & binary expressions
        {
            code: "test = testVar === _.isUndefined(5)",
            errors,
            output: "test = testVar === (5 === undefined)",
        },
        {
            code: "test = testVar !== _.isUndefined(5)",
            errors,
            output: "test = testVar !== (5 === undefined)",
        },
        {
            code: "test = testVar !== !_.isUndefined(5)",
            errors,
            output: "test = testVar !== (5 !== undefined)",
        },
        {
            code: "test = testVar !== !!_.isUndefined(5)",
            errors,
            output: "test = testVar !== (5 === undefined)",
        },
        {
            code: "test = testVar === _.isUndefined(testVar2)",
            errors,
            output: "test = testVar === (testVar2 === undefined)",
        },
        {
            code: "test = _.isUndefined(5) === testVar",
            errors,
            output: "test = (5 === undefined) === testVar",
        },
        {
            code: "test = !_.isUndefined(5) === testVar",
            errors,
            output: "test = (5 !== undefined) === testVar",
        },
        {
            code: "test = !!_.isUndefined(5) === testVar",
            errors,
            output: "test = (5 === undefined) === testVar",
        },
        {
          code : "test4 = _.isUndefined(5) && 8 ? true : false;",
          errors,
          output : "test4 = (5 === undefined) && 8 ? true : false;"
        },
        {
          code : "test4 = 8 && _.isUndefined(5) ? true : false;",
          errors,
          output : "test4 = 8 && (5 === undefined) ? true : false;"
        },
        //Confirm that if the user stores isUndefined in a variable, autofix will not be applied
        {
          code : "test = _.isUndefined",
          errors,
          output : "test = _.isUndefined"
        },
        {
          code : "test = !_.isUndefined",
          errors,
          output : "test = !_.isUndefined"
        },
    ]
});