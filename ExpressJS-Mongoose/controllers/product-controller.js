const Product = require('../models/product');
const Role = require('../models/role');
const User = require('../models/user');
const validator = require('express-validator');

exports.getAddProduct = (request, response, next) => {
    response.render('admin/add-product', {
        oldInput: {
            name: '',
            imageUrl: '',
            price: '',
            description: ''
        }
    });
}

exports.postAddProduct = (request, response, next) => {
    const errors = validator.validationResult(request);
    if (!errors.isEmpty()) {
        return response.render('admin/add-product', {
            errorMessage: errors.array()[0].msg,
            oldInput: { ...request.body }
        });
    }

    User
        .findOne({ _id: request.session.user._id, role: Role.ADMIN })
        .then(user => {
            const productData = { ...request.body };
            return new Product({
                name: productData.name,
                imageUrl: productData.imageUrl,
                price: productData.price,
                description: productData.description,
                userId: user._id
            });
        })
        .then(product => product.save())
        .then(() => response.redirect('/products/all'))
        .catch(error => console.error(error));
}

exports.getAllProducts = (request, response, next) => {
    Product.find()
        .then(products => {
            const templateData = {
                products: [...products],
                hasProducts: products.length > 0
            };

            response.render('shop/all-products', templateData);
        })
        .catch(error => console.error(error));
}

exports.getProductDetails = (request, response, next) => {
    const productId = request.params.productId;

    Product.findById(productId)
        .then(product => response.render('shop/product-details', product))
        .catch(error => console.error(error));
}

exports.getEditProduct = (request, response, next) => {
    const productId = request.params.productId;

    Product.findOne({ _id: productId, userId: request.session.user._id })
        .then((product) => response.render('admin/edit-product', {
            product,
            errorMessage: request.flash('authError')
        }))
        .catch((error) => console.error(error));
}

exports.postEditProduct = (request, response, next) => {
    const productData = { ...request.body };
    const errors = validator.validationResult(request);

    if (!errors.isEmpty()) {
        request.flash('authError', errors.array()[0].msg);
        return response.redirect(`/admin/products/edit/${productData.productId}`);
    }

    Product.findByIdAndUpdate(productData.productId, productData)
        .then(product => response.redirect(`/products/details/${product.id}`))
        .catch(error => console.error(error));
}

exports.postDeleteProduct = (request, response, next) => {
    const productId = request.params.productId;

    Product
        .deleteOne({ _id: productId, userId: request.session.user._id })
        .then(() => response.redirect('/products/all'))
        .catch(error => console.error(error));
}