const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const AccountService = require('../interfaces/services/AccountServices')
const config = require('../config')

class SudoService extends AccountService {
  constructor() {
    super()
    this._pool = new Pool()
  }

  async addAccount(payload) {
    try {
      const { id, username, nama, password } = payload
      const query = {
        text: 'INSERT INTO super_admin (id, username, nama, password) VALUES($1, $2, $3, $4) RETURNING id',
        values: [id, username, nama, password]
      }

      const { rows } = await this._pool.query(query)
      return rows[0]
    } catch (error) {
      throw new Error(`Gagal menambahkan akun baru: ${error.message}`)
    }
  }

  async resetAccount() {
    const defaultPassword = config.sudo.password
    const defaultUsername = config.sudo.username
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)
    const currentTime = new Date()
    try {
      const query = {
        text: 'UPDATE super_admin SET password = $1, updated_at = $2 WHERE username = $3',
        values: [hashedPassword, currentTime, defaultUsername]
      }
      await this._pool.query(query)
    } catch (error) {
      throw new Error(`Gagal mereset akun: ${error.message}`)
    }
  }

  async patchAccountDetail(id, payload) {
    const { nama } = payload
    const currentTime = new Date()

    try {
      const query = {
        text: 'UPDATE super_admin SET nama = $1, updated_at = $2 WHERE id = $3',
        values: [nama, currentTime, id]
      }
      await this._pool.query(query)
    } catch (error) {
      throw new Error(`Gagal mengubah detail akun: ${error.message}`)
    }
  }

  async patchAccountPassword(id, password) {
    const currentTime = new Date()

    try {
      const query = {
        text: 'UPDATE super_admin SET password = $1, updated_at = $2 WHERE id = $3',
        values: [password, currentTime, id]
      }
      await this._pool.query(query)
    } catch (error) {
      throw new Error(`Gagal mengubah password: ${error.message}`)
    }
  }

  async removeAccount(id) {
    try {
      const query = {
        text: 'DELETE FROM super_admin WHERE id = $1',
        values: [id]
      }
      await this._pool.query(query)
      return true
    } catch (error) {
      throw new Error(`Gagal menghapus akun: ${error.message}`)
    }
  }

  async getAccounts() {
    try {
      const { rows } = await this._pool.query('SELECT id, username, nama FROM super_admin')
      return rows
    } catch (error) {
      throw new Error(`Gagal mendapatkan semua akun: ${error.message}`)
    }
  }

  async getAccountById(id) {
    const query = {
      text: 'SELECT id, username, nama FROM super_admin WHERE id = $1',
      values: [id]
    }
    const { rowCount, rows } = await this._pool.query(query)

    if (!rowCount) {
      throw new Error('Akun tidak ditemukan')
    }
    return rows[0]
  }

  async getAccountByUsername(username) {
    const query = {
      text: 'SELECT username FROM super_admin WHERE username = $1',
      values: [username]
    }
    const { rowCount, rows } = await this._pool.query(query)
    if (rowCount) {
      throw new Error('Username telah digunakan')
    }
    return rows[0]
  }

  async verifyAccountCredential(username, password) {
    const query = {
      text: 'SELECT id, role, password FROM super_admin WHERE username = $1',
      values: [username]
    }
    const { rowCount, rows } = await this._pool.query(query)
    if (!rowCount) {
      throw new Error('Kredensial tidak valid')
    }

    const { id, password: hashedPassword, role } = rows[0]
    const isMatched = await bcrypt.compare(password, hashedPassword)
    if (!isMatched) {
      throw new Error('Password salah')
    }
    return { id, username, role }
  }
}

module.exports = SudoService
