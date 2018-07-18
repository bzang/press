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
    -   [Entrypoints](#entrypoints)
-   [Usage](#usage)
    -   [Forms](#forms)
    -   [Interactive Pages](#interactive-pages)
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
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js" integrity="sha256-/GKyJ0BQJD8c8UYgf7ziBrs/QgcikS7Fv/SaArgBcEI=" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vee-validate@latest/dist/vee-validate.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@urbandoor/press"></script>
```

Of course, PRESS is also available as an npm module:

```bash
npm install @urbandoor/press
```

> The npm version is intended for use with module bundlers: the following should
> also work, but is untested:

```html
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js" integrity="sha256-/GKyJ0BQJD8c8UYgf7ziBrs/QgcikS7Fv/SaArgBcEI=" > crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vee-validate@latest/dist/vee-validate.js"></script>
<script src="//node_modules/@urbandoor/press/press.min.js"></script>
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
    const {press} = require('@urbandoor/press');
    press();
    ```

    or

    ```js
    import {press} from '@urbandoor/press';
    press();
    ```

1.  Add the CSS

    ```css
    .press-hide-until-mount {
        display: none;
    }

    .press-mounted .press-hide-until-mount {
        display: initial;
    }
    ```

    > If you're using the
    > [postcss-import](https://github.com/postcss/postcss-import) plugin, you
    > should be able to simply

    ```css
    @import '@urbandoor/press';
    ```

### Forms

The motivating use-case for PRESS was client-side validation of HTML `<form>`s.
PRESS relies on `v-validate` for input validation.

Once the PRESS JavaScript loads on your site, it will automatically upgrade
`<form>` elements to Vue apps.

-   The `<form>`'s default validation behavior will be overridden to rely on
    VeeValidate.
-   Every input element with a `name` attribute will be annotated with a
    `v-model` attibute of the same name and an `v-validate` attribute (an empty
    `v-validate` attribute is enough to tell VeeValidate to infer rules based on
    HTML5 attributes like `type` and `required`.

> PRESS _will not_ render validation errors without server-side assistance. See
> [Form Validation](#form-validation) for details.

For example, the following HTML

```html
<form>
    <input name="email" required type="email">
</form>
```

becomes

```html
<form class="press-mounted" novalidate @submit.prevent="validateBeforeSubmit">
    <input name="email" required type="email" v-validate v-model="email">
</form>
```

If you've already specified the `v-model` or `v-validate` attributes in your
html, they will not be overridden.

```html
<form>
    <input name="start" required type="date" v-model="start">
    <input name="end" required type="date" v-model="end" v-validate="'after:start'">
</form>
```

becomes

```html
<form class="press-mounted" novalidate @submit.prevent="validateBeforeSubmit">
    <input name="start" required type="date" v-model="start" v-validate>
    <input name="end" required type="date" v-model="end" v-validate="'after:start'">
</form>
```

#### Form Validation

Errors need somewhere to render, but since PRESS doesn't know what UI framework
you're using (if any), PRESS doesn't know how to render errors appropriately.
You need to alter your input templates to always include the appropriate error
output template for your style system, hidden by a `v-if`. For Semantic-UI,
convert

```html
<form>
    <div class="field">
        <label for="email_address">Your Email</label>
        <input id="email_address" name="email_address" type="email">
    </div>
</form>
```

to

```html
<form>
    <div class="field">
        <label for="email_address">Your Email</label>
        <input id="email_address" name="email_address" type="email">
        <div class="error press-hide-until-mount" v-if="errors.has('email_address')">
            {{errors.first('email_address')}}
        </div>
    </div>
</form>
```

> Note the `.press-hide-until-mount` class. This prevents nodes should be hidden
> by `v-if=false` from being visible until Vue has token over and `v-if` has an
> effect. If you're going to present server-side validation errors, you'll want
> to omit this class when appropriate.
>
> `errors` is straight out of VeeValidate`, so checkout the
> [VeeValidate API Docs](https://baianat.github.io/vee-validate/api/errorbag.html)
> for other ways you might access error messages

#### Custom Validation

VeeValidate has a
[very rich set](https://baianat.github.io/vee-validate/guide/rules.html) of form
validations plus a flexible
[extension facility](https://baianat.github.io/vee-validate/guide/custom-rules.html).
Custom form validation with PRESS works just like VeeValidate; just make sure to
register your validations before PRESS decorates your page.

### Interactive Pages

> Nothing in this section is true, yet.

What if you want to update HTML outside of a form as the form gets filled out?
The `data-press-app` attribute let's you declare the DOM-node the root element
of a PRESS app. In other words, every element discovered with the selector
`[data-press-app]` will be passed to `new Vue({el: el})`.

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

## How It Works

> This section is approximately true; `data-press-app` nested within
> `data-press-app` is not currently supported

PRESS makes a series of passes over a page, decorating or replacing HTML as
appropriate:

1.  Add `data-press-app="form"` to any `<form>` that meets the following
    criteria:

    -   The `<form>` does not already have a `data-press-app` assignment

1.  Add `v-model` and `v-validate` to any input-like element that meets the
    following criteria

    -   The element has a `name` attribute
    -   The element is a child of an element that matches `[data-press-app]`.

1.  For every element `el` that matches `[data-press-app]` but is not itself a
    child of an element that matches `[data-press-app]`, do the following

    1.  create an empty object `data`
    1.  for every child of `el` with a `v-model`, add an entry to `data` at the
        keypath specified by the child's `v-model`; if the child's `value`
        attibute is defined, use that, otherwise, use `null`.
    1.  call the constructor specified by the value of `data-press-app`.

> Point three presently represents neither intended nor implemented behavior.
> Apps within apps are still being designed.

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

PRs Welcome

## License

[UNLICENSED](LICENSE) &copy; [Ian Remmel](https://github.com/ianwremmel) 2018
until at least now
