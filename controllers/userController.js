const {User} = require("../models/user");
const randomString = require("randomstring");

exports.register = (req, res) => {
    const login = req.body['login']
    const password = req.body['password']

    User.findAll({where: {login: login}, raw: true}).then(result => {
        if (result.length !== 0) {
            res.status(422)
            return res.send(JSON.stringify({
                response: 'Пользователь с таким логином уже существует'
            }))
        } else {
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
}

exports.login = (req, res) => {
    const login = req.body['login']
    const password = req.body['password']

    User.findOne({where: {login: login, password: password}, raw: true}).then(result => {
        if(result === null || result.length === 0) {
            res.status(422)
            return res.send(JSON.stringify({
                response: 'Пользователя с таким логином не существует'
            }))
        }   else {
            const newToken = randomString.generate()
            User.update(
                {token: newToken},
                {where: {login: login, password: password}},
            ).then(result => {
                console.log(result)
                res.status(200)
                return res.send(JSON.stringify({
                    token: newToken
                }))
            })
        }
    })
}
