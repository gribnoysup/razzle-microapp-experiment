/* eslint-disable no-console */

import app from './app';
import http from 'http';

const server = http.createServer(app);

let currentApp = app;

server.listen(process.env.PORT || 3000, error => {
  if (error) {
    console.error(error);
  }

  console.log('🚀 started');
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./app', () => {
    console.log('🔁  HMR Reloading `./app`...');
    server.removeListener('request', currentApp);
    const newApp = require('./app').default;
    server.on('request', newApp);
    currentApp = newApp;
  });
}
