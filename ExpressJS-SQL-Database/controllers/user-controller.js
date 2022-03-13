const User = require('../models/user');

exports.findUserById = () => User.findByPk(1);

exports.createUserIfNotExists = async (user) => {
    if (!user) {
        return User.create({ username: 'ste4o26', email: 'ste4o26@gmail.com' })
            .then(user => user.createCart());
    }

    return Promise.resolve(user);
};