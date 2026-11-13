// Keep table rows together and repeat their header when a shared passage spans slides.
export function passagePages(text, budget = 1050) {
    if (!text) return [];
    const lines = text.split('\n');
    if (text.length <= budget && lines.length <= 22) return [];
    const pages = [];
    let page = '';
    let linesOnPage = 0;
    const push = part => {
        const lineCount = part.split('\n').length;
        if (page && (page.length + part.length + 1 > budget || linesOnPage + lineCount > 22)) {
            pages.push(page.trim());
            page = '';
            linesOnPage = 0;
        }
        page += (page ? '\n' : '') + part;
        linesOnPage += lineCount;
    };
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        if (/^\s*\|/.test(line) && /^\s*\|?\s*:?-{2,}/.test(lines[index + 1] || '')) {
            const header = line + '\n' + lines[++index];
            let table = header;
            let rows = 0;
            while (/^\s*\|/.test(lines[index + 1] || '')) {
                const row = lines[++index];
                if (table !== header && (table.length + row.length > budget || rows >= 18)) {
                    push(table);
                    table = header;
                    rows = 0;
                }
                table += '\n' + row;
                rows++;
            }
            push(table);
        } else {
            // A math expression is atomic. Other prose may wrap at words.
            for (const chunk of line.match(/(?:\$\$.*?\$\$|\$[^$]*\$|[^$\s]+|\$)\s*/g)?.reduce((chunks, word) => {
                if (!chunks.length || chunks.at(-1).length + word.length > budget) chunks.push(word);
                else chunks[chunks.length - 1] += word;
                return chunks;
            }, []) || ['']) push(chunk);
        }
    }
    if (page.trim()) pages.push(page.trim());
    return pages;
}
