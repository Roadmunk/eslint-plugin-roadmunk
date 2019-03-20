# Prevent require statements with paths ending in `.js` (no-require-path-js)
This rule aims to introduce consistency to the way we require/import `.js` files. It will flag all require/import statements that have a path ending with `.js`.
The rule will auto-fix all violations.

Examples of **incorrect** code for this rule:

```js
const Account = require('./models/Account.js');
import Account from './models/Account.js';
```

Examples of **correct** code for this rule:

```js
const Account = require('./models/Account');
import CustomProperty from 'models/CustomProperty.List';
```
