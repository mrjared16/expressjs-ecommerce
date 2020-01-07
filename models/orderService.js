const { Order } = require('./orderModel');
const cartService = require('./cartService');
const recommendationService = require('./recommendationService');

exports.placeOrder = async (req) => {
    const cart = await cartService.getUserCart(req.user._id);

    let totalPrice = cart.items.reduce((total, item) => {
        return total + item.unit_price * item.quantity
    }, 0);

    const newOrder = new Order({
        user: cart.user,
        items: cart.items,
        totalPrice
    });
    
    recommendationService.logOrder(newOrder);

    cart.items = [];
    await Promise.all([newOrder.save(), cart.save()]);

    req.session.cart = [];
    // req.app.locals.itemsInMyCart = [];
    // req.app.locals.totalPrice = 0;
}

exports.getAllOrder = async ({ _id }) => {
    return await Order.find({ user: _id });
}
