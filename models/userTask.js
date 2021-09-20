const config = require('../config'),
    sequelize = config.sequelize,
    Sequelize = config.Sequelize;

const UserTask = sequelize.define("usertask", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    }
})

module.exports.UserTask = UserTask
