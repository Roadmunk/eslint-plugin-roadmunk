/**
 * @fileoverview Ensures that the require statements are in a specific order
 * @author Watandeep Sekhon
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
const rule       = require('../../../lib/rules/order-require');
const RuleTester = require('eslint').RuleTester;

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
			code :
			`
var JS = require('@roadmunk/jsclass');
var _  = require('lodash');
			`,
			errors : [ {
				message : 'lodash was not required in the correct order',
				type    : 'CallExpression',
			},
			],
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
			errors : [ {
				message : 'pluralize was not required in the correct order',
				type    : 'CallExpression',
			},
			],
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
			errors : [ {
				message : 'models/BaseModel was not required in the correct order',
				type    : 'CallExpression',
			},
			],
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
	],
});
