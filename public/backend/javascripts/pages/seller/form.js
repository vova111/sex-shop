document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form[name=seller]');
    const nameField = document.querySelector('input[name=name]');
    const slugField = document.querySelector('input[name=slug]');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // const formData = validate.collectFormValues(form);
        //
        // const constraints = {
        //     name: {
        //         presence: {
        //             message: "Название продавца обязательное поле"
        //         },
        //         length: {
        //             minimum: 3,
        //             message: "Название продавца должно содержать минимум 3 символа"
        //         }
        //     },
        //     slug: {
        //         presence: {
        //             message: "Постоянная ссылка обязательное поле"
        //         },
        //         length: {
        //             minimum: 3,
        //             message: "Постоянная ссылка должна содержать минимум 3 символа"
        //         },
        //         format: {
        //             pattern: "[a-z0-9]+(?:-[a-z0-9]+)*",
        //             message: "Постоянная ссылка может состоять только из символов a-z, 0-9, '-' и не содержать пробелов"
        //         }
        //     }
        // };
        //
        // const errors = validate(formData, constraints, {format: "flat"});
        //
        // if (errors !== undefined) {
        //     hideFromErrors();
        //     showFormErrors(errors);
        // } else {
        //     form.submit();
        // }

        if (cropper) {
            canvas = cropper.getCroppedCanvas({
                // width: 200,
                // height: 90,
            });

            // set size proportional to image
            canvas.height = canvas.width * (200 / 90);

            // step 1 - resize to 50%
            var oc = document.createElement('canvas'),
                octx = oc.getContext('2d');

            oc.width = img.width * 0.5;
            oc.height = img.height * 0.5;
            octx.drawImage(img, 0, 0, oc.width, oc.height);

            // step 2
            octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

            // step 3, resize to final size
            ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
                0, 0, canvas.width, canvas.height);

            const test = document.querySelector('.test');
            test.src = oc.toDataURL();
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

    const options = {
        aspectRatio: 20 / 9,
        preview: '.img-preview',
        ready: function (e) {
            // console.log(e.type);
        },
        cropstart: function (e) {
            // console.log(e.type, e.detail.action);
        },
        cropmove: function (e) {
            // console.log(e.type, e.detail.action);
        },
        cropend: function (e) {
            // console.log(e.type, e.detail.action);
        },
        crop: function (e) {
            var data = e.detail;

            // console.log(e.type);
        },
        zoom: function (e) {
            // console.log(e.type, e.detail.ratio);
        }
    };

    let cropper;
    const URL = window.URL || window.webkitURL;

    const container = document.querySelector('.img-container');
    const image = document.querySelector('.img-container > img');

    let uploadedImageType;
    let uploadedImageName;
    let uploadedImageURL;

    const inputImage = document.querySelector('input[name=img]');

    if (URL) {
        inputImage.onchange = function () {
            const files = this.files;
            let file;

            if (files && files.length) {
                file = files[0];

                if (/^image\/\w+/.test(file.type)) {
                    uploadedImageType = file.type;
                    uploadedImageName = file.name;

                    if (uploadedImageURL) {
                        URL.revokeObjectURL(uploadedImageURL);
                    }
                    console.log(image);
                    image.src = uploadedImageURL = URL.createObjectURL(file);

                    if (cropper) {
                        cropper.destroy();
                    }

                    cropper = new Cropper(image, options);
                    inputImage.value = null;
                } else {
                    window.alert('Please choose an image file.');
                }
            }
        };
    } else {
        inputImage.disabled = true;
        inputImage.parentNode.className += ' disabled';
    }
});