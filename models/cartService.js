// const User = require('./user');
const Product = require('./product')

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

exports.itemsInCart = async (myCart) => {
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
