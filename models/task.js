const config = require('../config'),
    sequelize = config.sequelize,
    Sequelize = config.Sequelize;

const Task = sequelize.define("task", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

module.exports.Task = Task
