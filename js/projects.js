document.addEventListener("DOMContentLoaded", function () {
    fetch("../files/projects.json")
        .then(response => response.json())
        .then(data => {
            const projects = data.projects;
            const container = document.getElementById("project-list");

            projects.forEach(project => {
                if (project.published === false) return;

                const projectElement = document.createElement("div");
                projectElement.classList.add("project");

                const link = document.createElement("a");
                link.href = "projects/project.html?id=" + project.id;

                const img = document.createElement("img");
                img.src = "../files/img/projects/" + project.thumbnail;
                img.alt = project.title;

                const title = document.createElement("div");
                title.classList.add("project-title");
                title.textContent = project.title;

                const description = document.createElement("div");
                description.classList.add("project-description");
                description.textContent = project.description;

                link.appendChild(img);
                link.appendChild(title);
                link.appendChild(description);
                projectElement.appendChild(link);
                container.appendChild(projectElement);
            });
        })
        .catch(error => console.error("Error loading projects:", error));
});
