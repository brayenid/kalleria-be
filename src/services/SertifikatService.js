const { Pool } = require('pg')

class SertifikatService {
  constructor() {
    this._pool = new Pool()
  }

  async addSertifikat(id, kelasUserId) {
    const currentTime = new Date()
    try {
      const query = {
        text: 'INSERT INTO sertifikat(id, kelas_user_id, created_at, updated_at) VALUES($1, $2, $3, $3)',
        values: [id, kelasUserId, currentTime]
      }
      await this._pool.query(query)
    } catch (error) {
      throw new Error(`Gagal membuat sertifikat: ${error.message}`)
    }
  }

  async validateSertifikatAvailability(kelasUserId) {
    try {
      const query = {
        text: 'SELECT id FROM sertifikat WHERE kelas_user_id = $1',
        values: [kelasUserId]
      }

      const { rowCount } = await this._pool.query(query)
      if (rowCount) {
        throw new Error('Sertifikat telah diklaim')
      }
    } catch (error) {
      throw new Error(`Gagal memvalidasi keberadaan sertifikat: ${error.message}`)
    }
  }

  async getSertifikatUserId(userId, pageSize = 20, pageNumber = 1) {
    const offset = (pageNumber - 1) * pageSize

    try {
      const query = {
        text: `
        SELECT
        sertifikat.id,
        sertifikat.kelas_user_id,
        kelas.nama_kelas AS "namaKelas",
        sertifikat.updated_at AS "tanggal"
        FROM sertifikat
        JOIN
        kelas_users
        ON
        sertifikat.kelas_user_id = kelas_users.id
        JOIN
        users
        ON
        kelas_users.user_id = users.id
        JOIN
        kelas
        ON
        kelas_users.kelas_id = kelas.id
        WHERE users.id = $1
        ORDER BY
        sertifikat.updated_at DESC
        LIMIT $2 OFFSET $3`,
        values: [userId, pageSize, offset]
      }
      const { rows } = await this._pool.query(query)
      const total = await this._getSertifikatUserIdTotal(userId)
      return {
        total,
        rows
      }
    } catch (error) {
      throw new Error(`Gagal mendapatkan sertifikat berdasarkan user: ${error.message}`)
    }
  }

  async _getSertifikatUserIdTotal(userId) {
    try {
      const query = {
        text: `
          SELECT
          COUNT(sertifikat.id) AS "totalSertifikat"
          FROM sertifikat
          JOIN
          kelas_users
          ON
          sertifikat.kelas_user_id = kelas_users.id
          JOIN
          users
          ON
          kelas_users.user_id = users.id
          JOIN
          kelas
          ON
          kelas_users.kelas_id = kelas.id
          WHERE users.id = $1`,
        values: [userId]
      }
      const { rows } = await this._pool.query(query)
      return Number(rows[0].totalSertifikat)
    } catch (error) {
      throw new Error(`Gagal mendapatkan total sertifikat berdasarkan user: ${error.message}`)
    }
  }

  async getSertifikatByUserAndKelasUser(userId, kelasUserId) {
    try {
      const query = {
        text: `
          SELECT
          sertifikat.id,
          sertifikat.kelas_user_id
          FROM sertifikat
          JOIN
          kelas_users
          ON
          sertifikat.kelas_user_id = kelas_users.id
          JOIN
          users
          ON
          kelas_users.user_id = users.id
          WHERE users.id = $1 AND sertifikat.kelas_user_id = $2`,
        values: [userId, kelasUserId]
      }
      const { rows } = await this._pool.query(query)
      return rows[0]
    } catch (error) {
      throw new Error(`Gagal mendapatkan sertifikat berdasarkan user dan kelas user: ${error.message}`)
    }
  }

  async getSertifikatById(id) {
    try {
      const query = {
        text: `
          SELECT
          sertifikat.id,
          users.nama AS "nama",
          kelas.nama_kelas AS "namaKelas",
          kelas_users.maksimal_pertemuan AS "maksimalPertemuan",
          sertifikat.updated_at AS "tanggal"
          FROM sertifikat
          JOIN
          kelas_users
          ON
          sertifikat.kelas_user_id = kelas_users.id
          JOIN
          users
          ON
          kelas_users.user_id = users.id
          JOIN
          kelas
          ON
          kelas_users.kelas_id = kelas.id
          WHERE sertifikat.id = $1`,
        values: [id]
      }
      const { rows } = await this._pool.query(query)
      return rows[0]
    } catch (error) {
      throw new Error(`Gagal mendapatkan sertifikat berdasarkan id: ${error.message}`)
    }
  }

  async getSertifikat(search = '', pageSize = 20, pageNumber = 1) {
    const offset = (pageNumber - 1) * pageSize

    try {
      const query = {
        text: `
        SELECT
        sertifikat.id,
        users.nama,
        sertifikat.kelas_user_id,
        kelas.nama_kelas AS "namaKelas",
        sertifikat.updated_at AS "tanggal"
        FROM sertifikat
        JOIN
        kelas_users
        ON
        sertifikat.kelas_user_id = kelas_users.id
        JOIN
        users
        ON
        kelas_users.user_id = users.id
        JOIN
        kelas
        ON
        kelas_users.kelas_id = kelas.id
        WHERE users.nama ILIKE $1 OR sertifikat.id ILIKE $1 OR kelas.nama_kelas ILIKE $1
        ORDER BY
        sertifikat.updated_at DESC
        LIMIT $2 OFFSET $3`,
        values: [`%${search}%`, pageSize, offset]
      }
      const { rows } = await this._pool.query(query)
      const total = await this._getSertifikatTotal(search)
      return {
        total,
        rows
      }
    } catch (error) {
      throw new Error(`Gagal mendapatkan sertifikat berdasarkan user: ${error.message}`)
    }
  }

  async _getSertifikatTotal(search) {
    try {
      const query = {
        text: `
          SELECT
          COUNT(sertifikat.id) AS "totalSertifikat"
          FROM sertifikat
          JOIN
          kelas_users
          ON
          sertifikat.kelas_user_id = kelas_users.id
          JOIN
          users
          ON
          kelas_users.user_id = users.id
          JOIN
          kelas
          ON
          kelas_users.kelas_id = kelas.id
          WHERE users.nama ILIKE $1 OR sertifikat.id ILIKE $1 OR kelas.nama_kelas ILIKE $1`,
        values: [`%${search}%`]
      }
      const { rows } = await this._pool.query(query)
      return Number(rows[0].totalSertifikat)
    } catch (error) {
      throw new Error(`Gagal mendapatkan total sertifikat berdasarkan user: ${error.message}`)
    }
  }
}

module.exports = SertifikatService
