const UserControllers = require('./UserControllers')

const UserService = require('../../services/UserService')

const userService = new UserService()

exports.userControllers = new UserControllers(userService)
