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
    const { pageSize, pageNumber, username } = req.query

    try {
      const response = await this.service.getKelasUsers(pageNumber, pageSize, username)

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

    try {
      const response = await this.service.getKelasUsersByUserId(userId)

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

module.exports = KelasUsersController
