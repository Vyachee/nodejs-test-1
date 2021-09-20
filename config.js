const Sequelize = require('sequelize'),
    sequelize = new Sequelize('api_todo', 'root', 'root', {
        dialect: 'mysql',
        host: '127.0.0.1'
    })

module.exports.sequelize = sequelize
module.exports.Sequelize = Sequelize
