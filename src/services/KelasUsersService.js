const { Pool } = require('pg')
class KelasUsersService {
  constructor() {
    this._pool = new Pool()
  }

  async addKelasUser(payload) {
    const { id, userId, kelasId, maksimalPertemuan } = payload
    const initialMaksimalPertemuan = maksimalPertemuan || 18
    const currentTime = new Date()

    try {
      const query = {
        text: 'INSERT INTO kelas_users (id, user_id, kelas_id, maksimal_pertemuan, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $5) RETURNING id',
        values: [id, userId, kelasId, initialMaksimalPertemuan, currentTime]
      }

      await this._pool.query(query)
    } catch (error) {
      throw new Error(`Gagal menambahkan kelas user: ${error.message}`)
    }
  }

  async checkKelasUSerAvailability(userId, kelasId) {
    try {
      const query = {
        text: 'SELECT * FROM kelas_users WHERE user_id = $1 AND kelas_id = $2',
        values: [userId, kelasId]
      }
      const { rowCount } = await this._pool.query(query)

      if (!rowCount) {
        return true
      }
      return false
    } catch (error) {
      throw new Error(`Gagal memvalidasi kelas user: ${error.message}`)
    }
  }

  async getKelasUserById(id) {
    try {
      const query = {
        text: `
        SELECT 
        kelas_users.id, 
        kelas_users.user_id AS "userId", 
        users.nama,
        kelas_users.kelas_id AS "kelasId", 
        kelas.nama_kelas AS "namaKelas",
        kelas_users.maksimal_pertemuan AS "maksimalPertemuan", 
        kelas_users.presensi, 
        kelas_users.created_at AS "createdAt", 
        kelas_users.updated_at AS "updatedAt" 
        FROM 
        kelas_users 
        JOIN
        users
        ON
        kelas_users.user_id = users.id
        JOIN
        kelas
        ON
        kelas_users.kelas_id = kelas.id
        WHERE kelas_users.id = $1`,
        values: [id]
      }
      const { rows } = await this._pool.query(query)

      return rows[0]
    } catch (error) {
      throw new Error(`Gagal mendapatkan kelas user: ${error.message}`)
    }
  }

  async getKelasUsersByUserId(pageNumber = 1, pageSize = 20, userId) {
    const offset = (pageNumber - 1) * pageSize
    try {
      const query = {
        text: `
        SELECT 
        kelas_users.id,
        users.nama,
        kelas.id AS "kelasId",
        kelas.nama_kelas AS "namaKelas",
        kelas.tipe_kelas AS "tipeKelas",
        kelas.thumbnail_kelas AS "thumbnailKelas",
        kelas_users.maksimal_pertemuan AS "maksimalPertemuan", 
        kelas_users.presensi, 
        kelas_users.created_at AS "createdAt", 
        kelas_users.updated_at AS "updatedAt" 
        FROM 
        kelas_users
        JOIN
        users
        ON
        kelas_users.user_id = users.id
        JOIN
        kelas
        ON
        kelas_users.kelas_id = kelas.id
        WHERE kelas_users.user_id = $3
        ORDER BY
        kelas_users.updated_at DESC
        LIMIT $1 OFFSET $2`,
        values: [pageSize, offset, userId]
      }

      const { rows } = await this._pool.query(query)
      const total = await this._getKelasUsersByUserIdTotal(userId)
      return {
        total,
        rows
      }
    } catch (error) {
      throw new Error(`Gagal mendapatkan kelas user: ${error.message}`)
    }
  }

  async _getKelasUsersByUserIdTotal(userId) {
    try {
      const query = {
        text: `
        SELECT 
        COUNT (kelas_users.*) AS "totalKelasUsers"
        FROM 
        kelas_users
        JOIN
        users
        ON
        kelas_users.user_id = users.id
        JOIN
        kelas
        ON
        kelas_users.kelas_id = kelas.id
        WHERE kelas_users.user_id = $1`,
        values: [userId]
      }

      const { rows } = await this._pool.query(query)

      return Number(rows[0].totalKelasUsers)
    } catch (error) {
      throw new Error(`Gagal mendapatkan total kelas user: ${error.message}`)
    }
  }

  async getKelasUsersByKelasId(kelasId) {
    try {
      const query = {
        text: `
        SELECT 
        id, 
        user_id AS "userId", 
        kelas_id AS "kelasId", 
        maksimal_pertemuan AS "maksimalPertemuan", 
        presensi, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt" 
        FROM 
        kelas_users 
        WHERE kelas_id = $1`,
        values: [kelasId]
      }

      const { rows } = await this._pool.query(query)

      return rows
    } catch (error) {
      throw new Error(`Gagal mendapatkan kelas user: ${error.message}`)
    }
  }

  async validateKelasUser(userId, kelasId) {
    try {
      const query = {
        text: 'SELECT * FROM kelas_users WHERE user_id = $1 AND kelas_id = $2',
        values: [userId, kelasId]
      }

      const { rowCount } = await this._pool.query(query)

      if (!rowCount) {
        throw new Error('User tidak terdaftar pada kelas')
      }
    } catch (error) {
      throw new Error(`Gagal mengambil kelas user: ${error.message}`)
    }
  }

