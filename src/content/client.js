import React from 'react';
import { hydrate } from 'react-dom';

import Content from './components/Content';

hydrate(<Content />, document.getElementById('h24-app-content'));

if (module.hot) {
  module.hot.accept();
}