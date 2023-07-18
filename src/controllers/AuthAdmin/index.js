const AuthControllersAdmin = require('./AuthControllersAdmin')
const AdminService = require('../../services/AdminService')
const AuthService = require('../../services/AuthService')

const adminService = new AdminService()
const authService = new AuthService()

exports.authControllersAdmin = new AuthControllersAdmin(adminService, authService)
