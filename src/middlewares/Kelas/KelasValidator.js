const { body, validationResult } = require('express-validator')

exports.kelasValidator = [
  body('namaKelas').notEmpty().withMessage('Nama kelas tidak boleh kosong'),
  body('tipeKelas').notEmpty().withMessage('Tipe kelas tidak boleh kosong'),
  body('hargaKelas').notEmpty().withMessage('Harga kelas tidak boleh kosong'),
  body('deskripsiKelas').notEmpty().withMessage('Deskripsi kelas tidak boleh kosong'),
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
