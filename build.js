// Builds the site into _site/: copies the static files, then renders
// articles/*.md into pages/articles/<slug>.html and the article listing.
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const OUT = '_site';
const SITE_URL = 'https://www.cengizozel.com';
const STATIC = ['CNAME', 'index.html', 'css', 'js', 'files', 'pages'];

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fill(template, values) {
    return template.replace(/{{(\w+)}}/g, (_, key) => {
        if (!(key in values)) throw new Error(`No value for {{${key}}}`);
        return values[key];
    });
}

function parseArticle(file) {
    const raw = fs.readFileSync(path.join('articles', file), 'utf8');
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) throw new Error(`${file}: missing front matter`);
    const meta = {};
    for (const line of match[1].split('\n')) {
        const colon = line.indexOf(':');
        if (colon > 0) meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
    }
    for (const key of ['title', 'description', 'date']) {
        if (!meta[key]) throw new Error(`${file}: missing "${key}" in front matter`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`${file}: date must be YYYY-MM-DD`);
    return { slug: file.replace(/\.md$/, ''), meta, content: marked.parse(match[2]) };
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'pages', 'articles'), { recursive: true });
for (const entry of STATIC) {
    fs.cpSync(entry, path.join(OUT, entry), { recursive: true });
}

const articleTemplate = fs.readFileSync('templates/article.html', 'utf8');
const listingTemplate = fs.readFileSync('templates/articles.html', 'utf8');

const articles = fs.readdirSync('articles').filter((f) => f.endsWith('.md')).map(parseArticle);
articles.sort((a, b) => b.meta.date.localeCompare(a.meta.date));

for (const article of articles) {
    const dateHuman = new Date(article.meta.date + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
    const page = fill(articleTemplate, {
        title: escapeHtml(article.meta.title),
        description: escapeHtml(article.meta.description),
        url: `${SITE_URL}/pages/articles/${article.slug}.html`,
        date_human: dateHuman,
        content: article.content,
    });
    fs.writeFileSync(path.join(OUT, 'pages', 'articles', `${article.slug}.html`), page);
}

const list = articles.map((article) => `            <div class="article">
                <div class="article-date"><time datetime="${article.meta.date}">${article.meta.date}</time></div>
                <div class="article-title"><a href="articles/${article.slug}.html">${escapeHtml(article.meta.title)}</a></div>
                <div class="article-description">${escapeHtml(article.meta.description)}</div>
            </div>`).join('\n');
fs.writeFileSync(path.join(OUT, 'pages', 'articles.html'), fill(listingTemplate, { list: '\n' + list + '\n        ' }));

console.log(`Built ${articles.length} articles into ${OUT}/`);
