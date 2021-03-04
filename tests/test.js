const PostsCss = require('postcss');
const UrlVersion = require('../index.js');

const UrlProc = PostsCss([UrlVersion({
  version: ()=>{ return 123 }
})]);
const version = '?v=123';

const assert = (input, output, test) => {
  if (input === output) {
    console.log(`Test ${test} passed ✅`)
    // console.log({input: output})
  } else {
    console.log(`Test ${test} failed ❌`)
    // console.log({[input]: output})
  }
}

// Tests based on the use cases from https://developer.mozilla.org/en-US/docs/Web/CSS/url()
(async () => {
  /**
   * Associated properties
   */
  const test1 = await UrlProc.process('body { background-image: url("https://mdn.mozillademos.org/files/16761/star.gif"); }', { from: undefined });
  assert(
    `body { background-image: url("https://mdn.mozillademos.org/files/16761/star.gif${version}"); }`,
    test1.css,
    'associated properties #1'
  );

  const test2 = await UrlProc.process("body { list-style-image: url('../images/bullet.jpg'); }", { from: undefined });
  assert(
    `body { list-style-image: url("../images/bullet.jpg${version}"); }`,
    test2.css,
    'associated properties #2'
  );

  const test3 = await UrlProc.process('body { content: url("pdficon.jpg"); }', { from: undefined });
  assert(
    `body { content: url("pdficon.jpg${version}"); }`,
    test3.css,
    'associated properties #3'
  );

  const test4 = await UrlProc.process('body { cursor: url(mycursor.cur); }', { from: undefined });
  assert(
    `body { cursor: url("mycursor.cur${version}"); }`,
    test4.css,
    'associated properties #4'
  );

  const test5 = await UrlProc.process('body { border-image-source: url(/media/diamonds.png); }', { from: undefined });
  assert(
    `body { border-image-source: url("/media/diamonds.png${version}"); }`,
    test5.css,
    'associated properties #5'
  );

  const test6 = await UrlProc.process("@font-face { font-family: 'Open Sans'; { src: url('fantasticfont.woff'); } }", { from: undefined });
  assert(
    `@font-face { font-family: 'Open Sans'; { src: url("fantasticfont.woff${version}"); } }`,
    test6.css,
    'associated properties #6'
  );

  const test7 = await UrlProc.process('body { offset-path: url(#path); }', { from: undefined });
  assert(
    `body { offset-path: url(#path); }`,
    test7.css,
    'associated properties #7'
  );

  const test8 = await UrlProc.process('body { mask-image: url("masks.svg#mask1"); }', { from: undefined });
  assert(
    `body { mask-image: url("masks.svg${version}#mask1"); }`,
    test8.css,
    'associated properties #8'
  );

  /**
   * Properties with fallbacks
   */
  const test9 = await UrlProc.process('body { cursor: url(pointer.cur), pointer; }', { from: undefined });
  assert(
    `body { cursor: url("pointer.cur${version}"), pointer; }`,
    test9.css,
    'Properties with fallbacks #9'
  );


  /**
   * Associated short-hand properties
   */
  const test10 = await UrlProc.process('body { background: url("https://mdn.mozillademos.org/files/16761/star.gif") bottom right repeat-x blue; }', { from: undefined });
  assert(
    `body { background: url("https://mdn.mozillademos.org/files/16761/star.gif${version}") bottom right repeat-x blue; }`,
    test10.css,
    'Associated short-hand properties #10'
  );

  const test11 = await UrlProc.process('body { border-image: url("/media/diamonds.png") 30 fill / 30px / 30px space; }', { from: undefined });
  assert(
    `body { border-image: url("/media/diamonds.png${version}") 30 fill / 30px / 30px space; }`,
    test11.css,
    'Associated short-hand properties #11'
  );

  /**
   * As a parameter in another CSS function
   */
  const test12 = await UrlProc.process('body { background-image: cross-fade(20% url(first.png), url(second.png)); }', { from: undefined });
  assert(
    `body { background-image: cross-fade(20% url("first.png${version}"), url("second.png${version}")); }`,
    test12.css,
    'As a parameter in another CSS function #12'
  );

  const test13 = await UrlProc.process('body { mask-image: image(url(mask.png), skyblue, linear-gradient(rgba(0, 0, 0, 1.0), transparent)); }', { from: undefined });
  assert(
    `body { mask-image: image(url("mask.png${version}"), skyblue, linear-gradient(rgba(0, 0, 0, 1.0), transparent)); }`,
    test13.css,
    'As a parameter in another CSS function #13'
  );

  /**
   * As part of a non-shorthand multiple value
   */
  const test14 = await UrlProc.process('body { content: url(star.svg) url(star.svg) url(star.svg) url(star.svg) url(star.svg); }', { from: undefined });
  assert(
    `body { content: url("star.svg${version}") url("star.svg${version}") url("star.svg${version}") url("star.svg${version}") url("star.svg${version}"); }`,
    test14.css,
    'As part of a non-shorthand multiple value #14'
  );

  /**
   * At-rules
   */
  const test15 = await UrlProc.process('@document url("https://www.example.com/")', { from: undefined });
  assert(
    `@document url("https://www.example.com/${version}")`,
    test15.css,
    'At-rules #15'
  );

  const test16 = await UrlProc.process('@import url("https://www.example.com/style.css");', { from: undefined });
  assert(
    `@import url("https://www.example.com/style.css${version}");`,
    test16.css,
    'At-rules #16'
  );

  const test17 = await UrlProc.process('@namespace url(http://www.w3.org/1999/xhtml)', { from: undefined });
  assert(
    `@namespace url("http://www.w3.org/1999/xhtml${version}")`,
    test17.css,
    'At-rules #17'
  );
})();
