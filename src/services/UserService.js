const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const AccountService = require('../interfaces/services/AccountServices')
const { nanoid } = require('nanoid')

class UserService extends AccountService {
  constructor() {
    super()
    this._pool = new Pool()
  }

  async addAccount(payload) {
    const { id, username, nama, noIdentitas, jenisKelamin, tempatLahir, tanggalLahir, alamat, email, noTelepon, password, asalSekolah } = payload
    try {
      const query = {
        text: 'INSERT INTO users (id, username, nama, no_identitas, jenis_kelamin, tempat_lahir,tanggal_lahir, alamat, email, no_telepon, password, asal_sekolah) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id',
        values: [id, username, nama, noIdentitas, jenisKelamin, tempatLahir, tanggalLahir, alamat, email, noTelepon, password, asalSekolah]
      }

      const { rows } = await this._pool.query(query)
      return rows[0]
    } catch (error) {
      throw new Error(`Gagal menambahkan akun baru: ${error.message}`)
    }
  }

  async resetAccount(userId) {
    const currentTime = new Date()
    const newPassword = nanoid(8)
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    try {
      const query = {
        text: 'UPDATE users SET password = $1, updated_at = $2 WHERE id = $3',
        values: [hashedPassword, currentTime, userId]
      }
      await this._pool.query(query)
      return newPassword
    } catch (error) {
      throw new Error(`Gagal mereset akun: ${error.message}`)
    }
  }

  async patchAccountDetail(id, payload) {
    const { nama, alamat, email, noTelepon, asalSekolah, noIdentitas, urlFoto, jenisKelamin, tanggalLahir, tempatLahir } = payload
    const currentTime = new Date()

    try {
      const query = {
        text: `
        UPDATE 
        users 
        SET 
        nama = $1, 
        alamat = $2, 
        email = $3, 
        no_telepon = $4, 
        asal_sekolah = $5, 
        no_identitas = $6, 
        url_foto = $7,
        jenis_kelamin = $8,
        tanggal_lahir = $9,
        tempat_lahir = $10,
        updated_at = $11 
        WHERE id = $12`,
        values: [nama, alamat, email, noTelepon, asalSekolah, noIdentitas, urlFoto, jenisKelamin, tanggalLahir, tempatLahir, currentTime, id]
      }
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

  async getAccounts(pageNumber = 1, pageSize = 20, searchQuery = '') {
    const offset = (pageNumber - 1) * pageSize
    try {
      const query = {
        text: `
        SELECT id, 
        username, 
        nama, 
        email, 
        no_telepon AS "noTelepon", 
        asal_sekolah AS "asalSekolah",
        created_at AS "createdAt"
        FROM users
        WHERE nama ILIKE $3 OR username ILIKE $3 OR id ILIKE $3
        ORDER BY
        updated_at DESC
        LIMIT $1 OFFSET $2
        `,
        values: [pageSize, offset, `%${searchQuery}%`]
      }
      const total = await this._getAccountsTotal(searchQuery)
      const { rows } = await this._pool.query(query)
      return {
        total,
        rows
      }
    } catch (error) {
      throw new Error(`Gagal mendapatkan semua akun: ${error.message}`)
    }
  }

  async _getAccountsTotal(searchQuery) {
    try {
      const query = {
        text: 'SELECT COUNT(*) AS "totalUsers" FROM users WHERE nama ILIKE $1 OR username ILIKE $1 ',
        values: [`%${searchQuery}%`]
      }
      const { rows } = await this._pool.query(query)
      return Number(rows[0].totalUsers)
    } catch (error) {
      throw new Error(`Gagal mendapatkan total akun users: ${error.message}`)
    }
  }

  async getAccountById(id) {
    const query = {
      text: `
      SELECT 
      id, 
      username, 
      nama, 
      alamat, 
      jenis_kelamin AS "jenisKelamin", 
      tempat_lahir AS "tempatLahir", 
      tanggal_lahir AS "tanggalLahir", 
      email, 
      no_telepon AS "noTelepon", 
      asal_sekolah AS "asalSekolah", 
      no_identitas AS "noIdentitas", 
      url_foto AS "urlFoto", 
      created_at AS "createdAt", 
      updated_at AS "updatedAt" 
      FROM users WHERE id = $1`,
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
