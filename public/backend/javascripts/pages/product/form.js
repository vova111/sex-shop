let cropper;
let uploadedImageURL;
const URL = window.URL || window.webkitURL;
const pica = window.pica({});

const getCountPostedImages = (container) => {
    return container.children.length;
};

const resizeAndSaveImage = (container, imageField, cropperBox) => {
    const image = cropper.getCroppedCanvas();

    const createCanvas = (width, height) => {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        return canvas;
    };

    const convertToBase64 = (blob) => {
        const temporaryFileReader = new FileReader();

        return new Promise((resolve, reject) => {
            temporaryFileReader.onerror = () => {
                temporaryFileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };

            temporaryFileReader.onload = () => {
                resolve(temporaryFileReader.result);
            };

            temporaryFileReader.readAsDataURL(blob);
        });
    };

    const placeImage = (files) => {
        const imagesCount = getCountPostedImages(container);
        const divImageContainer = document.createElement('div');
        const divImage = document.createElement('div');
        const image = document.createElement('img');
        const divButtons = document.createElement('div');
        const divButtonsText = document.createTextNode(' ');
        const buttonMain = document.createElement('button');
        const buttonMainIcon = document.createElement('i');
        const buttonDelete = document.createElement('button');
        const buttonDeleteIcon = document.createElement('i');
        const buttonDeleteText = document.createTextNode(' Удалить');
        const inputThumb = document.createElement('input');
        const inputFull = document.createElement('input');
        const inputMain = document.createElement('input');

        image.src = files[0];

        divImage.classList.add('product-img');
        divImage.appendChild(image);

        buttonMainIcon.classList.add('fa');
        buttonMainIcon.classList.add('fa-check');

        buttonMain.setAttribute('type', 'button');
        buttonMain.classList.add('btn');
        buttonMain.classList.add('btn-xs');
        buttonMain.classList.add('product-image-change-main');

        buttonMain.appendChild(buttonMainIcon);

        if (imagesCount) {
            const buttonMainText = document.createTextNode(' Сделать основным');
            buttonMain.appendChild(buttonMainText);
            buttonMain.classList.add('btn-primary');
            inputMain.value = '0';
        } else {
            const buttonMainText = document.createTextNode(' Основное');
            buttonMain.appendChild(buttonMainText);
            buttonMain.classList.add('btn-success');
            inputMain.value = '1';
        }

        buttonDeleteIcon.classList.add('fa');
        buttonDeleteIcon.classList.add('fa-trash-o');

        buttonDelete.setAttribute('type', 'button');
        buttonDelete.classList.add('btn');
        buttonDelete.classList.add('btn-danger');
        buttonDelete.classList.add('btn-xs');
        buttonDelete.classList.add('product-image-delete');

        buttonDelete.appendChild(buttonDeleteIcon);
        buttonDelete.appendChild(buttonDeleteText);

        divButtons.classList.add('product-buttons');
        divButtons.appendChild(buttonMain);
        divButtons.appendChild(divButtonsText);
        divButtons.appendChild(buttonDelete);

        inputThumb.value = files[0].split(',')[1];
        inputFull.value = files[1].split(',')[1];

        inputMain.setAttribute('type', 'hidden');
        inputMain.setAttribute('name', 'image_main[]');
        inputMain.classList.add('image-main');
        inputThumb.setAttribute('type', 'hidden');
        inputThumb.setAttribute('name', 'image_thumb[]');
        inputThumb.classList.add('image-thumb');
        inputFull.setAttribute('type', 'hidden');
        inputFull.setAttribute('name', 'image_full[]');
        inputFull.classList.add('image-full');

        divImageContainer.classList.add('product-image');
        divImageContainer.appendChild(divImage);
        divImageContainer.appendChild(divButtons);
        divImageContainer.appendChild(inputThumb);
        divImageContainer.appendChild(inputFull);
        divImageContainer.appendChild(inputMain);

        container.appendChild(divImageContainer);

        imageField.value = '';
        cropperBox.classList.add('cropper-box');
    };

    Promise.all([
            pica.resize(image, createCanvas('210', '185')),
            pica.resize(image, createCanvas('380', '335'))
        ])
        .then((results) => {
            return Promise.all([
                pica.toBlob(results[0], 'image/jpeg', 0.90),
                pica.toBlob(results[1], 'image/jpeg', 0.90)
            ]);
        })
        .then((blobs) => {
            return Promise.all([
                convertToBase64(blobs[0]),
                convertToBase64(blobs[1])
            ]);
        })
        .then((files) => placeImage(files));
};

const getImageId = (target) => {
    const parent = getImageContainer(target);
    return parent.dataset.item;
};

const getImageContainer = (target) => {
    return target.parentNode.parentNode;
};

