const removeAllNodes = (node) => {
    while (node.firstChild) {
        node.firstChild.remove();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const page = document.querySelector('.page');
    const catalogButton = document.querySelector('.catalog-open');
    const catalogContainer = document.querySelector('.side');

    catalogButton.addEventListener('click', () => {
        if (catalogContainer.classList.contains('side-hidden')) {
            page.classList.add('overlay');
            catalogContainer.classList.remove('side-hidden');
        } else {
            catalogContainer.classList.add('side-hidden');
            page.classList.remove('overlay');
        }
    });

    catalogContainer.addEventListener('mouseleave', () => {
        catalogContainer.classList.add('side-hidden');
        page.classList.remove('overlay');
    });
});