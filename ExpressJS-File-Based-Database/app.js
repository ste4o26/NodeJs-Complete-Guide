const express = require('express');

const expressConfiguration = require('./configurations/expressConfiguration');
const adminRoutes = require('./routes/adminRoutes');
const shopRoutes = require('./routes/shopRoutes');
const errorRoutes = require('./routes/errorRoutes');

const app = express();
expressConfiguration(app);

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

app.listen(3000);
