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

`no-lodash-isundefined` : Prevents usage of `_.isUndefined` method

`no-lodash-isnull` : Prevents usage of `_.isNull` method.

`no-align-assign` : Ensure that assignment statements are aligned
