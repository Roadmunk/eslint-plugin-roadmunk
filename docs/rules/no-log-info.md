# Prevents use of log.info (no-log-info)
This rule prevents the use of log.info. Our coding standards recommend usage of log.user & log.sys over the deprecated log.info
There is no autocorrect logic implemented for this rule.

Examples of **incorrect** code for this rule:

```js
log.info('hello');
```

Examples of **correct** code for this rule:

```js
log.user('hello')
log.sys('hello')

```
