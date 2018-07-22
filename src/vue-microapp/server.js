import { createRenderer } from 'vue-server-renderer';
import App from './App';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const renderer = createRenderer();

export default {
  renderToString: async () => {
    return await renderer.renderToString(App);
  },
  assets: assets['vue-microapp'],
};
