const product = require('./product');

exports.queryIndex = async (req, res) => {
    console.log(req.query);
    // category,  gender, group, color, size, order
    const totalItems = await product.countDocuments({
        brand: { "$regex": new RegExp(req.query.brand, 'i') },
        category: { "$regex": new RegExp(req.query.category, 'i') },
        gender: { "$regex": new RegExp(req.query.gender, 'i') },
        group: { "$regex": new RegExp(req.query.group, 'i') },
    });
    console.log(totalItems);
    const itemPerPage = 12;
    const page = req.query.page;

    const pageOptions = new function () {
        this.totalPage = Math.ceil(totalItems / itemPerPage);
        this.isPaginate = (this.totalPage > 1);
        this.currentPage = page ? parseInt(page) : 1;
        this.url = req.baseUrl + req.path;
        this.queryParams = req.query;
    };
    console.log(pageOptions);

    //console.log(result);
    const productsOnPage = await product.find({
        brand: { "$regex": new RegExp(req.query.brand, 'i') },
        category: { "$regex": new RegExp(req.query.category, 'i') },
        gender: { "$regex": new RegExp(req.query.gender, 'i') },
        group: { "$regex": new RegExp(req.query.group, 'i') }
    })
        .skip((pageOptions.currentPage - 1) * itemPerPage)
        .limit(itemPerPage);

    const products = productsOnPage.map(item => ({
        hasBage: (item.sale | item.sale > 0) ? true : false,
        imgpath: item.assert.path + item.assert.img[0],
        name: item.name,
        title: item.name.length > 30 ? item.name.substr(0, 29) + "..." : item.name,
        price: item.price,
        id: item._id
    }));

    console.log(products);


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