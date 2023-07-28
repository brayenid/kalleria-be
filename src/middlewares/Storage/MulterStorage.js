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

const storageThumbnailKelas = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.resolve(__dirname, '..', '..', 'public', 'uploads', 'kelas')
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true })
    }
    cb(null, destinationPath)
  },

  filename: (req, file, cb) => {
    const { namaKelas } = req.body
    const namaKelasWithoutSpace = namaKelas.split(' ').join('')
    const getIndexLength = file.originalname.split('.').length
    const fileExt = file.originalname.split('.')[getIndexLength - 1]

    const curretUnixTime = new Date().getTime()
    cb(null, `${file.fieldname}_${namaKelasWithoutSpace || 'unamed-class'}_${curretUnixTime}.${fileExt}`)
  }
})

const storageBuktiBayarKelas = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.resolve(__dirname, '..', '..', 'public', 'uploads', 'transaksi')
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true })
    }
    cb(null, destinationPath)
  },

  filename: (req, file, cb) => {
    const { id } = req.user
    const getIndexLength = file.originalname.split('.').length
    const fileExt = file.originalname.split('.')[getIndexLength - 1]

    const curretUnixTime = new Date().getTime()
    cb(null, `${file.fieldname}_${id}_${curretUnixTime}.${fileExt}`)
  }
})

const limits = { fileSize: 512 * 1024 } // in bytes

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

exports.multerUploadThumbnailKelas = multer({
  storage: storageThumbnailKelas,
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

exports.multerUploadBuktiBayar = multer({
  storage: storageBuktiBayarKelas,
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
