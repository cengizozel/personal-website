document.addEventListener('DOMContentLoaded', function () {
    let currentTheme = localStorage.getItem('theme') || 'light';
    document.body.className = currentTheme;

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const articleData = articlesData.find(a => a.id === id);

    if (!articleData) {
        document.querySelector('.article-title').textContent = 'Article not found';
        return;
    }

    fetch('../../files/articles.json')
        .then(response => response.json())
        .then(data => {
            const meta = data.articles.find(a => parseInt(a.id) === id);
            const title = meta ? meta.title : '';
            const date = meta ? 'Published on ' + new Date(meta.publishedDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

            document.title = title;
            document.querySelector('.article-title').textContent = title;
            document.querySelector('.article-date').textContent = date;
            document.querySelector('.article-content').innerHTML = articleData.content;
        });
});
