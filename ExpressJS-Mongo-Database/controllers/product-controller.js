const Product = require('../models/product');

exports.getAddProduct = (request, response, next) => {
    response.render('admin/add-product');
}

exports.postAddProduct = (request, response, next) => {
    console.log(request.user._id);  
    const productData = { ...request.body };
    const product = new Product(productData.name, productData.imageUrl, productData.price, productData.description, null, request.user._id);

    product.save()
        .then(() => response.redirect('/'))
        .catch(error => console.error(error));
}

exports.getAllProducts = (request, response, next) => {
    Product.fetchAll()
        .then(allProducts => {
            const templateData = {
                products: [...allProducts],
                hasProducts: allProducts.length > 0
            }

            response.render('shop/all-products', templateData);
        })
        .catch(error => console.error(error));
}

exports.getProductDetails = (request, response, next) => {
    const productId = request.params.productId;

    Product.fetchById(productId)
        .then(product => response.render('shop/product-details', product))
        .catch(error => console.error(error));
}

exports.getEditProduct = (request, response, next) => {
    const productId = request.params.productId;

    Product.fetchById(productId)
        .then(product => {
            if (product.userId.toString() !== request.user._id.toString())
                throw new Error('You are NOT authorized to perform this action!');

            return product;
        })
        .then((product) => response.render('admin/edit-product', product))
        .catch((error) => console.error(error));
}

exports.postEditProduct = (request, response, next) => {
    const productData = { ...request.body };
    const product = new Product(productData.name, productData.imageUrl, productData.price, productData.description, productData.productId);

    product.update()
        .then(() => response.redirect(`/products/details/${product.id}`))
        .catch(error => console.error(error));
}

exports.postDeleteProduct = (request, response, next) => {
    const productId = request.params.productId;

    Product.fetchById(productId)
        .then(product => {
            if (product.userId.toString() !== request.user._id.toString())
                throw new Error('You are NOT authorized to perform this action!');

            return product;
        })
        .catch(error => console.error(error));


    Product.deleteById(productId)
        .then(() => response.redirect('/products/all'))
        .catch(error => console.error(error));
}