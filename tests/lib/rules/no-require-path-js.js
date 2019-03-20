/**
 * @fileoverview Prevent require statements with paths ending in `.js`
 * @author Watandeep Sekhon
 */
'use strict';

const RuleTester = require('eslint').RuleTester;
const rule       = require('../../../lib/rules/no-require-path-js');

const ruleTester = new RuleTester({ parserOptions : { ecmaVersion : 2017, sourceType : 'module' } });

const generateErrorsObject = isRequire => [ {
	message : `${isRequire ? 'Require' : 'Import'} statements with paths ending in ".js" are not allowed`,
	type    : isRequire ? 'CallExpression' : 'ImportDeclaration',
} ];

const requireErrors = generateErrorsObject(true);
const importErrors  = generateErrorsObject(false);

ruleTester.run('no-require-path-js', rule, {
	valid : [
		"var CustomProperty = require('models/CustomProperty.List');",
		"var template = require('./template.html');",
		"var CustomProperty = require('models/CustomProperty.List.ejs');",
		"require('models/CustomProperty.List');",
		"require('./template.html');",
		"require('models/CustomProperty.List.ejs');",
		"import fs from 'fs';",
		"import template from './template.html';",
		"import CustomProperty from 'models/CustomProperty.List.ejs';",
		"import CustomProperty from 'models/CustomProperty.List';",
		"require([ 'models/CustomProperty', 'models/Account' ], (customProperty, account) => false );",
	],

	invalid : [
		{
			code   : "require('./models/Account.js');",
			output : "require('./models/Account');",
			errors : requireErrors,
		},
		{
			code   : "var Account = require('./models/Account.js');",
			output : "var Account = require('./models/Account');",
			errors : requireErrors,
		},
		{
			code   : "require(['./models/Account.js'], foo => bar);",
			output : "require(['./models/Account'], foo => bar);",
			errors : requireErrors,
		},
		{
			code   : "require(['./models/Account.js', './models/User'], foo => bar);",
			output : "require(['./models/Account','./models/User'], foo => bar);",
			errors : requireErrors,
		},
		{
			code   : "import Account from './models/Account.js';",
			output : "import Account from './models/Account';",
			errors : importErrors,
		},
	],
});
