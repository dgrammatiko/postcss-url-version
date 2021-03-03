# postcss-url-version

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
