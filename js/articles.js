// Builds the article listing from articlesData (defined in articles-data.js),
// newest first.
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("article-list");

    const published = articlesData
        .filter((article) => article.published)
        .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));

    published.forEach((article) => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("article");

        const dateElement = document.createElement("div");
        dateElement.classList.add("article-date");
        const time = document.createElement("time");
        time.setAttribute("datetime", article.publishedDate);
        time.textContent = article.publishedDate;
        dateElement.appendChild(time);

        const titleElement = document.createElement("div");
        titleElement.classList.add("article-title");
        const link = document.createElement("a");
        link.href = "articles/article.html?id=" + article.id;
        link.textContent = article.title;
        titleElement.appendChild(link);

        const descriptionElement = document.createElement("div");
        descriptionElement.classList.add("article-description");
        descriptionElement.textContent = article.description;

        articleElement.appendChild(dateElement);
        articleElement.appendChild(titleElement);
        articleElement.appendChild(descriptionElement);
        container.appendChild(articleElement);
    });
});
