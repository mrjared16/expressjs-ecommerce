const qs = require('querystring');
module.exports = {
    createAlert: ({ type, message }) => {
        // success, info, warning, danger
        // console.log(type);
        // console.log(message);
        const icon = {
            'success': `<i class='tf-ion-thumbsup'></i>`,
            'info': `<i class='tf-ion-android-checkbox-outline'></i>`,
            'warning': `<i class='tf-ion-alert-circled'></i>`,
            'danger': `<i class='tf-ion-close-circled'></i>`
        }
        return (!type) ? '' : `<div class='alert alert-${type} alert-common' role='alert'>${icon[type]} ${message}</div>`
    },
    createSortOption: (option) => {
        const { list, selected, queryString } = option;
        if (!queryString || !list)
            return '';

        let optionElements = list.map(option => {
            if (option.key === undefined)
                return '';

            const isSelected = (selected && selected === option.key) ? 'selected' : '';
            return `<option value=${option.key} ${isSelected}>${option.name}</option>`;
        }).join('\n');
        if (selected === undefined) {
            optionElements = `<option hidden disabled selected value> -- Sắp xếp -- </option>\n ${optionElements}`;
        }
        return ` 
    <div class="widget">
        <h4 class="widget-title">Sắp xếp</h4>
        <select name="${queryString}" class="form-control filter-form">
        ${optionElements}  
        </select>
    </div>`
    },
    createCheckBoxOptions: (options) => {
        const filterOptions = options.map(option => {
            const { title, queryString, list, selected } = option;
            if (!queryString || !list)
                return '';
            let optionElements = list.map(option => {
                if (option.key === undefined)
                    return '';
                const isChecked = (Array.isArray(selected) && selected.includes(option.key)) || (selected && selected === option.key);
                const check = (isChecked) ? 'checked' : '';

                return `<div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="${option.key}"
                    name=${queryString} value=${option.key} ${check} >
                <label class="custom-control-label" for=${option.key}>${option.name}</label>
            </div>`;
            }).join('\n');
            return ` 
            <div class="panel-group commonAccordion" id="${queryString}container" role="tablist" aria-multiselectable="true">
                <div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="${queryString}heading">
                        <h4 class="panel-title">
                            <a role="button" data-toggle="collapse" data-parent="#${queryString}container"
                            href="#${queryString}collapse" aria-expanded="true" aria-controls="${queryString}collapse">
                                ${title}
                            </a>
                        </h4>   
                    </div>
                    <div id="${queryString}collapse" class="panel-collapse collapse in" role="tabpanel"
                    aria-labelledby="${queryString}heading">
                        <div class="filter-form custom-control panel-body ">
                            ${optionElements}
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('\n');

        return `<div class="widget product-category">
                    <h4 class="widget-title">Lọc</h4>
                    ${filterOptions}
                </div>`
    },

    createPagination: (pageOptions) => {
        // console.log(pageOptions);
        const { currentPage, url } = pageOptions;
        const totalPage = Math.ceil(pageOptions.totalItems / pageOptions.itemPerPage);
        if (totalPage <= 1)
            return '';

        let params = pageOptions.queryParams;
        let queryString;
        let str = '';
        // previous page
        if (currentPage > 1) {
            params.page = currentPage - 1;
            queryString = qs.stringify(params);
            str +=
                `<li>
                    <a href='${url}?${queryString}'>Prev</a>
                </li>`;
        }

        // first page
        if (currentPage === 1) {
            str +=
                `<li class='active'>
                    <a href='#'>1</a>
                </li>`;
        }
        else {
            params.page = 1;
            queryString = qs.stringify(params);
            str +=
                `<li>
                    <a href='${url}?${queryString}'>${params.page}</a>
                </li>`;
        }

        // previous page (number)
        if (currentPage > 2) {
            params.page = currentPage - 1;
            queryString = qs.stringify(params);
            if (currentPage > 3) {
                str +=
                    `<li>
                    <a href='#'>...</a>
                </li>`;
            }
            str +=
                `<li>
                    <a href='${url}?${queryString}'>${params.page}</a>
                </li>`;
        }

        // current page
        if (currentPage !== 1 && currentPage !== totalPage) {
            str +=
                `<li class='active'>
                    <a href='#'>${currentPage}</a>
                </li>`;
        }

        // next page (number)
        if (totalPage - currentPage > 1) {
            params.page = currentPage + 1;
            queryString = qs.stringify(params);
            str +=
                `<li>
                    <a href='${url}?${queryString}'>${params.page}</a>
                </li>`;
            if (totalPage - currentPage > 2) {
                str +=
                    `<li>
                    <a>...</a>
                </li>`;
            }
        }

        // last page
        if (currentPage === totalPage) {
            str +=
                `<li class='active'>
                    <a href='#'>${totalPage}</a>
                </li>`;
        }
        else {
            params.page = totalPage;
            queryString = qs.stringify(params);
            str +=
                `<li>
                    <a href='${url}?${queryString}'>${params.page}</a>
                </li>`;
        }

        // next page
        if (totalPage - currentPage > 0) {
            params.page = currentPage + 1;
            queryString = qs.stringify(params);
            str +=
                `<li>
                    <a href='${url}?${queryString}'>Next</a>
                </li>`;
        }
        return `<div class="row">
            <ul class="pagination post-pagination">
                ${str}
            </ul>
        </div>`
    }
}