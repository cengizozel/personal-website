// Dev server: serves _site/ on localhost, rebuilds on source changes, and
// auto-reloads the browser via a server-sent-events endpoint injected into
// every HTML page.
const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFile } = require('child_process');

const OUT = '_site';
const PORT = process.env.PORT || 8080;
const IGNORE = [OUT, 'node_modules', '.git'];

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

const RELOAD_SCRIPT = `<script>
(() => {
    const card = document.createElement('div');
    card.style.cssText = 'display:none;position:fixed;bottom:16px;right:16px;z-index:99999;max-width:380px;background:#1c1c1e;color:#d8d8d8;border:1px solid rgba(229,72,77,0.4);border-radius:8px;padding:12px 28px 12px 14px;font:12px/1.5 monospace;box-shadow:0 4px 24px rgba(0,0,0,0.4);';
    document.body.appendChild(card);

    function showCard(item, isWarn) {
        card.textContent = '';
        card.style.borderColor = isWarn ? 'rgba(245,166,35,0.4)' : 'rgba(229,72,77,0.4)';
        const close = document.createElement('button');
        close.textContent = '\\u00d7';
        close.style.cssText = 'position:absolute;top:4px;right:8px;background:none;border:none;color:#8a8a8e;font:16px monospace;cursor:pointer;padding:2px;';
        close.onclick = () => { card.style.display = 'none'; };
        card.appendChild(close);
        const text = document.createElement('div');
        text.textContent = item.texts.join('\\n');
        text.style.cssText = 'white-space:pre-wrap;color:' + (isWarn ? '#e6c07b' : '#f2a0a0') + ';' + (item.snippet ? 'margin-bottom:8px;' : '');
        card.appendChild(text);
        if (item.snippet) {
            const hint = document.createElement('div');
            hint.textContent = 'Add this to the top of the file:';
            hint.style.cssText = 'color:#8a8a8e;margin-bottom:4px;';
            card.appendChild(hint);
            const pre = document.createElement('pre');
            pre.textContent = item.snippet;
            pre.style.cssText = 'margin:0;padding:8px 10px;background:#111;border-radius:6px;color:#c3d9c4;overflow-x:auto;';
            card.appendChild(pre);
            const copy = document.createElement('button');
            copy.textContent = 'copy';
            copy.style.cssText = 'margin-top:8px;padding:4px 10px;background:#2a2a2e;color:#d8d8d8;border:1px solid #3a3a3e;border-radius:6px;font:inherit;cursor:pointer;';
            copy.onclick = () => {
                navigator.clipboard.writeText(item.snippet + '\\n').then(() => {
                    copy.textContent = 'copied!';
                    setTimeout(() => { copy.textContent = 'copy'; }, 1500);
                });
            };
            card.appendChild(copy);
        }
        card.style.display = 'block';
    }

    // Mark listing entries and page titles of files with frontmatter warnings:
    // red + warning icon, click opens the card with the copyable template.
    function markBroken(items) {
        for (const item of items) {
            if (!item.file) continue;
            const target = item.file.replace(/\\.md$/, '.html');
            const mark = (el) => {
                if (el.dataset.devMarked) return;
                el.dataset.devMarked = '1';
                const label = el.querySelector('.project-title, .article-title') || el;
                label.style.color = '#e5484d';
                label.prepend('\\u26a0 ');
                el.style.cursor = 'pointer';
                el.title = item.texts.join('\\n');
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    showCard(item, true);
                });
            };
            document.querySelectorAll('a[href]').forEach((a) => {
                if (a.getAttribute('href').endsWith(target)) mark(a);
            });
            if (location.pathname.endsWith('/' + target)) {
                const heading = document.querySelector('.article-title, .project-title');
                if (heading) mark(heading);
            }
        }
    }

    new EventSource('/__reload').onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === 'reload') location.reload();
        if (msg.type !== 'error') return;
        if (msg.warn) markBroken(msg.items);
        else showCard(msg.items[0], false);
    };
})();
</script>`;
const clients = new Set();

let building = false;
let buildQueued = false;
let lastError = null;

function notify(msg) {
    for (const client of clients) client.write(`data: ${JSON.stringify(msg)}\n\n`);
}

// For frontmatter errors, offer a paste-ready template with the title guessed
// from the filename and today's date filled in.
function frontmatterSnippet(text) {
    const m = text.match(/^(articles|projects)\/(.+?)\.md: missing/);
    if (!m) return null;
    const title = m[2].split(/[-_]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
    if (m[1] === 'projects') {
        return `---\ntitle: ${title}\ntype: TODO\nthumbnail: TODO\ndescription: TODO\norder: 99\n---`;
    }
    const today = new Date().toLocaleDateString('sv');
    return `---\ntitle: ${title}\ndescription: TODO\ndate: ${today}\n---`;
}

function build() {
    if (building) {
        buildQueued = true;
        return;
    }
    building = true;
    execFile('node', ['build.js', '--lenient'], (err, stdout, stderr) => {
        building = false;
        process.stdout.write(stdout);
        if (err) {
            const text = (stderr.match(/^Error: (.*)$/m) || [null, stderr.trim() || err.message])[1];
            console.error(stderr.trim() || err.message);
            lastError = { type: 'error', items: [{ texts: [text], snippet: frontmatterSnippet(text) }] };
            notify(lastError);
        } else {
            const warns = [...stderr.matchAll(/^warn: (.*)$/gm)].map((m) => m[1]);
            if (warns.length) process.stderr.write(stderr);
            const items = [];
            for (const text of warns) {
                const file = (text.match(/^(articles|projects)\/\S+\.md(?=:)/) || [null])[0];
                let item = items.find((i) => i.file === file);
                if (!item) items.push(item = { file, texts: [], snippet: null });
                item.texts.push(text);
                if (!item.snippet) item.snippet = frontmatterSnippet(text);
            }
            lastError = items.length ? { type: 'error', warn: true, items } : null;
            notify({ type: 'reload' });
        }
        if (buildQueued) {
            buildQueued = false;
            build();
        }
    });
}

const server = http.createServer((req, res) => {
    if (req.url === '/__reload') {
        res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store' });
        res.write('\n');
        clients.add(res);
        if (lastError) res.write(`data: ${JSON.stringify(lastError)}\n\n`);
        req.on('close', () => clients.delete(res));
        return;
    }

    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let file = path.normalize(path.join(OUT, urlPath));
    if (!file.startsWith(OUT)) {
        res.writeHead(403).end('Forbidden');
        return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
        file = path.join(file, 'index.html');
    }
    if (!fs.existsSync(file)) {
        file = path.join(OUT, '404.html');
        if (!fs.existsSync(file)) {
            res.writeHead(404).end('Not found');
            return;
        }
        res.statusCode = 404;
    }

    const ext = path.extname(file).toLowerCase();
    let body = fs.readFileSync(file);
    if (ext === '.html') {
        body = body.toString().replace('</body>', `${RELOAD_SCRIPT}\n</body>`);
    }
    res.setHeader('Content-Type', TYPES[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(body);
});

let debounce;
fs.watch('.', { recursive: true }, (_, filename) => {
    if (!filename || IGNORE.some((dir) => filename === dir || filename.startsWith(dir + path.sep))) return;
    clearTimeout(debounce);
    debounce = setTimeout(() => {
        console.log(`Changed: ${filename}`);
        build();
    }, 100);
});

build();
server.listen(PORT, () => {
    console.log(`Serving http://localhost:${PORT} (watching for changes, Ctrl+C to stop)`);
});
