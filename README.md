# Gatsby #1659

This is a detailed reproduction of the Gatsby CSS module bug [documented in GitHub issue #1659](https://github.com/gatsbyjs/gatsby/issues/1659).

## Environment Details

- Node v7.7.3
- Yarn v0.27.5
- macOS Sierra 10.12.6
- Google Chrome 59

JavaScript dependencies are specified in the `yarn.lock` file for each branch of this repo.

## Steps to Reproduce

1. Set up a Gatsby site with components using CSS modules in such a way that triggers the bug (see **Import Graph** below).
2. Run `gatsby build` to generate the site.
3. Observe the failures (see **Branches** below).

## Import Graph

Starting a new Gatsby site from scratch and adding CSS Modules seems to work fine. The bug documented here is triggered by setting up a combination of React component imports and CSS Module imports.

See the `src/components` directory of this repo for an example setup that triggers the bug.

This behaviour (or something closely related) was also identified by @0xc0dec, who [posted the following details](https://github.com/gatsbyjs/gatsby/issues/1659#issuecomment-318887255):

> Also what's really weird is that this happens in my project only when there are more than 3 such page components (importing X). For <= 3 it builds fine.

> When a component imports styles and is itself being imported (even indirectly) several times this error occurs.

Both of these comments hint at what’s going on. It’s still not clear exactly what combinations of JS and CSS imports are breaking. It seems to be related to cyclic dependencies in the import graph.

## Branches

This problem manifests differently in different versions of Gatsby.

Due to the extreme difficulty of debugging and diagnosing the problem (there are far too many libraries interacting with a level of complexity that’s near impossible for an end-user to understand without spending hours or days learning about the interactions between Gatsby, Webpack, PostCSS, Sass, CSS Modules, etc...), I’ve split this repo up into multiple branches which each illustrate specific aspects of the issue.

### Gatsby 1.3+ (`gatsby-1.3` branch)

The following error is produced during the `Compiling production bundle.js` step of `gatsby build`:

```
crypto.js:74
  this._handle.update(data, encoding);
               ^

TypeError: Data must be a string or a buffer
    at Hash.update (crypto.js:74:16)
    at /Users/Daisy/Projects/gatsby-1659/node_modules/gatsby/dist/utils/get-hash-fn.js:22:10
    at /Users/Daisy/Projects/gatsby-1659/node_modules/gatsby/dist/utils/hashed-chunk-ids-plugin.js:20:22
    at Array.forEach (native)
    at Compilation.<anonymous> (/Users/Daisy/Projects/gatsby-1659/node_modules/gatsby/dist/utils/hashed-chunk-ids-plugin.js:18:14)
    at Compilation.applyPlugins (/Users/Daisy/Projects/gatsby-1659/node_modules/tapable/lib/Tapable.js:26:37)
    at Compilation.<anonymous> (/Users/Daisy/Projects/gatsby-1659/node_modules/webpack/lib/Compilation.js:545:8)
    at Compilation.applyPluginsAsync (/Users/Daisy/Projects/gatsby-1659/node_modules/tapable/lib/Tapable.js:60:69)
    at Compilation.seal (/Users/Daisy/Projects/gatsby-1659/node_modules/webpack/lib/Compilation.js:525:7)
    at Compiler.<anonymous> (/Users/Daisy/Projects/gatsby-1659/node_modules/webpack/lib/Compiler.js:397:15)
    at /Users/Daisy/Projects/gatsby-1659/node_modules/tapable/lib/Tapable.js:103:11
    at Compilation.<anonymous> (/Users/Daisy/Projects/gatsby-1659/node_modules/webpack/lib/Compilation.js:445:10)
    at /Users/Daisy/Projects/gatsby-1659/node_modules/webpack/lib/Compilation.js:417:12
    at /Users/Daisy/Projects/gatsby-1659/node_modules/webpack/lib/Compilation.js:332:10
    at /Users/Daisy/Projects/gatsby-1659/node_modules/async/lib/async.js:52:16
    at done (/Users/Daisy/Projects/gatsby-1659/node_modules/async/lib/async.js:246:17)
```

This results in `gatsby build` failing, meaning the site does not successfully compile.

### Gatsby 1.2 (`gatsby-1.2` branch)

The `gatsby-1.2` branch demonstrates what looks like a related issue but with a different error condition when running on Gatsby 1.2.

In this situation, `gatsby build` successfully completes. Adding several additional components with CSS modules is sufficient to trigger the error which can be reproduced as follows:

```
gatsby build
cd public
python -m SimpleHTTPServer 8000
```

Visiting one of the site URLs results in the site crashing with the following error visible in the JavaScript console:

```
bootstrap 4c83f00…:52 Uncaught TypeError: Cannot read property 'call' of undefined
    at t (bootstrap 4c83f00…:52)
    at Object../node_modules/css-loader/index.js?modules&minimize&importLoaders=1!./node_modules/sass-loader/index.js!./src/components/LogoPage.module.scss (page-component---src-pages-page-2-js-b37f85c….js:1)
    at t (bootstrap 4c83f00…:52)
    at Object../src/components/LogoPage.module.scss (page-component---src-pages-page-2-js-b37f85c….js:1)
    at t (bootstrap 4c83f00…:52)
    at Object../src/components/LogoPage.js (page-component---src-pages-page-2-js-b37f85c….js:1)
    at t (bootstrap 4c83f00…:52)
    at Object../node_modules/babel-loader/lib/index.js?{"plugins":["/Users/Daisy/Projects/gatsby-1659/node_modules/gatsby/dist/utils/babel-plugin-extract-graphql.js","/Users/Daisy/Projects/gatsby-1659/node_modules/babel-plugin-add-module-exports/lib/index.js","/Users/Daisy/Projects/gatsby-1659/node_modules/babel-plugin-add-module-exports/lib/index.js","/Users/Daisy/Projects/gatsby-1659/node_modules/babel-plugin-transform-object-assign/lib/index.js"],"presets":["/Users/Daisy/Projects/gatsby-1659/node_modules/babel-preset-env/lib/index.js","/Users/Daisy/Projects/gatsby-1659/node_modules/babel-preset-stage-0/lib/index.js","/Users/Daisy/Projects/gatsby-1659/node_modules/babel-preset-react/lib/index.js"],"cacheDirectory":true}!./src/pages/page-2.js (page-component---src-pages-page-2-js-b37f85c….js:1)
    at t (bootstrap 4c83f00…:52)
    at page-2.js?bd0e:11
```

### Differences between 1.2 and 1.3?

Some builds with CSS Modules that break on 1.3 are working on 1.2. This suggests that something was introduced or a dependency was upgraded at this version bump which impacts on the behaviour documented here.

## Impacts

This issue is a showstopper as far as working with CSS Modules in Gatsby is concerned. It’s not obvious what does and doesn’t work, and has the potential to lead to great frustration and wasted time.

If this is a Webpack or CSS Modules issue and is not related to Gatsby, then this feedback and bug report will need to move to another repo where the problem can be addressed.