const imagesActions = (event) => {
    const target = event.target;

    if (target.classList.contains('product-image-change-main')) {
        if (!target.classList.contains('btn-success')) {
            const imageId = getImageId(target);
            const btnPrimary = 'btn-primary';
            const btnSuccess = 'btn-success';

            if (imageId !== undefined) {
                // Здесь нужно обращаться к серверу и помечать картинку как основную
            }

            const changeButtonInner = (button, text, removeClass, addClass) => {
                const icon = document.createElement('i');
                const buttonText = document.createTextNode(` ${text}`);

                icon.classList.add('fa');
                icon.classList.add('fa-check');

                removeChildrens(button);

                button.appendChild(icon);
                button.appendChild(buttonText);

                if (button.classList.contains(removeClass)) {
                    button.classList.remove(removeClass);
                }

                if (!button.classList.contains(addClass)) {
                    button.classList.add(addClass);
                }
            };

            const buttons = document.querySelectorAll('button.product-image-change-main');

            for (let button of buttons) {
                const container = getImageContainer(button);
                const mainField = container.querySelector('input.image-main');
                changeButtonInner(button, 'Сделать основным', btnSuccess, btnPrimary);

                if (mainField) {
                    mainField.value = '0';
                }
            }

            const container = getImageContainer(target);
            const mainField = container.querySelector('input.image-main');
            changeButtonInner(target, 'Основное', btnPrimary, btnSuccess);

            if (mainField) {
                mainField.value = '1';
            }
        }
    } else if (target.classList.contains('product-image-delete')) {
        const container = getImageContainer(target);

        if (!container.querySelector('button.btn-success')) {
            alertify.confirm('Это изображение будет удалено безвозвратно!', 'Вы действительно хотите удалить это изображение?', () => {
                const imageId = getImageId(target);

                if (imageId !== undefined) {
                    // Здесь нужно лезть на сервер и удалять изображение
                }

                container.remove();
            }, () => {
                return;
            });
        } else {
            alertify.alert('Внимание', 'Вы не можете удалить основное изображение!');
        }
    }
};

const removeChildrens = (node) => {
    while (node.firstChild) {
        node.firstChild.remove();
    }
};

const addNewSpecificationFields = (container) => {
    const addField = (caption, name, maxlength, hasLink = false) => {
        const divCol = document.createElement('div');
        const divGroup = document.createElement('div');
        const label = document.createElement('label');
        const labelText = document.createTextNode(`${caption}: `);
        const labelSpan = document.createElement('span');
        const labelSpanText = document.createTextNode('*');
        const input = document.createElement('input');

        input.classList.add('form-control');
        input.setAttribute('type', 'text');
        input.setAttribute('name', name);
        input.setAttribute('maxlength', maxlength);
        input.setAttribute('placeholder', caption);

        labelSpan.classList.add('text-danger');
        labelSpan.appendChild(labelSpanText);
        label.appendChild(labelText);
        label.appendChild(labelSpan);

        divGroup.classList.add('form-group');
        divGroup.appendChild(label);
        divGroup.appendChild(input);

        if (hasLink) {
            const p = document.createElement('p');
            const link = document.createElement('a');
            const linkText = document.createTextNode(' удалить эту характеристику');
            const icon = document.createElement('i');

            icon.classList.add('fa');
            icon.classList.add('fa-trash-o');

            link.classList.add('text-danger');
            link.classList.add('remove-specification');
            link.setAttribute('href', 'javascript:;');
            link.appendChild(icon);
            link.appendChild(linkText);

            p.classList.add('help-block');
            p.appendChild(link);

            divGroup.appendChild(p);
        }

        divCol.classList.add('col-lg-6');
        divCol.appendChild(divGroup);

        return divCol;
    };

    const divRow = document.createElement('div');

    divRow.classList.add('row');
    divRow.classList.add('product-specification');
    divRow.appendChild(addField('Название характеристики', 'specification_name[]', 100, true));
    divRow.appendChild(addField('Описание характеристики', 'specification_value[]', 250));

    container.appendChild(divRow);
};

