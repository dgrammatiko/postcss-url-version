# postcss-url-version

[![GitHub issues](https://img.shields.io/github/issues/dgrammatiko/postcss-url-version)](https://github.com/dgrammatiko/postcss-url-version/issues)
[![GitHub forks](https://img.shields.io/github/forks/dgrammatiko/postcss-url-version)](https://github.com/dgrammatiko/postcss-url-version/network)
[![GitHub license](https://img.shields.io/github/license/dgrammatiko/postcss-url-version)](https://github.com/dgrammatiko/postcss-url-version/blob/main/LICENSE)
![npm](https://img.shields.io/npm/v/postcss-url-version)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/dgrammatiko/postcss-url-version/Node.js%20CI)](https://github.com/dgrammatiko/postcss-url-version/actions)

[![Twitter](https://img.shields.io/twitter/url?url=https%3A%2F%2Ftwitter.com%2Fdgrammatiko)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fdgrammatiko%2Fpostcss-url-version)


Postcss-url-version is a simple PostCSS plugin that adds a hash on every `url` property.

### Usage
install it:
```bash
npm i -D postcss-url-version
```
Include it in your scripts:
```js
const UrlVersion = require('postcss-url-version');
```

Use as any other PostCSS plugin:
```js
Postcss([Autoprefixer, UrlVersion])...
```

## Options
There are 2 options, `version` and `variable`:
- `version` could be a function or a string
- `variable` could be a a string denoting the URLparam that will be used for the version

eg:

```js
const UrlVersion = require('postcss-url-version');
const versioned = UrlVersion({
  version: (new Date()).valueOf().toString(),
  variable: 'v',
});
Postcss([versioned])...

// Will produce something like url("https://mdn.mozillademos.org/files/16761/star.gif?v=1614866396902");
```

License MIT
