const disableAllFilters = (container) => {
    const filterBlocks = container.querySelectorAll('.filter-block');

    for (let block of filterBlocks) {
        const layer = document.createElement('div');

        layer.classList.add('filter-block-layer');
        block.classList.add('filter-block-disable');
        block.appendChild(layer);
    }
};

const enableAllFilters = (container) => {
    const filterBlocks = container.querySelectorAll('.filter-block');
    const layers = container.querySelectorAll('.filter-block-layer');

    for (let layer of layers) {
        layer.remove();
    }

    for (let block of filterBlocks) {
        const layer = document.createElement('div');
        block.classList.remove('filter-block-disable');
    }
};

const rebuildProductsList = (productsContainer, products) => {
    return new Promise((resolve, reject) => {
        const createCell = (product) => {
            const divCell = document.createElement('div');
            const divCellImage = document.createElement('div');
            const divCellPrice = document.createElement('div');
            const divCellName = document.createElement('div');
            const divCellTags = document.createElement('div');

            const createCategory = () => {
                const divCellCategory = document.createElement('div');
                const divCellCategoryName = document.createElement('div');
                const divCellCategoryNameText = document.createTextNode(product.mainCategory.name);
                const div = document.createElement('div');
                const span = document.createElement('span');

                span.classList.add('add-to-favorite');
                span.dataset.item = product._id;
                divCellCategoryName.classList.add('cell-category-name');
                divCellCategory.classList.add('cell-category');

                div.appendChild(span);
                divCellCategoryName.appendChild(divCellCategoryNameText);
                divCellCategory.appendChild(divCellCategoryName);
                divCellCategory.appendChild(div);
                // console.log(div);
                return divCellCategory;
            };
            console.log(createCategory());
            divCell.appendChild(createCategory());
        };

        for (let i = 0; i < products.length; i++) {
            createCell(products[i])
            // productsContainer.appendChild(createCell(products[i]));
        }
    });
};

const rebuildFilters = (container, brands, countries) => {
    return new Promise((resolve, reject) => {
        const pasteCheckboxes = (selector, entities) => {
            const content = container.querySelector(selector);

            removeAllNodes(content);

            for (let entity of entities) {
                const checkbox = document.createElement('div');
                const checkboxText = document.createTextNode(entity.name);

                checkbox.classList.add('checkbox');

                if (typeof entity.selected !== 'undefined') {
                    checkbox.classList.add('checked');
                }

                checkbox.dataset.item = entity.id;
                checkbox.appendChild(checkboxText);

                content.appendChild(checkbox);
            }
        };

        pasteCheckboxes('.filter-brand .filter-block-content', brands);
        pasteCheckboxes('.filter-country .filter-block-content', countries);

        enableAllFilters(container);
    });
};

const filterProducts = (container, productsContainer) => {
    disableAllFilters(container);
    removeAllNodes(productsContainer);

    const collectCheckboxes = (selector, isCategory = false) => {
        const checkboxes = container.querySelectorAll(selector);
        const collection = [];

        for (let checkbox of checkboxes) {
            if (checkbox.classList.contains('checked')) {
                collection.push(checkbox.dataset.item);
            }
        }

        if (isCategory && !collection.length) {
            for (let checkbox of checkboxes) {
                collection.push(checkbox.dataset.item);
            }
        }

        return collection;
    };

    const getPrice = (selector) => {
        const field = container.querySelector(selector);
        const limit = parseInt(field.dataset.limit);
        const value = parseInt(field.value);

        return limit !== value ? value : false;
    };

    const getSort = () => {
        const sort = document.querySelector('.list-caption-container ul li a.active');
        return sort.dataset.item;
    };

    const categories = collectCheckboxes('.filter-category .checkbox', true);
    const brands = collectCheckboxes('.filter-brand .checkbox');
    const countries = collectCheckboxes('.filter-country .checkbox');

    const price = {
        min: getPrice('.filter-price input[name="range-min"]'),
        max: getPrice('.filter-price input[name="range-max"]')
    };

    const sort = getSort();
    const page = 1;

    axios.post('/catalog/filter', {
            categories, brands, countries, price, sort, page
        })
        .then((response) => {
            return Promise.all([
                rebuildFilters(container, response.data.brands, response.data.countries),
                rebuildProductsList(productsContainer, response.data.products)
            ]);
        })
        .catch((error) => {
            alert('Неизвестная ошибка! Перезагрузите страницу.');
        });
};

