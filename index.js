/**
 * Author: Dimitris Grammatikogiannis
 * License: MIT
 */
const { existsSync } = require('fs');
const { dirname, resolve } = require('path');
const { createHash } = require('crypto');
const IS_VAR_PROP = /(--(.+))/;

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
  variable: 'v',
  version: (imagePath, sourceCssPath) =>{
    if (!sourceCssPath || (url.startsWith('http') || url.startsWith('//')))
      return (new Date()).valueOf().toString();

    if (existsSync(resolve(`${dirname(sourceCssPath)}/${imagePath}`)))
      return (createHash('md5')).update(readFileSync(resolve(`${dirname(sourceCssPath)}/${imagePath}`))).digest('hex');

    return (new Date()).valueOf().toString();
  },
};

const processChunk = (value, decl, versionFn) => {
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
      result = `${url}?${defaultOptions.variable}=${versionFn(url, decl)}`;
      result = link ? `${result}#${link}` : result;
      result = `url("${result}")`;
      final = final.replace(element, result);
    });

    return final
  }
  return value;
};

const processValue = (value, decl, versionFn) => {
  if (!value.includes('url(') || value.startsWith('url("data:') || value.startsWith('url(\'data:')) {
    return value;
  }
  const chunksValue = value.split(',');
  if (chunksValue.length) {
    const chunks = chunksValue.map((chunk) => processChunk(chunk, decl, versionFn));
    return chunks.join(',');
  }
  return processChunk(value, decl, versionFn);
};

module.exports = (opts) => {
  const options = Object.assign({}, defaultOptions, opts);
  return {
    postcssPlugin: 'postcss-url-versioner',
    Once(root) {
      // eslint-disable-next-line consistent-return
      root.walkDecls((decl) => {
        if (supportingUrl.includes(decl.prop) || IS_VAR_PROP.test(decl.prop)) {
          decl.value = processValue(decl.value, root.source.input.file, options.version);
        }
      });
      // Imports
      root.walkAtRules(atRule => {
        if (['import'].includes(atRule.name)) { // SKIP 'document', 'namespace'
          atRule.params = processValue(atRule.params, root.source.input.file, options.version);
        }
      })
    },
  };
};

module.exports.postcss = true;
