const User = require('./user');
const Product = require('./product')
const userService = require('../models/userService');

exports.addItemInCart = async (myCart, itemId) => {
  var itemInfo = {id: itemId, quantity: "1"}
  await myCart.forEach(async (item, index) => {
    if (item.id == itemId) {
      item.quantity = await new Promise((resolve, reject) => {
        const numberOfItem = parseInt(item.quantity) + 1;
        resolve(numberOfItem + "")
      });
      itemInfo.quantity = item.quantity;
    }
  })
  if (itemInfo.quantity == 1) {
    await myCart.push(itemInfo);
  }
}

exports.getItemsInCart = async (myCart) => {
  var itemsInfo = [];
  await Promise.all(myCart.map(async (item) => {
    let temp  = await Product.findOne({_id: item.id});
    let formatData = {
        id: temp.id,
        name: temp.name,
        price: temp.price,
        img: temp.assert.path + temp.assert.img[0],
        quantity: item.quantity
    };
    itemsInfo.push(formatData);
  }));
  return itemsInfo;
}

exports.deleteItemInCart = async (myCart, itemId) => {
  await Promise.all(myCart.map((item, index) => {
    if (item.id == itemId) {
      myCart.splice(index, 1);
    }
  }))
  // return myCart.filter((item) => {
  //   return item.id != itemId;
  // })
}

exports.totalPriceInCart = async (myCart) => {
  let total = 0;
  await Promise.all(myCart.map(async (item) => {
    let temp  = await Product.findOne({_id: item.id});
    let formatData = {
        id: temp.id,
        name: temp.name,
        price: temp.price,
        img: temp.assert.path + temp.assert.img[0],
        quantity: item.quantity
    };
    total = total + parseInt(temp.price) * parseInt(item.quantity);
  }));
  if (total == 0) {
    return null;
  }
  return total;
}

async function getItemInfoFromProductModel(myCart) {
  let items = [];
  let total = 0;
  await Promise.all(myCart.map(async (item) => {
    let temp  = await Product.findOne({_id: item.id});
    let itemInfo = {
      item_id: temp.id,
      quantity: item.quantity,
      price: temp.price
    };
    total = total + parseInt(temp.price) * parseInt(item.quantity);
    items.push(itemInfo);
  }));
  return {items: items, totalPrice: total};
}

async function setOrderFieldUser(userOrder, myCart) {
  let itemsAndTotalPrice = await getItemInfoFromProductModel(myCart);
  let order = {
    status: "Chưa giao",
    data: new Date(),
    items: itemsAndTotalPrice.items,
    total_price: itemsAndTotalPrice.totalPrice
  };
  userOrder.order.push(order);
  await userOrder.save();
}

exports.setItemsInOrderUser = async (myCart, userId) => {
  const userOrder = await User.findOne({_id: userId});
  await setOrderFieldUser(userOrder, myCart);
}

exports.getUserInfoToPayment = async (userId) => {
  return await userService.getUserInfo(userId);
}
