// Shared by the editor and standalone export. Keep this function self-contained
// so the downloaded HTML can embed it.
export function fitSlideBox(box) {
    Object.assign(box.style, {
        transformOrigin: '0 0', transform: '', width: '100%', height: '100%',
        flex: '0 0 auto', overflow: '',
    });
    if (!box.clientWidth || !box.clientHeight) return true;
    const fits = () => box.scrollHeight <= box.clientHeight + 1
        && box.scrollWidth <= box.clientWidth + 1;
    for (const scale of [0.9, 0.8, 0.7, 0.6, 0.5]) {
        if (fits()) return true;
        Object.assign(box.style, {
            transform: 'scale(' + scale + ')',
            width: (100 / scale) + '%',
            height: (100 / scale) + '%',
        });
    }
    if (fits()) return true;
    box.style.overflow = 'auto';
    return false;
}
