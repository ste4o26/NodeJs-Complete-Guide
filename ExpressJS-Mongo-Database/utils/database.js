const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://ste4o26:mongodb%40P123@cluster0.ohphy.mongodb.net/node-complete-guide?retryWrites=true&w=majority";
let _db;

const mongoConnection = (callback) => {
    MongoClient.connect(uri)
        .then(client => {
            console.log('Connected!');
            _db = client.db();
            callback();
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}

const getDb = () => {
    if(_db) return _db;

    throw new Error('No Database found!');
}

exports.mongoConnection = mongoConnection;
exports.getDb = getDb;