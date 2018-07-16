# Prevent usage of deprecated lodash functions

This rule aims to prevent usage of deprecated lodash functions method which are just aliases for newer functions

The rule supports code auto fixing the code

Examples:
```js
 const test = _.contains(myArr, myVar); // Gets auto-fixed to the line below
 const test = _.includes(myArr, myVar);
```

A full list of all deprecated lodash functions is as follows:
```
first     -> head
object    -> zipObject
tail      -> rest
unique    -> uniq
all       -> every
any       -> some
collect   -> map
contains  -> includes
detect    -> find
each      -> forEach
eachRight -> forEachRight
foldl     -> reduce
foldr     -> reduceRight
include   -> includes
inject    -> reduce
select    -> filter
backflow  -> flowRight
compose   -> flowRight
eq        -> isEqual
extend    -> assign
methods   -> functions
iteratee  -> callback
```
