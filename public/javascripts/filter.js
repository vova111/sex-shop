document.addEventListener('DOMContentLoaded', () => {
    const filterBlocks = document.querySelector('.filter-blocks');

    filterBlocks.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('toggle')) {
            const parent = target.parentNode.parentNode.parentNode;
            const content = parent.querySelector('.filter-block-content');

            if (!target.classList.contains('toggle-closed')) {
                content.classList.add('content-closed');
                target.classList.add('toggle-closed');
            } else {
                content.classList.remove('content-closed');
                target.classList.remove('toggle-closed');
            }
        }

        if (target.classList.contains('checkbox')) {
            if (!target.classList.contains('checked')) {
                target.classList.add('checked');
            } else {
                target.classList.remove('checked');
            }
        }
    });
});