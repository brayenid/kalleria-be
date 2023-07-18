const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const AccountService = require('../interfaces/services/AccountServices')

class UserService extends AccountService {
  constructor() {
    super()
    this._pool = new Pool()
  }

  async addAccount(payload) {
    try {
      const { id, username, nama, email, noTelepon, password, pekerjaan, noIdentitas, urlFoto } = payload
      const query = {
        text: 'INSERT INTO users (id, username, nama, email, no_telepon, password, pekerjaan, no_identitas, url_foto) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
        values: [id, username, nama, email, noTelepon, password, pekerjaan, noIdentitas, urlFoto]
      }

      const { rows } = await this._pool.query(query)
      return rows[0]
    } catch (error) {
      throw new Error(`Gagal menambahkan akun baru: ${error.message}`)
    }
  }

  async patchAccountDetail(id, payload) {
    const { nama, email, noTelepon, pekerjaan, noIdentitas, urlFoto } = payload
    const currentTime = new Date()

    try {
      const query = {
        text: 'UPDATE users SET nama = $1, email = $2, no_telepon = $3, pekerjaan = $4, no_identitas = $5, url_foto = $6, updated_at = $7 WHERE id = $8',
        values: [nama, email, noTelepon, pekerjaan, noIdentitas, urlFoto, currentTime, id]
      }
      // fs.unlinkSync(path.resolve(`src/public/uploads/${oldUrlFoto}`))
      await this._pool.query(query)
    } catch (error) {
      throw new Error(`Gagal mengubah detail user: ${error.message}`)
    }
  }

  async patchAccountPassword(id, password) {
    const currentTime = new Date()

    try {
      const query = {
        text: 'UPDATE users SET password = $1, updated_at = $2 WHERE id = $3',
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
        text: 'DELETE FROM users WHERE id = $1',
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
      const { rows } = await this._pool.query('SELECT id, username, nama, email, no_telepon FROM users')
      return rows
    } catch (error) {
      throw new Error(`Gagal mendapatkan semua akun: ${error.message}`)
    }
  }

  async getAccountById(id) {
    const query = {
      text: 'SELECT id, username, nama, email, no_telepon, pekerjaan, no_identitas, url_foto FROM users WHERE id = $1',
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
      text: 'SELECT username FROM users WHERE username = $1',
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
      text: 'SELECT id, role, password FROM users WHERE username = $1',
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

module.exports = UserService
