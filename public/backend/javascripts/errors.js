const showFormErrors = (errors, cropFirstWord = true) => {
    const container = document.querySelector('.error-container');

    const divRow = document.createElement('div');
    const divCol = document.createElement('div');
    const divAlert = document.createElement('div');

    const ul = document.createElement('ul');

    ul.classList.add('errors-list');

    for (let message of errors) {
        if (cropFirstWord) {
            const pos = message.indexOf(' ');
            message = `${message.slice(pos + 1)}.`;
        }

        const li = document.createElement('li');
        const text = document.createTextNode(message);

        li.appendChild(text);
        ul.appendChild(li);
    }

    divAlert.classList.add('alert');
    divAlert.classList.add('alert-danger');

    divCol.classList.add('col-lg-12');

    divRow.classList.add('row');

    divAlert.appendChild(ul);
    divCol.appendChild(divAlert);
    divRow.appendChild(divCol);

    container.appendChild(divRow);

    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
};

const hideFromErrors = () => {
    const container = document.querySelector('.error-container');

    while (container.firstChild) {
        container.firstChild.remove();
    }
};