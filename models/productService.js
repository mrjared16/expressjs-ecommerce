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
    console.log(result);
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

exports.queryDetail = async (req, res) => {
    const detail = await product.findByIdAndUpdate(req.params.id, {$inc : {'view' : 1}});
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