const autoBind = require('auto-bind')
const AuthController = require('../../interfaces/controllers/AuthControllers')
const TokenManager = require('../../utils/TokenManager')
const { cookieOptRefresh, cookieOptRole, clearCookieOpt } = require('../../config/cookies')

class AuthControllersAdmin extends AuthController {
  constructor(adminService, authService) {
    super()
    this.adminService = adminService
    this.authService = authService
    autoBind(this)
  }

  async getToken(req, res) {
    try {
      const { username, password } = req.body
      const credential = await this.adminService.verifyAccountCredential(username, password)

      const { id, role } = credential

      const accessToken = TokenManager.generateAccessToken({ id, role, username })
      const refreshToken = TokenManager.generateRefreshToken({ id, role, username })

      await this.authService.addRefreshToken({
        token: refreshToken,
        accountId: id
      })

      res.status(200).cookie('refreshTokenAdmin', refreshToken, cookieOptRefresh()).cookie('role', 'admin', cookieOptRole()).json({
        status: 'success',
        message: 'Anda berhasil masuk',
        data: {
          accessToken
        }
      })
    } catch (error) {
      return res.status(404).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async putToken(req, res) {
    const { refreshTokenAdmin } = req.signedCookies
    try {
      await this.authService.verifyRefreshToken(refreshTokenAdmin)

      const { id, role, username } = TokenManager.verifyRefreshToken(refreshTokenAdmin)
      const accessToken = TokenManager.generateAccessToken({ id, role, username })

      return res.status(200).json({
        status: 'success',
        data: {
          accessToken
        }
      })
    } catch (error) {
      await this.authService.deleteRefreshToken(refreshTokenAdmin)

      return res.status(403).clearCookie('refreshTokenAdmin', clearCookieOpt()).clearCookie('role', clearCookieOpt()).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async removeToken(req, res) {
    try {
      const { refreshTokenAdmin } = req.signedCookies
      await this.authService.verifyRefreshToken(refreshTokenAdmin)
      await this.authService.deleteRefreshToken(refreshTokenAdmin)

      return res.status(200).clearCookie('refreshTokenAdmin', clearCookieOpt()).clearCookie('role', clearCookieOpt()).json({
        status: 'success',
        message: 'Anda berhasil keluar'
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: 'Permintaan keluar tidak valid'
      })
    }
  }
}

module.exports = AuthControllersAdmin
