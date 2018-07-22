import React from 'react';
import { renderToString as reactDOMRenderToString } from 'react-dom/server';
import { renderStylesToString } from 'emotion-server';

import Content from './components/Content';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

export default {
  renderToString(props) {
    return renderStylesToString(reactDOMRenderToString(<Content {...props} />));
  },
  assets: assets.content,
};
