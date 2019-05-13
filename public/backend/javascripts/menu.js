const locationPathname = window.location.pathname;

document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.querySelector('.navbar-nav');

    for (let menu of menuContainer.children) {
        if (menu.dataset.url === locationPathname) {
            menu.classList.add('active');
            break;
        }
    }
});