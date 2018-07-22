import React from 'react';
import { renderToString as reactDOMRenderToString } from 'react-dom/server';

import Footer from './components/Footer';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

export default {
  renderToString(props) {
    return reactDOMRenderToString(<Footer {...props} />);
  },
  assets: assets.footer,
};
