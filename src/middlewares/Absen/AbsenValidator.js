const { body, validationResult } = require('express-validator')

exports.absenValidator = [
  body('userId').notEmpty().withMessage('User ID tidak boleh kosong'),
  body('kelasId').notEmpty().withMessage('Kelas ID tidak boleh kosong'),
  body('jumlahPertemuan').isNumeric().withMessage('Jumlah pertemuan harus angka').notEmpty().withMessage('Jumlah pertemuan tidak boleh kosong'),
  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: errors.array()
      })
    }

    next()
  }
]
