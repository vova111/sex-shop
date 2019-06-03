document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelector('.thumbnails');
    const mainImage = document.querySelector('div.main-photo > img');
    const colorsContainer = document.querySelector('.colors');

    tippy('.product-color', {
        arrow: true,
        arrowType: 'round',
        animation: 'fade',
        theme: 'light-border'
    });

    thumbnails.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('thumbnail')) {
            const active = thumbnails.querySelector('ul li a.active');
            const image = target.getAttribute('src');

            active.classList.remove('active');
            target.parentNode.classList.add('active');
            mainImage.src = image;
        }
    });

    colorsContainer.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('product-color')) {
            if (!target.classList.contains('active')) {
                const active = colorsContainer.querySelector('.active');

                active.classList.remove('active');
                target.classList.add('active');
            }
        }
    });
});