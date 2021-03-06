const Util = require('../util');

exports.getProductListViewModel = (products) => {
    const productsViewModel = products.map(item => ({
        hasBage: (item.sale && item.sale > 0) ? true : false,
        imgpath: item.assert.img[0],
        name: item.name,
        price: item.price,
        title: item.name.length > 17 ? item.name.substr(0, 17) + '...' : item.name,
        id: item._id
    }));
    return productsViewModel;
}

exports.getProductDetailViewModel = (product) => {
    let { _id, name, description, price, quantity, review, view } = product;
    let color, size;
    [color, size] = ['color', 'size'].map(field => product.option[field].map(option => option.name));

    const productViewModel = {
        active_img: product.assert.img[0],
        img: product.assert.img.slice(1, product.assert.img.length),
        name,
        description,
        price,
        color,
        size,
        quantity,
        view,
        review,
        id: _id
    }
    return productViewModel;
}


exports.getPageOption = ({ itemPerPage, currentPage, totalItems, url, queryParams }) => {
    return {
        itemPerPage,
        currentPage,
        totalItems,
        url,
        queryParams
    }
}

exports.getSortOption = ({ query }) => {
    const option = new function () {
        this.queryString = 'sort',
            this.list = [{
                key: '0',
                name: 'Sắp xếp theo giá tăng dần'
            }, {
                key: '1',
                name: 'Sắp xếp theo giá giảm dần'
            }, {
                key: '2',
                name: 'Sản phẩm phổ biến'
            }, {
                key: '3',
                name: 'Sản phẩm bán chạy'
            }, {
                key: '4',
                name: 'Sản phẩm mới'
            }, {
                key: '5',
                name: 'Sản phẩm yêu thích'
            }
            ]
        this.selected = query[this.queryString];
    };
    return option;
}
exports.getFilterOptions = async ({ query, data }) => {
    const title = {
        gender: 'Giới tính',
        brand: 'Thương hiệu',
        category: 'Danh mục',
        group: 'Loại'
    }
    const result = {};
    return Object.keys(title).map(key => {
        return {
            queryString: key,
            title: title[key],
            list: data[key],
            selected: query[key],
        }
    });
}
