# dept [![NPM version][npm-image]][npm-url] [![npm module downloads][npm-downloads-image]][npm-downloads-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url] [![License: MIT][license-image]][license-url]

Dependencies templates management CLI to install your fixed NPM dependencies and cofing files.

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

オプション:
  --version, -v  Show version                                          [boolean]
  --yarn, -y     use 'yarn' instead of 'npm'                    [default: false]
  --init, -i     initialize 'package.json'                      [default: false]
  --data, -d     specify a JSON data string with 'add' command          [string]
  --file, -f     specify a JSON template file with 'add' command        [string]
  --help, -h     Show help                                             [boolean]
```

## Template format

```json
{
  "dependencies": {
    "module-name-A": "1.0.0",
  },
  "devDependencies": {
    "module-name-B": "*",
    "module-name-C": "*",
  },
  "files": {
    "file-name-A.json": {
      "any": {
        "any": [
          "any-1",
          "any-2",
          "any-3"
        ]
      }
    },
        "file-name-B.json": {
      "any": {
        "any": {
          "any-1": 123,
          "any-2" : true,
          "any-3": "something"
        }
      }
    }
}

```

## Use cases

### Install your fixed template to your project

You can add your fixed template with `dept add` then install the template to your project with `dept install`.

```bash
$ dept add react-eslint-prettier -f ./template.json
$ dept default react-eslint-prettier
$ dept list
* react-eslint-prettier
  express-typescript
  vue-nuxt
$ cd your-react-app # Already NPM installed
$ dept install
```

### Use fixed React templates in your new project

You can initialize your new project with `--init` option.

```bash
$ dept add react-eslint-prettier -f ./template.json
$ dept default react-eslint-prettier
$ dept list
* react-eslint-prettier
  express-typescript
  vue-nuxt
$ mkdir your-react-app
$ cd your-react-app # NOT NPM installed
$ dept install --init
```

### Use fixed React templates in your new project with Yarn

You can also use `yarn` instead of `npm` with `--yarn` option.

```bash
$ dept add react-eslint-prettier -f ./template.json
$ dept default react-eslint-prettier
$ dept list
* react-eslint-prettier
  express-typescript
  vue-nuxt
$ mkdir your-react-app
$ cd your-react-app # NOT Yarn installed
$ dept install --init --yarn
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
