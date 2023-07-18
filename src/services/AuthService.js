const { Pool } = require('pg')

class AuthenticationService {
  constructor() {
    this._pool = new Pool()
  }

  async addRefreshToken(payload) {
    const { token, accountId } = payload
    const query = {
      text: 'INSERT INTO authentications (token, account_id) VALUES($1, $2)',
      values: [token, accountId]
    }
    await this._pool.query(query)
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token]
    }
    const { rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new Error('Refresh token is invalid')
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token]
    }
    await this._pool.query(query)
  }
}

module.exports = AuthenticationService
