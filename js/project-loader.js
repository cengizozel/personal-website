document.addEventListener('DOMContentLoaded', function () {
    let currentTheme = localStorage.getItem('theme') || 'light';
    document.body.className = currentTheme;

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const project = projectsData.find(p => p.id === id);

    if (!project) {
        document.querySelector('.project-title').textContent = 'Project not found';
        return;
    }

    document.title = project.title;
    document.querySelector('.project-title').textContent = project.title;
    document.querySelector('.project-type').textContent = project.type;
    document.querySelector('.project-thumbnail').src = project.thumbnail;
    document.querySelector('.project-thumbnail').alt = project.title;
    document.querySelector('.project-content').innerHTML = project.content;
});
