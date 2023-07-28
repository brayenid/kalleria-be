const { body, validationResult } = require('express-validator')

exports.putBuktiBayarValidator = [
  body('status').notEmpty().withMessage('Status tidak boleh kosong (pending, dibayar, diterima, ditolak)'),
  body('maksimalPertemuan').isNumeric().withMessage('Maksimal pertemuan haruslah angka'),
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
