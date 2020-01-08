const { ProductComment } = require('./commentModel');
const userService = require('./userService');
const productService = require('./productService');
const { Product } = require('./productModel');

exports.addNewReview = async ({ name, author, body, product }) => {
    // create new comment with [author, name], body, (title, rating)
    const comment = new ProductComment({ body, author, name });
    // save comment
    const commentPromise = comment.save();

    // get product by id
    const productPromise = productService.getProduct(product);

    // add id to product
    const [updatedProduct, newComment] = await Promise.all([productPromise, commentPromise]);
    updatedProduct.review.unshift(newComment._id);

    // save product
    await updatedProduct.save();
}


exports.getReviews = async (productId, page, limit) => {
    const result = await Product.findOne({ _id: productId }).slice('review', [(page - 1) * limit, limit]).populate(
        {
            path: 'review',
            populate: {
                path: 'author',
                select: ['_id', 'avatar', 'name']
            }
        }
    );
    return result;
}
