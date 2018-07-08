# Prevent usage of `_.isNull` method (no-lodash-isnull)

This rule aims to prevent usage of `_.isNull` method which is just a wrapper for `value === null`

The rule supports code auto fixing the code

Examples:
```
 const test = _.isNull(myVar); //Gets auto-fixed to the line below
 const test = myVar === null;

 const test = !_.isNull(myVar); //Gets auto-fixed to the line below
 const test = myVar !== null;
```

If the code cannot be auto-fixed, an error will still be thrown to warn the user about usage of `_.isNull`