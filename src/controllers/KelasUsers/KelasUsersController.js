const autoBind = require('auto-bind')

class KelasUsersController {
  constructor(service) {
    this.service = service

    autoBind(this)
  }

  async putKelasUser(req, res) {
    const { id } = req.params
    try {
      const isKelasUserAvailable = await this.service.getKelasUserById(id)
      if (!isKelasUserAvailable) {
        throw new Error('Gagal mengubah kelas user: Kelas user tidak ditemukan')
      }

      await this.service.putKelasUser(id, req.body)

      return res.status(200).json({
        status: 'success',
        message: 'Kelas user berhasil diubah'
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async deleteKelasUser(req, res) {
    const { id } = req.params
    try {
      const isKelasUserAvailable = await this.service.getKelasUserById(id)
      if (!isKelasUserAvailable) {
        throw new Error('Gagal mengubah kelas user: Kelas user tidak ditemukan')
      }

      await this.service.removeKelasUser(id)

      return res.status(200).json({
        status: 'success',
        message: 'Kelas user berhasil dihapus'
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async getAllKelasUsers(req, res) {
    const { pageSize, pageNumber, search } = req.query

    try {
      const response = await this.service.getKelasUsers(pageNumber, pageSize, search)

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

  async getKelasUsersByUserId(req, res) {
    const { id: userId } = req.user
    const { pageSize, pageNumber } = req.query

    try {
      const response = await this.service.getKelasUsersByUserId(pageNumber, pageSize, userId)

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

  async getKelasUserById(req, res) {
    const { id } = req.params
    const { id: userId } = req.user

    try {
      await this.service.validateKelasUserOwner(id, userId)
      const response = await this.service.getKelasUserById(id)
      return res.status(200).json({
        status: 'success',
        data: response
      })
    } catch (error) {
      return res.status(400).json({
        status: 'message',
        message: error.message
      })
    }
  }
}

module.exports = KelasUsersController
