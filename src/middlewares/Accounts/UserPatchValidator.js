const { body, validationResult } = require('express-validator')

exports.userPatchValidator = [
  body('email').notEmpty().withMessage('Email tidak boleh kosong').isEmail().withMessage('Email tidak valid'),
  body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
  body('noTelepon').notEmpty().withMessage('No telepon tidak boleh kosong').isMobilePhone().withMessage('No telepon tidak valid'),
  body('noIdentitas').notEmpty().withMessage('No identitas tidak boleh kosong'),
  body('jenisKelamin').notEmpty().withMessage('Jenis kelamin tidak boleh kosong'),
  body('tanggalLahir').notEmpty().withMessage('Tanggal lahir tidak boleh kosong'),
  body('tempatLahir').notEmpty().withMessage('Tempat lahir tidak boleh kosong'),
  body('asalSekolah').notEmpty().withMessage('Asal sekolah tidak boleh kosong'),
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
