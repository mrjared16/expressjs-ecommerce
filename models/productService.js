const product = require('./product');

exports.queryIndex = async (req, res) => {
    console.log(req.query);
    // category,  gender, group, 
    const result = await product.find({
        brand: { "$regex": new RegExp(req.query.brand, 'i') },
        category: { "$regex": new RegExp(req.query.category, 'i') },
        gender: { "$regex": new RegExp(req.query.gender, 'i') },
        group: { "$regex": new RegExp(req.query.group, 'i') },
    });
    const totalPage = result.count();
    console.log(`totalPage: ${totalPage}`);
    //console.log(result);
    const products = result.map(item => ({
        hasBage: (item.sale | item.sale > 0) ? true : false,
        imgpath: item.assert.path + item.assert.img[0],
        name: item.name,
        price: item.price,
        id: item._id
    }));

    console.log(products);
    const itemPerPage = 12;

    const pageOptions = new function () {
        this.totalPage = Math.round(products.length / itemPerPage);
        this.currentPage = req.params.page ? parseInt(req.params.page) : 1;
        this.isPaginate = (this.totalPage > 1);
        this.hasNext = (this.currentPage !== this.totalPage);
        this.hasPrev = (this.currentPage !== 1);
        this.nextPage = (this.hasNext) ? this.currentPage + 1 : null;
        this.prevPage = (this.hasPrev) ? this.currentPage - 1 : null;
        this.hasNextDot = (this.nextPage && this.totalPage - this.nextPage > 1);
        this.hasPrevDot = (this.prevPage && this.prevPage - 1 > 1);
        this.hasLastPage = (this.totalPage - this.currentPage > 1);
        this.hasFirstPage = (this.currentPage - 1 > 1);
        this.url = req.originalUrl;
    };
    console.log(pageOptions);
    return { products: products, pageOptions: pageOptions };
}

exports.queryDetail = async (req, res) => {
    const detail = await product.findByIdAndUpdate(req.params.id, { $inc: { 'view': 1 } });
    const imgpath = detail.assert.img.map(item => detail.assert.path + item);
    const query = {
        active_img: imgpath[0],
        img: imgpath.slice(1, imgpath.length),
        name: detail.name,
        description: detail.description,
        price: detail.price,
        color: detail.option.color,
        size: detail.option.size,
        quantity: detail.quantity,
        tag: detail.tag,
        view: detail.view
    }
    console.log(query);
    return query;
}

exports.queryIndexHome = async (req, res) => {
    const result = await product.aggregate().sample(6);
    const query = result.map(item => ({
        hasBage: (item.sale | item.sale > 0) ? true : false,
        imgpath: item.assert.path + item.assert.img[0],
        name: item.name,
        price: item.price,
        id: item._id
    }));
    console.log(query);
    return query;
}