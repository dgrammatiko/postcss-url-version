/**
 * Author: Dimitris Grammatikogiannis
 * License: MIT
 */
const { existsSync } = require('fs');
const { dirname, resolve } = require('path');

// List from https://developer.mozilla.org/en-US/docs/Web/CSS/url()
const supportingUrl = [
  'background',
  'background-image',
  'border-image',
  'border-image-source',
  'content',
  'cue',
  'cue-after',
  'cue-before',
  'cursor',
  'font-face',
  'list-style',
  'list-style-image',
  'mask',
  'mask-image',
  'offset-path',
  'play-during',
  'src',
];

const regexURL = /url\((.*?)\)/gi;
const defaultOptions = {
  version: (imagePath, sourceCssPath) =>{
    if (!sourceCssPath) {
      return (new Date()).valueOf().toString();
    }

    const directory = dirname(sourceCssPath);
    if (
      existsSync(resolve(`${directory}/${imagePath}`))
      && !(imagePath.startsWith('http') || imagePath.startsWith('//'))
      && existsSync(resolve(`${directory}/${imagePath}`))
    ) {
      const fileBuffer = readFileSync(resolve(`${directory}/${imagePath}`));
      const hashSum = crypto.createHash('md5');
      hashSum.update(fileBuffer);

      return hashSum.digest('hex');
    }

    return (new Date()).valueOf().toString();
  },
  variable: 'v',
};

const processChunk = (value, decl, opts) => {
  const innerUrl = value.match(regexURL)
  if (innerUrl && innerUrl.length) {
    if (innerUrl[0].startsWith('url("data:') || innerUrl[0].startsWith('url(\'data:')) {
      return value;
    }
    let final = value
    innerUrl.forEach(element => {
      const newVal = element.match(/url\((.*?)\)/)
      const tmp = newVal[1].replace(/["']/g, '').split('#');
      let url = tmp[0];
      if (url === '') { return value; }
      if (url.endsWith('?')) { url = url.replace('?', ''); } // IE EOT Case
      if (url.includes('?')) { return value; } // There's a version string so we skip
      const link = tmp[1];
      let result;
      result = `${url}?${defaultOptions.variable}=${opts.version(url, decl)}`;
      result = link ? `${result}#${link}` : result;
      result = `url("${result}")`;
      final = final.replace(element, result);
    });

    return final
  }
  return value;
};

const processValue = (value, decl, opts) => {
  if (!value.includes('url(')) {
    return value;
  }
  if (value.startsWith('url("data:') || value.startsWith('url(\'data:')) {
    return value;
  }
  const chunksValue = value.split(',');
  if (chunksValue.length) {
    const chunks = chunksValue.map((chunk) => processChunk(chunk, decl, opts));
    return chunks.join(',');
  }
  return processChunk(value, decl, opts);
};

module.exports = (opts) => {
  return {
    postcssPlugin: 'postcss-url-versioner',
    Once(root) {
      // eslint-disable-next-line consistent-return
      root.walkDecls((decl) => {
        if (supportingUrl.includes(decl.prop)) {
          decl.value = processValue(decl.value, root.source.input.file, opts);
        }
      });
      // Imports
      root.walkAtRules(atRule => {
        if (['import', 'document', 'namespace'].includes(atRule.name)) {
          atRule.params = processValue(atRule.params, root.source.input.file, opts);
        }
      })
    },
  };
};

module.exports.postcss = true;
