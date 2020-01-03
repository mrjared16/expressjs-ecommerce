const { Order } = require('./orderModel');
const { Cart } = require('./cartModel');

exports.placeOrder = async (req) => {
    console.log(req.baseUrl + req.path);
    const cart = await Cart.findOne({ user: req.user._id });
    let totalPrice = cart.items.reduce((total, item) => {
        return total + item.unit_price * item.quantity
    }, 0);
    const newOrder = new Order({
        user: cart.user,
        items: cart.items,
        totalPrice
    });
    await newOrder.save();

    cart.items = [];
    await cart.save();

    req.session.cart = [];
    req.app.locals.itemsInMyCart = [];
    req.app.locals.totalPrice = 0;
}

exports.getAllOrder = async ({ _id }) => {
    return await Order.find({ user: _id });
}