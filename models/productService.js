const product = require('./product');

exports.queryIndex = async (req, res) => {
    // console.log(req.query);
    const query_object = {};
    const addField = (field) => {
        if (req.query[field])
        {
            query_object[field] = { "$regex": new RegExp('^' + req.query[field] + '$', 'i') };
        }
    }
    //TODO: category,  gender, group, color, size, order
    ['brand', 'category', 'gender', 'group'].forEach(field => addField(field));
    // console.log(query_object);

    const totalItems = await product.countDocuments(query_object);
    // console.log(`Total item: ${totalItems}`);
    const itemPerPage = 12;
    const page = req.query.page;

    const pageOptions = new function () {
        this.totalPage = Math.ceil(totalItems / itemPerPage);
        this.isPaginate = (this.totalPage > 1);
        this.currentPage = page ? parseInt(page) : 1;
        this.url = req.baseUrl + req.path;
        this.queryParams = req.query;
    };
    // console.log(pageOptions);

    //console.log(result);
    const productsOnPage = await product.find(query_object)
        .skip((pageOptions.currentPage - 1) * itemPerPage)
        .limit(itemPerPage);

    const products = productsOnPage.map(item => ({
        hasBage: (item.sale | item.sale > 0) ? true : false,
        imgpath: item.assert.path + item.assert.img[0],
        name: item.name,
        title: item.name.length > 20 ? item.name.substr(0, 19) + '...' : item.name,
        price: item.price,
        id: item._id
    }));

    // console.log(products);


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
        title: item.name.length > 20 ? item.name.substr(0, 19) + '...' : item.name,
        id: item._id
    }));
    console.log(query);
    return query;
}