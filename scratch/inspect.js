const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');

const htmlWithScript = fs.readFileSync('index.html', 'utf8')
    .replace('<head>', '<head><base href="http://localhost:8089/">')
    .replace('</body>', `
<script>
window.addEventListener('load', () => {
    const bars = document.querySelector('.fa-bars');
    const barsRect = bars ? bars.getBoundingClientRect() : null;
    const nav = document.querySelector('nav');
    const navRect = nav ? nav.getBoundingClientRect() : null;
    const bodyW = document.body.offsetWidth;
    const docW = document.documentElement.offsetWidth;
    const scrollW = document.documentElement.scrollWidth;

    const data = {
        viewportW: window.innerWidth,
        docW,
        scrollW,
        bodyW,
        navRect,
        barsRect,
        barsDisplay: bars ? window.getComputedStyle(bars).display : null,
        barsColor: bars ? window.getComputedStyle(bars).color : null,
        barsVisible: bars ? (bars.offsetWidth > 0 && bars.offsetHeight > 0) : false
    };

    // Find all overflowing elements
    const bad = [];
    document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > window.innerWidth + 2) {
            bad.push({
                tag: el.tagName,
                cls: el.className,
                id: el.id,
                right: Math.round(r.right),
                width: Math.round(r.width)
            });
        }
    });
    data.overflowing = bad;

    const div = document.createElement('div');
    div.id = 'inspect-result';
    div.innerText = JSON.stringify(data, null, 2);
    document.body.appendChild(div);
});
</script>
</body>`);

fs.writeFileSync('scratch/inspect.html', htmlWithScript);

try {
    const output = execSync('\"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\" --headless --disable-gpu --virtual-time-budget=2000 --window-size=390,844 --dump-dom \"http://localhost:8089/scratch/inspect.html\"', { encoding: 'utf8' });
    const match = output.match(/<div id="inspect-result">([\s\S]*?)<\/div>/);
    if (match) {
        console.log(match[1]);
    } else {
        console.log('No result match');
    }
} catch (e) {
    console.error('Error running chrome:', e.message);
}
