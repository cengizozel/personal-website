document.addEventListener('DOMContentLoaded', function() {
    let currentTheme = localStorage.getItem('theme') || 'light';
    document.body.className = currentTheme;
});
