const bcrypt = require('bcrypt')
const { nanoid } = require('nanoid')
const autoBind = require('auto-bind')
const config = require('../../config')

class SudoController {
  constructor(service) {
    this.service = service

    autoBind(this)
  }

  async addSudo(req, res) {
    const payload = {
      id: `sudo-${nanoid(12)}`,
      username: config.sudo.username,
      nama: config.sudo.username,
      password: await bcrypt.hash(config.sudo.password, 10)
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

  async patchSudoPassword(req, res) {
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

  async getAccountById(req, res) {
    const { id } = req.user
    try {
      const data = await this.service.getAccountById(id)
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

module.exports = SudoController
