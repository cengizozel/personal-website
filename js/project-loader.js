// Loads a single project into the template page from projectsData, keyed by ?id=.
document.addEventListener('DOMContentLoaded', function () {
    const id = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
    const project = projectsData.find((p) => p.id === id);

    if (!project) {
        document.querySelector('.project-title').textContent = 'Project not found';
        return;
    }

    const thumbnail = document.querySelector('.project-thumbnail');

    document.title = project.title;
    document.querySelector('.project-title').textContent = project.title;
    document.querySelector('.project-type').textContent = project.type;
    thumbnail.src = '../../files/img/projects/' + project.thumbnail;
    thumbnail.alt = project.title;
    document.querySelector('.project-content').innerHTML = project.content;
});
