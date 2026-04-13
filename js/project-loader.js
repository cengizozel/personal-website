document.addEventListener('DOMContentLoaded', function () {
    let currentTheme = localStorage.getItem('theme') || 'light';
    document.body.className = currentTheme;

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const projectData = projectsData.find(p => p.id === id);

    if (!projectData) {
        document.querySelector('.project-title').textContent = 'Project not found';
        return;
    }

    fetch('../../files/projects.json')
        .then(response => response.json())
        .then(data => {
            const meta = data.projects.find(p => parseInt(p.id) === id);
            const title = meta ? meta.title : '';
            const type = meta ? meta.type : '';
            const thumbnail = meta ? '../../files/img/projects/' + meta.thumbnail : '';

            document.title = title;
            document.querySelector('.project-title').textContent = title;
            document.querySelector('.project-type').textContent = type;
            document.querySelector('.project-thumbnail').src = thumbnail;
            document.querySelector('.project-thumbnail').alt = title;
            document.querySelector('.project-content').innerHTML = projectData.content;
        });
});
