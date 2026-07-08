const katex = require('katex');
try {
    katex.renderToString('\\angle ABC = 45^\\circ');
} catch(e) {
    console.log(e.message);
}
try {
    katex.renderToString('\\\\angle ABC = 45^\\\\circ');
} catch(e) {
    console.log(e.message);
}
