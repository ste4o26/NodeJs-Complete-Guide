const Product = require('../models/product');

exports.getAddProduct = (request, response, next) => {
    response.render('admin/add-product', { title: 'Add Product' });
}

exports.postAddProduct = (request, response, next) => {
    let { name, imageUrl, price, description } = { ...request.body };
    const product = new Product(null, name, imageUrl, price, description);
    product.save();

    response.redirect('/');
}

exports.getAllProducts = (request, response, next) => {
    Product.fetchAll((products) => {
        const templateData = {
            products: [...products],
            hasProducts: products.length > 0,
            title: 'Shop'
        }

        response.render('shop/all-products', templateData);
    });
}

exports.getProductDetails = (request, response, next) => {
    const productId = request.params.productId;
    Product.fetchById(productId, (product) => {
        response.render('shop/product-details', product)
    });
}

exports.getEditProduct = (request, response, next) => {
    const productId = request.params.productId;
    Product.fetchById(productId, product => {
        if (!product) response.redirect('/error');
        response.render('admin/edit-product', product)
    });
}

exports.postEditProduct = (request, response, next) => {
    const product = { ...request.body };
    const editedProduct = new Product(product.id, product.name, product.imageUrl, product.price, product.description);

    if (!hasChanges(editedProduct)) response.redirect(`/products/details/${editedProduct.id}`);
    editedProduct.edit();
}

exports.postDeleteProduct = (request, response, next) => {
    const productId = request.params.productId;
    Product.fetchById(productId, product => {
        const productToDelete = new Product(product.id, product.name, product.imageUrl, product.price, product.description);
        productToDelete.delete();
        response.redirect('/products/all');
    });
}

const hasChanges = (editedProduct) => {
    return Product.fetchById(editedProduct.id, product => {
        if (editedProduct.name !== product.name ||
            editedProduct.imageUrl !== product.imageUrl ||
            editedProduct.price !== product.price ||
            editedProduct.description !== product.description) return true;

        return false;
    });
}