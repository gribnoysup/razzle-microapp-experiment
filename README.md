This is an experiment that tries to use Razzle for "microfrontend" architecture.

## Setup

`src` folder contains separate, "independant" applications. Application is any
folder which name does not starts with `__` (all this is really flexible and can
be changed to any other pattern later)

In the current example `src/content`, `src/footer` and `src/header` are
considered microapplications and `__dev` is not an app and "ignored" during the
build (more on this in "extending razzle").

Every application has a `client.js` and a `server.js` entry point, the same way
as default razzle bootstrap, the difference is that `server.js` exports
`renderToString` method and required client `assets` for the micro-app instead
of the full-blown server, allowing every app to be used in different
environments and completely separate from each other.

To demonstrate the last point, this example includes two types of apps: React
and Vue. They have similar API in terms of how the app is rendered on client
(mound to a node with a proper name) and on server (export renderToString and
required assets), that allows `__dev` server to consume them in an identical way

## Output

When running the production build, the output is separate entries for every
application for client and server. All client common external dependencies are
gathered to `vendor~` chunk, webpack `runtime` is also separated from
application bundles. Every server entry could be used completely separately from
each other and capable of rendering microapplication and also providing assets
that are needed for the app to run

## Dev-mode (npm start)

For the dev-mode, a special entrypoint in `src/__dev` is used. This is an
express server that can SSR every application based on the HTML template that is
provided. HMR is still supported both for client-side and server-side

## Extending Razzle

There are three major extensions that were needed for this to work:

1.  Automatically generate entry points for client and server based on src
    folder structure
2.  Add optimization keys to webpack config:

- `splitChunks: all` to extract all common dependencies in separate bundle
- `runtimeChunk: single` to extract webpack runtime to single chunk (prevent
  file hashes to be busted completely on every change in modules tree)

And the worst of them all at the moment:

3.  Manually patch `assets-webpack-plugin` to support `webpack@4` new `stats`
    format
    ([PR is on the way](https://github.com/ztoben/assets-webpack-plugin/pull/109),
    but this will be a breaking chane to the current razzle behavior)

Patch is created with the `patch-package` library and committed with the
project. To illustrate what was the issue, here is `manifest.json` generated
with current and patched versions of the library:

Current:

```json
{
  "vendors~content~footer~header": {
    "js": "/static/js/vendors~content~footer~header.3efea5c0.js"
  },
  "runtime": { "js": "/static/js/runtime.bae6e273.js" },
  "content": { "js": "/static/js/content.e3e17e39.js" },
  "footer": {
    "css": "/static/css/3.bundle.aefaaba6.css",
    "js": "/static/js/footer.31cbc0ab.js"
  },
  "header": {
    "css": "/static/css/4.bundle.9d96271c.css",
    "js": "/static/js/header.a6f65a4c.js"
  },
  "vendors~content": { "js": "/static/js/vendors~content.75c1ee4e.js" }
}
```

Patched:

```json
{
  "content": {
    "js": [
      "/static/js/runtime.bae6e273.js",
      "/static/js/vendors~content~footer~header.3efea5c0.js",
      "/static/js/vendors~content.75c1ee4e.js",
      "/static/js/content.e3e17e39.js"
    ]
  },
  "footer": {
    "js": [
      "/static/js/runtime.bae6e273.js",
      "/static/js/vendors~content~footer~header.3efea5c0.js",
      "/static/js/footer.31cbc0ab.js"
    ],
    "css": "/static/css/3.bundle.aefaaba6.css"
  },
  "header": {
    "js": [
      "/static/js/runtime.bae6e273.js",
      "/static/js/vendors~content~footer~header.3efea5c0.js",
      "/static/js/header.a6f65a4c.js"
    ],
    "css": "/static/css/4.bundle.9d96271c.css"
  }
}
```

As you can see the difference is big. Current version treats all vendor and
runtime chunks as entry points without providing any context about which REAL
entry is dependant on what and what is the order that you need to follow while
loading those dependencies.

The patched version avoids this by using `stats.entries` records from webpack
which give you information about every dependency for every REAL entry in your
webpack config, excluding entries that are not real entries, but more like a
static dependencies

## Caveats

- Manual patch to razzle dependency (will be fixed upstream sooner or later)
- Boilerplate that needs to be created for every new microapp (can be solved
  with additional tooling)
- Modified `razzle.config` (documentation states that this is an "escape hatch",
  not a solid solution, maybe all mentioned changes could be moved to the
  separate plugin)
- `razzle-plugin-vue` breaks CSS modules in general, probably should be fixed
  upstream somehow (in general not a use-case for us, this was moe like a demo
  of capabilities how to mix different apps, so it is not a big issue)
