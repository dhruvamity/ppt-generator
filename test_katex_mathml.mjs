import katex from 'katex';

const tex = '\\\\angle ABC = 45^\\\\circ';
const html = katex.renderToString(tex, { output: 'mathml' });
console.log(html);
