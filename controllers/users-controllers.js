const {selectAllUsers, selectUser} = require('../models/users-models');

exports.getUsers = (req, res, next) => {

    selectAllUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getUser = (req, res, next) => {
const {username} = req.params
    selectUser(username).then((user) => {
        res.status(200).send({user})
    })
    .catch((err) => {
        next(err)
    })
}