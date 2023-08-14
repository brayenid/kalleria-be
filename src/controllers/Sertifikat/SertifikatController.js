const autoBind = require('auto-bind')
const { generateId } = require('../../utils/IdGenerator')

class SertifikatController {
  constructor(service, kelasUserService) {
    this.service = service
    this.kelasUserService = kelasUserService

    autoBind(this)
  }

  async addSertifikat(req, res) {
    const { id: kelasUserId } = req.params
    const id = generateId(50)
    try {
      const { id: userId, role } = req.user
      if (role !== 'sudo' && role !== 'admin') {
        await this.kelasUserService.validateKelasUserOwner(kelasUserId, userId)
      }
      await this.kelasUserService.validateUserGraduated(kelasUserId)
      await this.service.validateSertifikatAvailability(kelasUserId)
      await this.service.addSertifikat(id, kelasUserId)

      return res.status(201).json({
        status: 'success',
        message: 'Sertifikat berhasil diklaim'
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async getSertifikatByUserId(req, res) {
    const { id: userId } = req.user
    const { pageSize, pageNumber } = req.query

    try {
      const response = await this.service.getSertifikatUserId(userId, pageSize, pageNumber)

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

  async getSertifikatByUserIdAndKelasId(req, res) {
    const { id: userId } = req.user
    const { kelasUserId } = req.params
    try {
      const response = await this.service.getSertifikatByUserAndKelasUser(userId, kelasUserId)

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

  async getSertifikatById(req, res) {
    const { id } = req.params
    try {
      const response = await this.service.getSertifikatById(id)

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

  async getSertifikat(req, res) {
    const { pageNumber, pageSize, search } = req.query
    try {
      const response = await this.service.getSertifikat(search, pageSize, pageNumber)

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

module.exports = SertifikatController
