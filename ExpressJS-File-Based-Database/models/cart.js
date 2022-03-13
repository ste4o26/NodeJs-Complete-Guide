const path = require('path');
const fs = require('fs');

const rootDir = require('../utils/localPath');

const cartDatabasePath = path.join(rootDir, 'data', 'cart.json');

class Cart {
    static addProduct(product, callback) {
        saveToCartFile(product, callback);
    }

    static deleteProductById(id, deleteAll) {
        deleteProductFromCartFile(id, deleteAll);
    }

    static fetchProductById(id, callback) {
        fetchProductByIdFromCartFile(id, callback);
    }

    static fetchCart(callback) {
        fetchCartFromCartFile(callback);
    }
}

const fetchProductByIdFromCartFile = (id, callback) => {
    fetchCartFromCartFile(cart => {
        const foundProduct = cart.products.find(product => product.id === id);
        if (!foundProduct) return null;
        callback(foundProduct);
    });
}

const deleteProductFromCartFile = (id, deleteAll) => {
    fetchCartFromCartFile(cart => {
        const productIndex = cart.products.findIndex(product => product.id === id);
        let totalProductPrice = cart.products[productIndex].price;
        if (cart.products[productIndex].quantity - 1 <= 0) deleteAll = true;

        if (deleteAll) {
            totalProductPrice = cart.products[productIndex].price * cart.products[productIndex].quantity;
            cart.products.splice(productIndex, 1);
        } else
            cart.products[productIndex].quantity--;

        cart.totalPrice -= totalProductPrice;
        fs.writeFile(cartDatabasePath, JSON.stringify(cart), error => console.error(error));
    });
}

const fetchCartFromCartFile = callback => {
    fs.readFile(cartDatabasePath, (error, data) => {
        if (error) return callback({});
        callback(JSON.parse(data));
    });
}

// понеже количката е една за всеки потребител през целия период на ползване на проложението 
// немога да създавам нова инстанция от класа Cart всеки път когато искам да добавя нов продукт към нея,
// защото по този начин винаги ще имам само по един продъкт който ще бъде последния добавен.
// За това използвам статичен метод в който всеки път всемам стария обект който е във cart.json файла
// търся дали продукта който се опитвам да добавя го има и ако да просто го ъпдейтвам и го заменям в масива
// с продукти от обекта който получавам от файла, а ако не съществува просто го добавям отново в масива с продукти от обекта.
// cart променливата я инициализирам в още в началото понеже ако те първа се създава файла (aka няма такъв файл)
// няма да взема никакви данни от него и за това ще работя предварително иницализирания cart обект с началните стойности. 
// quantity e ново поле което добавям към обекта от тип Product (добавям го само в рамките на тази функционалност с количката)
// за да мога да си следя ако добавям вече съществуващ продукт да не го добавям а само да му увеличавам колкичеството
const saveToCartFile = (product, callback) => {
    fs.readFile(cartDatabasePath, (error, data) => {
        let cart = {
            products: [],
            totalPrice: 0
        }

        if (!error) cart = JSON.parse(data);

        let updatedProduct;
        const existingProductIndex = cart.products.findIndex(currentProduct => currentProduct.id === product.id);
        const existingProduct = cart.products[existingProductIndex];

        if (existingProduct) {
            updatedProduct = { ...existingProduct };
            updatedProduct.quantity++;
            cart.products[existingProductIndex] = updatedProduct;
        } else {
            updatedProduct = { ...product, quantity: 1 };
            cart.products = [...cart.products, updatedProduct];
        }

        cart.totalPrice += +product.price;
        fs.writeFile(cartDatabasePath, JSON.stringify(cart), error => console.log(error));
        callback();
    });
}

module.exports = Cart;