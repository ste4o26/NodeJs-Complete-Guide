// Here i make use of an ORM package called sequelize to manage all the heavy lifting like creating tables based on js objects structures
// it also write all the queriesd for me behind the sciene and exports to me only the functions i could use. So basically no more hard coded
// queries in the models are needed!
const Sequelize = require('sequelize').Sequelize;// the .Sequalized at the end is added only for the autocomplition 

const sequelize = new Sequelize('node-complete-guide', 'root', 'mysql@P123', {
    dialect: 'mysql',
    host: 'localhost'
    // Both of these options are optional by default the host is localhost but dialect my differ depends on the mysql engine we are using
});

module.exports = sequelize;

// This is raw use of mysql package without any ORMs
// const mysql = require('mysql2');

// const poolOptions = {
//     host: 'localhost',
//     database: 'node-complete-guide',
//     user: 'root',
//     password: 'mysql@P123'
// }

// const connectionsPool = mysql.createPool(poolOptions);

// module.exports = connectionsPool.promise();
