const { Product, Gender, Brand, Category, Group } = require('./productModel');

exports.productCount = async (query) => {
    return await Product.countDocuments(query);
}

exports.getProducts = async (query, { page, sort }) => {
    //query
    return (page && sort)
        ?
        await Product.find(query)
            .skip((page.currentPage - 1) * page.itemPerPage)
            .limit(page.itemPerPage)
            .sort(sort)
        :
        await Product.find(query);
}

exports.getProductDetail = async (id) => {
    return await Product.findByIdAndUpdate(id, { $inc: { 'view': 1 } });
}

exports.getHotProducts = async (req, res) => {
    return await Product.aggregate().sample(6);
}

exports.getQueryObject = async (query) => {
    const result = {};
    const models = {
        gender: Gender,
        brand: Brand,
        category: Category,
        group: Group
    }

    //get all ids
    await Promise.all([
        ...Object.keys(query).map(key =>
            new Promise(async (resolve, reject) => {
                // property not in {gender, brand, ...} => not insert to result
                if (!models[key]) {
                    resolve();
                    return;
                }
                // property in array => query all values
                if (Array.isArray(query[key])) {
                    // query
                    const temp = (await Promise.all([
                        ...query[key].map((value) => new Promise(
                            async (resolve, reject) => {
                                resolve(await models[key].findOne({ key: value }));
                            })
                        )
                    ])).reduce((found, res) => {
                        // map res to id, trunc null element
                        if (res && res._id)
                            found.push(res._id);
                        return found;
                    }, []);
                    result[key] = { "$in": temp };
                }
                else {
                    let temp = await models[key].findOne({ key: query[key] });
                    result[key] = (temp && temp._id) ? temp._id : null;
                }
                resolve();
            })
        )]);
    return result;
}

exports.getSortQueryObject = (option) => {
    const sort = {};
    if (!option)
        return sort;
    const code = parseInt(option);

    switch (code) {
        // price increasing
        case 0:
            sort['price'] = 1;
            break;
        // price descending
        case 1:
            sort['price'] = -1;
            break;
        case 2:
            sort['view'] = -1;
            break;
        case 3:
            sort['sold'] = -1;
            break;
        case 4:
            sort['createdAt'] = -1;
            break;
        case 5:
            sort['rating'] = -1;
            break;
    }
    return sort;
}

exports.getFilterOptionsData = async () => {
    const models = {
        gender: Gender,
        brand: Brand,
        category: Category,
        group: Group
    }
    const result = {};
    await Promise.all([
        ...Object.keys(models).map(key =>
            new Promise(async (resolve, reject) => {
                result[key] = await models[key].find();
                resolve();
            })
        )]);
    return result;
}