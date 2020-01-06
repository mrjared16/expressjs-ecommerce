const { ProductComment } = require('./commentModel');
const userService = require('./userService');
const productService = require('./productService');

exports.addNewReview = async ({ name, author, body, product }) => {
    // create new comment with [author, name], body, (title, rating)
    const comment = new ProductComment({ body, author, name });
    // save comment
    const commentPromise = comment.save();

    // get product by id
    const productPromise = productService.getProduct(product);

    // add id to product
    const [updatedProduct, newComment] = await Promise.all([productPromise, commentPromise]);
    updatedProduct.review.push(newComment._id);

    // save product
    await updatedProduct.save();
}