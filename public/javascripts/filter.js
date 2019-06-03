let rangerObject;

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

const rebuildProductsList = (productsContainer, showMoreButton, products) => {
    return new Promise((resolve, reject) => {
        const createCell = (product) => {
            const divCell = document.createElement('div');

            const createCategory = () => {
                const cellCategory = document.createElement('div');
                const cellCategoryName = document.createElement('div');
                const cellCategoryNameText = document.createTextNode(product.mainCategory.name);
                const div = document.createElement('div');
                const span = document.createElement('span');

                span.classList.add('add-to-favorite');
                span.dataset.item = product._id;
                cellCategoryName.classList.add('cell-category-name');
                cellCategory.classList.add('cell-category');

                div.appendChild(span);
                cellCategoryName.appendChild(cellCategoryNameText);
                cellCategory.appendChild(cellCategoryName);
                cellCategory.appendChild(div);

                return cellCategory;
            };

            const createImage = () => {
                const cellImage = document.createElement('div');
                const link = document.createElement('a');
                const image = document.createElement('img');

                const getMainImage = () => {
                    for (let i = 0; i < product.photos.length; i++) {
                        if (product.photos[i].isMain) {
                            return product.photos[i].name;
                        }
                    }
                };

                image.src = `/uploads/products/thumbnails/${getMainImage()}`;
                image.setAttribute('alt', product.name);
                link.setAttribute('href', `/product/${product.slug}`);
                cellImage.classList.add('cell-image');


                link.appendChild(image);
                cellImage.appendChild(link);

                if (product.cost.isDiscount) {
                    const discount = Math.round((product.cost.mainCost - product.cost.discountCost) / product.cost.mainCost * 100);
                    const cellDiscount = document.createElement('div');
                    const cellDiscountText = document.createTextNode(`-${discount}%`);

                    cellDiscount.classList.add('cell-discount');
                    cellDiscount.appendChild(cellDiscountText);
                    cellImage.appendChild(cellDiscount);
                }

                return cellImage;
            };

            const createPrice = () => {
                const cellPrice = document.createElement('div');
                const cellPriceMain = document.createElement('div');

                const getFormattedPrice = (price) => {
                    if (price % 2 > 0) {
                        return (price / 100).toFixed(2);
                    }

                    return price / 100;
                };

                const cellPriceMainText = document.createTextNode(`${getFormattedPrice(product.cost.currentCost)} грн.`);

                cellPrice.classList.add('cell-price');
                cellPriceMain.classList.add('cell-price-main');
                cellPriceMain.appendChild(cellPriceMainText);

                if (!product.cost.isDiscount) {
                    cellPrice.appendChild(cellPriceMain);
                } else {
                    const cellPriceOld = document.createElement('div');
                    const cellPriceOldText = document.createTextNode(`${getFormattedPrice(product.cost.mainCost)} грн.`);

                    cellPriceOld.classList.add('cell-price-old');
                    cellPriceMain.classList.add('discount');

                    cellPriceOld.appendChild(cellPriceOldText);
                    cellPrice.appendChild(cellPriceMain);
                    cellPrice.appendChild(cellPriceOld);
                }

                return cellPrice;
            };

            const createName = () => {
                const cellName = document.createElement('div');
                const link = document.createElement('a');
                const linkText = document.createTextNode(product.name);

                link.setAttribute('href', `/product/${product.slug}`);
                cellName.classList.add('cell-name');

                link.appendChild(linkText);
                cellName.appendChild(link);

                return cellName;
            };

            const createTags = () => {
                const cellTags = document.createElement('div');

                cellTags.classList.add('cell-tags');

                const createTag = (className, text) => {
                    const span = document.createElement('span');
                    const spanText = document.createTextNode(text);

                    span.classList.add(className);
                    span.appendChild(spanText);

                    return span;
                };

                if (product.cost.isDiscount) {
                    cellTags.appendChild(createTag('discount', 'скидка'));
                }

                if (product.isBestseller) {
                    cellTags.appendChild(createTag('bestseller', 'хит продаж'));
                }

                if (product.isPremium) {
                    cellTags.appendChild(createTag('premium', 'премиум'));
                }

                if (product.isOnlyHere) {
                    cellTags.appendChild(createTag('only', 'только у нас'));
                }

                return cellTags;
            };

            divCell.classList.add('cell');
            divCell.appendChild(createCategory());
            divCell.appendChild(createImage());
            divCell.appendChild(createPrice());
            divCell.appendChild(createName());
            divCell.appendChild(createTags());

            return divCell;
        };

        for (let i = 0; i < products.length; i++) {
            productsContainer.appendChild(createCell(products[i]));
        }

        if (products.length !== 12) {
            showMoreButton.classList.add('show-more-hidden');
        } else {
            showMoreButton.classList.remove('show-more-hidden');
        }
    });
};

