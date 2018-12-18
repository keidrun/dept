# Examples

Examples of template files are [JSON](/examples/templates/json)/[YAML](/examples/templates/yaml).

## Prepare templates

```bash
$ dept add nodejs-eslint-prettier -f ./json/nodejs-eslint-prettier-template.json
$ dept add create-react-app-eslint-prettier -f ./json/create-react-app-eslint-prettier-template.json
$ dept add reactnative-eslint-prettier -f ./json/reactnative-eslint-prettier-template.json
$ dept list
* nodejs-eslint-prettier
  create-react-app-eslint-prettier
  reactnative-eslint-prettier
```

## Install Eslint, Prettier and TravisCI YAML via a template for NodeJS app

```bash
mkdir your-nodejs-app
cd your-nodejs-app
dept use yarn
dept install nodejs-eslint-prettier
```

## Install Eslint and Prettier via a template for React app

```bash
create-react-app your-react-app
cd your-react-app
dept use yarn
dept install create-react-app-eslint-prettier
```

## Install Eslint and Prettier via a template for ReactNative app

```bash
react-native init your-react-native-app
cd your-react-native-app
dept use yarn
dept install reactnative-eslint-prettier
```
