let cropper;
let uploadedImageURL;
const URL = window.URL || window.webkitURL;
const pica = window.pica({});

const resizeAndSaveImage = () => {
    const logoField = document.querySelector('input[name=logo]');

    const resizedImg = document.createElement('canvas');
    const resizeWidth = document.createAttribute('width');
    const resizeHeight = document.createAttribute('height');

    resizeWidth.value = '200';
    resizeHeight.value = '90';

    resizedImg.setAttributeNode(resizeWidth);
    resizedImg.setAttributeNode(resizeHeight);

    const canvas = cropper.getCroppedCanvas();

    pica.resize(canvas, resizedImg)
        .then(result => pica.toBlob(result, 'image/jpeg', 0.90))
        .then(blob => {
            const reader = new FileReader();

            reader.readAsDataURL(blob);
            reader.onloadend = function() {
                const base64data = reader.result.split(',')[1];

                logoField.value = base64data;
            };
        });
};

const options = {
    aspectRatio: 20 / 9,
    preview: '.img-preview',
    zoomOnWheel: false,
    minCropBoxHeight: 30,
    ready: function (e) {
        resizeAndSaveImage();
    },
    cropend: function (e) {
        resizeAndSaveImage();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form[name=seller]');
    const nameField = document.querySelector('input[name=name]');
    const slugField = document.querySelector('input[name=slug]');
    const imageField = document.querySelector('input[name=img]');
    const image = document.querySelector('.img-container > img');
    const cropperBox = document.querySelector('.cropper-box');
    const changeLogoButton = document.querySelector('.change-seller-logo');

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

    if (changeLogoButton) {
        changeLogoButton.addEventListener('click', () => {
            const uploadedImageContainer = document.querySelector('.uploaded-seller-logo');
            const uploadedFields = document.querySelector('.cropper-input');

            uploadedImageContainer.classList.add('hidden-uploaded');
            uploadedFields.classList.remove('cropper-input');
        });
    }

    if (URL) {
        imageField.addEventListener('change', function () {
            const files = this.files;
            let file;

            if (files && files.length) {
                file = files[0];

                if (/^image\/\w+/.test(file.type)) {
                    cropperBox.classList.remove('cropper-box');

                    if (uploadedImageURL) {
                        URL.revokeObjectURL(uploadedImageURL);
                    }

                    image.src = uploadedImageURL = URL.createObjectURL(file);

                    if (cropper) {
                        cropper.destroy();
                    }

                    cropper = new Cropper(image, options);
                    imageField.value = null;
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