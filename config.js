const Sequelize = require('sequelize'),
    sequelize = new Sequelize('api_todo', 'dev', 'P@ssw0rd', {
        dialect: 'mysql',
        host: 'localhost'
    })

module.exports.sequelize = sequelize
module.exports.Sequelize = Sequelize
