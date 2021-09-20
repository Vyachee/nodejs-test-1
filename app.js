const express = require('express'),
    randomString = require('randomstring'),
    config = require('./config.js'),
    sequelize = config.sequelize,
    UserTask = require('./models/userTask').UserTask,
    Task = require('./models/task').Task,
    User = require('./models/user').User,
    app = express()

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

app.post('/register', function (req, res) {
    const login = req.body['login']
    const password = req.body['password']

    User.findAll({where: {login: login}, raw: true}).then(result => {
        if(result.length !== 0) {
            res.status(422)
            return res.send(JSON.stringify({
                response: 'Пользователь с таким логином уже существует'
            }))
        }   else {
            User.create({
                login: login,
                password: password,
                token: randomString.generate()
            }).then(result => {
                return res.send(JSON.stringify({
                    token: result.token
                }))
            })
        }
    })
})

app.post('/login', function(req, res) {
    const login = req.body['login']
    const password = req.body['password']

    User.findOne({where: {login: login}, raw: true}).then(result => {
        if(result.length === 0) {
            res.status(422)
            return res.send(JSON.stringify({
                response: 'Пользователя с таким логином не существует'
            }))
        }   else {
            const newToken = randomString.generate()
            User.update(
                {token: newToken},
                {where: {login: login, password: password}}
            ).then(result => {
                console.log(result)
                res.status(200)
                return res.send(JSON.stringify({
                    token: newToken
                }))
            })
        }
    })
})

// проверяет токен
app.use((req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    User.findOne({where: {token: token}, raw: true }).then(result => {

        if(result === null || result.length === 0) {
            res.status(401)
            return res.send(JSON.stringify({
                response: 'Неверный токен'
            }))
        }   else {
            req.user = result
            next()
        }
    })
})

app.get('/getMyTasks', (req, res) => {
    UserTask.findAll({
        where: {userId: req.user.id},
        include: [
            'task',
            'user'
        ],
        raw: true
    }).then(result => {

        return res.send(JSON.stringify(result))
    })
})

app.post('/createTask', (req, res) => {

    console.log(req.body['title'])
    console.log(req.body['description'])

    const title = req.body['title']
    const description = req.body['description']

    if(!title || !description) {
        res.status(422)
        return res.send(JSON.stringify({
            response: 'Поля title и description обязательны!'
        }))
    }

    Task.create({
        title: title,
        description: description
    }).then(result => {
        UserTask.create({
            taskId: result.id,
            userId: req.user.id
        }).then(taskResult => {
            res.status(201)
            return res.send(JSON.stringify({
                response: 'Задача успешно создана!'
            }))
        }).catch(error => {
            res.status(422)
            return res.send(JSON.stringify({
                response: 'Error'
            }))
        })
    }).catch(error => {
        res.status(422)
        return res.send(JSON.stringify({
            response: 'Error'
        }))
    })
})

app.listen(port, host, () => {
    console.log(`http://${host}:${port}`)
})
