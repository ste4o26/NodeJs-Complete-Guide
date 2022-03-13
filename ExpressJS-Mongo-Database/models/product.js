const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class Product {
    constructor(name, imageUrl, price, description, id, userId) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this.id = id;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this);
    }


    update() {
        const db = getDb();
        return db.collection('products')
            .updateOne({ _id: new mongodb.ObjectId(this.id) }, { $set: this });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray();
    }

    static fetchById(id) {
        const db = getDb();
        return db.collection('products').find({ _id: new mongodb.ObjectId(id) }).next();
    }

    static deleteById(id) {
        const db = getDb();
        return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(id) });
    }
}

module.exports = Product;
