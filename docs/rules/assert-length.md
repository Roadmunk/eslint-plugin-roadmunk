# Uses the correct assertion method to check for length of an array (assert-length)

This rule aims to enforce use of `.length` message when testing the length of an array

Examples of **incorrect** code for this rule:

```js

expect(something.length).to.equal(x);

```

Examples of **correct** code for this rule:

```js

expect(something).to.have.length(x);

```
