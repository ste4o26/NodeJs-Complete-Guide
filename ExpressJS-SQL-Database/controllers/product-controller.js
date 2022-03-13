const Product = require('../models/product');

exports.getAddProduct = (request, response, next) => {
    response.render('admin/add-product', { title: 'Add Product' });
}

exports.postAddProduct = (request, response, next) => {
    const product = { ...request.body };

    request.user.createProduct(product)
        .then(() => response.redirect('/products/all'))
        .catch(error => console.error(error));
}

exports.getAllProducts = (request, response, next) => {
    Product.findAll()
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

    Product.findByPk(productId)
        .then(product => response.render('shop/product-details', product.get()))
        .catch(error => console.error(error));
}

exports.getEditProduct = (request, response, next) => {
    const productId = request.params.productId;

    request.user.getProducts({ where: { id: productId } })
        .then(products => response.render('admin/edit-product', products[0].get()))
        .catch(error => console.error(error));
}

exports.postEditProduct = (request, response, next) => {
    const editedProduct = { ...request.body };

    Product.findByPk(editedProduct.id)
        .then(product => product.set({ ...editedProduct }))
        .then(product => product.save())
        .then(product => response.redirect(`/products/details/${product.get('id')}`))
        .catch(error => console.error(error));
}

exports.postDeleteProduct = (request, response, next) => {
    const productId = request.params.productId;

    Product.findByPk(productId, { where: { userId: request.user.id } })
        .then(product => product.destroy())
        .then(() => response.redirect('/products/all'))
        .catch(error => console.error(error));
}