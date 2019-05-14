document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form[name=seller]');
    const nameField = document.querySelector('input[name=name]');
    const slugField = document.querySelector('input[name=slug]');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = validate.collectFormValues(form);

        const constraints = {
            name: {
                presence: {
                    message: "Название продавца обязательное поле"
                },
                length: {
                    minimum: 3,
                    message: "Название продавца должно содержать минимум 3 символа"
                }
            },
            slug: {
                presence: {
                    message: "Постоянная ссылка обязательное поле"
                },
                length: {
                    minimum: 3,
                    message: "Постоянная ссылка должна содержать минимум 3 символа"
                },
                format: {
                    pattern: "[a-z0-9]+(?:-[a-z0-9]+)*",
                    message: "Постоянная ссылка может состоять только из символов a-z, 0-9, '-' и не содержать пробелов"
                }
            }
        };

        const errors = validate(formData, constraints, {format: "flat"});

        if (errors !== undefined) {
            hideFromErrors();
            showFormErrors(errors);
        } else {
            form.submit();
        }
    });

    nameField.addEventListener('blur', () => {
        if (nameField.value.length && !slugField.value.length) {
            axios.post('/backend/seller/slug', {
                name: nameField.value
            })
                .then((response) => {
                    slugField.value = response.data.slug;
                })
                .catch((error) => {
                    showFormErrors(error);
                });
        }
    });
});