const KelasController = require('./KelasController')

const KelasService = require('../../services/KelasService')

const kelasService = new KelasService()

exports.kelasController = new KelasController(kelasService)
