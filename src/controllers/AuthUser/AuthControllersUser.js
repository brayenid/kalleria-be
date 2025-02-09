const autoBind = require('auto-bind')
const AuthController = require('../../interfaces/controllers/AuthControllers')
const TokenManager = require('../../utils/TokenManager')
const { cookieOptRefresh, cookieOptRole, clearCookieOpt } = require('../../config/cookies')

class AuthControllersUser extends AuthController {
  constructor(userService, authService) {
    super()
    this.userService = userService
    this.authService = authService
    autoBind(this)
  }

  async getToken(req, res) {
    try {
      const { username, password } = req.body
      const credential = await this.userService.verifyAccountCredential(username, password)

      const { id, role } = credential

      const accessToken = TokenManager.generateAccessToken({ id, role, username })
      const refreshToken = TokenManager.generateRefreshToken({ id, role, username })

      await this.authService.addRefreshToken({
        token: refreshToken,
        accountId: id
      })

      res.status(200).cookie('refreshTokenUser', refreshToken, cookieOptRefresh()).cookie('role', 'user', cookieOptRole()).json({
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
    const { refreshTokenUser } = req.signedCookies
    try {
      await this.authService.verifyRefreshToken(refreshTokenUser)

      const { id, role, username } = TokenManager.verifyRefreshToken(refreshTokenUser)
      const accessToken = TokenManager.generateAccessToken({ id, role, username })

      return res.status(200).json({
        status: 'success',
        data: {
          accessToken
        }
      })
    } catch (error) {
      await this.authService.deleteRefreshToken(refreshTokenUser)

      return res.status(403).clearCookie('refreshTokenUser', clearCookieOpt()).clearCookie('role', clearCookieOpt()).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async removeToken(req, res) {
    try {
      const { refreshTokenUser } = req.signedCookies
      await this.authService.verifyRefreshToken(refreshTokenUser)
      await this.authService.deleteRefreshToken(refreshTokenUser)

      return res.status(200).clearCookie('refreshTokenUser', clearCookieOpt()).clearCookie('role', clearCookieOpt()).json({
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

module.exports = AuthControllersUser
