const qs = require('querystring');
module.exports = {
    createAlert: ({ type, message }) => {
        // success, info, warning, danger
        console.log(type);
        console.log(message);
        const icon = {
            'success': `<i class='tf-ion-thumbsup'></i>`,
            'info': `<i class='tf-ion-android-checkbox-outline'></i>`,
            'warning': `<i class='tf-ion-alert-circled'></i>`,
            'danger': `<i class='tf-ion-close-circled'></i>`
        }
        return (!type) ? '' : `<div class='alert alert-${type} alert-common' role='alert'>${icon[type]} ${message}</div>`
    },
    createPagination: (pageOptions) => {
        const { currentPage, url, totalPage } = pageOptions;
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
        return str;
    }
}