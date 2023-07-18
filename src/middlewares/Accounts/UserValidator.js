const { body, validationResult } = require('express-validator')
const UserService = require('../../services/UserService')

const userService = new UserService()

exports.userValidator = [
  body('username')
    .notEmpty()
    .withMessage('Username tidak boleh kosong')
    .matches(/^[a-zA-Z0-9_]*$/)
    .withMessage('Username tidak boleh mengandung karakter spesial')
    .custom(async (username) => {
      await userService.getAccountByUsername(username)
    }),
  body('email').notEmpty().withMessage('Email tidak boleh kosong').isEmail().withMessage('Email tidak valid'),
  body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
  body('noTelepon').notEmpty().withMessage('No telepon tidak boleh kosong').isMobilePhone().withMessage('No telepon tidak valid'),
  body('password').notEmpty().isStrongPassword({ minLength: 8, minSymbols: 0, minUppercase: 1, minNumbers: 1, minLowercase: 0 }).withMessage('Password harus punya setidaknya 8 karakter, mengandung 1 huruf kapital, dan 1 angka'),
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
