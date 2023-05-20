// Fetch the JSON file
console.log("articles.js loaded");
document.addEventListener("DOMContentLoaded", function () {
    fetch("../files/articles.json")
        .then((response) => response.json()) // Parse the response as JSON
        .then((data) => {
            const articles = data.articles; // Access the articles array from the JSON data
            const container = document.querySelector(".articles-container");

            articles.forEach((article) => {
                // Create the article elements
                const articleElement = document.createElement("div");
                articleElement.classList.add("article"); // Add the article class

                const titleElement = document.createElement("h2");

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

                // Append the elements to the article container
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