const SudoController = require('./SudoControllers')

const SudoService = require('../../services/SudoService')

const sudoService = new SudoService()

exports.sudoController = new SudoController(sudoService)
