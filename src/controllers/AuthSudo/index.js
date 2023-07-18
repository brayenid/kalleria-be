const AuthControllersSudo = require('./AuthControllersSudo')
const SudoService = require('../../services/SudoService')
const AuthService = require('../../services/AuthService')

const sudoService = new SudoService()
const authService = new AuthService()

exports.authControllersSudo = new AuthControllersSudo(sudoService, authService)
