const Product = require('../models/product');

exports.getAddProduct = (request, response, next) => {
    response.render('admin/add-product', { isLoggedIn: request.session.isLoggedIn });
}

exports.postAddProduct = (request, response, next) => {
    const productData = { ...request.body };
    const product = new Product({
        name: productData.name,
        imageUrl: productData.imageUrl,
        price: productData.price,
        description: productData.description,
        userId: request.user.id
    });

    product.save()
        .then(() => response.redirect('/products/all'))
        .catch(error => console.error(error));
}

exports.getAllProducts = (request, response, next) => {
    Product.find()
        .then(products => {
            const templateData = {
                products: [...products],
                hasProducts: products.length > 0,
                isLoggedIn: request.session.isLoggedIn
            }

            response.render('shop/all-products', templateData);
        })
        .catch(error => console.error(error));
}

exports.getProductDetails = (request, response, next) => {
    const productId = request.params.productId;

    Product.findById(productId)
        .then(product => {
            const templateData = {
                isLoggedIn: request.session.isLoggedIn,
                product: product,
            }

            response.render('shop/product-details', templateData);
        })
        .catch(error => console.error(error));
}

exports.getEditProduct = (request, response, next) => {
    const productId = request.params.productId;

    Product.findById(productId)
        // .then(product => {
        //     if (product.userId.toString() !== request.user._id.toString())
        //         throw new Error('You are NOT authorized to perform this action!');

        //     return product;
        // })
        .then((product) => {
            const templateData = {
                isLoggedIn: request.session.isLoggedIn,
                product,
            }

            response.render('admin/edit-product', templateData)
        })
        .catch((error) => console.error(error));
}

exports.postEditProduct = (request, response, next) => {
    const productData = { ...request.body };

    Product.findByIdAndUpdate(productData.productId, productData)
        .then(product => response.redirect(`/products/details/${product.id}`))
        .catch(error => console.error(error));
}

exports.postDeleteProduct = (request, response, next) => {
    const productId = request.params.productId;

    Product.findByIdAndDelete(productId)
        .then(() => response.redirect('/products/all'))
        .catch(error => console.error(error));
}