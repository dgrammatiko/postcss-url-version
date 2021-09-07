const PostsCss = require('postcss');
const { join } = require('path');
const { existsSync, readFileSync } = require('fs');
const crypto = require('crypto');
const UrlVersion = require('../index.js');

const UrlProc = PostsCss([UrlVersion({
  version: (imagePath, sourceCssPath) =>{
    if (!sourceCssPath) {
      return 123;
    }

    if (
      existsSync(join(sourceCssPath, imagePath))
      && !(imagePath.startsWith('http') || imagePath.startsWith('//'))
      && existsSync(join(sourceCssPath, imagePath))
    ) {
      const fileBuffer = readFileSync(join(sourceCssPath, imagePath));
      const hashSum = crypto.createHash('md5');
      hashSum.update(fileBuffer);

      return '1631026846905';
    }

    return 123;
  }
})]);

const version = '?v=123';

const assert = (input, output, test) => {
  if (input === output) {
    console.log(`✅ Test ${test} passed`)
    // console.log({input: output})
  } else {
    console.log(`❌ Test ${test} failed`)
    console.log({[input]: output})
  }
}

// Tests based on the use cases from https://developer.mozilla.org/en-US/docs/Web/CSS/url()
(async () => {
  /**
   * Associated properties
   */
  assert(
    `body { background-image: url("https://mdn.mozillademos.org/files/16761/star.gif${version}"); }`,
    (await UrlProc.process('body { background-image: url("https://mdn.mozillademos.org/files/16761/star.gif"); }', { from: undefined })).css,
    'associated properties #1'
  );

  assert(
    `body { list-style-image: url("../images/bullet.jpg${version}"); }`,
    (await UrlProc.process("body { list-style-image: url('../images/bullet.jpg'); }", { from: undefined })).css,
    'Associated properties #2'
  );

  assert(
    `body { content: url("pdficon.jpg${version}"); }`,
    (await UrlProc.process('body { content: url("pdficon.jpg"); }', { from: undefined })).css,
    'Associated properties #3'
  );

  assert(
    `body { cursor: url("mycursor.cur${version}"); }`,
    (await UrlProc.process('body { cursor: url(mycursor.cur); }', { from: undefined })).css,
    'Associated properties #4'
  );

  assert(
    `body { border-image-source: url("/media/diamonds.png${version}"); }`,
    (await UrlProc.process('body { border-image-source: url(/media/diamonds.png); }', { from: undefined })).css,
    'Associated properties #5'
  );

  assert(
    `@font-face { font-family: 'Open Sans'; { src: url("fantasticfont.woff${version}"); } }`,
    (await UrlProc.process("@font-face { font-family: 'Open Sans'; { src: url('fantasticfont.woff'); } }", { from: undefined })).css,
    'Associated properties #6'
  );

  assert(
    `body { offset-path: url(#path); }`,
    (await UrlProc.process('body { offset-path: url(#path); }', { from: undefined })).css,
    'Associated properties #7'
  );

  assert(
    `body { mask-image: url("masks.svg${version}#mask1"); }`,
    (await UrlProc.process('body { mask-image: url("masks.svg#mask1"); }', { from: undefined })).css,
    'Associated properties #8'
  );

  /**
   * Properties with fallbacks
   */
  assert(
    `body { cursor: url("pointer.cur${version}"), pointer; }`,
    (await UrlProc.process('body { cursor: url(pointer.cur), pointer; }', { from: undefined })).css,
    'Properties with fallbacks #9'
  );


  /**
   * Associated short-hand properties
   */
  assert(
    `body { background: url("https://mdn.mozillademos.org/files/16761/star.gif${version}") bottom right repeat-x blue; }`,
    (await UrlProc.process('body { background: url("https://mdn.mozillademos.org/files/16761/star.gif") bottom right repeat-x blue; }', { from: undefined })).css,
    'Associated short-hand properties #10'
  );

  assert(
    `body { border-image: url("/media/diamonds.png${version}") 30 fill / 30px / 30px space; }`,
    (await UrlProc.process('body { border-image: url("/media/diamonds.png") 30 fill / 30px / 30px space; }', { from: undefined })).css,
    'Associated short-hand properties #11'
  );

  /**
   * As a parameter in another CSS function
   */
  assert(
    `body { background-image: cross-fade(20% url("first.png${version}"), url("second.png${version}")); }`,
    (await UrlProc.process('body { background-image: cross-fade(20% url(first.png), url(second.png)); }', { from: undefined })).css,
    'As a parameter in another CSS function #12'
  );

  assert(
    `body { mask-image: image(url("mask.png${version}"), skyblue, linear-gradient(rgba(0, 0, 0, 1.0), transparent)); }`,
    (await UrlProc.process('body { mask-image: image(url(mask.png), skyblue, linear-gradient(rgba(0, 0, 0, 1.0), transparent)); }', { from: undefined })).css,
    'As a parameter in another CSS function #13'
  );

  /**
   * As part of a non-shorthand multiple value
   */
  assert(
    `body { content: url("star.svg${version}") url("star.svg${version}") url("star.svg${version}") url("star.svg${version}") url("star.svg${version}"); }`,
    (await UrlProc.process('body { content: url(star.svg) url(star.svg) url(star.svg) url(star.svg) url(star.svg); }', { from: undefined })).css,
    'As part of a non-shorthand multiple value #14'
  );

  /**
   * At-rules
   */
  assert(
    `@document url("https://www.example.com/${version}")`,
    (await UrlProc.process('@document url("https://www.example.com/")', { from: undefined })).css,
    'At-rules #15'
  );

  assert(
    `@import url("https://www.example.com/style.css${version}");`,
    (await UrlProc.process('@import url("https://www.example.com/style.css");', { from: undefined })).css,
    'At-rules #16'
  );

  assert(
    `@namespace url("http://www.w3.org/1999/xhtml${version}")`,
    (await UrlProc.process('@namespace url(http://www.w3.org/1999/xhtml)', { from: undefined })).css,
    'At-rules #17'
  );

  /**
   * Associated properties reading a source file
   */
  assert(
    `body {\n  list-style-image: url("../images/bullet.jpg?v=1631026846905");\n}\n`,
    (await UrlProc.process(readFileSync('./tests/test.css'), { from: 'tests/test.css' })).css,
    'Associated properties with Source File #1'
  );

  assert(
    `body {\n  list-style-image: url("../images/bullet.jpg?v=123");\n}\n`,
    (await UrlProc.process(readFileSync('./tests/test.css'), { from: undefined })).css, //, { from: undefined }
    'Associated properties with Source File #2'
  );

  assert(
    `body {\n  list-style-image: url("../images/bullet.jpg?v=123");\n}\n`,
    (await UrlProc.process(readFileSync('./tests/test.css'))).css, //, { from: undefined }
    'Associated properties with Source File #2'
  );
})();
