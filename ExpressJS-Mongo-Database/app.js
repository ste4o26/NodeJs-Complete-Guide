const express = require('express');

const expressConfiguration = require('./configurations/express-configuration');
const mongoConnection = require('./utils/database').mongoConnection;

const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');
const errorRoutes = require('./routes/error-routes');
const User = require('./models/user');

const app = express();
expressConfiguration(app);

app.use((request, response, next) => {
    User.fetchById('62268373783dbbd9fcb357d8')
        .then(user => {
            request.user = new User(user.username, user.email, user.cart, user._id)
            next();
        })
        .catch(error => console.error(error));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

mongoConnection(() => app.listen(3000));