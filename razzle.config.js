const fs = require('fs');
const path = require('path');

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    const applications = fs
      .readdirSync(path.resolve(__dirname, 'src'))
      .filter(name => !/^__/.test(name));

    let entry;

    if (target === 'web') {
      for (const appName of applications) {
        if (!entry) entry = {};

        // TODO: Add polyfill
        entry[appName] = [path.resolve(__dirname, 'src', appName, 'client.js')];

        if (dev) {
          entry[appName].unshift(
            require.resolve('razzle-dev-utils/webpackHotDevClient')
          );
        }
      }

      config.optimization = {
        ...(config.optimization || {}),
        runtimeChunk: 'single',
        splitChunks: { chunks: 'all' },
      };

      if (dev) {
        config.output = {
          ...config.output,
          filename: 'static/js/[name].js',
          chunkFilename: 'static/js/[name].js',
        };
      } else {
        config.output = {
          ...config.output,
          filename: 'static/js/[name].[chunkhash:8].js',
          chunkFilename: 'static/js/[name].[chunkhash:8].js',
        };
      }
    }

    if (target === 'node') {
      if (dev) {
        entry = [
          // TODO: Seems to be not released yet
          // require.resolve('razzle-dev-utils/prettyNodeErrors'),
          'webpack/hot/poll?300',
          path.resolve(__dirname, 'src', '__dev', 'index.js'),
        ];
      } else {
        for (const appName of applications) {
          if (!entry) entry = {};

          // TODO: Add polyfill
          entry[appName] = path.resolve(__dirname, 'src', appName, 'server.js');

          config.output = {
            ...config.output,
            filename: 'server/[name].js',
          };
        }
      }
    }

    config.entry = entry;

    return config;
  },
  plugins: ['vue'],
};
