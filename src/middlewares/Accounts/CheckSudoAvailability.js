const SudoService = require('../../services/SudoService')

const sudoService = new SudoService()

exports.checkSudoAvailability = async (req, res, next) => {
  const isSudoAvailable = await sudoService.getAccounts()
  if (isSudoAvailable.length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal membuat Super Admin, Super Admin sudah ada '
    })
  }
  next()
}
