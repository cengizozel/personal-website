# personal-website

Website where I share my background, projects, and articles about my interests.
Plain static HTML/CSS/JS — no build step.

## Structure

- `index.html` - home page
- `pages/articles.html` - article listing, built from `js/articles-data.js`
- `pages/projects.html` - project listing, built from `js/projects-data.js`
- `pages/articles/article.html` - single template page for all articles (`?id=`)
- `pages/projects/project.html` - single template page for all projects (`?id=`)

## Adding Content

**New article:** add an object to `js/articles-data.js` with `id`, `title`,
`description`, `publishedDate` (`YYYY-MM-DD`), `published`, and `content`. Set
`published: false` until ready, then flip to `true`.

**New project:** add an object to `js/projects-data.js` with `id`, `title`,
`type`, `thumbnail`, `description`, `published`, and `content`, and drop the
thumbnail image in `files/img/projects/`.

## JS

- `js/sidebar.js` - injects the shared profile sidebar and owns the theme toggle
- `js/footer.js` - injects the copyright footer on every page
- `js/articles-data.js` / `js/projects-data.js` - the article/project data
- `js/articles.js` / `js/projects.js` - build the listing pages
- `js/article-loader.js` / `js/project-loader.js` - load one item into the
  template page via `?id=`

## Running locally

Serve from the repo root (the sidebar uses root-absolute paths):

```
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.
