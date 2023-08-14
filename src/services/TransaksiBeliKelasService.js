const { Pool } = require('pg')

class TransaksiBeliKelasService {
  constructor() {
    this._pool = new Pool()
  }

  async addTransaksi(payload) {
    const { id, userId, kelasId } = payload
    try {
      const query = {
        text: 'INSERT INTO transaksi_beli_kelas (id, user_id, kelas_id) VALUES($1, $2, $3) RETURNING id',
        values: [id, userId, kelasId]
      }

      const { rows } = await this._pool.query(query)
      return rows[0]
    } catch (error) {
      throw new Error(`Gagal melakukan transaksi beli kelas: ${error.message}`)
    }
  }

  async addTransaksiTunai(payload) {
    const { id, userId, kelasId, adminId } = payload
    const status = 'diterima'
    const bukitBayar = 'tunai'
    const currentTime = new Date()
    try {
      const query = {
        text: `
        INSERT INTO 
        transaksi_beli_kelas (id, user_id, kelas_id, status, url_bukti_bayar, accepted_by, created_at, updated_at) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $7) 
        RETURNING id`,
        values: [id, userId, kelasId, status, bukitBayar, adminId, currentTime]
      }

      const { rows } = await this._pool.query(query)
      return rows[0]
    } catch (error) {
      throw new Error(`Gagal melakukan transaksi beli kelas: ${error.message}`)
    }
  }

  async patchBuktiTransaksi(id, urlBuktiBayar) {
    const currentTime = new Date()
    try {
      const query = {
        text: "UPDATE transaksi_beli_kelas SET url_bukti_bayar = $1, status = 'dibayar', updated_at = $2 WHERE id = $3",
        values: [urlBuktiBayar, currentTime, id]
      }

      await this._pool.query(query)
    } catch (error) {
      throw new Error(`Gagal melakukan konfirmasi pembayaran: ${error.message}`)
    }
  }

  async putStatusTransakasi(id, payload) {
    const currentTime = new Date()
    const { adminId, message, status } = payload

    try {
      const query = {
        text: 'UPDATE transaksi_beli_kelas SET status = $1, message = $2, accepted_by = $3, updated_at = $4 WHERE id = $5 RETURNING kelas_id AS "kelasId", user_id AS "userId"',
        values: [status, message, adminId, currentTime, id]
      }

      const { rows } = await this._pool.query(query)
      return rows[0]
    } catch (error) {
      throw new Error(`Gagal merubah status pembayaran: ${error.message}`)
    }
  }

  async getTransaksiById(id) {
    try {
      const query = {
        text: `
        SELECT 
        transaksi_beli_kelas.id, 
        'Pembelian ' || kelas.nama_kelas AS "namaTransaksi",
        transaksi_beli_kelas.user_id AS "userId", 
        users.nama,
        transaksi_beli_kelas.kelas_id AS "kelasId", 
        transaksi_beli_kelas.status,
        kelas.harga_kelas AS "hargaKelas",
        transaksi_beli_kelas.url_bukti_bayar AS "urlBuktiBayar", 
        transaksi_beli_kelas.message, 
        transaksi_beli_kelas.accepted_by AS "acceptedBy",
        transaksi_beli_kelas.created_at AS "createdAt", 
        transaksi_beli_kelas.updated_at AS "updatedAt" 
        FROM 
        transaksi_beli_kelas
        JOIN kelas 
        ON transaksi_beli_kelas.kelas_id = kelas.id
        JOIN users
        ON transaksi_beli_kelas.user_id = users.id
        WHERE transaksi_beli_kelas.id = $1`,
        values: [id]
      }
      const { rows, rowCount } = await this._pool.query(query)
      if (!rowCount) {
        throw new Error('Transaksi tidak ada')
      }

      return rows[0]
    } catch (error) {
      throw new Error(`Gagal mendapatkan detail transaksi beli kelas: ${error.message}`)
    }
  }

