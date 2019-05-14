const formName = 'deleteForm';

const createDeleteForm = () => {
    const body = document.querySelector('body');
    const form = document.createElement('form');

    const formNameAttr = document.createAttribute('name');
    const formMethodAttr = document.createAttribute('method');

    formNameAttr.value = formName;
    formMethodAttr.value = 'post';

    form.setAttributeNode(formNameAttr);
    form.setAttributeNode(formMethodAttr);

    body.appendChild(form);
};

const submitDelteForm = (form, id, url) => {
    alertify.confirm('Подтверждение', 'Вы действительно хотите удалить этот элемент?', () => {
        const action = `/backend/${url}/${id}`;

        form.setAttribute('action', action);
        form.submit();
    }, () => {
        return;
    });
};

document.addEventListener('DOMContentLoaded', () => {
    createDeleteForm();

    const table = document.querySelector('.table');
    const form = document.querySelector(`form[name="${formName}"]`);

    table.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('delete')) {
            const id = target.dataset.item;
            const url = target.dataset.url;
            const check = target.dataset.check;

            if (!check) {
                submitDelteForm(form, id, url);
            } else {
                axios.post(`/backend/${url}/${check}`, {
                        id: id
                    })
                    .then((response) => {
                        if (response.data.status) {
                            const count = Number(response.data.count);

                            if (!count) {
                                submitDelteForm(form, id, url);
                            } else {
                                alertify.alert('Внимание!', response.data.message);
                            }
                        }
                    })
                    .catch((error) => {
                        //
                    });
            }
        }
    });
});