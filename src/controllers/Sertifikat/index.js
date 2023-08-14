const SertifikatController = require('./SertifikatController')
const SertifikatService = require('../../services/SertifikatService')
const KelasUsersService = require('../../services/KelasUsersService')

const kelasUsersService = new KelasUsersService()
const sertifikatService = new SertifikatService()

exports.sertifikatController = new SertifikatController(sertifikatService, kelasUsersService)
