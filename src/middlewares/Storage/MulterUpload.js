const { multer, multerUploadProfilePhoto, multerUploadThumbnailKelas, multerUploadBuktiBayar } = require('./MulterStorage')

const uploadProfile = multerUploadProfilePhoto.single('foto')
const uploadKelasThumbnail = multerUploadThumbnailKelas.single('thumbnailKelas')
const uploadBuktiBayar = multerUploadBuktiBayar.single('buktiBayar')

// MULTER WILL PROCESS THE REQ.BODY AND PASS IT TO EXPRESS-VALIDATOR AND CONTROLLER
exports.photoUpload = async (req, res, next) => {
  uploadProfile(req, res, async (error) => {
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

exports.kelasThumbnailUpload = async (req, res, next) => {
  uploadKelasThumbnail(req, res, async (error) => {
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

exports.buktiBayarUpload = async (req, res, next) => {
  uploadBuktiBayar(req, res, async (error) => {
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
