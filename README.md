# eslint-plugin-roadmunk-custom

Plugin to hold custom ESLint rules for Roadmunk

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-roadmunk-custom`:

```
$ npm install eslint-plugin-roadmunk-custom --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-roadmunk-custom` globally.

## Usage

Add `roadmunk-custom` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "roadmunk-custom"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "roadmunk-custom/rule-name": 2
    }
}
```

## Supported Rules

`align-assign` : Ensure that assignment statements are aligned

`assert-length` : Uses the correct assertion method to check for length of an array

`log-message-length` : Enforces a specified max length on log messages

`no-lodash-deprecated-functions` : Prevents usage of deprecated lodash functions.

`no-lodash-isnull` : Prevents usage of `_.isNull` method.

`no-lodash-isundefined` : Prevents usage of `_.isUndefined` method

`no-log-info` : Prevents the use of `log.info`. Our coding standards recommend usage of `log.user` & `log.sys` over the deprecated `log.info`

`no-require-views` : Warns about requiring packages from the `views/` folder.

`order-import` : Ensures that import statements in a file are in the correct order.

`order-require` : Ensures that require statements in a file are in the correct order.
