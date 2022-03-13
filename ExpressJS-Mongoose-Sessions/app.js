const express = require('express');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');
const errorRoutes = require('./routes/error-routes');
const authRoutes = require('./routes/auth-routes');
const userController = require('./controllers/user-controller');

const expressConfiguration = require('./configurations/express-configuration');
const MONGODB_URI = "mongodb+srv://ste4o26:mongodb%40P123@cluster0.ohphy.mongodb.net/node-complete-guide?retryWrites=true&w=majority";

const app = express();
expressConfiguration(app);

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes);

mongoose
    .connect(MONGODB_URI)
    .then(() => userController.createUserIfNotExists)
    .then(() => app.listen(3000))
    .catch(error => console.error(error));