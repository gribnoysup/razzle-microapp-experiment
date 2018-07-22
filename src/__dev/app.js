import express from 'express';

const server = express();

const flattenByKey = (array, key) =>
  array
    .filter(item => item.hasOwnProperty(key))
    .map(item => item[key])
    .reduce((acc, value) => acc.concat(value), []);

const unique = array => [...new Set(array)];

const indexHTMLTemplate = `
<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>Razzle microapps sandbox</title>

    <!-- CSS -->
  </head>

  <body>
    <div id="h24-app-header"></div>
    <div id="h24-app-content"></div>
    <div id="h24-app-vue-microapp"></div>
    <div id="h24-app-footer"></div>

    <!-- Testing that this will not break the sandbox: -->
    <div id="h24-app-non-existent"></div>

    <!-- JS -->
  </body>

</html>
`;

const requireApp = appName => {
  try {
    return require('../' + appName + '/server.js').default;
  } catch (error) {
    // eslint-disable-next-line no-console
    // console.warn(`Can't find application "${appName}"`);
    return null;
  }
};

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    const assets = [];
    const appRegEx = /(<div\s+id="h24-app-(.+?)">).*(<\/div>)/g;

    let body = indexHTMLTemplate;
    let match;

    while ((match = appRegEx.exec(body)) !== null) {
      const [_, TAG_OPEN, appName, TAG_CLOSE] = match;
      const app = requireApp(appName);

      if (app == null) continue;

      const appHTML = await app.renderToString(/* props? whole request? */);

      assets.push(app.assets);
      body = body.replace(_, TAG_OPEN + appHTML + TAG_CLOSE);
    }

    const js = unique(flattenByKey(assets, 'js'));
    const css = unique(flattenByKey(assets, 'css'));

    body = body
      .replace(
        '<!-- CSS -->',
        css.map(src => `<link rel="stylesheet" href="${src}" />`).join('')
      )
      .replace(
        '<!-- JS -->',
        js.map(src => `<script src="${src}"></script>`).join('')
      );

    res.send(body);
  });

export default server;
