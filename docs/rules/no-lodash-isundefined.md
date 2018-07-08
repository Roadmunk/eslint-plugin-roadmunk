# Prevents usage of `isUndefined` method (no-lodash-isundefined)

## Rule Details

This rule aims to prevent usage of `_.isUndefined` method which is just a wrapper for `value === undefined`

The rule supports code auto fixing the code

Examples:
```
 const test = _.isUndefined(myVar); //Gets auto-fixed to the line below
 const test = myVar === undefined;

 const test = !_.isUndefined(myVar); //Gets auto-fixed to the line below
 const test = myVar !== undefined;
```

If the code cannot be auto-fixed, an error will still be thrown to warn the user about usage of `_.isUndefined`