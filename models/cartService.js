const { User } = require('./userModel');
const { Product } = require('./productModel');
const { Cart } = require('./cartModel');
const userService = require('../models/userService');
const mongoose = require('mongoose');


exports.updateCart = async (req, res) => {
  // sync session to database
  if (userService.isAuthenticated(req, res)) {
    req.session.cart = await exports.syncLocalCartToDatabase(req.session.cart, req.user);
  }

  // get cart item view model
  let { totalPrice, items } = await exports.getItemsDetailInCart(req.session.cart);
  // console.log(totalPrice, items);
  req.app.locals.itemsInMyCart = items;
  req.app.locals.totalPrice = totalPrice;
  return items;
}

exports.addItemToCart = (myCart, itemId) => {
  let found = false;
  myCart.forEach((item, index) => {
    if (item.product == itemId) {
      myCart[index].quantity++;
      found = true;
    }
  });

  if (!found) {
    const newItem = {
      product: itemId,
      quantity: 1
    }
    myCart.push(newItem)
  }

  return myCart;
}

exports.deleteItemInLocalCart = (myCart, itemId) => {
  myCart.forEach((item, index) => {
    if (item.product == itemId) {
      myCart.splice(index, 1);
    }
  });
  return myCart;
}

exports.getCartItemViewModel = (product, { quantity }) => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    img: product.assert.img[0],
    quantity
  }
}

exports.getItemsDetailInCart = async (myCart) => {
  let totalPrice = 0;
  if (myCart == null) {
    myCart = [];
  }
  const items = await Promise.all(
    myCart.map((item) => new Promise(
      async (resolve, reject) => {
        const product = await Product.findOne({ _id: item.product });
        totalPrice += product.price * item.quantity;
        resolve(exports.getCartItemViewModel(product, item));
      }
    ))
  );
  return { items, totalPrice };
}

// exports.getItemsInCart = async (myCart) => {
//   let totalPrice = 0;
//   if (myCart == null) {
//     myCart = [];
//   }
//   const items = await Promise.all(
//     myCart.map((item) => new Promise(
//       async (resolve, reject) => {
//         const unit_price = (await Product.findOne({ _id: item.product })).price;
//         totalPrice = totalPrice + unit_price * item.quantity;
//         resolve({
//           product: item.product,
//           quantity: item.quantity,
//         });
//       }
//     ))
//   );
//   return { items, totalPrice };
// }

exports.syncLocalCartToDatabase = async (myCart, { _id }) => {
  // find cart in database
  const cart = await Cart.findOne({ user: _id });

  // local cart null
  if (myCart == null)
    myCart = [];

  // database cart null
  if (!cart) {
    cart = await new Cart({
      user: _id,
    });
  }

  cart.items = myCart;
  await cart.save();
  return myCart;
}

exports.insertLocalToDatabase = async (req) => {
  // found => save new items
  let cart = await Cart.findOne({ user: req.user._id });

  // local cart null
  if (req.session.cart == null) {
    req.session.cart = [];
  }

  // database cart null
  if (!cart) {
    cart = await new Cart({
      user: req.user._id,
      items: []
    });
  }

  // merge
  req.session.cart.forEach(local => {
    let found = false;
    let i;
    for (i = 0; i < cart.items.length; i++) {
      if (cart.items[i].product.toString() == local.product) {
        cart.items[i].quantity += local.quantity;
        found = true;
        break;
      }
    }
    if (!found) {
      // console.log('add from local cart: ', local);
      cart.items.push(local);
    } else {
      // console.log('update quantity: ', cart.items[i]);
    }
  })

  // save
  cart = await cart.save();

  // new local cart
  req.session.cart = cart.items;

  // update view
  let { totalPrice, items } = await exports.getItemsDetailInCart(req.session.cart);
  // console.log(totalPrice, items);
  req.app.locals.itemsInMyCart = items;
  req.app.locals.totalPrice = totalPrice;
}

// async function setOrderFieldUser(userOrder, myCart) {
//   let itemsAndTotalPrice = await getItemInfoFromProductModel(myCart);
//   let order = {
//     status: "Chưa giao",
//     data: new Date(),
//     items: itemsAndTotalPrice.items,
//     total_price: itemsAndTotalPrice.totalPrice
//   };
//   //userOrder.order.push(order);
//   await userOrder.save();
// }



exports.getUserInfoToPayment = async (userId) => {
  return await userService.getUserInfo(userId);
}
