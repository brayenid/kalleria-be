const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const AccountService = require('../interfaces/services/AccountServices')

class AdminService extends AccountService {
  constructor() {
    super()
    this._pool = new Pool()
  }

  async addAccount(payload) {
    try {
      const { id, username, nama, password } = payload
      const query = {
        text: 'INSERT INTO admins (id, username, nama, password) VALUES($1, $2, $3, $4) RETURNING id',
        values: [id, username, nama, password]
      }

      const { rows } = await this._pool.query(query)
      return rows[0]
    } catch (error) {
      throw new Error(`Gagal menambahkan akun baru: ${error.message}`)
    }
  }

  async patchAccountDetail(id, payload) {
    const { nama } = payload
    const currentTime = new Date()

    try {
      const query = {
        text: 'UPDATE admins SET nama = $1, updated_at = $2 WHERE id = $3',
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
        text: 'UPDATE admins SET password = $1, updated_at = $2 WHERE id = $3',
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
        text: 'DELETE FROM admins WHERE id = $1',
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
      const { rows } = await this._pool.query('SELECT id, username, nama FROM admins')
      return rows
    } catch (error) {
      throw new Error(`Gagal mendapatkan semua akun: ${error.message}`)
    }
  }

  async getAccountById(id) {
    const query = {
      text: 'SELECT id, username, nama FROM admins WHERE id = $1',
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
      text: 'SELECT username FROM admins WHERE username = $1',
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
      text: 'SELECT id, role, password FROM admins WHERE username = $1',
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

module.exports = AdminService
