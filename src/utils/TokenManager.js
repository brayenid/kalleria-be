const jwt = require('jsonwebtoken')
const jwtDecode = require('jwt-decode')
const config = require('../config')

const TokenManager = {
  generateAccessToken: (payload) => {
    return jwt.sign(payload, config.token.access, {
      expiresIn: '15s'
    })
  },
  generateRefreshToken: (payload) => {
    return jwt.sign(payload, config.token.refresh, {
      expiresIn: '7d'
    })
  },
  verifyRefreshToken: (refreshToken) => {
    try {
      jwt.verify(refreshToken, config.token.refresh)
      const artifacts = jwtDecode(refreshToken)
      const payload = artifacts
      return payload
    } catch (error) {
      throw new Error('Refresh token is invalid')
    }
  }
}

module.exports = TokenManager
