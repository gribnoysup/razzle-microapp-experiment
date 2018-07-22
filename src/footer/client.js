import React from 'react';
import { hydrate } from 'react-dom';

import Footer from './components/Footer';

hydrate(<Footer />, document.getElementById('h24-app-footer'));

if (module.hot) {
  module.hot.accept();
}
