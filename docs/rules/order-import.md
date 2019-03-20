# Ensures that the require statements are in a specific order (order-require)

Follows Roadmunk's coding convention of always having the import statements at the top of the file in a predictable order.


## Rule Details

Examples of **incorrect** code for this rule:

```js

import _ from 'lodash';
import pluralize from 'pluralize';
import JS from '@roadmunk/jsclass';
import Moment from 'lib/rm-moment';
import Msgbox from 'views/Msgbox';
import BaseModel from 'models/BaseModel';

```

Examples of **correct** code for this rule:

```js

import _ from 'lodash';
import pluralize from 'pluralize';
import JS from '@roadmunk/jsclass';
import Moment from 'lib/rm-moment';
import BaseModel from 'models/BaseModel';
import Msgbox from 'views/Msgbox';

```

## Things to keep in mind
- Autofixing logic of this rule currently only fixes one statement at a time.
- Relative requires are placed at the bottom

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

Here is an example of an autofixed require block that contains a mixture of most common require statements we encounter in our project

```js
import _ from 'lodash';
import JS from '@roadmunk/jsclass';
import Moment from 'lib/rm-moment';
import RelativeLib from './lib/rm-moment';
import RmMomentCommon from 'common/lib/rm-moment';
import RealtiveCommonLib from '../common/lib/rm-moment';
import BaseModel from 'models/BaseModel';
import ModelStorage from './models/ModelStorage';
import ModelStorage from '../models/ModelStorage';
import AccountCommon from 'common/models/Account';
import ModelStorage from './common/models/ModelStorage';
import Msgbox from 'views/Msgbox';
import Msgbox from './views/Msgbox';
import Msgbox from 'common/views/Msgbox';
import Msgbox from './common/views/Msgbox';
import TEMPLATE from 'text!./rm-select.html';
import RmFieldMixin from '/mixins/rm-field';
import RESTAPI from 'api/RESTAPI';
import testMethod from 'lodash/testMethod';
import RmListdMixin from '../mixins/rm-list';
import BaseTemplate from '../BaseTemplate';
```
