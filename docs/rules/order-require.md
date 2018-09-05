# Ensures that the require statements are in a specific order (order-require)

Follows Roadmunk's coding convention of always having the require statements at the top of the file in a predictable order.


## Rule Details

Examples of **incorrect** code for this rule:

```js

var _         = require('lodash');
var pluralize = require('pluralize');
var JS        = require('@roadmunk/jsclass');
var Moment    = require('lib/rm-moment');
var Msgbox    = require('views/Msgbox');
var BaseModel = require('models/BaseModel');

```

Examples of **correct** code for this rule:

```js

var _         = require('lodash');
var pluralize = require('pluralize');
var JS        = require('@roadmunk/jsclass');
var Moment    = require('lib/rm-moment');
var BaseModel = require('models/BaseModel');
var Msgbox    = require('views/Msgbox');

```

## Things to keep in mind
- Autofixing logic of this rule currently only fixes one statement at a time.
- Relative requires at placed at the bottom

 ## Expected Order
 Expect the modules to be ordered as listed below:

 - Third party
 - @roadmunk modules
 - lib<sup>1</sup>
 - models<sup>1</sup>
 - views<sup>1</sup>
 - tests<sup>1</sup>
 - text!
 - Non relative require statements that don't match any of the above like `api/`, `sandbox/`
 - Relative require statements that don't match any of the above

 > <sup>1</sup> There are four levels of hierarchy for these modules
 > - Base level (Eg: `lib/`)
 > - Relative requires (Eg : `./lib`)
 > - Common requires (Eg: `common/lib`)
 > - Relative Common requires (Eg: `./common/lib`)

Here is an example of an autofixed require block that contains a mixture of most common require statments we encounter in our project

```js
var _                 = require('lodash');
var JS                = require('@roadmunk/jsclass');
var Moment            = require('lib/rm-moment');
var RelativeLib       = require('./lib/rm-moment');
var RmMomentCommon    = require('common/lib/rm-moment');
var RealtiveCommonLib = require('../common/lib/rm-moment');
var BaseModel         = require('models/BaseModel');
var ModelStorage      = require('./models/ModelStorage');
var ModelStorage      = require('../models/ModelStorage');
var AccountCommon     = require('common/models/Account');
var ModelStorage      = require('./common/models/ModelStorage');
var Msgbox            = require('views/Msgbox');
var Msgbox            = require('./views/Msgbox');
var Msgbox            = require('common/views/Msgbox');
var Msgbox            = require('./common/views/Msgbox');
var TEMPLATE          = require('text!./rm-select.html');
var RmFieldMixin      = require('/mixins/rm-field');
var RESTAPI           = require('api/RESTAPI');
var testMethod        = require('lodash/testMethod');
var RmListdMixin      = require('../mixins/rm-list');
var BaseTemplate      = require('../BaseTemplate');
```