// Injects the shared profile sidebar into a `<div id="profile">` placeholder so
// the markup lives in exactly one place. Also owns the light/dark theme toggle.
// Runs synchronously at the end of <body>, before first paint, to avoid a flash.
(function () {
    const mount = document.getElementById('profile');
    if (!mount) return;

    // Icons are inlined (from Ionicons, MIT) so the site has no third-party
    // CDN dependency and nothing render-blocking.
    const icons = {
        moon: '<svg class="toggle-icon moon" viewBox="0 0 512 512" aria-hidden="true"><path d="M264 480A232 232 0 0132 248c0-94 54-178.28 137.61-214.67a16 16 0 0121.06 21.06C181.07 76.43 176 104.66 176 136c0 110.28 89.72 200 200 200 31.34 0 59.57-5.07 81.61-14.67a16 16 0 0121.06 21.06C442.28 426 358 480 264 480z"/></svg>',
        sunny: '<svg class="toggle-icon sun" viewBox="0 0 512 512" aria-hidden="true"><path d="M256 118a22 22 0 01-22-22V48a22 22 0 0144 0v48a22 22 0 01-22 22zM256 486a22 22 0 01-22-22v-48a22 22 0 0144 0v48a22 22 0 01-22 22zM369.14 164.86a22 22 0 01-15.56-37.55l33.94-33.94a22 22 0 0131.11 31.11l-33.94 33.94a21.93 21.93 0 01-15.55 6.44zM108.92 425.08a22 22 0 01-15.55-37.56l33.94-33.94a22 22 0 1131.11 31.11l-33.94 33.94a21.94 21.94 0 01-15.56 6.45zM464 278h-48a22 22 0 010-44h48a22 22 0 010 44zM96 278H48a22 22 0 010-44h48a22 22 0 010 44zM403.08 425.08a21.94 21.94 0 01-15.56-6.45l-33.94-33.94a22 22 0 0131.11-31.11l33.94 33.94a22 22 0 01-15.55 37.56zM142.86 164.86a21.89 21.89 0 01-15.55-6.44l-33.94-33.94a22 22 0 0131.11-31.11l33.94 33.94a22 22 0 01-15.56 37.55zM256 358a102 102 0 11102-102 102.12 102.12 0 01-102 102z"/></svg>',
        linkedin: '<svg class="contact-icon" viewBox="0 0 512 512" aria-hidden="true"><path d="M444.17 32H70.28C49.85 32 32 46.7 32 66.89v374.72C32 461.91 49.85 480 70.28 480h373.78c20.54 0 35.94-18.21 35.94-38.39V66.89C480.12 46.7 464.6 32 444.17 32zm-273.3 373.43h-64.18V205.88h64.18zM141 175.54h-.46c-20.54 0-33.84-15.29-33.84-34.43 0-19.49 13.65-34.42 34.65-34.42s33.85 14.82 34.31 34.42c-.01 19.14-13.31 34.43-34.66 34.43zm264.43 229.89h-64.18V296.32c0-26.14-9.34-44-32.56-44-17.74 0-28.24 12-32.91 23.69-1.75 4.2-2.22 9.92-2.22 15.76v113.66h-64.18V205.88h64.18v27.77c9.34-13.3 23.93-32.44 57.88-32.44 42.13 0 74 27.77 74 87.64z"/></svg>',
        github: '<svg class="contact-icon" viewBox="0 0 512 512" aria-hidden="true"><path d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 003.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 01-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0025.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 015-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 01112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 015 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 004-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z"/></svg>',
        scholar: '<svg class="contact-icon" viewBox="0 0 512 512" aria-hidden="true"><path d="M256 368a16 16 0 01-7.94-2.11L108 285.84a8 8 0 00-12 6.94V368a16 16 0 008.23 14l144 80a16 16 0 0015.54 0l144-80a16 16 0 008.23-14v-75.22a8 8 0 00-12-6.94l-140.06 80.05A16 16 0 01256 368z"/><path d="M495.92 190.5v-.11a16 16 0 00-8-12.28l-224-128a16 16 0 00-15.88 0l-224 128a16 16 0 000 27.78l224 128a16 16 0 0015.88 0L461 221.28a2 2 0 013 1.74v144.53c0 8.61 6.62 16 15.23 16.43A16 16 0 00496 368V192a14.76 14.76 0 00-.08-1.5z"/></svg>'
    };

    mount.innerHTML = `
        <a href="/index.html">
            <img id="profile-picture" src="/files/img/profile.png" alt="Cengiz Ozel">
        </a>

        <h1>Cengiz Ozel</h1>

        <div id="under-name">
            <h3 id="occupation">Researcher</h3>
            <div>
                <input type="checkbox" class="checkbox" id="checkbox" aria-label="Toggle dark mode">
                <label for="checkbox" class="checkbox-label">
                    ${icons.moon}
                    ${icons.sunny}
                    <span class="ball"></span>
                </label>
            </div>
        </div>

        <div id="nav">
            <h3>
                <a href="/pages/articles.html">Articles</a> |
                <a href="/pages/projects.html">Projects</a> |
                <a href="/files/cengiz-ozel-resume.pdf" target="_blank" rel="noopener">Resume</a>
            </h3>
        </div>

        <div id="contact">
            <a href="https://www.linkedin.com/in/cengiz-ozel/" target="_blank" rel="noopener" aria-label="LinkedIn">${icons.linkedin}</a>
            <a href="https://github.com/cengizozel" target="_blank" rel="noopener" aria-label="GitHub">${icons.github}</a>
            <a href="https://scholar.google.com/citations?user=f0nD3j8AAAAJ" target="_blank" rel="noopener" aria-label="Google Scholar">${icons.scholar}</a>
        </div>`;

    // Theme toggle. Occupation label is intentionally coupled to the theme:
    // "AI Engineer" in light, "Researcher" in dark.
    const checkbox = document.getElementById('checkbox');
    const occupation = document.getElementById('occupation');

    function applyTheme(theme) {
        document.body.className = theme;
        checkbox.checked = theme === 'dark';
        occupation.textContent = theme === 'dark' ? 'Researcher' : 'AI Engineer';
    }

    applyTheme(localStorage.getItem('theme') || 'light');

    checkbox.addEventListener('change', function () {
        const theme = checkbox.checked ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        applyTheme(theme);
    });
})();
