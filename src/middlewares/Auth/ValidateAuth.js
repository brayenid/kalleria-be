const jwt = require('jsonwebtoken')
const config = require('../../config')
const autoBind = require('auto-bind')
const SudoService = require('../../services/SudoService')

const sudoService = new SudoService()

class ValidateAuth {
  constructor(service) {
    this.service = service
    this.sudoService = sudoService

    autoBind(this)
  }

  async validate(req, res, next) {
    const { authorization } = req.headers

    if (!authorization) {
      return res.status(401).json({
        status: 'fail',
        message: 'Anda tidak terautentikasi'
      })
    }

    const token = authorization.split(' ')[1]

    try {
      const decodedToken = jwt.verify(token, config.token.access)
      if (decodedToken.role === 'sudo') {
        const { id } = decodedToken
        console.log(decodedToken)
        await this.sudoService.getAccountById(id)
        req.user = decodedToken
        next()
      } else {
        const { id } = decodedToken
        await this.service.getAccountById(id)
        req.user = decodedToken
        next()
      }
    } catch (error) {
      return res.status(401).json({
        status: 'fail',
        message: 'Token autentikasi tidak valid'
      })
    }
  }
}

module.exports = ValidateAuth
