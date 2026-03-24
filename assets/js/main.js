import '../css/screen.css';

// General Purpose — main entry point

// Dark mode toggle handler
const toggleBtn = document.querySelector('[data-theme-toggle]');
const html = document.documentElement;

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        // Add transition class for smooth animation
        document.body.classList.add('theme-transition');

        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        toggleBtn.setAttribute('aria-label',
            next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );

        // Remove transition class after animation completes
        setTimeout(() => document.body.classList.remove('theme-transition'), 300);
    });
}
