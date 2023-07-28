const { Router } = require('express')
const router = Router()

// CONTROLLERS MODULES
const { authControllersUser } = require('../controllers/AuthUser')
const { authControllersAdmin } = require('../controllers/AuthAdmin')
const { authControllersSudo } = require('../controllers/AuthSudo')
const { userControllers } = require('../controllers/User')
const { adminController } = require('../controllers/Admins')
const { sudoController } = require('../controllers/Sudo')
const { kelasController } = require('../controllers/Kelas')
const { transaksiBeliKelasController } = require('../controllers/TransaksiBeliKelas')
const { kelasUsersController } = require('../controllers/KelasUsers')
const { absenController } = require('../controllers/Absen')

// MIDDLEWARES MODULES
const { userValidator } = require('../middlewares/Accounts/UserValidator')
const { userPatchValidator } = require('../middlewares/Accounts/UserPatchValidator')
const { adminValidator } = require('../middlewares/Accounts/AdminValidator')
const { passwordPatchValidator } = require('../middlewares/Accounts/PasswordPatchValidator')
const { photoUpload, kelasThumbnailUpload, buktiBayarUpload } = require('../middlewares/Storage/MulterUpload')
const ValidateAuth = require('../middlewares/Auth/ValidateAuth')
const { checkSudoAvailability } = require('../middlewares/Accounts/CheckSudoAvailability')
const { kelasValidator } = require('../middlewares/Kelas/KelasValidator')
const { putBuktiBayarValidator } = require('../middlewares/TransaksiBeliKelas/PutBuktiBayarValidator')
const { putKelasUserValidator } = require('../middlewares/KelasUsers/PutKelasUserValidator')
const { absenValidator } = require('../middlewares/Absen/AbsenValidator')

// SERVICES MODULES
const UserService = require('../services/UserService')
const AdminService = require('../services/AdminService')
const SudoService = require('../services/SudoService')

// SERVICE INSTANCES
const userService = new UserService()
const adminService = new AdminService()
const sudoService = new SudoService()

// MIDDLEWARES INSTANCES
const validateAuthUser = new ValidateAuth(userService)
const validateAuthAdmin = new ValidateAuth(adminService)
const validateAuthSudo = new ValidateAuth(sudoService)

// USERS ROUTES
router.post('/users', userValidator, userControllers.addUser)
router.patch('/users', validateAuthUser.validate, photoUpload, userPatchValidator, userControllers.patchUserDetailInfo)
router.delete('/users/:id', validateAuthAdmin.validate, userControllers.deleteUser)
router.patch('/users/credential', validateAuthUser.validate, passwordPatchValidator, userControllers.patchUserPassword)
router.get('/users', validateAuthAdmin.validate, userControllers.getUsers)
router.get('/users/detail', validateAuthUser.validateStrict, userControllers.getUserById)
router.get('/users/detail/:id', validateAuthAdmin.validate, userControllers.getUserByParamsId)

// ADMINS ROUTES
router.post('/admins', validateAuthSudo.validate, adminValidator, adminController.addAdmin)
router.patch('/admins', validateAuthAdmin.validate, adminController.patchAdminDetailInfo)
router.delete('/admins/:id', validateAuthSudo.validate, adminController.deleteAdmin)
router.patch('/admins/credential', validateAuthAdmin.validate, passwordPatchValidator, adminController.patchAdminPassword)
router.get('/admins', validateAuthSudo.validate, adminController.getAdmins)
router.get('/admins/detail', validateAuthAdmin.validateStrict, adminController.getAdminById)
router.get('/admins/detail/:id', validateAuthSudo.validateStrict, adminController.getAdminByParamsId)

// SUDO ROUTES
router.get('/sudo/create', checkSudoAvailability, sudoController.addSudo)
router.patch('/sudo/credential', validateAuthSudo.validate, sudoController.patchSudoPassword)
router.get('/sudo/detail', validateAuthSudo.validateStrict, sudoController.getAccountById)

// AUTH ROUTES USERS
router.post('/auth/user', authControllersUser.getToken)
router.delete('/auth/user', authControllersUser.removeToken)
router.get('/auth/user', authControllersUser.putToken)

// AUTH ROUTES ADMINS
router.post('/auth/admin', authControllersAdmin.getToken)
router.delete('/auth/admin', authControllersAdmin.removeToken)
router.get('/auth/admin', authControllersAdmin.putToken)

// AUTH ROUTES SUDO
router.post('/auth/sudo', authControllersSudo.getToken)
router.delete('/auth/sudo', authControllersSudo.removeToken)
router.get('/auth/sudo', authControllersSudo.putToken)

// KELAS ROUTES SUDO
router.post('/admins/kelas', validateAuthAdmin.validate, kelasThumbnailUpload, kelasValidator, kelasController.addKelas)
router.put('/admins/kelas/:id', validateAuthAdmin.validate, kelasThumbnailUpload, kelasValidator, kelasController.putKelas)
router.delete('/admins/kelas/:id', validateAuthAdmin.validate, kelasController.deleteKelas)
router.get('/kelas', kelasController.getAllKelas)
router.get('/kelas/:id', kelasController.getKelasById)

// TRANSAKSI BELI KELAS ROUTES
router.post('/transaksi/:kelasId', validateAuthUser.validateStrict, transaksiBeliKelasController.addTransaksiBeliKelas)
router.patch('/transaksi/:idTransaksi', validateAuthUser.validateStrict, buktiBayarUpload, transaksiBeliKelasController.patchBuktiBayarTransaksi)
router.put('/transaksi/:idTransaksi', validateAuthAdmin.validate, putBuktiBayarValidator, transaksiBeliKelasController.putStatusTransakasiBeliKelas)
router.get('/transaksi', validateAuthAdmin.validate, transaksiBeliKelasController.getAllTransaksi)
router.get('/transaksi/detail/:transaksiId', validateAuthUser.validateLoose, transaksiBeliKelasController.getTransaksiById)
router.get('/transaksi/user', validateAuthUser.validateStrict, transaksiBeliKelasController.getTransaksiByUserIdUser)
router.get('/transaksi/user/:id', validateAuthAdmin.validate, transaksiBeliKelasController.getTransaksiByUserIdAdminSudo)

// KELAS USERS ROUTES
router.put('/kelasuser/:id', validateAuthAdmin.validate, putKelasUserValidator, kelasUsersController.putKelasUser)
router.delete('/kelasuser/:id', validateAuthAdmin.validate, kelasUsersController.deleteKelasUser)
router.get('/kelasuser', validateAuthAdmin.validate, kelasUsersController.getAllKelasUsers)
router.get('/kelasuser/user', validateAuthUser.validateStrict, kelasUsersController.getKelasUsersByUserId)

// ABSEN ROUTES
router.post('/absen', validateAuthAdmin.validate, absenValidator, absenController.addAbsen)
router.get('/absen/:kelasId', validateAuthAdmin.validate, absenController.getAbsenByKelasId)

module.exports = router
