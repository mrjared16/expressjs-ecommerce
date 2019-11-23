const express = require('express');
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
        imgpath: item.img_path[0],
        name: item.name,
        price: item.price,
        id: item._id
    }));

    console.log(query);
    return query;
}

exports.queryDetail = async (req, res) => {
    const detail = await product.findById(req.params.id);
    const query = {
        active_img: detail.img_path[0],
        img: detail.img_path.slice(1, detail.img_path.length),
        name: detail.name,
        description: detail.description,
        price: detail.price,
        color: null,
        quantity: detail.quantity,
        categories: detail.categories
    }
    console.log(query);
    return query;
}

exports.queryIndexHome = async (req, res) => {
    const result = await product.aggregate().sample(6);
    const query = result.map(item => ({
        hasBage: (item.sale | item.sale > 0) ? true : false,
        imgpath: item.img_path[0],
        name: item.name,
        price: item.price,
        id: item._id
    }));
    console.log(query);
    return query;
}