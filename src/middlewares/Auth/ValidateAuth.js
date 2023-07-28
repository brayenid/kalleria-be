const jwt = require('jsonwebtoken')
const config = require('../../config')
const autoBind = require('auto-bind')
const SudoService = require('../../services/SudoService')
const AdminService = require('../../services/AdminService')

const sudoService = new SudoService()
const adminService = new AdminService()

class ValidateAuth {
  constructor(service) {
    this.service = service
    this.sudoService = sudoService
    this.adminService = adminService

    autoBind(this)
  }

  // RESOURCE OWNER AND FALLBACK TO SUDO
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
      return res.status(403).json({
        status: 'fail',
        message: 'Token autentikasi tidak valid'
      })
    }
  }

  // ONLY RESOURCE OWNER
  async validateStrict(req, res, next) {
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
      const { id } = decodedToken
      await this.service.getAccountById(id)
      req.user = decodedToken
      next()
    } catch (error) {
      return res.status(403).json({
        status: 'fail',
        message: 'Token autentikasi tidak valid (STRICT)'
      })
    }
  }

  // RESOURCE OWNER, FALLBACK TO ADMIN, THEN SUDO
  async validateLoose(req, res, next) {
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
        await this.sudoService.getAccountById(id)
        req.user = decodedToken
        next()
      } else if (decodedToken.role === 'admin') {
        const { id } = decodedToken
        await this.adminService.getAccountById(id)
        req.user = decodedToken
        next()
      } else {
        const { id } = decodedToken
        await this.service.getAccountById(id)
        req.user = decodedToken
        next()
      }
    } catch (error) {
      return res.status(403).json({
        status: 'fail',
        message: 'Token autentikasi tidak valid'
      })
    }
  }
}

module.exports = ValidateAuth
