/**
 * @fileoverview Ensures that the import statements are in a specific order
 * @author Steven McConomy
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
const RuleTester = require('eslint').RuleTester;
const rule       = require('../../../lib/rules/order-import');


const getErrorMessage = moduleName => ([ {
	message : `${moduleName} was not imported in the correct order`,
	type    : 'ImportDeclaration',
} ]);

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------
const ruleTester = new RuleTester({ parserOptions : { ecmaVersion : 2017, sourceType : 'module' } });
ruleTester.run('order-require', rule, {
	valid : [
		`
		import fs from 'fs';
		import async from 'async';
		import lib1 from 'lib/test';
		import lib2 from '../lib/test';
		import lib3 from 'common/lib/test';
		import lib4 from '../common/lib/test';
		import models1 from 'models/test';
		import models2 from '../models/test';
		import models3 from 'common/models/test';
		import models4 from '../common/models/test';
		import views1 from 'views/test';
		import views2 from '../views/test';
		import views3 from 'common/views/test';
		import views4 from '../common/views/test';
		`,
		`
		import _ from 'lodash';
		import pluralize from 'pluralize';
		import JS from '@roadmunk/jsclass';
		import Moment from 'lib/rm-moment';
		import BaseModel from 'models/BaseModel';
		import Msgbox from 'views/Msgbox';
		`,
	],

	invalid : [
		{
			// Autofixing of this rule doesn't try to align code at all therefore the examples are unindented
			code :
			`
import JS from '@roadmunk/jsclass';
import _ from 'lodash';
			`,
			errors : getErrorMessage('lodash'),
			output :
			`
import _ from 'lodash';
import JS from '@roadmunk/jsclass';
			`,
		},
		{
			code :
			`
import _ from 'lodash';
import JS from '@roadmunk/jsclass';
import pluralize from 'pluralize';
			`,
			errors : getErrorMessage('pluralize'),
			output :
			`
import _ from 'lodash';
import pluralize from 'pluralize';
import JS from '@roadmunk/jsclass';
			`,
		},
		{
			code :
			`
import _ from 'lodash';
import pluralize from 'pluralize';
import JS from '@roadmunk/jsclass';
import Moment from 'lib/rm-moment';
import Msgbox from 'views/Msgbox';
import BaseModel from 'models/BaseModel';
			`,
			errors : getErrorMessage('models/BaseModel'),
			output :
			`
import _ from 'lodash';
import pluralize from 'pluralize';
import JS from '@roadmunk/jsclass';
import Moment from 'lib/rm-moment';
import BaseModel from 'models/BaseModel';
import Msgbox from 'views/Msgbox';
			`,
		},
		{
			code :
			`
import ko from 'knockout';
import $ from 'jquery';
import BaseBinding from './BaseBinding';
import JS from '@roadmunk/jsclass';
			`,
			errors : getErrorMessage('@roadmunk/jsclass'),
			output :
			`
import ko from 'knockout';
import $ from 'jquery';
import JS from '@roadmunk/jsclass';
import BaseBinding from './BaseBinding';
			`,
		},
		{
			code :
			`
import ko from 'knockout';
import $ from 'jquery';
import JS from '@roadmunk/jsclass';
import Moment from '../lib/rm-moment';
import Moments from 'lib/rm-moment';
			`,
			errors : getErrorMessage('lib/rm-moment'),
			output :
			`
import ko from 'knockout';
import $ from 'jquery';
import JS from '@roadmunk/jsclass';
import Moments from 'lib/rm-moment';
import Moment from '../lib/rm-moment';
			`,
		},
		{
			code :
			`
import $ from 'jquery';
import BaseMainModule from './BaseMainModule';
import Msgbox from 'views/Msgbox';
			`,
			errors : getErrorMessage('views/Msgbox'),
			output :
			`
import $ from 'jquery';
import Msgbox from 'views/Msgbox';
import BaseMainModule from './BaseMainModule';
			`,
		},
		{
			code :
			`
import Vue from 'vue';
import _ from 'lodash';
import template from 'text!./rm-select.html';
import JS from '@roadmunk/jsclass';
import RmFieldMixin from '../mixins/rm-field';
			`,
			errors : getErrorMessage('@roadmunk/jsclass'),
			output :
			`
import Vue from 'vue';
import _ from 'lodash';
import JS from '@roadmunk/jsclass';
import template from 'text!./rm-select.html';
import RmFieldMixin from '../mixins/rm-field';
			`,
		},
		// Example below requires from a directory the plugin doesn't know about (sandbox) so it should go to the bottom
		{
			code :
			`
import SandboxBaseVM from 'sandbox/SandboxBaseVM';
import JS from '@roadmunk/jsclass';
			`,
			errors : getErrorMessage('@roadmunk/jsclass'),
			output :
			`
import JS from '@roadmunk/jsclass';
import SandboxBaseVM from 'sandbox/SandboxBaseVM';
			`,
		},
		{
			code :
			`
import JS from '@roadmunk/jsclass';
import { Test } from 'sandbox';
			`,
			errors : getErrorMessage('sandbox'),
			output :
			`
import { Test } from 'sandbox';
import JS from '@roadmunk/jsclass';
			`,
		},
		// Test cases involving comments
		{

			// Autofixing of this rule doesn't try to align code at all therefore the examples are unindented
			code :
			`
import JS from '@roadmunk/jsclass'; // comment 1
import _ from 'lodash'; // comment 2
			`,
			errors : getErrorMessage('lodash'),
			output :
			`
import _ from 'lodash'; // comment 2
import JS from '@roadmunk/jsclass'; // comment 1
			`,
		},
	],
});
