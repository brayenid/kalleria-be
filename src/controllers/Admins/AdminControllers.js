const bcrypt = require('bcrypt')
const autoBind = require('auto-bind')
const { generateId } = require('../../utils/IdGenerator')

class AdminControllers {
  constructor(service) {
    this.service = service

    autoBind(this)
  }

  async addAdmin(req, res) {
    const { username, nama, password } = req.body
    const usernameReplace = username.trim().replace(/\s/g, '')
    const payload = {
      id: `admin-${generateId(12)}`,
      username: usernameReplace,
      nama,
      password: await bcrypt.hash(password, 10)
    }
    try {
      await this.service.addAccount(payload)

      res.status(201).json({
        status: 'success',
        message: 'Akun berhasil dibuat'
      })
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  }

  async patchAdminDetailInfo(req, res) {
    const { id } = req.user
    try {
      await this.service.patchAccountDetail(id, req.body)
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

  async patchAdminPassword(req, res) {
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

  async deleteAdmin(req, res) {
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
        message: error.message
      })
    }
  }

  async getAdmins(req, res) {
    const { pageSize, pageNumber, search } = req.query
    try {
      const response = await this.service.getAccounts(pageNumber, pageSize, search)
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

  async getAdminById(req, res) {
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

  async getAdminByParamsId(req, res) {
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

module.exports = AdminControllers
