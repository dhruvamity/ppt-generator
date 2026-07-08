let text = 'In \\triangleABC';
text = text.replace(/\\(triangle|angle|circ)([A-Za-z])/g, '\\$1 $2');
console.log(text);
