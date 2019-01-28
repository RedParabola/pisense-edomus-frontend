const projectRootDir = process.env.IONIC_ROOT_DIR;
const appScriptsDir = process.env.IONIC_APP_SCRIPTS_DIR;
const IONIC_ENV = process.env.IONIC_ENV || 'dev';
const ENV = process.env.ENV || 'development';

// Load Ionic's default webpack.config.js
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require(path.join(appScriptsDir, 'config', 'webpack.config.js'))[IONIC_ENV];

// Load environment specific configuration
let envVars;
let packageApp;
try {
  envVars = require(path.join(projectRootDir, 'config', 'env', `${ENV}.json`));
  packageApp = require(path.join(projectRootDir, 'package.json'));
} catch (e) {
  envVars = {};
}

// Configure Webpack DefinePlugin
webpackConfig.plugins = webpackConfig.plugins || [];
webpackConfig.plugins.push(
  new webpack.DefinePlugin({
    appEnvironment: JSON.stringify(envVars),
    packageApp: JSON.stringify(packageApp)
  })
);

// config.plugins.push(
//   new webpack.DefinePlugin({
//     ENV: Object.assign(envVars, {
//       environment: JSON.stringify(env)
//     })
//   })
// );
//
// if (ENV === 'prod') {
//   // This helps ensure the builds are consistent if source hasn't changed:
//   config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
// }

// Export
module.exports = webpackConfig;
