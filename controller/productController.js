const productService = require('../models/productService')
const productViewModel = require('../models/productViewModel')

exports.getList = async (req, res) => {
    const query = await productService.getQueryObject(req.query);
    console.log('query params', req.query);
    console.log('query mongoose: ', query);
    const totalItems = await productService.productCount(query);

    const sortOption = productViewModel.getSortOption({ query: req.query });

    const fitlerOptionsData = await productService.getFilterOptionsData();
    const filterOptions = await productViewModel.getFilterOptions({ query: req.query, data: fitlerOptionsData });

    const pageOptions = productViewModel.getPageOption({
        itemPerPage: 12,
        currentPage: req.query['page'] ? parseInt(req.query['page']) : 1,
        totalItems: totalItems,
        url: req.baseUrl + req.path,
        queryParams: req.query
    });
    const viewModel = {
        products: productViewModel.getProductListViewModel(await productService.getProducts({
            object: query,
            sort: productService.getSortQueryObject(sortOption.selected),
            page: pageOptions
        })),
        pageOptions,
        sortOption,
        filterOptions,
        search: req.query.name
    }
    
    res.render('product/list', viewModel);
}

exports.getDetail = async (req, res) => {
    const product = await productService.getProductDetail(req.params.id);
    const viewModel = {
        relate: null,
        detail: productViewModel.getProductDetailViewModel(product)
    }
    res.render('product/detail', viewModel);
}
