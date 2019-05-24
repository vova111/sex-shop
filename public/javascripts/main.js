document.addEventListener('DOMContentLoaded', () => {
    const page = document.querySelector('.page');
    const catalogButton = document.querySelector('.catalog-open');
    const catalogContainer = document.querySelector('.side');

    catalogButton.addEventListener('click', () => {
        page.classList.add('overlay');
        catalogContainer.classList.remove('side-hidden');
    });

    catalogContainer.addEventListener('mouseleave', () => {
        catalogContainer.classList.add('side-hidden');
        page.classList.remove('overlay');
    });
});