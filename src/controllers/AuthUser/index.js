const AuthControllersUser = require('./AuthControllersUser')
const UserService = require('../../services/UserService')
const AuthService = require('../../services/AuthService')

const userService = new UserService()
const authService = new AuthService()

exports.authControllersUser = new AuthControllersUser(userService, authService)
