const bcrypt = require('bcrypt')
const { nanoid } = require('nanoid')
const autoBind = require('auto-bind')
const path = require('path')
const { oldPhotosCleaner } = require('../../utils/PhotosCleaner')

class UserController {
  constructor(service) {
    this.service = service

    autoBind(this)
  }

  async addUser(req, res) {
    const { username, nama, noIdentitas, jenisKelamin, tempatLahir, tanggalLahir, alamat, email, noTelepon, password, asalSekolah } = req.body
    const usernameReplace = username.trim().replace(/\s/g, '')
    const payload = {
      id: `user-${nanoid(12)}`,
      username: usernameReplace,
      nama,
      noIdentitas,
      jenisKelamin,
      tempatLahir,
      tanggalLahir,
      alamat,
      email,
      noTelepon,
      asalSekolah,
      password: await bcrypt.hash(password, 10)
    }
    try {
      await this.service.addAccount(payload)

      return res.status(201).json({
        status: 'success',
        message: 'Akun berhasil dibuat.'
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async patchUserDetailInfo(req, res) {
    const { id } = req.user
    try {
      const getUrlPath = (fullPath) => fullPath.path.split('\\').splice(6, 9).join('/')

      const { nama, alamat, email, noTelepon, asalSekolah, noIdentitas } = req.body
      let urlFoto
      if (req.file) {
        urlFoto = getUrlPath(req.file)
        const destinationPath = path.resolve(__dirname, '..', '..', 'public', 'uploads', 'foto')

        // HANDLE DUPLICATE USER's PHOTO AFTER UPDATE //
        oldPhotosCleaner({ destinationPath, urlFoto, photoDir: 'foto' })
      } else {
        const { url_foto } = await this.service.getAccountById(id)
        urlFoto = url_foto
      }

      const payload = {
        nama,
        alamat,
        email,
        noTelepon,
        asalSekolah,
        noIdentitas,
        urlFoto
      }

      await this.service.patchAccountDetail(id, payload)

      return res.status(200).json({
        status: 'success',
        message: 'Detail akun berhasil diubah'
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async patchUserPassword(req, res) {
    const { id, username } = req.user
    const { password, newPassword } = req.body

    try {
      await this.service.verifyAccountCredential(username, password)
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await this.service.patchAccountPassword(id, hashedPassword)

      return res.status(200).json({
        status: 'success',
        message: 'Password berhasil diubah'
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params
    try {
      await this.service.getAccountById(id)
      await this.service.removeAccount(id)
      return res.status(200).json({
        status: 'success',
        message: 'Akun berhasil dihapus'
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: `Akun gagal dihapus: ${error.message}`
      })
    }
  }

  async getUsers(req, res) {
    try {
      const response = await this.service.getAccounts()
      return res.status(200).json({
        status: 'success',
        data: [...response]
      })
    } catch (error) {
      return res.status(500).json({
        status: 'fail',
        message: 'server error'
      })
    }
  }

  async getUserById(req, res) {
    const { id } = req.user
    try {
      const data = await this.service.getAccountById(id)

      return res.status(200).json({
        status: 'success',
        data
      })
    } catch (error) {
      return res.status(403).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async getUserByParamsId(req, res) {
    const { id } = req.params

    try {
      const data = await this.service.getAccountById(id)

      return res.status(200).json({
        status: 'success',
        data
      })
    } catch (error) {
      return res.status(403).json({
        status: 'fail',
        message: error.message
      })
    }
  }
}

module.exports = UserController
