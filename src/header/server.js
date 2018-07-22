import React from 'react';
import { renderToString as reactDOMRenderToString } from 'react-dom/server';

import Header from './components/Header';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

export default {
  renderToString(props) {
    return reactDOMRenderToString(<Header {...props} />);
  },
  assets: assets.header,
};
