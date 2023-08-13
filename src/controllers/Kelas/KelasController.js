const autoBind = require('auto-bind')
const path = require('path')
const { unamedThumbnailCleaner, deletePhotoByPath, oldPhotosCleaner } = require('../../utils/PhotosCleaner')
const { generateId } = require('../../utils/IdGenerator')
const logger = require('../../logs/winston')

class KelasController {
  constructor(service) {
    this.service = service

    autoBind(this)
  }

  async addKelas(req, res) {
    const { namaKelas, tipeKelas, hargaKelas, deskripsiKelas } = req.body
    const getUrlPath = (fullPath) => fullPath.path.split('\\').splice(6, 9).join('/')
    const thumbnailKelas = getUrlPath(req.file)
    logger.info(`no func = ${req.file.path.split('\\').splice(6, 9).join('/')}`)
    logger.info(`with func = ${getUrlPath(req.file)}`)

    try {
      const id = `kelas-${generateId(10)}`

      const destinationPath = path.resolve(__dirname, '..', '..', 'public', 'uploads', 'kelas')

      // HANDLE DUPLICATE/UNAMED THUMBNAIL PHOTO AFTER UPDATE //
      // oldPhotosCleaner({ destinationPath, urlFoto: thumbnailKelas, photoDir: 'kelas' })
      unamedThumbnailCleaner(destinationPath, 'kelas')

      const payload = {
        id,
        namaKelas,
        tipeKelas,
        hargaKelas,
        deskripsiKelas,
        thumbnailKelas
      }

      await this.service.addKelas(payload)

      return res.status(201).json({
        status: 'success',
        message: 'Kelas berhasil ditambahkan'
      })
    } catch (error) {
      if (req.file) {
        deletePhotoByPath(thumbnailKelas)
      }
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async putKelas(req, res) {
    const { namaKelas, tipeKelas, hargaKelas, deskripsiKelas } = req.body
    const { id } = req.params
    try {
      const { thumbnailKelas } = await this.service.getKelasById(id)
      if (!thumbnailKelas) {
        throw new Error('Kelas tidak ditemukan')
      }
      const getUrlPath = (fullPath) => fullPath.path.split('\\').splice(6, 9).join('/')

      let urlThumbnail
      if (req.file) {
        urlThumbnail = getUrlPath(req.file)
        const destinationPath = path.resolve(__dirname, '..', '..', 'public', 'uploads', 'kelas')

        // HANDLE DUPLICATE PHOTO AFTER UPDATE //
        oldPhotosCleaner({ destinationPath, urlFoto: urlThumbnail, photoDir: 'kelas' })
        unamedThumbnailCleaner(destinationPath, 'kelas')
      } else {
        urlThumbnail = thumbnailKelas
      }

      const payload = {
        namaKelas,
        tipeKelas,
        hargaKelas,
        deskripsiKelas,
        thumbnailKelas: urlThumbnail
      }

      await this.service.putKelas(id, payload)

      return res.status(200).json({
        status: 'success',
        message: 'Kelas berhasil diperbaharui'
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async deleteKelas(req, res) {
    const { id } = req.params
    try {
      const { thumbnailKelas } = await this.service.getKelasById(id)
      if (!thumbnailKelas) {
        throw new Error('Kelas tidak ditemukan')
      }
      await this.service.removeKelas(id)
      deletePhotoByPath(thumbnailKelas)

      return res.status(200).json({
        status: 'success',
        message: 'Kelas berhasil dihapus'
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async getAllKelas(req, res) {
    const { pageNumber, pageSize } = req.query
    try {
      const data = await this.service.getAllKelas(pageNumber, pageSize)
      return res.status(200).json({
        status: 'success',
        data
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async getKelasById(req, res) {
    const { id } = req.params
    try {
      const data = await this.service.getKelasById(id)

      if (!data) {
        throw new Error('Gagal mendapatkan data: Kelas tidak tersedia')
      }
      return res.status(200).json({
        status: 'success',
        data
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }
}

module.exports = KelasController
