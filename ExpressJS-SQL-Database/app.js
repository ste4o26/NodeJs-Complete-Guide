const express = require('express');

const expressConfiguration = require('./configurations/express-configuration');
const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');
const errorRoutes = require('./routes/error-routes');
const req = require('express/lib/request');
const sequelize = require('./utils/database');
const userController = require('./controllers/user-controller');

const app = express();
expressConfiguration(app);

app.use((request, response, next) => {
    userController.findUserById(1)
        .then(user => {
            request.user = user;
            next();
        }); 
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

// sequelize.sync({ force: true })
sequelize.sync()
    .then(() => userController.findUserById())
    .then((user) => userController.createUserIfNotExists(user))
    .then(() => app.listen(3000))
    .catch(error => console.error(error));
