const AdminControllers = require('./AdminControllers')

const AdminService = require('../../services/AdminService')

const adminService = new AdminService()

exports.adminController = new AdminControllers(adminService)
