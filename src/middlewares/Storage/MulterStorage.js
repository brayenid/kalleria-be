const multer = require('multer')
const fs = require('fs')
const path = require('path')

const storageProfilePhoto = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.resolve(__dirname, '..', '..', 'public', 'uploads', 'foto')
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true })
    }
    cb(null, destinationPath)
  },

  filename: (req, file, cb) => {
    const getIndexLength = file.originalname.split('.').length
    const fileExt = file.originalname.split('.')[getIndexLength - 1]

    const curretUnixTime = new Date().getTime()
    cb(null, `${file.fieldname}_${req.user.username}_${curretUnixTime}.${fileExt}`)
  }
})

const limits = { fileSize: 1 * 1024 * 1024 } // in mb

exports.multerUploadProfilePhoto = multer({
  storage: storageProfilePhoto,
  limits,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.JPG' && ext !== '.JPEG' && ext !== '.PNG') {
      cb(new Error('Tipe file tidak didukung, hanya menerima jpg, jpeg, dan png'), false)
      return
    }
    cb(null, true)
  }
})

exports.multer = multer