  async getTransaksiByKelasAndUser(userId, kelasId) {
    try {
      const query = {
        text: `
        SELECT
        transaksi_beli_kelas.id, 
        'Pembelian: ' || kelas.nama_kelas AS "namaTransaksi",
        transaksi_beli_kelas.user_id AS "userId", 
        transaksi_beli_kelas.kelas_id AS "kelasId", 
        transaksi_beli_kelas.status, 
        transaksi_beli_kelas.url_bukti_bayar AS "urlBuktiBayar", 
        transaksi_beli_kelas.message, 
        transaksi_beli_kelas.accepted_by AS "acceptedBy",
        transaksi_beli_kelas.created_at AS "createdAt", 
        transaksi_beli_kelas.updated_at AS "updatedAt"
        FROM 
        transaksi_beli_kelas 
        JOIN kelas
        ON transaksi_beli_kelas.kelas_id = kelas.id 
        WHERE user_id = $1 
        AND 
        kelas_id = $2 
        AND 
        status != 'ditolak'`,
        values: [userId, kelasId]
      }

      const { rows } = await this._pool.query(query)

      return rows
    } catch (error) {
      throw new Error(`Gagal mendapatkan transaksi: ${error.message}`)
    }
  }

  async getAllTransaksiByUserId(userId, pageNumber = 1, pageSize = 20) {
    const offset = (pageNumber - 1) * pageSize

    try {
      const query = {
        text: `
        SELECT 
        transaksi_beli_kelas.id, 
        'Pembelian: ' || kelas.nama_kelas AS "namaTransaksi",
        transaksi_beli_kelas.user_id AS "userId",
        users.nama,
        transaksi_beli_kelas.kelas_id AS "kelasId", 
        kelas.harga_kelas AS "hargaKelas",
        transaksi_beli_kelas.status, 
        transaksi_beli_kelas.created_at AS "createdAt", 
        transaksi_beli_kelas.updated_at AS "updatedAt"
        FROM 
        transaksi_beli_kelas 
        JOIN kelas 
        ON transaksi_beli_kelas.kelas_id = kelas.id
        JOIN users
        ON transaksi_beli_kelas.user_id = users.id
        WHERE transaksi_beli_kelas.user_id = $3
        ORDER BY 
        transaksi_beli_kelas.updated_at DESC
        LIMIT $1 OFFSET $2`,
        values: [pageSize, offset, userId]
      }

      const { rows } = await this._pool.query(query)
      const total = await this._getAllTransaksiByUserIdTotal(userId)

      return { total, page: Number(pageNumber), rows }
    } catch (error) {
      throw new Error(`Gagal mendapatkan semua transaksi: ${error.message}`)
    }
  }

  async _getAllTransaksiByUserIdTotal(userId) {
    try {
      const query = {
        text: 'SELECT COUNT(*) AS "totalTransaksi" FROM transaksi_beli_kelas WHERE user_id = $1',
        values: [userId]
      }

      const { rows } = await this._pool.query(query)

      return Number(rows[0].totalTransaksi)
    } catch (error) {
      throw new Error(`Gagal mendapatkan total semua transaksi: ${error.message}`)
    }
  }

  async getPendingOrDitolakStatusLeft(userId) {
    try {
      const query = {
        text: "SELECT status, id FROM transaksi_beli_kelas WHERE user_id = $1 AND (status = 'pending' OR status = 'ditolak')",
        values: [userId]
      }

      const { rowCount } = await this._pool.query(query)
      return rowCount > 0
    } catch (error) {
      throw new Error(`Gagal mendapatkan status transaksi: ${error.message}`)
    }
  }

  async validateTransaksiOwner(transaksiId, userId) {
    try {
      const query = {
        text: 'SELECT * FROM transaksi_beli_kelas WHERE id = $1 AND user_id = $2',
        values: [transaksiId, userId]
      }
      const { rowCount } = await this._pool.query(query)
      if (!rowCount) {
        return false
      }
      return true
    } catch (error) {
      throw Error(`Gagal melakukan validasi owner transaksi: ${error.message}`)
    }
  }

  async validateTransaksiUserAvailability(userId, kelasId) {
    try {
      const query = {
        text: "SELECT * FROM transaksi_beli_kelas WHERE user_id = $1 AND kelas_id = $2 AND status != 'ditolak'",
        values: [userId, kelasId]
      }

      const { rowCount } = await this._pool.query(query)
      if (rowCount) {
        throw new Error(`Transaksi atas ${userId} terhadap ${kelasId} sedang berlangsung/telah berhasil, dapat mengirim kembali jika status transaksi ditolak `)
      }
    } catch (error) {
      throw new Error(`Gagal melakukan transaksi: ${error.message}`)
    }
  }

