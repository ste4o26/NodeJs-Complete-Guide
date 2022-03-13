const fs = require('fs');
const path = require('path');

const Cart = require('./cart');
const rootDir = require('../utils/localPath');
const productsDatabasePath = path.join(rootDir, 'data', 'products.json');

class Product {
    constructor(id, name, imageUrl, price, description) {
        this.setId = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    set setId(id) {
        if (!id) return this.id = Math.random().toString();
        this.id = id;
    }

    save() {
        saveToProductsFile(this);
    }

    edit() {
        updateFromProductFile(this);
    }

    delete() {
        Cart.fetchProductById(this.id, product => Cart.deleteProductById(product.id, true));
        deleteFromProductsFile(this);
    }

    static fetchAll(callback) {
        fetchAllFromProductsFile(callback);
    }

    static fetchById(id, callback) {
        return fetchByIdFromProductsFile(id, callback);
    }
}

const deleteFromProductsFile = productToDelete => {
    fetchAllFromProductsFile(products => {
        const productIndex = products.findIndex(product => product.id === productToDelete.id);
        products.splice(productIndex, 1);

        fs.writeFile(productsDatabasePath, JSON.stringify(products), error => console.error(error));
    });
}

const updateFromProductFile = productToUpdate => {
    fetchAllFromProductsFile(products => {
        const productIndex = products.findIndex(product => product.id === productToUpdate.id);
        products[productIndex] = productToUpdate;

        fs.writeFile(productsDatabasePath, JSON.stringify(products), error => console.error(error));
    });
}

const saveToProductsFile = product => {
    fetchAllFromProductsFile(products => {
        products.push(product);
        fs.writeFile(productsDatabasePath, JSON.stringify(products), error => console.error(error));
    });
}

const fetchAllFromProductsFile = callback => {
    fs.readFile(productsDatabasePath, (error, data) => {
        if (error) return callback([]);
        callback(JSON.parse(data));
    });
}

const fetchByIdFromProductsFile = (id, callback) => {
    fetchAllFromProductsFile(products => {
        const foundProduct = products.find(product => product.id === id)
        if (!foundProduct) throw new Error(`Product with ${id} id has not been found!`);
        callback(foundProduct);
    });
}

module.exports = Product;