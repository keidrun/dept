# Examples

Example templates files are [HERE](/examples/templates).

## Prepare templates

```bash
$ dept add nodejs-eslint-prettier -f ./nodejs-eslint-prettier-template.json
$ dept add create-react-app-eslint-prettier -f ./create-react-app-eslint-prettier-template.json
$ dept add reactnative-eslint-prettier -f ./reactnative-eslint-prettier-template.json
$ dept list
* nodejs-eslint-prettier
  create-react-app-eslint-prettier
  reactnative-eslint-prettier
```

## Install Eslint, Prettier and TravisCI YAML via a template for NodeJS app

```bash
mkdir your-nodejs-app
cd your-nodejs-app
dept install nodejs-eslint-prettier --yarn --init
```

## Install Eslint and Prettier via a template for React app

```bash
create-react-app your-react-app
cd your-react-app
dept install create-react-app-eslint-prettier --yarn
```

## Install Eslint and Prettier via a template for ReactNative app

```bash
react-native init your-react-native-app
cd your-react-native-app
dept install reactnative-eslint-prettier --yarn
```
