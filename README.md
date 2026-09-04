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

Write drafts in `drafts/` (not tracked). Move the file to `articles/` and push to publish.

Projects live in `js/projects-data.js`, with thumbnails in `files/img/projects/`.

## How it works

`build.js` renders the markdown and `templates/` into `_site/`, which is deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to main.
