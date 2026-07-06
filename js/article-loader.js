// Loads a single article into the template page from articlesData, keyed by ?id=.
document.addEventListener('DOMContentLoaded', function () {
    const id = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
    const article = articlesData.find((a) => a.id === id);

    if (!article) {
        document.querySelector('.article-title').textContent = 'Article not found';
        return;
    }

    const date = new Date(article.publishedDate + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    document.title = article.title;
    document.querySelector('.article-title').textContent = article.title;
    document.querySelector('.article-date').textContent = 'Published on ' + date;
    document.querySelector('.article-content').innerHTML = article.content;
});