  async getAllTransaksi(pageNumber = 1, pageSize = 20, status, search = '') {
    const offset = (pageNumber - 1) * pageSize
    try {
      const query = {
        text: `
        SELECT 
        transaksi_beli_kelas.id, 
        'Pembelian: ' || kelas.nama_kelas AS "namaTransaksi",
        transaksi_beli_kelas.user_id AS "userId", 
        users.nama,
        transaksi_beli_kelas.kelas_id AS "kelasId",
        kelas.harga_kelas AS "hargaKelas", 
        transaksi_beli_kelas.status, 
        transaksi_beli_kelas.created_at AS "createdAt", 
        transaksi_beli_kelas.updated_at AS "updatedAt"
        FROM 
        transaksi_beli_kelas 
        JOIN kelas 
        ON transaksi_beli_kelas.kelas_id = kelas.id
        JOIN users
        ON transaksi_beli_kelas.user_id = users.id
        WHERE (users.nama ILIKE $3 OR users.username ILIKE $3 OR kelas.nama_kelas ILIKE $3 OR transaksi_beli_kelas.id ILIKE $3)`,
        values: [pageSize, offset, `%${search}%`]
      }
      if (status) {
        query.text += ' AND transaksi_beli_kelas.status = $4'
        query.values.push(status)
      }
      query.text += ' ORDER BY transaksi_beli_kelas.updated_at DESC LIMIT $1 OFFSET $2'
      const { rows } = await this._pool.query(query)
      const total = await this._getAllTransaksiTotal(status, search)

      return { total, page: Number(pageNumber), rows }
    } catch (error) {
      throw new Error(`Gagal mendapatkan semua transaksi: ${error.message}`)
    }
  }

  async _getAllTransaksiTotal(status, search) {
    try {
      const query = {
        text: `
        SELECT 
        COUNT(*) AS "totalTransaksi"
        FROM 
        transaksi_beli_kelas 
        JOIN kelas 
        ON transaksi_beli_kelas.kelas_id = kelas.id
        JOIN users
        ON transaksi_beli_kelas.user_id = users.id
        WHERE (users.nama ILIKE $1 OR users.username ILIKE $1 OR kelas.nama_kelas ILIKE $1 OR transaksi_beli_kelas.id ILIKE $1)`,
        values: [`%${search}%`]
      }
      if (status) {
        query.text += ' AND transaksi_beli_kelas.status = $2'
        query.values.push(status)
      }
      const { rows } = await this._pool.query(query)
      return Number(rows[0].totalTransaksi)
    } catch (error) {
      throw new Error(`Gagal mendapatkan total semua transaksi: ${error.message}`)
    }
  }

  async getAllTransaksiByDate(pageSize = 31, status = 'diterima', from, to) {
    try {
      const query = {
        text: `
        SELECT 
        transaksi_beli_kelas.id, 
        'Pembelian: ' || kelas.nama_kelas AS "namaTransaksi",
        transaksi_beli_kelas.user_id AS "userId", 
        users.nama,
        transaksi_beli_kelas.kelas_id AS "kelasId",
        kelas.harga_kelas AS "hargaKelas", 
        transaksi_beli_kelas.status, 
        transaksi_beli_kelas.created_at AS "createdAt", 
        transaksi_beli_kelas.updated_at AS "updatedAt"
        FROM 
        transaksi_beli_kelas 
        JOIN kelas 
        ON transaksi_beli_kelas.kelas_id = kelas.id
        JOIN users
        ON transaksi_beli_kelas.user_id = users.id
        WHERE 
        (transaksi_beli_kelas.updated_at >= $3 AND transaksi_beli_kelas.updated_at <= $4) 
        AND transaksi_beli_kelas.status = $2
        ORDER BY 
        transaksi_beli_kelas.updated_at ASC 
        LIMIT $1`,
        values: [pageSize, status, from, to]
      }

      const { rows } = await this._pool.query(query)
      return rows
    } catch (error) {
      throw new Error(`Gagal mendapatkan semua transaksi: ${error.message}`)
    }
  }
}

module.exports = TransaksiBeliKelasService
