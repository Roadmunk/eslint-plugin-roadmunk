# Prevent requiring `views/` packages in JS code (no-require-views)

This rule aims to prevent importing packages from within the `views/`, directory. We should instead be only requiring the packages we specifically need, instead of entire views. 

## Rule Details

This rule checks any `require` statements for the packages they're importing _except_ for on-demand `require` statements (see below).

Examples of **incorrect** code for this rule:

```js

const badRequire1 = require('../views/some/view');

let badFunc = function() {
    const badRequire2 = require('views/some/other/view');
    return badRequire2.foo();
}

```

Examples of **correct** code for this rule:

```js

require([ '../views/some/package' ], function() {
    return 'I will pass';
});

```