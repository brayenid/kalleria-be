const autoBind = require('auto-bind')
const { nanoid } = require('nanoid')
const { oldPhotosCleaner } = require('../../utils/PhotosCleaner')
const path = require('path')

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
    const id = `transaksi-${nanoid(24)}`

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

      const getUrlPath = (fullPath) => fullPath.path.split('\\').splice(6, 9).join('/')

      const urlBuktiBayar = getUrlPath(req.file)
      await this.service.patchBuktiTransaksi(idTransaksi, urlBuktiBayar)

      const destinationPath = path.resolve(__dirname, '..', '..', 'public', 'uploads', 'transaksi')
      oldPhotosCleaner({ destinationPath, urlFoto: urlBuktiBayar, photoDir: 'transaksi' })

      return res.status(200).json({
        status: 'success',
        message: 'Bukti pembayaran telah dikirim, mengunggu konfirmasi admin'
      })
    } catch (error) {
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
        const kelasUsersId = `kelasuser-${nanoid(20)}`
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
    const { pageNumber, pageSize, status } = req.query
    try {
      const response = await this.service.getAllTransaksi(pageNumber, pageSize, status)

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
}

module.exports = TransaksiBeliKelasController
