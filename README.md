# PRESS _(@urbandoor/press)_

[![license](https://img.shields.io/github/license/urbandoor/press.svg)](https://github.com/urbandoor/press/blob/master/LICENSE)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![npm (scoped)](https://img.shields.io/npm/v/@urbandoor/press.svg)](https://www.npmjs.com/package/@urbandoor/press)
[![npm](https://img.shields.io/npm/dm/@urbandoor/press.svg)](https://www.npmjs.com/package/@urbandoor/press)

[![Dependabot badge](https://img.shields.io/badge/Dependabot-active-brightgreen.svg)](https://dependabot.com/)
[![dependencies Status](https://david-dm.org/@urbandoor/press/status.svg)](https://david-dm.org/urbandoor/press)
[![devDependencies Status](https://david-dm.org/@urbandoor/press/dev-status.svg)](https://david-dm.org/urbandoor/press?type=dev)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![CircleCI](https://circleci.com/gh/urbandoor/press.svg?style=svg)](https://circleci.com/gh/urbandoor/press)

> PRESS is a client-side library and set of server-side patterns for
> progressively adding interactivity to server-rendered HTML.

## Table of Contents

<!-- toc -->

-   [Install](#install)
    -   [Integration with webpack](#integration-with-webpack)
    -   [Entrypoints](#entrypoints)
-   [Usage](#usage)
    -   [Interactive Pages](#interactive-pages)
    -   [Components](#components)
-   [How It Works](#how-it-works)
-   [Testing](#testing)
-   [Maintainer](#maintainer)
-   [Contribute](#contribute)
-   [License](#license)

<!-- tocstop -->

## Install

The easiest way to get started with PRESS is to drop the script tag (and
dependencies) onto your page.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@urbandoor/press@latest/press.css">
<script src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@urbandoor/press@latest/press.min.js"></script>
```

> Yes, mixing jQuery and Vue seems a bit odd. Our site necessarily uses jQuery
> for other things, so from our point of view, it's not a huge addition and it
> saves us a lot of time by leveraging
> [prior art](http://www.daterangepicker.com/). Eventually (in a semver-major),
> we'll release a version of PRESS that makes our custom components optional and
> removes the jQuery dependency.

> If you intend to use the autocomplete component, you may need to polyfill
> `window.fetch()`. The easiest way to do so is with polyfill.io
>
> ```html
> <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
> ```
>
> But following the instructions for
> [whatwg-fetch](https://github.com/github/fetch) is probably a better long-term
> option.

Of course, PRESS is also available as an npm module:

```bash
npm install @urbandoor/press
```

> Note the peer dependency warnings; PRESS has a number of peers for setting up
> webpack.

> The npm version is intended for use with module bundlers: the following should
> also work, but is untested:

```html
<link rel="stylesheet" href="//node_modules/@urbandoor/press/press.css">
<script src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="//node_modules/@urbandoor/press/press.min.js"></script>
```

### Integration with webpack

We're building PRESS from npm in our main application project using webpacker.

Since the nature of Vue makes it a little tricky to distribute a
fully-functional library that still tree shakes effectively, you'll need to make
some changes to your webpack and postcss configs to use press. The following
webpack configuration _should_ add the PRESS JavaScript and CSS to your app.

> This config externalizes Vue and jQuery so they can be loaded directly from
> their CDNs rather than building them into your bundle.

```js
// webpack.config.js

'use strict';

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
    externals: {
        jQuery: 'jquery',
        vue: 'Vue'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new LodashModuleReplacementPlugin({paths: true})
    ]
};
```

```js
// postcss.config.js

'use strict';

module.exports = function({
    env,
    file,
    options: {autoprefixer = {}, cssnano = {}}
}) {
    return {
        plugins: {
            'postcss-import': {root: file.dirname},
            autoprefixer: env === 'production' ? autoprefixer : false,
            cssnano: env === 'production' ? cssnano : false
        }
    };
};
```

### Entrypoints

`package.json` defines a number of different entry points:

-   `main`: CommonJS entrypoint. The code specified by `main` has been fully
    compiled to meet the compatibility required by
    [`.browserslistrc`](./.browserslistrc). This is almost certainly the
    entrypoint preferred by your bundler, unless it's configured to look for
    `module`.
-   `module`: Like `main` this is fully compiled according to `.browserslistrc`,
    but uses EcmaScript modules instead of CommonJS requires so that your
    bundler can treeshake more effectively. Webpack and the like _may_ prefer
    this over `main` automatically.
-   `jsdelivr`: Identifies the bundle we create for the CDN.
-   `style`: A [defacto standard](https://github.com/postcss/postcss-import) for
    exporting css from `node_modules`. A reasonably standard postcss
    configuration should automatically target this entrypoint if you use
    `@import "@urbandoor/press" in your css.
-   `source`: raw source code. You almost certainly don't want to use this, but
    it if you're really concerned about filesize and want to, for example,
    supply your own set of values to `browserslist`, you might want to configure
    your bundle to target this entrypoint.

> If you're bundling assets yourself and you use one of the npm versions, make
> sure you make the full version of Vue available, not just the runtime. Since
> PRESS is intended to upgrade server-render html with Vue directives, you'll
> need to version of Vue that includes the template compiler. See the
> [dist README](https://github.com/vuejs/vue/blob/dev/dist/README.md) in the Vue
> package for details on configuring your bundler.

## Usage

1.  Initialize the PRESS JavaScript

    If using the CDN version, PRESS will automatically annotate your page once
    the script finishes loading. If you're using the version from npm, make sure
    to

    ```js
    require('@urbandoor/press');
    ```

    or

    ```js
    import '@urbandoor/press';
    ```

1.  Add the CSS

    > If you're using the
    > [postcss-import](https://github.com/postcss/postcss-import) plugin, you
    > should be able to simply

    ```css
    @import '@urbandoor/press';
    ```

1.  Vue refuses to work if its bound to the `body` tag, so add
    `[data-press-app]` to the boundary of interactive content on your page.

    ```html
    <html>
        <body>
            <main data-press-app></main>
        </body>
    </html>
    ```

### Interactive Pages

PRESS effectively does two things:

1.  Alter `input[type=date]` elements to be replaced by a custom Vue date picker
    component if those elements find themselves inside a Vue instance.
2.  Instantiate a Vue app for every `[data-press-app]` element on the page.

This means that within a server-rendered page, you can use Vue bindings for any
element that is a child of a `[data-press-app]`.

> In most cases, it should be adequate to add `data-press-app` to the first
> child of the `body` tag, but if you've got multiple pieces of functionality on
> a page, it may make sense to create several apps to prevent data sharing

```html
<div data-press-app>
    <div class="left">
        <form>
            <input name="count" type="number">
        </form>
    </div>
    <div class="right">{{count}}</div>
</div>
```

We use a few tricks to avoid rendering the templates until Vue takes over:

1.  Combine `v-if="false"` with a sibling `template` tag

```html
<p v-if="false">This text will be visible until Vue takes over</p>
<template><p>This text will be visible after Vue takes over</p></template>
```

1.  Use [`v-cloak`](https://vuejs.org/v2/api/#v-cloak). Let's say you have a
    complicated `v-if`. You don't want its contents to render until after Vue is
    running and the conditional can be evaluated.

    ```html
    <div v-if="magic()" v-cloak>
    </div>
    ```

> Previously, we recommended the class `.press-hide-until-mount` rather than
> `[v-cloak]`. This is still supported but is deprecated behavior that may be
> removed in a future version.

### Components

In addition to providing a framework for progressively enhancing server-rendered
HTML, press includes its own componets.

> Eventually, there will be a sem-ver major release that makes the components
> optional, but for now, they're required as are their dependencies

Each component in [./src/components/](./src/components/) has a README explaining
its usage.

## How It Works

PRESS executes a series of phases, decorating or replacing HTML as appropriate:

1.  Register PRESS components
1.  Infer intended components using the `infer()` method of each registered
    component. e.g. Find all `input[type="date"]` elements and add
    `[data-press-component="datepicker"]`
1.  For every element `el` that matches `[data-press-component]`, call the
    `enhance()` method of the specified component on `el`.
1.  For every element `el` that matches `[data-press-app]` but is not itself a
    child of an element that matches `[data-press-app]`, do the following

    1.  create an empty object `data`
    1.  for every child `child` of `el` matching `[name]:not([v-model])`, add a
        `v-model` attribute with the same value as the `name` attribute.
    1.  for every child of `child` of `el` with a `v-model`, add an entry to
        `data` at the keypath specified by the child's `v-model`; if the child's
        `value` attibute is defined, use that, otherwise, use `null`.
    1.  call the constructor specified by the value of `data-press-app`.

## Testing

Test are implemented using [Gherkin syntax](https://docs.cucumber.io/gherkin/)
and [Cucumber JS](https://github.com/cucumber/cucumber-js) via
[WebdriverIO](http://webdriver.io/). We're using WebdriverIO mostly for its
ability to launch multiple browsers and Gherkin for its ability to narrowly
scope failures (Reasonable but unfortunate implementation decisions in other
JavaScript selenium runners make it straightforward to know what test failed,
but not what step of the test failed).

Gherkin `feature` files are stored in `./features`. Step definitions are stored
in `./features/steps`. The files `given.js`, `then.js`, and `when.js` as well as
most everything in `./features/support` are taken pretty much directly from the
[WDIO Cucumber Boilerplate](https://github.com/webdriverio/cucumber-boilerplate)
(with adjustments made to support CommonJS instead of ESM).

## Maintainer

[Ian Remmel](https://github.com/ianwremmel)

## Contribute

PRs Welcome.

You can use `npm run plop -- component` to scaffold out a new PRESS component.

## License

[MIT](LICENSE) &copy; [Urbandoor Inc.](https://github.com/UrbanDoor) 2018 until
at least now