const rebuildFilters = (container, showMore, brands, countries, price, isPrice) => {
    return new Promise((resolve, reject) => {
        if (!showMore) {
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

            if (!isPrice) {
                rangerObject.update(price.min, price.max);
            }
        }

        enableAllFilters(container);
    });
};

const filterProducts = (container, productsContainer, showMoreButton, isPrice = false, showMore = false) => {
    disableAllFilters(container);

    let page = 1;

    if (!showMore) {
        removeAllNodes(productsContainer);
        showMoreButton.dataset.page = '2';
    } else {
        page = Number(showMoreButton.dataset.page);
        showMoreButton.dataset.page = String(page + 1);
    }

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

    const collectTags = () => {
        const tags = container.querySelectorAll('.filter-tags span.tag.active');
        const array = [];

        for (let tag of tags) {
            array.push(tag.dataset.item);
        }

        return array;
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

    const getSearchText = () => {
        const input = container.querySelector('.filter-search input[name="search"]');
        return input.value;
    };

    const categories = collectCheckboxes('.filter-category .checkbox', true);
    const brands = collectCheckboxes('.filter-brand .checkbox');
    const countries = collectCheckboxes('.filter-country .checkbox');
    const tags = collectTags();
    const search = getSearchText();

    const price = {
        min: getPrice('.filter-price input[name="range-min"]'),
        max: getPrice('.filter-price input[name="range-max"]')
    };

    const sort = getSort();

    axios.post('/catalog/filter', {
            categories, tags, brands, countries, search, price, isPrice, sort, page
        })
        .then((response) => {
            return Promise.all([
                rebuildFilters(container, showMore, response.data.brands, response.data.countries, response.data.price, response.data.isPrice),
                rebuildProductsList(productsContainer, showMoreButton, response.data.products)
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
    const sortContainer = document.querySelector('.list-caption-container-sort');
    const showMoreButton = document.querySelector('a.show-more');

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

            filterProducts(filterContainer, productsContainer, showMoreButton);
        }

        if (target.classList.contains('tag')) {
            if (target.classList.contains('active')) {
                target.classList.remove('active');
            } else {
                target.classList.add('active');
            }

            filterProducts(filterContainer, productsContainer, showMoreButton);
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

    sortContainer.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('sort')) {
            const active = sortContainer.querySelector('a.active');

            active.classList.remove('active');
            target.classList.add('active');

            filterProducts(filterContainer, productsContainer, showMoreButton, true);
        }
    });

    showMoreButton.addEventListener('click', () => {
        filterProducts(filterContainer, productsContainer, showMoreButton, false,true);
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
            reInit: function (min, max) {

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
            filterProducts(filterContainer, productsContainer, showMoreButton, true);
        });

        /* set Max slide Listener */
        slideMax.addEventListener("mousedown", function(e){
            range.maxDragged = true;
        });

        slideMax.addEventListener("mouseup", function(e){
            range.maxDragged = false;
            filterProducts(filterContainer, productsContainer, showMoreButton, true);
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

        this.update = function (min, max) {
            minElement.value = `${min}${currency}`;
            minElement.dataset.limit = min;
            maxElement.value = `${max}${currency}`;
            maxElement.dataset.limit = max;

            range.min = min;
            range.max = max;
            range.maxLeft = sliderRanger.offsetWidth;
            range.width = sliderRanger.offsetWidth / (range.max - range.min);
            range.step = (!isNaN(parseInt(step)) && parseInt(step) > 0)?parseInt(step):range.step;
            range.init();
        };
    };

    rangerObject = new Ranger('.ranger', 'input[name="range-min"]', 'input[name="range-max"]');
});