const autoBind = require('auto-bind')
const { deletePhotoByPath, oldTransaksiCleaner } = require('../../utils/PhotosCleaner')
const path = require('path')
const { generateId } = require('../../utils/IdGenerator')
const { getUrlPath } = require('../../utils/ImgHelper')

class TransaksiBeliKelasController {
  constructor(service, kelasService, kelasUsersService) {
    this.service = service
    this.kelasService = kelasService
    this.kelasUsersService = kelasUsersService

    autoBind(this)
  }

  async addTransaksiBeliKelas(req, res) {
    const { kelasId } = req.params
    const { id: userId } = req.user
    const id = `transaksi-${generateId(24)}`
    try {
      const isKelasAvailable = await this.kelasService.getKelasById(kelasId)
      if (!isKelasAvailable) {
        throw new Error('Gagal menambahkan transaksi: Kelas tidak tersedia')
      }

      await this.service.validateTransaksiUserAvailability(userId, kelasId)

      const payload = {
        id,
        userId,
        kelasId
      }
      await this.service.addTransaksi(payload)

      return res.status(201).json({
        status: 'success',
        message: 'Transaksi berhasil dibuat, silahkan selesaikan pembayaran'
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async patchBuktiBayarTransaksi(req, res) {
    const { idTransaksi } = req.params
    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'Berkas bukti pembayaran harus diunggah.'
      })
    }
    // const getUrlPath = (fullPath) => fullPath.path.split('/').splice(6, 9).join('/')
    const urlBuktiBayar = getUrlPath(req.file, 6, 9)

    try {
      const isTransaksiBeliKelasAvailable = await this.service.getTransaksiById(idTransaksi)
      if (!isTransaksiBeliKelasAvailable) {
        throw new Error('Gagal menambahkan bukti transaksi: Transaksi tidak tersedia')
      }
      if (isTransaksiBeliKelasAvailable.status === 'dibayar') {
        throw new Error('Gagal menambahkan bukti transaksi: Anda telah mengirimkan bukti, tunggu hasil pemeriksaan admin')
      }
      if (isTransaksiBeliKelasAvailable.status === 'diterima') {
        throw new Error('Gagal menambahkan bukti transaksi: Anda telah mengirimkan bukti dan diterima')
      }

      const destinationPath = path.resolve(__dirname, '..', '..', 'public', 'uploads', 'transaksi')

      await this.service.patchBuktiTransaksi(idTransaksi, urlBuktiBayar)
      oldTransaksiCleaner({ destinationPath, urlFoto: urlBuktiBayar })

      return res.status(200).json({
        status: 'success',
        message: 'Bukti pembayaran telah dikirim, mengunggu konfirmasi admin'
      })
    } catch (error) {
      deletePhotoByPath(urlBuktiBayar)
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async putStatusTransakasiBeliKelas(req, res) {
    const { idTransaksi } = req.params
    const { id: adminId } = req.user
    const { status, message, maksimalPertemuan } = req.body

    try {
      const payload = {
        adminId,
        message,
        status
      }

      const isTransaksiAvailable = await this.service.getTransaksiById(idTransaksi)
      if (!isTransaksiAvailable) {
        throw new Error('Gagal merubah status: Transaksi tidak valid')
      }

      const { kelasId, userId } = await this.service.putStatusTransakasi(idTransaksi, payload)

      const isKelasUsersAvailable = await this.kelasUsersService.checkKelasUSerAvailability(userId, kelasId)
      let responseMessage = 'Status transaksi beli kelas berhasil diubah'

      if (status === 'diterima' && isKelasUsersAvailable) {
        const kelasUsersId = `kelasuser-${generateId(20)}`
        const kelasUsersPayload = {
          id: kelasUsersId,
          userId,
          kelasId,
          maksimalPertemuan
        }
        await this.kelasUsersService.addKelasUser(kelasUsersPayload)
        responseMessage += '. Kelas telah ditambahkan ke daftar kelas yang diikuti user'
      }

      return res.status(200).json({
        status: 'success',
        message: responseMessage
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async getAllTransaksi(req, res) {
    const { pageNumber, pageSize, status, search } = req.query
    try {
      const response = await this.service.getAllTransaksi(pageNumber, pageSize, status, search)

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

  async getAllTransaksiByDate(req, res) {
    const { pageSize, status, from, to } = req.query

    try {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/
      if (!from || !to) {
        throw new Error('Gagal mendapatkan data transaksi: Harus memiliki query rentang tanggal (Mis. example.com/date?from=2023-08-01&to=2023-08-31)')
      }
      if (!datePattern.test(from) || !datePattern.test(to)) {
        throw new Error('Gagal mendapatkan data transaksi: Pola tanggal yang benar TTTT/BB/HH')
      }

      const response = await this.service.getAllTransaksiByDate(pageSize, status, from, to)

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

  async getTransaksiById(req, res) {
    const { transaksiId } = req.params
    const { id: userId, role } = req.user
    try {
      const isOwner = await this.service.validateTransaksiOwner(transaksiId, userId)
      if (!isOwner && role !== 'admin' && role !== 'sudo') {
        throw new Error('Gagal mendapatkan detail transaksi: Tidak terautorisasi')
      }

      const response = await this.service.getTransaksiById(transaksiId)

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

  async getTransaksiByUserIdUser(req, res) {
    const { id: userId } = req.user
    const { pageNumber, pageSize } = req.query

    try {
      const response = await this.service.getAllTransaksiByUserId(userId, pageNumber, pageSize)

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

  async getTransaksiByKelasAndUser(req, res) {
    const { id: userId } = req.user
    const { kelasId } = req.params

    try {
      const response = await this.service.getTransaksiByKelasAndUser(userId, kelasId)

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

  async getTransaksiByUserIdAdminSudo(req, res) {
    const { id: userId } = req.params
    const { pageNumber, pageSize } = req.query

    try {
      const response = await this.service.getAllTransaksiByUserId(userId, pageNumber, pageSize)

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

  async getPendingOrDitolakStatusLeft(req, res) {
    const { id: userId } = req.user

    try {
      const response = await this.service.getPendingOrDitolakStatusLeft(userId)

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

module.exports = TransaksiBeliKelasController
