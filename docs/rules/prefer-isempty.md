# Prefer `_.isEmpty` for checking empty collections

Enforces the usage of `_.isEmpty` by checking for comparisons of `\.length` to `0`

## Rule Details

Examples of **incorrect** code for this rule:

```js
array.length === 0
array.length !== 0
array.length > 0
0 < array.length
array.length >= 1
1 <= array.length
Object.keys(object).length === 0
```

Examples of **correct** code for this rule:

```js
array.length < 0
array.length === 1
array.length >= 0
_.isEmpty(array)
_.isEmpty(object)
```
