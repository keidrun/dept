# dept [![NPM version][npm-image]][npm-url] [![npm module downloads][npm-downloads-image]][npm-downloads-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url] [![License: MIT][license-image]][license-url]

Dependencies templates management CLI to install your fixed NPM or Yarn dependencies and cofing files to your project.

## Usage

```bash
$ dept -h
Usage: dept <command> [options]

Commands:
  dept list                    show all templates                  [aliases: ls]
  dept show [templateName]     show a template in details           [aliases: s]
  dept default [templateName]  use a template by default           [aliases: df]
  dept install [templateName]  install dependencies and config files from a
                                   template                         [aliases: i]
  dept add [templateName]      add a template with '--data' or '--file'
                                   options                          [aliases: a]
  dept remove [templateName]   remove a template                    [aliases: r]
  dept rename [templateName]   rename a template name
  [newTemplateName]                                                [aliases: mv]

Options:
  --version, -v  Show version                                          [boolean]
  --yarn, -y     use 'yarn' instead of 'npm'                    [default: false]
  --init, -i     initialize 'package.json'                      [default: false]
  --data, -d     specify a JSON data string with 'add' command          [string]
  --file, -f     specify a JSON template file with 'add' command        [string]
  --help, -h     Show help                                             [boolean]
```

## Template JSON format

You can define the following properties.

- dependencies ... NPM package `dependencies`
- devDependencies ... NPM package `devDependencies`
- files ... Config files like `.eslintrc` and so on

For example:

```json
{
  "dependencies": {
    "module-name-A": "1.0.0",
  },
  "devDependencies": {
    "module-name-B": "*",
    "module-name-C": "^2.1.1",
  },
  "files": {
    "file-name-A.json": {
      "any-prop-1": [
          "any-element-1",
          "any-element-2",
          "any-element-3"
      ],
      "any-prop-2": {
          "any-value-1": 123,
          "any-value-2": true,
          "any-value-3": "something"
      },
      "any-prop-3": "anything"
    },
    "file-name-B.txt": "Hello World"
  }
}
```

Real world's templates examples are [HERE](/examples/EXAMPLES.md).

## Use cases

### Install your fixed template to your project

You can add your fixed template with `dept add` then install the template to your project with `dept install`.
And you can set a default template with `dept default`.

```bash
$ dept add react-eslint-prettier -f ./template.json
$ dept default react-eslint-prettier
$ dept list
* react-eslint-prettier
  express-typescript
  vue-nuxt
$ cd your-app # Already NPM installed
$ dept install
```

### Install your fixed template in your new project

You can initialize your new project with `--init` option.

```bash
$ dept list
* react-eslint-prettier
  express-typescript
  vue-nuxt
$ mkdir your-new-app
$ cd your-new-app # NOT NPM installed
$ dept install --init
```

### Install your fixed template in your new project with Yarn

You can also use `yarn` instead of `npm` with `--yarn` option.

```bash
$ dept list
* react-eslint-prettier
  express-typescript
  vue-nuxt
$ mkdir your-new-app
$ cd your-new-app # NOT Yarn installed
$ dept install --init --yarn
```

### Specify a template from your fixed templates

Of course, you can specify a template you'd like to use in your project after `dept install`.

```bash
$ dept list
* react-eslint-prettier
  express-typescript
  vue-nuxt
$ cd your-app
$ dept install express-typescript --yarn
```

[npm-url]: https://npmjs.org/package/dept
[npm-image]: https://badge.fury.io/js/dept.svg
[npm-downloads-url]: https://npmjs.org/package/dept
[npm-downloads-image]: https://img.shields.io/npm/dt/dept.svg
[travis-url]: https://travis-ci.org/keidrun/dept
[travis-image]: https://secure.travis-ci.org/keidrun/dept.svg?branch=master
[depstat-url]: https://david-dm.org/keidrun/dept
[depstat-image]: https://david-dm.org/keidrun/dept.svg
[license-url]: https://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/badge/License-MIT-yellow.svg
