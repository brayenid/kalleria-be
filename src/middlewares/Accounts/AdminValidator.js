const { body, validationResult } = require('express-validator')
const AdminService = require('../../services/AdminService')

const adminService = new AdminService()

exports.adminValidator = [
  body('username')
    .notEmpty()
    .withMessage('Username tidak boleh kosong')
    .matches(/^[a-zA-Z0-9_]*$/)
    .withMessage('Username tidak boleh mengandung karakter spesial')
    .custom(async (username) => {
      await adminService.getAccountByUsername(username)
    }),
  body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
  body('password').notEmpty().isStrongPassword({ minLength: 8, minSymbols: 0, minUppercase: 1, minNumbers: 1, minLowercase: 0 }).withMessage('Password harus punya setidaknya 8 karakter, mengandung 1 huruf kapital, dan 1 angka'),
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