  async validatePresensiNotExceeded(userId, kelasId, pertemuan) {
    try {
      const query = {
        text: 'SELECT maksimal_pertemuan AS "maksimalPertemuan", presensi FROM kelas_users WHERE user_id = $1 AND kelas_id = $2',
        values: [userId, kelasId]
      }

      const { rows } = await this._pool.query(query)
      if (Number(pertemuan) + rows[0].presensi > rows[0].maksimalPertemuan) {
        throw new Error('Pertemuan melebihi maksimal pertemuan')
      }
    } catch (error) {
      throw new Error(`Gagal menambahkan presensi: ${error.message}`)
    }
  }

  async getKelasUsers(pageNumber = 1, pageSize = 20, search = '') {
    const offset = (pageNumber - 1) * pageSize
    try {
      const query = {
        text: `
        SELECT 
        kelas_users.id,
        users.nama,
        kelas.nama_kelas AS "namaKelas",
        kelas_users.maksimal_pertemuan AS "maksimalPertemuan", 
        kelas_users.presensi, 
        kelas_users.created_at AS "createdAt", 
        kelas_users.updated_at AS "updatedAt" 
        FROM 
        kelas_users
        JOIN
        users
        ON
        kelas_users.user_id = users.id
        JOIN
        kelas
        ON
        kelas_users.kelas_id = kelas.id
        WHERE users.username ILIKE $3 OR users.nama ILIKE $3 OR kelas.nama_kelas ILIKE $3
        ORDER BY
        kelas_users.updated_at DESC
        LIMIT $1 OFFSET $2
        `,
        values: [pageSize, offset, `%${search}%`]
      }

      const { rows } = await this._pool.query(query)
      const total = await this._getKelasUsersTotal(search)

      return {
        total,
        rows
      }
    } catch (error) {
      throw new Error(`Gagal mendapatkan semua kelas user: ${error.message}`)
    }
  }

  async _getKelasUsersTotal(search) {
    try {
      const query = {
        text: `
        SELECT 
        COUNT(kelas_users.*) AS "totalKelasUsers"
        FROM 
        kelas_users
        JOIN
        users
        ON
        kelas_users.user_id = users.id
        JOIN
        kelas
        ON
        kelas_users.kelas_id = kelas.id
        WHERE users.username ILIKE $1 OR users.nama ILIKE $1 OR kelas.nama_kelas ILIKE $1`,
        values: [`%${search}%`]
      }
      const { rows } = await this._pool.query(query)
      return Number(rows[0].totalKelasUsers)
    } catch (error) {
      throw new Error(`Gagal mendapatkan total kelas user: ${error.message}`)
    }
  }

  async putKelasUser(id, payload) {
    const { maksimalPertemuan, presensi } = payload
    const currentTime = new Date()

    try {
      const query = {
        text: 'UPDATE kelas_users SET maksimal_pertemuan = $1, presensi = $2, updated_at = $3 WHERE id = $4',
        values: [maksimalPertemuan, presensi, currentTime, id]
      }

      await this._pool.query(query)
    } catch (error) {
      throw new Error(`Gagal memperbaharui kelas user: ${error.message}`)
    }
  }

  async patchKelasUserPresensi(payload, pertemuan) {
    const { kelasId, userId } = payload
    try {
      const query = {
        text: 'UPDATE kelas_users SET presensi = presensi + $1 WHERE kelas_id = $2 AND user_id = $3 RETURNING id',
        values: [pertemuan, kelasId, userId]
      }

      const { rows } = await this._pool.query(query)

      return rows[0]
    } catch (error) {
      throw new Error(`Gagal menambah presensi: ${error.message}`)
    }
  }

  async removeKelasUser(id) {
    try {
      const query = {
        text: 'DELETE FROM kelas_users WHERE id = $1',
        values: [id]
      }
      await this._pool.query(query)
    } catch (error) {
      throw new Error(`Gagal menghapus kelas user: ${error.message}`)
    }
  }

  async validateUserGraduated(id) {
    try {
      const query = {
        text: 'SELECT presensi, maksimal_pertemuan AS "maksimalPertemuan" FROM kelas_users WHERE id = $1',
        values: [id]
      }

      const { rows } = await this._pool.query(query)

      const { presensi, maksimalPertemuan } = rows[0]

      if (presensi < maksimalPertemuan) {
        throw new Error('User belum lulus pada kelas ini')
      }
    } catch (error) {
      throw new Error(`Gagal memvalidasi kelulusan user: ${error.message}`)
    }
  }

  async validateKelasUserOwner(id, userId) {
    try {
      const query = {
        text: 'SELECT id FROM kelas_users WHERE id = $1 AND user_id = $2',
        values: [id, userId]
      }
      const { rowCount } = await this._pool.query(query)

      if (!rowCount) {
        throw new Error('Bukan pemiliki kelas user')
      }
    } catch (error) {
      throw new Error(`Gagal memvalidasi kepemilikan kelas user: ${error.message}`)
    }
  }
}

module.exports = KelasUsersService
