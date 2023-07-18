const { body, validationResult } = require('express-validator')

exports.userPatchValidator = [
  body('email').notEmpty().withMessage('Email tidak boleh kosong').isEmail().withMessage('Email tidak valid'),
  body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
  body('noTelepon').notEmpty().withMessage('No telepon tidak boleh kosong').isMobilePhone().withMessage('No telepon tidak valid'),
  body('pekerjaan').notEmpty().withMessage('Pekerjaan tidak boleh kosong'),
  body('noIdentitas').notEmpty().withMessage('No identitas tidak boleh kosong'),
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
