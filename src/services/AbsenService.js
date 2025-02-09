const { Pool } = require('pg')

class AbsenService {
  constructor() {
    this._pool = new Pool()
  }

  async addAbsen(payload) {
    const { id, userId, kelasId, jumlahPertemuan, admin } = payload

    try {
      const query = {
        text: 'INSERT INTO absen (id, user_id, kelas_id, jumlah_pertemuan, admin) VALUES($1, $2, $3, $4, $5)',
        values: [id, userId, kelasId, jumlahPertemuan, admin]
      }

      await this._pool.query(query)

      const response = await this._getUsernameAndKelas(userId, kelasId)

      return response
    } catch (error) {
      throw new Error(`Gagal menambah absen: ${error.message}`)
    }
  }

  async _getUsernameAndKelas(userId, kelasId) {
    try {
      const query = {
        text: 'SELECT users.nama AS "namaUser", kelas.nama_kelas AS "namaKelas" FROM absen JOIN users ON absen.user_id = users.id JOIN kelas ON absen.kelas_id = kelas.id WHERE absen.user_id = $1 AND absen.kelas_id = $2',
        values: [userId, kelasId]
      }

      const { rows } = await this._pool.query(query)
      return rows[0]
    } catch (error) {
      throw new Error(`Gagal mendapatkan username dan kelas: ${error.message}`)
    }
  }

  async getAbsenByKelasId(kelasId, queryDate) {
    const date = new Date()
    const year = date.getUTCFullYear()
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
    const day = date.getUTCDate().toString().padStart(2, '0')
    const fallbackDate = `${year}-${month}-${day}`

    const currentDate = queryDate || fallbackDate

    try {
      const query = {
        text: `
        SELECT
        id,
        user_id AS "userId",
        kelas_id AS "kelasId",
        jumlah_pertemuan AS "jumlahPertemuan",
        created_at AS "tanggal",
        admin
        FROM absen
        WHERE kelas_id = $1 AND DATE(created_at) = $2
        `,
        values: [kelasId, currentDate]
      }

      const { rows } = await this._pool.query(query)

      return rows
    } catch (error) {
      throw new Error(`Gagal mendapatkan absen berdasarkan kelas: ${error.message}`)
    }
  }

  async validateUserTodaysPresensi(kelasId, userId) {
    const date = new Date()
    const year = date.getUTCFullYear()
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const currentDate = `${year}-${month}-${day}`

    try {
      const query = {
        text: `
        SELECT
        id,
        user_id AS "userId",
        kelas_id AS "kelasId",
        jumlah_pertemuan AS "jumlahPertemuan",
        created_at AS "tanggal",
        admin
        FROM absen
        WHERE kelas_id = $1 AND user_id = $2 AND DATE(created_at) = $3
        `,
        values: [kelasId, userId, currentDate]
      }

      const { rowCount } = await this._pool.query(query)
      if (rowCount) {
        throw new Error('User telah absen hari ini')
      }
    } catch (error) {
      throw new Error(`Gagal menambah absen: ${error.message}`)
    }
  }

  async getAllAbsen(search = '', pageSize = 20, pageNumber = 1) {
    const offset = (pageNumber - 1) * pageSize

    try {
      const query = {
        text: `
        SELECT
        absen.id,
        absen.user_id AS "userId",
        kelas.nama_kelas AS "namaKelas",
        absen.jumlah_pertemuan AS "jumlahPertemuan",
        absen.created_at AS "tanggal",
        absen.admin,
        absen.updated_at AS "updatedAt"
        FROM absen
        JOIN
        users
        ON absen.user_id = users.id
        JOIN
        kelas
        ON absen.kelas_id = kelas.id
        WHERE
        users.nama ILIKE $1 OR absen.user_id ILIKE $1 OR kelas.nama_kelas ILIKE $1
        ORDER BY
        absen.updated_at DESC
        LIMIT $2 OFFSET $3`,
        values: [`%${search}%`, pageSize, offset]
      }
      const { rows } = await this._pool.query(query)
      const total = await this._getAllAbsenTotal(search)

      return {
        total,
        rows
      }
    } catch (error) {
      throw new Error(`Gagal mendapatkan semua absen: ${error.message}`)
    }
  }

  async _getAllAbsenTotal(search) {
    try {
      const query = {
        text: `
        SELECT
        COUNT(absen.*) AS "totalAbsen"
        FROM absen
        JOIN
        users
        ON absen.user_id = users.id
        JOIN
        kelas
        ON absen.kelas_id = kelas.id
        WHERE
        users.nama ILIKE $1 OR absen.user_id ILIKE $1 OR kelas.nama_kelas ILIKE $1`,
        values: [`%${search}%`]
      }
      const { rows } = await this._pool.query(query)

      return Number(rows[0].totalAbsen)
    } catch (error) {
      throw new Error(`Gagal mendapatkan semua absen: ${error.message}`)
    }
  }
}

module.exports = AbsenService
