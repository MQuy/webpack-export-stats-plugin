const webpack = require("webpack");
const ExportStatsPlugin = require("webpack-export-stats-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { styleLoader } = require("es6-css-loader");

module.exports = {
  entry: [`webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr`, "./index.js"],
  target: "web",
  devtool: "source-map",

  output: {
    path: __dirname,
    filename: "bundle.js"
  },

  mode: "development",

  optimization: {
    usedExports: true
  },

  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        loader: "babel-loader",
        options: {
          babelrc: false,
          presets: [],
          plugins: [
            [
              "@babel/plugin-transform-react-jsx",
              {
                pragma: "createElement"
              }
            ],
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-syntax-import-meta",
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-proposal-json-strings",
            [
              "@babel/plugin-proposal-decorators",
              {
                legacy: true
              }
            ],
            "@babel/plugin-proposal-function-sent",
            "@babel/plugin-proposal-export-namespace-from",
            "@babel/plugin-proposal-numeric-separator",
            "@babel/plugin-proposal-throw-expressions"
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          styleLoader,
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ExportStatsPlugin({
      patterns: ["*.(js|css)"],
      log: "verbose",
      numberOfMinDeps: 1,
      exclude: ["**/node_modules/**"]
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "template.html"
    })
  ]
};
