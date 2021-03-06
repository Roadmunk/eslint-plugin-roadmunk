/**
 * @fileoverview Ensures that the require statements are in a specific order
 * @author Watandeep Sekhon
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
const RuleTester = require('eslint').RuleTester;
const rule       = require('../../../lib/rules/order-require');


const getErrorMessage = moduleName => ([ {
	message : `${moduleName} was not required in the correct order`,
	type    : 'CallExpression',
} ]);

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------
const ruleTester = new RuleTester();
ruleTester.run('order-require', rule, {
	valid : [
		`
		var fs = require('fs');
		var async = require('async');
		var lib1 = require('lib/test');
		var lib2 = require('../lib/test');
		var lib2 = require('common/lib/test');
		var lib3 = require('../common/lib/test');
		var models1 = require('models/test');
		var models2 = require('../models/test');
		var models2 = require('common/models/test');
		var models3 = require('../common/models/test');
		var views1 = require('views/test');
		var views2 = require('../views/test');
		var views2 = require('common/views/test');
		var views3 = require('../common/views/test');
		`,
		`
		var _         = require('lodash');
		var pluralize = require('pluralize');
		var JS        = require('@roadmunk/jsclass');
		var Moment    = require('lib/rm-moment');
		var BaseModel = require('models/BaseModel');
		var Msgbox    = require('views/Msgbox');
		`,
	],

	invalid : [
		{
			// Autofixing of this rule doesn't try to align code at all therefore the examples are unindented
			code :
			`
var JS = require('@roadmunk/jsclass');
var _  = require('lodash');
			`,
			errors : getErrorMessage('lodash'),
			output :
			`
var _  = require('lodash');
var JS = require('@roadmunk/jsclass');
			`,
		},
		{
			code :
			`
var _  = require('lodash');
var JS = require('@roadmunk/jsclass');
var pluralize = require('pluralize');
			`,
			errors : getErrorMessage('pluralize'),
			output :
			`
var _  = require('lodash');
var pluralize = require('pluralize');
var JS = require('@roadmunk/jsclass');
			`,
		},
		{
			code :
			`
var _         = require('lodash');
var pluralize = require('pluralize');
var JS        = require('@roadmunk/jsclass');
var Moment    = require('lib/rm-moment');
var Msgbox    = require('views/Msgbox');
var BaseModel = require('models/BaseModel');
			`,
			errors : getErrorMessage('models/BaseModel'),
			output :
			`
var _         = require('lodash');
var pluralize = require('pluralize');
var JS        = require('@roadmunk/jsclass');
var Moment    = require('lib/rm-moment');
var BaseModel = require('models/BaseModel');
var Msgbox    = require('views/Msgbox');
			`,
		},
		{
			code :
			`
var ko          = require('knockout');
var $           = require('jquery');
var BaseBinding = require('./BaseBinding');
var JS          = require('@roadmunk/jsclass');
			`,
			errors : getErrorMessage('@roadmunk/jsclass'),
			output :
			`
var ko          = require('knockout');
var $           = require('jquery');
var JS          = require('@roadmunk/jsclass');
var BaseBinding = require('./BaseBinding');
			`,
		},
		{
			code :
			`
var ko      = require('knockout');
var $       = require('jquery');
var JS      = require('@roadmunk/jsclass');
var Moment  = require('../lib/rm-moment');
var Moments = require('lib/rm-moment');
			`,
			errors : getErrorMessage('lib/rm-moment'),
			output :
			`
var ko      = require('knockout');
var $       = require('jquery');
var JS      = require('@roadmunk/jsclass');
var Moments = require('lib/rm-moment');
var Moment  = require('../lib/rm-moment');
			`,
		},
		{
			code :
			`
var $                  = require('jquery');
var BaseMainModule     = require('./BaseMainModule');
var Msgbox             = require('views/Msgbox');
			`,
			errors : getErrorMessage('views/Msgbox'),
			output :
			`
var $                  = require('jquery');
var Msgbox             = require('views/Msgbox');
var BaseMainModule     = require('./BaseMainModule');
			`,
		},
		{
			code :
			`
var Vue          = require('vue');
var _            = require('lodash');
var template     = require('text!./rm-select.html');
var JS           = require('@roadmunk/jsclass');
var RmFieldMixin = require('../mixins/rm-field');
			`,
			errors : getErrorMessage('@roadmunk/jsclass'),
			output :
			`
var Vue          = require('vue');
var _            = require('lodash');
var JS           = require('@roadmunk/jsclass');
var template     = require('text!./rm-select.html');
var RmFieldMixin = require('../mixins/rm-field');
			`,
		},
		// Example below requires from a directory the plugin doesn't know about (sandbox) so it should go to the bottom
		{
			code :
			`
var SandboxBaseVM = require('sandbox/SandboxBaseVM');
var JS            = require('@roadmunk/jsclass');
			`,
			errors : getErrorMessage('@roadmunk/jsclass'),
			output :
			`
var JS            = require('@roadmunk/jsclass');
var SandboxBaseVM = require('sandbox/SandboxBaseVM');
			`,
		},
		// Require statements inside functions just be left alone
		{
			code :
			`
var JS            = require('@roadmunk/jsclass');

var test = function() {
	var ko         = require('knockout');
	var intrepidVM = require('views/IntrepidVM');
}
			`,
			errors : [],
			output :
			`
var JS            = require('@roadmunk/jsclass');

var test = function() {
	var ko         = require('knockout');
	var intrepidVM = require('views/IntrepidVM');
}
			`,
		},
		{
			code :
			`
var JS            = require('@roadmunk/jsclass');
var SandboxBaseVM = require('sandbox').Test;
			`,
			errors : getErrorMessage('sandbox'),
			output :
			`
var SandboxBaseVM = require('sandbox').Test;
var JS            = require('@roadmunk/jsclass');
			`,
		},
		// Test cases involving comments
		{

			// Autofixing of this rule doesn't try to align code at all therefore the examples are unindented
			code :
			`
var JS = require('@roadmunk/jsclass'); // comment 1
var _  = require('lodash'); // comment 2
			`,
			errors : getErrorMessage('lodash'),
			output :
			`
var _  = require('lodash'); // comment 2
var JS = require('@roadmunk/jsclass'); // comment 1
			`,
		},
	],
});
