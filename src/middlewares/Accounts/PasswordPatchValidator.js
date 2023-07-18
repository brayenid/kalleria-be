const { body, validationResult } = require('express-validator')

exports.passwordPatchValidator = [
  body('newPassword').notEmpty().isStrongPassword({ minLength: 8, minSymbols: 0, minUppercase: 1, minNumbers: 1, minLowercase: 0 }).withMessage('Password harus punya setidaknya 8 karakter, mengandung 1 huruf kapital, dan 1 angka'),
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
