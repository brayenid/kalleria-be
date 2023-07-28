const KelasUsersController = require('./KelasUsersController')
const KelasUsersService = require('../../services/KelasUsersService')

const kelasUsersService = new KelasUsersService()

exports.kelasUsersController = new KelasUsersController(kelasUsersService)
