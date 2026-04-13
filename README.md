# personal-website

Website where I share my background, projects, and articles about my interests.

## Structure

- `index.html` - home page
- `art.html`, `art/` - art section (music, photography)
- `pages/articles.html` - article listing, built dynamically from `files/articles.json`
- `pages/projects.html` - project listing, built dynamically from `files/projects.json`
- `pages/articles/article.html` - single template page for all articles
- `pages/projects/project.html` - single template page for all projects

## Adding Content

**New article:** add metadata to `files/articles.json` and content to `js/articles-data.js`. Set `published: false` until ready, then flip to `true`.

**New project:** add metadata to `files/projects.json` and content to `js/projects-data.js`.

## JS

- `js/script.js` - theme toggle and occupation text for pages with a sidebar
- `js/articles.js` - builds the article listing from JSON
- `js/projects.js` - builds the project listing from JSON
- `js/article-loader.js` - loads the correct article into the template page via `?id=`
- `js/project-loader.js` - loads the correct project into the template page via `?id=`
- `js/footer.js` - injects the copyright footer on every page