document.addEventListener('DOMContentLoaded', () => {
    const filterContainer = document.querySelector('.filter');
    const finterCatalogButton = filterContainer.querySelector('.filter-catalog-open');
    const finterCatalogContainer = filterContainer.querySelector('.side');
    const filterBlocks = document.querySelector('.filter-blocks');
    const productsContainer = document.querySelector('.list-products-container');

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

            filterProducts(filterContainer, productsContainer);
        }
    });

    finterCatalogButton.addEventListener('click', () => {
        if (finterCatalogContainer.classList.contains('side-hidden')) {
            disableAllFilters(filterContainer);
            finterCatalogContainer.classList.remove('side-hidden');
        } else {
            enableAllFilters(filterContainer);
            finterCatalogContainer.classList.add('side-hidden');
        }
    });

    finterCatalogContainer.addEventListener('mouseleave', () => {
        enableAllFilters(filterContainer);
        finterCatalogContainer.classList.add('side-hidden');
    });

    const Ranger = function (containerName, minElement, maxElement, step) {
        /* init main view-objects */
        let sliderRanger, slideMin, slideMax, slideFill;
        const currency = ' грн.';

        /* Range object */
        const range = {
            min : 0,
            max : 0,
            minLeft : 0,
            maxLeft : 0,
            width : 0,
            step : 10,
            minDragged : false,
            init : function () {
                slideMin.style.left = '0';
                slideMax.style.left = `${this.maxLeft}px`;
                this.fill();
            },
            sync : function () {
                /* set min */
                if (this.minDragged) {
                    minElement.value = `${this.min + Math.round(this.minLeft / this.width)}${currency}`;
                }

                if (this.maxDragged) {
                    maxElement.value = `${this.min + Math.round(this.maxLeft / this.width)}${currency}`;
                }
            },
            fill : function () {
                const left = parseInt(slideMin.style.left);
                const width = parseInt(slideMax.style.left) - left;

                slideFill.style.left = `${left}px`;
                slideFill.style.width = `${width}px`;
            },
            slideDrag : function(event){
                let left = event.clientX - sliderRanger.offsetLeft;

                /* min scroll */
                if (this.minDragged) {
                    if (left < 0) {
                        left = 0;
                    } else if (left >= this.maxLeft - slideMin.offsetWidth) {
                        left = (this.maxLeft - slideMin.offsetWidth);
                    }

                    this.minLeft = left;
                    slideMin.style.left = `${left}px`;
                    this.fill();
                    this.sync();
                }

                /* max scroll */
                if (this.maxDragged) {
                    if(left > sliderRanger.offsetWidth) {
                        left = sliderRanger.offsetWidth;
                    } else if (left <= this.minLeft + slideMin.offsetWidth) {
                        left = (this.minLeft + slideMin.offsetWidth);
                    }

                    this.maxLeft = left;
                    slideMax.style.left = `${left}px`;
                    this.fill();
                    this.sync();
                }
            }
        };

        /* Get range container and greate 2 slider (.min and .max) */
        sliderRanger = document.querySelector(String(containerName));
        if (sliderRanger === null) return;
        slideMin = document.createElement('div');
        slideMax = document.createElement('div');
        slideFill = document.createElement('div');
        slideMin.className = 'slider min';
        slideMax.className = 'slider max';
        slideFill.className = 'filler';
        sliderRanger.appendChild(slideMin);
        sliderRanger.appendChild(slideMax);
        sliderRanger.appendChild(slideFill);

        /* setInit value */
        const priceMaskOptions = {
            mask: `num ${currency}`,
            blocks: {
                num: {
                    mask: Number,
                }
            }
        };

        minElement = document.querySelector(String(minElement));
        maxElement = document.querySelector(String(maxElement));
        new IMask(minElement, priceMaskOptions);
        new IMask(maxElement, priceMaskOptions);
        if (minElement === null || typeof minElement === "undefined" || maxElement === null || typeof maxElement === "undefined") return;
        const minValue = parseInt(minElement.value);
        const maxValue = parseInt(maxElement.value);
        range.min = Math.floor(minValue);
        range.max = Math.floor(maxValue);
        range.maxLeft = sliderRanger.offsetWidth;
        range.width = sliderRanger.offsetWidth / (range.max - range.min);
        range.step = (!isNaN(parseInt(step)) && parseInt(step) > 0)?parseInt(step):range.step;
        range.init();

        minElement.addEventListener('blur', function (e) {
            e.target.value = `${e.target.value}${currency}`;
        });

        maxElement.addEventListener('blur', function (e) {
            e.target.value = `${e.target.value}${currency}`;
        });

        /* set Min slide Listener */
        slideMin.addEventListener("mousedown", function(e){
            range.minDragged = true;
        });

        slideMin.addEventListener("mouseup", function(e){
            range.minDragged = false;
            filterProducts(filterContainer, productsContainer);
        });

        /* set Max slide Listener */
        slideMax.addEventListener("mousedown", function(e){
            range.maxDragged = true;
        });

        slideMax.addEventListener("mouseup", function(e){
            range.maxDragged = false;
            filterProducts(filterContainer, productsContainer);
        });

        /* default unset */
        document.addEventListener("mouseup", function(e){
            range.minDragged = false;
            range.maxDragged = false;
        });

        /* set default Listener */
        document.addEventListener("mousemove", function(e){
            range.slideDrag(e);
        });
    };

    new Ranger('.ranger', 'input[name="range-min"]', 'input[name="range-max"]');
});