const removeSpecificationField = (event) => {
    const target = event.target;

    if (target.classList.contains('remove-specification')) {
        const parent = target.parentNode.parentNode.parentNode.parentNode;
        const inputs = parent.querySelectorAll('input');
        let isEmptyFields = true;

        for (let input of inputs) {
            if (input.value.length) {
                isEmptyFields = false;
                break;
            }
        }

        if (isEmptyFields) {
            parent.remove();
        } else {
            alertify.confirm('Подтверждение', 'Вы действительно хотите удалить эту характеристику?', () => {
                parent.remove();
            }, () => {
                return;
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form[name=product]');
    const nameField = document.querySelector('input[name=name]');
    const codeField = document.querySelector('input[name=code]');
    const slugField = document.querySelector('input[name=slug]');
    const costField = document.querySelector('input[name=cost]');
    const discountField = document.querySelector('input[name=discount]');
    const addSpecificationButton = document.querySelector('.add-specification');
    const specificationContainer = document.querySelector('.product-specification-container');
    const imageField = document.querySelector('input[name=img]');
    const image = document.querySelector('.img-container > img');
    const cropperBox = document.querySelector('.cropper-box');
    const saveImageButton = document.querySelector('.save-product-image');
    const imagesContainer = document.querySelector('.product-images-container');

    addSpecificationButton.addEventListener('click', () => addNewSpecificationFields(specificationContainer));
    specificationContainer.addEventListener('click', (event) => removeSpecificationField(event));

    saveImageButton.addEventListener('click', () => resizeAndSaveImage(imagesContainer, imageField, cropperBox));
    imagesContainer.addEventListener('click', (event) => imagesActions(event));

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = validate.collectFormValues(form);

        const constraints = {
            name: {
                presence: {
                    message: "Название товара обязательное поле"
                },
                length: {
                    minimum: 7,
                    message: "Название товара должно содержать минимум 7 символов"
                }
            },
            code: {
                presence: {
                    message: "Код товара обязательное поле"
                },
                length: {
                    minimum: 8,
                    message: "Код товара должен состоять из 8-ми символов"
                },
                numericality: {
                    onlyInteger: true,
                    message: "Код товара должен состоять только из цифр"
                }
            },
            cost: {
                presence: {
                    message: "Цена товара обязательное поле"
                },
                numericality: {
                    greaterThan: 0,
                    message: "Цена товара должна быть больше нуля"
                }
            },
            discount: {
                presence: false,
                numericality: {
                    greaterThan: 0,
                    message: "Скидочная цена товара должна быть больше нуля"
                }
            },
            'category[]': {
                presence: {
                    allowEmpty: false,
                    message: "Категория товара обязательное поле"
                },
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

        let errors = validate(formData, constraints, {format: "flat"});

        const specificationNames = document.querySelectorAll('input[name="specification_name[]"]');
        const specificationValues = document.querySelectorAll('input[name="specification_value[]"]');

        if (specificationNames.length && specificationValues.length) {
            let isEmptySpecificationNames = false;
            let isEmptySpecificationValues = false;

            for (let input of specificationNames) {
                if (!input.value) {
                    isEmptySpecificationNames = true;
                    break;
                }
            }

            for (let input of specificationValues) {
                if (!input.value) {
                    isEmptySpecificationValues = true;
                    break;
                }
            }

            if (isEmptySpecificationNames || isEmptySpecificationValues) {
                if (errors === undefined) {
                    errors = [];
                }

                if (isEmptySpecificationNames) {
                    errors.push(' Заполнены не все поля из названий характеристик');
                }

                if (isEmptySpecificationValues) {
                    errors.push(' Заполнены не все поля из описаний характеристик');
                }
            }
        }

        if (!getCountPostedImages(imagesContainer)) {
            if (errors === undefined) {
                errors = [];
            }

            errors.push(' Товар должен сожержать минимум одно изображение');
        }

        if (errors !== undefined) {
            hideFromErrors();
            showFormErrors(errors);
        } else {
            axios.post('/backend/product/prevalidation', {
                    code: codeField.value,
                    slug: slugField.value
                })
                .then((response) => {
                    if (response.data.messages.length) {
                        hideFromErrors();
                        showFormErrors(response.data.messages);
                    } else {
                        form.submit();
                    }
                })
                .catch((error) => {
                    showFormErrors(error);
                });
        }
    });

    const priceMaskOptions = {
        mask: Number,
        scale: 2,
        radix: '.',
        padFractionalZeros: true
    };

    new IMask(costField, priceMaskOptions);
    new IMask(discountField, priceMaskOptions);

    nameField.addEventListener('blur', () => {
        if (nameField.value.length && !slugField.value.length) {
            axios.post('/backend/product/slug', {
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
        select: 'select[name="category[]"]',
        searchPlaceholder: searchPlaceholder,
        searchText: searchText,
        placeholder: 'отсутствует'
    });

    if (URL) {
        imageField.addEventListener('change', function () {
            const files = this.files;
            let file;

            if (files && files.length) {
                file = files[0];

                if (/^image\/\w+/.test(file.type)) {
                    if (uploadedImageURL) {
                        URL.revokeObjectURL(uploadedImageURL);
                    }

                    image.src = uploadedImageURL = URL.createObjectURL(file);

                    if (cropper) {
                        cropper.destroy();
                    }

                    const options = {
                        aspectRatio: 1.13 / 1,
                        preview: '.img-preview',
                        zoomOnWheel: false,
                        minCropBoxHeight: 50,
                    };

                    cropper = new Cropper(image, options);
                    imageField.value = null;

                    cropperBox.classList.remove('cropper-box');
                } else {
                    imageField.value = null;
                    alertify.alert('Внимание!', 'Выберите файл изображения');
                }
            }
        });
    } else {
        imageField.disabled = true;
    }
});