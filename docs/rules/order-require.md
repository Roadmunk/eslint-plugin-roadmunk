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
