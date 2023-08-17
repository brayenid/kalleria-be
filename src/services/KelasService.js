const { Pool } = require('pg')

class KelasService {
  constructor() {
    this._pool = new Pool()
  }

  async addKelas(payload) {
    const { id, namaKelas, tipeKelas, hargaKelas, deskripsiKelas, thumbnailKelas } = payload
    const currentTime = new Date()

    try {
      const query = {
        text: 'INSERT INTO kelas (id, nama_kelas, tipe_kelas, harga_kelas, deskripsi_kelas, thumbnail_kelas, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id',
        values: [id, namaKelas, tipeKelas, hargaKelas, deskripsiKelas, thumbnailKelas, currentTime]
      }
      const { rows } = await this._pool.query(query)

      return rows[0]
    } catch (error) {
      throw new Error(`Gagal menambahkan kelas: ${error.message}`)
    }
  }

  async putKelas(id, payload) {
    const { namaKelas, tipeKelas, hargaKelas, deskripsiKelas, thumbnailKelas } = payload
    const currentTime = new Date()

    try {
      const query = {
        text: 'UPDATE kelas SET nama_kelas = $1, tipe_kelas = $2, harga_kelas = $3, deskripsi_kelas = $4, thumbnail_kelas = $5, updated_at = $6 WHERE id = $7',
        values: [namaKelas, tipeKelas, hargaKelas, deskripsiKelas, thumbnailKelas, currentTime, id]
      }
      await this._pool.query(query)
    } catch (error) {
      throw new Error(`Gagal mengubah kelas: ${error.message}`)
    }
  }

  async removeKelas(id) {
    try {
      const query = {
        text: 'DELETE FROM kelas WHERE id = $1',
        values: [id]
      }
      await this._pool.query(query)
    } catch (error) {
      throw new Error(`Gagal menghapus kelas: ${error.message}`)
    }
  }

  async getAllKelas(pageNumber = 1, pageSize = 10, search = '') {
    const offset = (pageNumber - 1) * pageSize
    try {
      const query = {
        text: `
        SELECT 
        id, 
        nama_kelas AS "namaKelas", 
        tipe_kelas AS "tipeKelas", 
        harga_kelas AS "hargaKelas", 
        thumbnail_kelas AS "thumbnailKelas" 
        FROM 
        kelas
        WHERE nama_kelas ILIKE $3 OR tipe_kelas ILIKE $3
        ORDER BY
        updated_at DESC
        LIMIT $1 OFFSET $2`,
        values: [pageSize, offset, `%${search}%`]
      }
      const { rows } = await this._pool.query(query)
      const total = await this._getAllKelasTotal(search)
      return {
        total,
        rows
      }
    } catch (error) {
      throw new Error(`Gagal mendapatkan semua kelas: ${error.message}`)
    }
  }

  async _getAllKelasTotal(search) {
    const query = {
      text: `
      SELECT COUNT(*) AS "totalKelas" 
      FROM kelas 
      WHERE nama_kelas ILIKE $1 OR tipe_kelas ILIKE $1`,
      values: [`%${search}%`]
    }
    const { rows } = await this._pool.query(query)

    return Number(rows[0].totalKelas)
  }

  async getKelasById(id) {
    try {
      const query = {
        text: `
        SELECT 
        id, 
        nama_kelas AS "namaKelas", 
        tipe_kelas AS "tipeKelas", 
        harga_kelas AS "hargaKelas", 
        thumbnail_kelas AS "thumbnailKelas", 
        deskripsi_kelas AS "deskripsiKelas",
        updated_at AS "updatedAt" 
        FROM kelas WHERE id = $1`,
        values: [id]
      }
      const { rows } = await this._pool.query(query)

      return rows[0]
    } catch (error) {
      throw new Error(`Gagal mendapatkan detail kelas: ${error.message}`)
    }
  }
}

module.exports = KelasService
