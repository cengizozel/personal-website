console.log("articles.js loaded");
document.addEventListener("DOMContentLoaded", function () {
    fetch("../files/articles.json")
        .then((response) => response.json())
        .then((data) => {
            const articles = data.articles;
            const container = document.querySelector(".articles-container");
            articles.reverse();

            articles.forEach((article, index) => {
                if (article.published === false) {
                    return;
                }
                // Create the article elements
                const articleElement = document.createElement("div");
                articleElement.classList.add("article");

                const titleElement = document.createElement("div");
                titleElement.classList.add("article-title");

                const linkElement = document.createElement("a");
                linkElement.href = "articles/" + article.link;
                linkElement.textContent = article.title;

                const descriptionElement = document.createElement("p");
                descriptionElement.textContent = article.description;

                const publishedDateElement = document.createElement("p");
                publishedDateElement.innerHTML =
                    "Published on <time datetime='" +
                    article.publishedDate +
                    "'>" +
                    article.publishedDate +
                    "</time>";

                titleElement.appendChild(linkElement);
                articleElement.appendChild(titleElement);
                articleElement.appendChild(descriptionElement);
                articleElement.appendChild(publishedDateElement);
                container.appendChild(articleElement);
            });

        })
        .catch((error) => {
            console.error("Error loading articles:", error);
        });
});
