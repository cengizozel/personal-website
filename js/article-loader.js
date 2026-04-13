document.addEventListener('DOMContentLoaded', function () {
    let currentTheme = localStorage.getItem('theme') || 'light';
    document.body.className = currentTheme;

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const article = articlesData.find(a => a.id === id);

    if (!article) {
        document.querySelector('.article-title').textContent = 'Article not found';
        return;
    }

    document.title = article.title;
    document.querySelector('.article-title').textContent = article.title;
    document.querySelector('.article-date').textContent = article.date;
    document.querySelector('.article-content').innerHTML = article.content;
});
