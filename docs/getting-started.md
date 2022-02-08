# Getting Started

## Create React App

To install in a CRA application, perform the following steps:

_Install Packages_

```sh
yarn add @css-components/webpack @css-components/react
```

_Add Webpack Plugin_

If you have ejected from CRA, simply add the Webpack CCMPlugin from `@css-components/webpack` to the list of webpack plugins.

```js
const { CCMPlugin } = require('@css-components/webpack');

module.exports {
    plugins: [
        new CCMPlugin()
    ]
}
```

If the app is not ejected, add the CCM webpack plugin to the webpack config using [React App Rewired](https://www.npmjs.com/package/react-app-rewired) or a similar tool.

```js
// file: config-overrides.js
const { CCMPlugin } = require('@css-components/webpack');

module.exports = function override(config, env) {
  config.plugins.push(new CCMPlugin());
  return config;
};
```

## Webpack

## Rollup

## ESBuild

## Vite

## Parcel
