const {User} = require("../models/user");


exports.checkToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    User.findOne({where: {token: token}, raw: true}).then(result => {

        if (result === null || result.length === 0) {
            res.status(401)
            return res.send(JSON.stringify({
                response: 'Неверный токен'
            }))
        } else {
            req.user = result
            next()
        }
    })
}
