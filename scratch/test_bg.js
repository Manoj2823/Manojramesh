const { execSync } = require('child_process');
const fs = require('fs');

const positions = [
    { name: 'right_top', pos: 'right top' },
    { name: 'center_top', pos: 'center top' },
    { name: 'center_center', pos: 'center' },
    { name: 'pct80_top', pos: '80% top' }
];

let css = fs.readFileSync('style.css', 'utf8');

positions.forEach(p => {
    let testCss = css.replace(/#header\s*\{\s*background-image:\s*url\('image\/phn img\.png'\);\s*background-size:\s*cover;\s*background-position:[^;]+;/, 
        `#header { background-image: url('image/phn img.png'); background-size: cover; background-position: ${p.pos};`);
    fs.writeFileSync('scratch/style_' + p.name + '.css', testCss);

    let testHtml = fs.readFileSync('index.html', 'utf8')
        .replace('<head>', '<head><base href="http://localhost:8089/">')
        .replace('style.css', 'scratch/style_' + p.name + '.css');
    fs.writeFileSync('scratch/' + p.name + '.html', testHtml);

    execSync(`\"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\" --headless --disable-gpu --window-size=390,844 --screenshot=\"C:\\Users\\manoj\\.gemini\\antigravity\\brain\\83105814-e911-4958-8c6b-3efa71c90a44\\scratch\\screen_${p.name}.png\" \"http://localhost:8089/scratch/${p.name}.html\"`);
});

console.log('All screenshots generated!');
