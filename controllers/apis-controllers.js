const {selectApiDetails} = require('../models/apis-models');

exports.getApiDetails = (req, res, next) => {
    selectApiDetails().then((apis) => {
        res.status(200).send({apis})
    })
    .catch((err) => {
        next(err)
    })
}