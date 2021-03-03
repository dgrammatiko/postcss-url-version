/**
 * Author: Dimitris Grammatikogiannis
 * License: MIT
 */

// List from https://developer.mozilla.org/en-US/docs/Web/CSS/url()
const supportingUrl = [
  '@import',
  '@document',
  '@namespace',
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

const regexURL = /\((.*?)\)/;
const defaultOptions = {
  version: () => (new Date()).valueOf().toString(),
  variable: 'v',
};

const getVersion = () => {
  const { version } = defaultOptions;
  if (typeof version === 'function') {
    return defaultOptions.version();
  }
  return version;
};

const processChunk = (value) => {
  if (!value.startsWith('url(') || (value.startsWith('url(') && (value.startsWith('url("data:') || value.startsWith('url(\'data:')))) {
    return value;
  }

  const tmp = value.match(regexURL)[1].replace(/["']/g, '').split('#');
  let url = tmp[0];
  if (url.endsWith('?')) { url = url.replace('?', ''); } // IE EOT Case
  if (url.includes('?')) { return value; } // There's a version string so we skip
  const link = tmp[1];
  let result;
  result = `${url}?${defaultOptions.variable}=${getVersion(url)}`;
  result = link ? `${result}#${link}` : result;
  result = `url("${result}")`;
  return result;
};

const processValue = (value) => {
  const chunksValue = value.split(' ');
  if (chunksValue.length > 1) {
    const chunks = chunksValue.map((chunk) => processChunk(chunk));
    return chunks.join(' ');
  }
  return processChunk(value);
};

module.exports = (opts) => {
  Object.assign(defaultOptions, opts);
  return {
    postcssPlugin: 'postcss-url-versioner',
    Once(root) {
      // eslint-disable-next-line consistent-return
      root.walkDecls((decl) => {
        if (supportingUrl.includes(decl.prop) && decl.value.startsWith('url(')) {
          if (decl.value.startsWith('url("data:') || decl.value.startsWith('url(\'data:')) {
            return decl.value;
          }

          decl.value = processValue(decl.value);
        }
      });
    },
  };
};

module.exports.postcss = true;
