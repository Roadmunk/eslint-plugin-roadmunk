/**
 * @fileoverview Prevent require statements from requiring views from outside the 'views/' folder
 * @author Brandon Mubarak
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const _          = require('lodash');
const rule       = require('../../../lib/rules/no-require-views');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const error = {
	message : 'Use an on-demand require statement to import views',
	type   	: 'CallExpression',
};

const ruleTester = new RuleTester();
ruleTester.run('no-require-views', rule, {
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
		`,
		// On-demand require statements should be valid regardless
		`
require([ '../views/mainLib' ], function() { return 0; });
require([ 'some/directory/for/views/models' ], function() { return false; });
require([ 'views/test' ], function() { return true; });
		`,
	],
	invalid : [
		{
			code :
			`
var view = require('../views/models/test');
			`,
			errors : _.times(1, _.constant(error)),
		},
		{
			code :
			`
var fs = require('fs');
var async = require('async');
var lib1 = require('lib/test');
var lib2 = require('../lib/test');
var view = require('../views/models/test');
var models1 = require('models/test');
var models2 = require('../models/test');
			`,
			errors : _.times(1, _.constant(error)),
		},
		// Should only fail on the require method at the top
		{
			code :
			`
var fs = require('fs');
var async = require('async');
var lib1 = require('lib/test');
var lib2 = require('../lib/test');
var view = require('../views/models/test');
var models1 = require('models/test');
var models2 = require('../models/test');

require([ 'views/test' ], function() { return true; });
			`,
			errors : _.times(1, _.constant(error)),
		},
		// Should fail on the require method at the top and the require within the function only
		{
			code :
			`
var fs = require('fs');
var async = require('async');
var lib1 = require('lib/test');
var lib2 = require('../lib/test');
var view = require('../views/models/test');
var models1 = require('models/test');
var models2 = require('../models/test');

require([ 'views/test' ], function() { return true; });

var test = function() {
    viewInFunction = require('../views/models/moarTests');
    var models3 = require('../models/test');
    
    return 0;
}
			`,
			errors : _.times(2, _.constant(error)),
		},
		{
			code :
			`
var fs = require('fs');
var async = require('async');
var lib1 = require('lib/test');
var lib2 = require('../lib/test');
var view1 = require('../views/models/test1');
var view2 = require('views/models/test2');
var view3 = require('../../../views/models/test3');
var models1 = require('models/test');
var models2 = require('../models/test');
			`,
			errors : _.times(3, _.constant(error)),
		},
	],
});
