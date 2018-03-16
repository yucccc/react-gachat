const error = (err) => {
    return {'code': 1, msg: err}
}

const success = (data = {}, msg = '') => {
    return {'code': 0, msg, data}
}
module.exports = {
    error,
    success
}