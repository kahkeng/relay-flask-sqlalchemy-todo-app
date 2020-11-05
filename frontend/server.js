/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

require('@babel/register')( {
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  presets: [
      "@babel/preset-env",
      "@babel/preset-react",
      "@babel/preset-typescript",
  ],
  plugins: [
      ["@babel/plugin-transform-runtime",
        {
          "regenerator": true
        }
      ]
  ]
} )
import 'isomorphic-fetch';

import CopyWebpackPlugin from 'copy-webpack-plugin';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Resolver } from 'found-relay';
import { getFarceResult } from 'found/server';
import ReactDOMServer from 'react-dom/server';
import RelayServerSSR from 'react-relay-network-modern-ssr/lib/server';
import serialize from 'serialize-javascript';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import path from 'path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const { createRelayEnvironment } = require('./ts/createRelayEnvironment')
const { historyMiddlewares, routeConfig } = require('./ts/router')
const config = require('./ts/config').default

const app = express();

const webpackConfig = {
  mode: 'development',

  entry: ['isomorphic-fetch', path.resolve(__dirname, 'ts', 'client.tsx')],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
          { loader: 'ts-loader', options: { transpileOnly: true } },
        ],
      },
    ],
  },
  output: {filename: 'app.js', path: '/'},
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        'public/learn.json',
        'node_modules/todomvc-common/base.css',
        'node_modules/todomvc-app-css/index.css',
      ],
    }),
  ],

  devtool: 'cheap-module-source-map',
};

app.use(
  webpackMiddleware(webpack(webpackConfig), {
    stats: { colors: true },
  }),
);

const options = {
  target: `http://${config.BACKEND_HOST}:${config.BACKEND_PORT}`,
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets
  pathRewrite: {
  },
  router: function(req) {
    return {
      protocol: 'http:',
      host: config.BACKEND_HOST,
      port: config.BACKEND_PORT,
    }
  },
};
app.use('/graphql', createProxyMiddleware('/graphql', options))

app.use(async (req, res) => {
  const relaySsr = new RelayServerSSR();

  const { redirect, status, element } = await getFarceResult({
    url: req.url,
    historyMiddlewares,
    routeConfig,
    resolver: new Resolver(
      createRelayEnvironment(relaySsr, `http://${config.BACKEND_HOST}:${config.BACKEND_PORT}/graphql`),
    ),
  });

  if (redirect) {
    res.redirect(302, redirect.url);
    return;
  }

  const appHtml = ReactDOMServer.renderToString(element);
  const relayData = await relaySsr.getCache();

  res.status(status).send(`
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Relay • TodoMVC</title>
  <link rel="stylesheet" href="base.css">
  <link rel="stylesheet" href="index.css">
</head>

<body>
<div id="root">${appHtml}</div>

<script>
  window.__RELAY_PAYLOADS__ = ${serialize(relayData, { isJSON: true })};
</script>
<script src="/app.js"></script>
</body>

</html>
  `);
});

app.listen(config.APP_PORT, () => {
  console.log(`listening on port ${config.APP_PORT}`); // eslint-disable-line no-console
});
