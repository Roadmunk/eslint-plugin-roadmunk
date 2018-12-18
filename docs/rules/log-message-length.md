# Enforces a specified max length on log messages (log-message-length)

Log messages get truncated at 50 characters therefore this rule catches scenarios that go over that limit.
There is no autofixing logic for this rule.

## Rule Details

This rule currently only checks the methods 

- log.info
- log.debug
- log.warn
- log.error
- log.command
- log.sys

Examples of **incorrect** code for this rule:

```js

log.debug('This is a string that is long enough that it goes over the limit');

```

Examples of **correct** code for this rule:

```js

log.debug('Short log message');

```
