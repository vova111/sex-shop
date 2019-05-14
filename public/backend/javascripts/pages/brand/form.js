document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form[name=brand]');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = validate.collectFormValues(form);

        const constraints = {
            name: {
                presence: {
                    message: "Название бренда обязательное поле"
                },
                length: {
                    minimum: 3,
                    message: "Название бренда должно содержать минимум 3 символа"
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
});