console.log("articles.js loaded");
document.addEventListener("DOMContentLoaded", function () {
    fetch("../files/articles.json")
        .then((response) => response.json())
        .then((data) => {
            const articles = data.articles;
            const container = document.getElementById("article-list");
            articles.reverse();

            articles.forEach((article, index) => {
                if (article.published === false) {
                    return;
                }
                // Create the article elements
                const articleElement = document.createElement("div");
                articleElement.classList.add("article");

                const publishedDateElement = document.createElement("div");
                publishedDateElement.classList.add("article-date");
                publishedDateElement.innerHTML =
                    "<time datetime='" +
                    article.publishedDate +
                    "'>" +
                    article.publishedDate +
                    "</time>";

                const titleElement = document.createElement("div");
                titleElement.classList.add("article-title");

                const linkElement = document.createElement("a");
                linkElement.href = "articles/" + article.link;
                linkElement.textContent = article.title;

                const descriptionElement = document.createElement("div");
                descriptionElement.classList.add("article-description");
                descriptionElement.textContent = article.description;

                // Date
                articleElement.appendChild(publishedDateElement);
                // Title
                titleElement.appendChild(linkElement);
                articleElement.appendChild(titleElement);
                // Description
                articleElement.appendChild(descriptionElement);
                container.appendChild(articleElement);
            });

        })
        .catch((error) => {
            console.error("Error loading articles:", error);
        });
});
