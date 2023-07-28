const autoBind = require('auto-bind')
const { nanoid } = require('nanoid')

class AbsenController {
  constructor(service, kelasUserService) {
    this.service = service
    this.kelasUserService = kelasUserService

    autoBind(this)
  }

  async addAbsen(req, res) {
    const { id: admin } = req.user
    const { userId, kelasId, jumlahPertemuan } = req.body
    const id = `absen-${nanoid(44)}`

    const absenPayload = {
      id,
      userId,
      kelasId,
      jumlahPertemuan,
      admin
    }

    const kelasUserPayload = {
      kelasId,
      userId
    }

    try {
      await this.kelasUserService.validateKelasUser(userId, kelasId)
      await this.kelasUserService.validatePresensiNotExceeded(userId, kelasId, jumlahPertemuan)
      await this.service.validateUserTodaysPresensi(kelasId, userId)

      const { namaUser, namaKelas } = await this.service.addAbsen(absenPayload)
      await this.kelasUserService.patchKelasUserPresensi(kelasUserPayload, jumlahPertemuan)

      return res.status(201).json({
        status: 'success',
        message: `${namaUser} berhasil mengisi presensi untuk ${namaKelas}`
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async getAbsenByKelasId(req, res) {
    const { date } = req.query
    const { kelasId } = req.params

    try {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/
      if (date && !datePattern.test(date)) {
        throw new Error('Gagal mendapatkan data absen: Pola tanggal yang benar TTTT/BB/HH')
      }
      const response = await this.service.getAbsenByKelasId(kelasId, date)

      return res.status(200).json({
        status: 'success',
        data: response
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }
}

module.exports = AbsenController
