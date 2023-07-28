const AbsenController = require('./AbsenController')
const AbsenService = require('../../services/AbsenService')
const KelasUsersService = require('../../services/KelasUsersService')

const absenService = new AbsenService()
const kelasUserService = new KelasUsersService()

exports.absenController = new AbsenController(absenService, kelasUserService)
