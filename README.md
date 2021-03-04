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

License MIT
