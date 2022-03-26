const Product = require('../models/product');
const Role = require('../models/role');
const User = require('../models/user');
const validator = require('express-validator');
const errorController = require('./error-controller');

const ITEMS_PER_PAGE = 3;

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
        return response
            .status(422)
            .render('admin/add-product', {
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
        .catch(error => next(errorController.getError(error.message, 500)));
}

exports.getAllProducts = (request, response, next) => {
    const page = Number(request.query.page ? request.query.page : 1);
    let totalProductsCount;

    Product
        .countDocuments()
        .then(productsCount => {
            totalProductsCount = productsCount;

            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            const templateData = {
                products: [...products],
                hasProducts: products.length > 0,
                hasNextPage: page * ITEMS_PER_PAGE < totalProductsCount,
                hasPrevPage: page > 1,
                nextPage: page + 1,
                prevPage: page - 1
            };

            response.render('shop/all-products', templateData);
        })
        .catch(error => next(errorController.getError(error.message, 500)));
}

exports.getProductDetails = (request, response, next) => {
    const productId = request.params.productId;

    Product.findById(productId)
        .then(product => response.render('shop/product-details', product))
        .catch(error => next(errorController.getError(error.message, 500)));
}

exports.getEditProduct = (request, response, next) => {
    const productId = request.params.productId;

    Product.findOne({ _id: productId, userId: request.session.user._id })
        .then((product) => response.render('admin/edit-product', {
            product,
            errorMessage: request.flash('authError')
        }))
        .catch(error => next(errorController.getError(error.message, 500)));
}

exports.postEditProduct = (request, response, next) => {
    const productData = { ...request.body };
    const errors = validator.validationResult(request);

    if (!errors.isEmpty()) {
        return response
            .status(422)
            .render('admin/edit-product', {
                errorMessage: errors.array()[0].msg,
                product: { ...request.body }
            });
    }

    Product.findByIdAndUpdate(productData._id, productData)
        .then(product => response.redirect(`/products/details/${product._id}`))
        .catch(error => next(errorController.getError(error.message, 500)));
}

exports.postDeleteProduct = (request, response, next) => {
    const productId = request.params.productId;

    Product
        .deleteOne({ _id: productId, userId: request.session.user._id })
        .then(() => response.redirect('/products/all'))
        .catch(error => next(errorController.getError(error.message, 500)));
}