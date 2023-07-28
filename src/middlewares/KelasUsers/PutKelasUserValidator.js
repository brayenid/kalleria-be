const { body, validationResult } = require('express-validator')

exports.putKelasUserValidator = [
  body('maksimalPertemuan').isNumeric().withMessage('Maksimal pertemuan harus dalam bentuk angka').notEmpty().withMessage('Maksimal pertemuan tidak boleh kosong'),
  body('presensi').isNumeric().withMessage('Presensi harus dalam bentuk angka').notEmpty().withMessage('Presensi tidak boleh kosong'),
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
