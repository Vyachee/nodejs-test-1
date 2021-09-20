const express = require('express');
const app = express()
const config = require('./config.js');
const sequelize = config.sequelize;
const UserTask = require('./models/userTask').UserTask;
const Task = require('./models/task').Task;
const User = require('./models/user').User;
const userController = require('./controllers/userController');
const tasksController = require('./controllers/tasksController');
const tokenMiddleware = require('./middleware/tokenHandler');

const host = '127.0.0.1'
const port = 1337

UserTask.belongsTo(Task)
UserTask.belongsTo(User)

// sync models with db
sequelize.sync().then(result => {
    console.log(result)
}).catch(error => {
    console.log(error)
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/register', userController.register)
app.post('/login', userController.login)

// проверяет токен
app.use(tokenMiddleware.checkToken)

app.get('/getMyTasks', tasksController.getMyTasks)
app.post('/createTask', tasksController.createTask)

app.listen(port, host, () => {
    console.log(`http://${host}:${port}`)
})
