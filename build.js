// Builds the site into _site/: copies the static files, renders articles/*.md
// and projects/*.md into real pages, and generates the listings, RSS feed,
// and sitemap.
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const OUT = '_site';
const SITE_URL = 'https://www.cengizozel.com';
const STATIC = ['CNAME', 'robots.txt', 'index.html', 'css', 'js', 'files'];

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fill(template, values) {
    return template.replace(/{{(\w+)}}/g, (_, key) => {
        if (!(key in values)) throw new Error(`No value for {{${key}}}`);
        return values[key];
    });
}

// {{text||YYYY-MM-DD: note}} marks text with a dated update popover.
const ANNOTATION = /{{(.+?)\|\|(\d{4}-\d{2}-\d{2}):\s*(.+?)}}/gs;

function renderAnnotations(markdown) {
    return markdown.replace(ANNOTATION, (_, text, date, note) =>
        `<span class="annotated" tabindex="0">${text}<span class="annotation"><span class="annotation-date">Revisited ${date}</span>${note}</span></span>`);
}

function renderAnnotationsPlain(markdown) {
    return markdown.replace(ANNOTATION, (_, text, date, note) => `${text} [Revisited ${date}: ${note}]`);
}

function parseMarkdown(dir, file, requiredFields) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) throw new Error(`${dir}/${file}: missing front matter`);
    const meta = {};
    for (const line of match[1].split('\n')) {
        const colon = line.indexOf(':');
        if (colon > 0) meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
    }
    for (const field of requiredFields) {
        if (!meta[field]) throw new Error(`${dir}/${file}: missing "${field}" in front matter`);
    }
    return {
        slug: file.replace(/\.md$/, ''),
        meta,
        content: marked.parse(renderAnnotations(match[2])),
        plainContent: marked.parse(renderAnnotationsPlain(match[2])),
    };
}

function readCollection(dir, requiredFields) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => parseMarkdown(dir, f, requiredFields));
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'pages', 'articles'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'pages', 'projects'), { recursive: true });
for (const entry of STATIC) {
    fs.cpSync(entry, path.join(OUT, entry), { recursive: true });
}

const template = (name) => fs.readFileSync(`templates/${name}.html`, 'utf8');

// Articles
const articles = readCollection('articles', ['title', 'description', 'date']);
for (const article of articles) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(article.meta.date)) {
        throw new Error(`${article.slug}: date must be YYYY-MM-DD`);
    }
    if (article.meta.edited && !/^\d{4}-\d{2}-\d{2}$/.test(article.meta.edited)) {
        throw new Error(`${article.slug}: edited must be YYYY-MM-DD`);
    }
}
articles.sort((a, b) => b.meta.date.localeCompare(a.meta.date));

const humanDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
});

for (const article of articles) {
    let dateLine = 'Published on ' + humanDate(article.meta.date);
    if (article.meta.edited) {
        dateLine += ' | Edited on ' + humanDate(article.meta.edited);
    }
    fs.writeFileSync(path.join(OUT, 'pages', 'articles', `${article.slug}.html`), fill(template('article'), {
        title: escapeHtml(article.meta.title),
        description: escapeHtml(article.meta.description),
        url: `${SITE_URL}/pages/articles/${article.slug}.html`,
        date_line: dateLine,
        content: article.content,
    }));
}

const articleList = articles.map((article) => `            <div class="article">
                <div class="article-date"><time datetime="${article.meta.date}">${article.meta.date}</time></div>
                <div class="article-title"><a href="articles/${article.slug}.html">${escapeHtml(article.meta.title)}</a></div>
                <div class="article-description">${escapeHtml(article.meta.description)}</div>
            </div>`).join('\n');
fs.writeFileSync(path.join(OUT, 'pages', 'articles.html'), fill(template('articles'), { list: '\n' + articleList + '\n        ' }));

// Projects
const projects = readCollection('projects', ['title', 'type', 'thumbnail', 'description', 'order']);
projects.sort((a, b) => Number(a.meta.order) - Number(b.meta.order));

for (const project of projects) {
    fs.writeFileSync(path.join(OUT, 'pages', 'projects', `${project.slug}.html`), fill(template('project'), {
        title: escapeHtml(project.meta.title),
        type: escapeHtml(project.meta.type),
        thumbnail: project.meta.thumbnail,
        description: escapeHtml(project.meta.description),
        url: `${SITE_URL}/pages/projects/${project.slug}.html`,
        og_image: `${SITE_URL}/files/img/projects/${project.meta.thumbnail}`,
        content: project.content,
    }));
}

const projectPlaceholder = `            <div class="project-placeholder">Currently revamping this page. In the meantime, all of my public projects are on <a class="hyperlink" href="https://github.com/cengizozel" target="_blank" rel="noopener">my GitHub</a>.</div>`;
const projectList = projects.length === 0 ? projectPlaceholder : projects.map((project) => `            <div class="project">
                <a href="projects/${project.slug}.html">
                    <img src="../files/img/projects/${project.meta.thumbnail}" alt="${escapeHtml(project.meta.title)}">
                    <div class="project-title">${escapeHtml(project.meta.title)}</div>
                    <div class="project-description">${escapeHtml(project.meta.description)}</div>
                </a>
            </div>`).join('\n');
fs.writeFileSync(path.join(OUT, 'pages', 'projects.html'), fill(template('projects'), { list: '\n' + projectList + '\n        ' }));

// RSS (articles only)
const rssItems = articles.map((article) => `        <item>
            <title>${escapeHtml(article.meta.title)}</title>
            <link>${SITE_URL}/pages/articles/${article.slug}.html</link>
            <guid>${SITE_URL}/pages/articles/${article.slug}.html</guid>
            <pubDate>${new Date(article.meta.date + 'T00:00:00Z').toUTCString()}</pubDate>
            <description>${escapeHtml(article.meta.description)}</description>
            <content:encoded><![CDATA[${article.plainContent.replaceAll('href="/', `href="${SITE_URL}/`)}]]></content:encoded>
        </item>`).join('\n');
fs.writeFileSync(path.join(OUT, 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Cengiz Ozel</title>
        <link>${SITE_URL}</link>
        <description>Articles by Cengiz Ozel</description>
        <language>en</language>
        <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${rssItems}
    </channel>
</rss>
`);

// Sitemap
const sitemapUrls = [
    { loc: `${SITE_URL}/` },
    { loc: `${SITE_URL}/pages/articles.html` },
    { loc: `${SITE_URL}/pages/projects.html` },
    ...articles.map((a) => ({ loc: `${SITE_URL}/pages/articles/${a.slug}.html`, lastmod: a.meta.edited || a.meta.date })),
    ...projects.map((p) => ({ loc: `${SITE_URL}/pages/projects/${p.slug}.html` })),
];
const sitemap = sitemapUrls.map((u) => `    <url>
        <loc>${u.loc}</loc>${u.lastmod ? `\n        <lastmod>${u.lastmod}</lastmod>` : ''}
    </url>`).join('\n');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap}
</urlset>
`);

console.log(`Built ${articles.length} articles and ${projects.length} projects into ${OUT}/`);
