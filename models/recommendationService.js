const { Recommendation } = require('./recommendationModel');


exports.logOrder = async (order) => {
    const promises = [];
    // console.log(order);
    for (let item of order.items) {
        for (let relate of order.items) {
            if (item._id === relate._id)
                continue;
            await exports.logProduct(item.product, relate.product);
        }
    }
}

exports.getRelatedProducts = async (product, quantity) => {
    const record = await Recommendation.findOne({ productId: product }).slice('relatedProduct', quantity).populate('relatedProduct.productId');
    return record ? record.relatedProduct.map(record => record.productId) : null;
}

// increase counter of related product in product
exports.logProduct = async (productId, relatedProductId) => {
    let log = await exports.getLogRecord(productId);
    if (log == null) {
        log = new Recommendation({
            productId: productId,
            relatedProductId: []
        })
    }

    if (log.productId.equals(relatedProductId))
        return;

    const index = log.relatedProduct.findIndex(counterObject => counterObject.productId.equals(relatedProductId));

    if (index != -1) {
        log.relatedProduct[index].boughtTogetherCount++;
    }
    else {
        log.relatedProduct.push({
            productId: relatedProductId
        })
    }
    // sort decen
    log.relatedProduct.sort((a, b) => b.boughtTogetherCount - a.boughtTogetherCount);
    console.log(log.relatedProduct);
    await log.save();
    return
}

exports.getLogRecord = async (product) => {
    return await Recommendation.findOne({ productId: product });
}