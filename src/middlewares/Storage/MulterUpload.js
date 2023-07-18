const { multer, multerUploadProfilePhoto } = require('./MulterStorage')

const upload = multerUploadProfilePhoto.single('foto')

// MULTER WILL PROCESS THE REQ.BODY AND PASS IT TO EXPRESS-VALIDATOR AND CONTROLLER
exports.photoUpload = async (req, res, next) => {
  upload(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    } else if (error) {
      if (error.message === 'Unsupported file type!') {
        return res.status(400).json({
          status: 'fail',
          message: error.message
        })
      }
      return res.status(500).json({
        status: 'fail',
        message: error.message
      })
    }
    next()
  })
}
