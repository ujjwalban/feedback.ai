(function () {
    const containers = document.querySelectorAll('[data-feedback-user]');

    containers.forEach(container => {
        const username = container.getAttribute('data-feedback-user');
        if (!username) return;

        const iframe = document.createElement('iframe');
        const baseUrl = window.location.origin.includes('localhost')
            ? 'http://localhost:3000'
            : 'https://feedback-ai.vercel.app'; // Replace with actual production URL

        iframe.src = `${baseUrl}/embed/${username}`;
        iframe.style.width = '100%';
        iframe.style.height = '400px';
        iframe.style.border = 'none';
        iframe.style.background = 'transparent';
        iframe.setAttribute('scrolling', 'no');

        container.appendChild(iframe);
    });
})();
