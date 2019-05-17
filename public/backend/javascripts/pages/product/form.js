document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form[name=product]');

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

    const searchText = 'Соответсвия поиска не были найдены';
    const searchPlaceholder = 'Поиск';

    new SlimSelect({
        select: 'select[name=country]',
        searchPlaceholder: searchPlaceholder,
        searchText: searchText
    });

    new SlimSelect({
        select: 'select[name=brand]',
        searchPlaceholder: searchPlaceholder,
        searchText: searchText
    });

    new SlimSelect({
        select: 'select[name=seller]',
        searchPlaceholder: searchPlaceholder,
        searchText: searchText,
        ajax: (search, callback) => {
            if (search.length < 2) {
                callback('Минимум 2 символа');
                return
            }

            axios.post('/backend/seller/search', {
                    name: search
                })
                .then((response) => {
                    let data;

                    if (response.data.status) {
                        data = [];

                        for (let i = 0; i < response.data.sellers.length; i++) {
                            data.push({value: response.data.sellers[i]._id, text: response.data.sellers[i].name});
                        }
                    } else {
                        data = searchText;
                    }

                    callback(data)
                })
                .catch((error) => {
                    callback(false);
                });
        }
    });

    new SlimSelect({
        select: 'select[name=category]',
        searchPlaceholder: searchPlaceholder,
        searchText: searchText
    });
});