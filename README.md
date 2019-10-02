## Webpack Export Stats Plugin

Webpack plugin to output export stats graph from your project

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![licenses][licenses]][licenses-url]

### Installation

Via npm:

```bash
$ npm install webpack-export-stats-plugin --save-dev
```

Via yarn:

```bash
$ yarn add -D webpack-export-stats-plugin
```

### Usage

```js
const ExportStatsPlugin = require('webpack-export-stats-plugin');

const webpackConfig = {
  ...
  optimization: {
    usedExports: true,
  },
  plugins: [
    new ExportStatsPlugin({
      patterns: [
        'src/**/*.(js|jsx|css)',
      ],
      exclude: [
        '**/*.(stories|spec).(js|jsx)',
      ],
    })
  ]
}
```

### Configuration

```js
new ExportStatsPlugin(options);
```

#### options.patterns (default: `["**/*.*"]`)

The array of patterns to look for. Directly pass to [`fast-glob`](https://github.com/mrmlnc/fast-glob)

#### options.exclude (default: `[]`)

The array of patterns to not look at.

#### options.context

Current working directoy for patterns above. If you don't set explicitly, your webpack context will be used.

#### options.output (default: `graph.json`)

Location where your graph will be created.

#### options.log (default: `info`, value: `info|verbose`)

- `info` shows number of used in other modules.
- `verbose` contains array of modules which use that export.

#### options.numberOfMinDeps (default: `2`)

Number of minimum dependencies to decide if exported functions is logged.

#### options.filterFunc (default: `undefined`)

A filter function which will decide whether module is logged.

[npm]: https://img.shields.io/npm/v/webpack-export-stats-plugin.svg
[npm-url]: https://npmjs.com/package/webpack-export-stats-plugin
[node]: https://img.shields.io/node/v/webpack-export-stats-plugin.svg
[node-url]: https://nodejs.org
[deps]: https://img.shields.io/david/MQuy/webpack-export-stats-plugin.svg
[deps-url]: https://david-dm.org/MQuy/webpack-export-stats-plugin
[licenses]: https://img.shields.io/github/license/MQuy/webpack-export-stats-plugin.svg
[licenses-url]: https://github.com/MQuy/webpack-export-stats-plugin/blob/master/LICENSE
