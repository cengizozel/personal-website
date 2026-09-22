# personal-website

## Content

Articles are markdown files in `articles/` with front matter:

```
---
title: Article Title
description: One line shown in the listing
date: 2026-01-01
---
```

Write drafts in `drafts/articles/` and `drafts/projects/` (not tracked by this repo). `npm run dev` serves the site on localhost:8080 with live reload and renders drafts marked "(draft)"; the real build ignores them. Move the file to `articles/` (or `projects/`) and push to publish.

Optional front matter: `edited: YYYY-MM-DD` shows an edited date next to the published date, for silent text adjustments.

Revisits: `{{text||YYYY-MM-DD: note}}` in the markdown marks text with a dated popover for later additions of new thinking. RSS shows it as a bracketed note.

Projects are markdown files in `projects/` with front matter (`title`, `type`, `thumbnail`, `description`, `order`), with thumbnails in `files/img/projects/`.

## How it works

`build.js` renders the markdown and `templates/` into `_site/` (pages, listings, RSS feed, sitemap), which is deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to main.
