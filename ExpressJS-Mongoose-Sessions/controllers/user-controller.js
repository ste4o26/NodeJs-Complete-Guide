const User = require('../models/user');

exports.createUserIfNotExists = (request, response, next) => {
    return User
        .findOne()
        .then(user => {
            if (user) return user;

            const newUser = new User({ username: 'ste4o26', password: '123456', email: 'ste4o99@gmail.com', cart: { products: [] } });
            return newUser.save();
        })
        .catch(error => console.error(error));
}

exports.fetchByUsername = (username) => {
    return User
        .findOne({ username: username })
        .then(user => {
            if (!user) throw new Error(`Invalid username or password!`);
            return user;
        })
        .catch(error => console.error(error));
}