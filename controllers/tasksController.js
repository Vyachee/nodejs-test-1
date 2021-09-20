const {UserTask} = require("../models/userTask");
const {Task} = require("../models/task");


exports.createTask = (req, res) => {
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
}


exports.getMyTasks = (req, res) => {
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
}
