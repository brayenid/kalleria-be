const { Router } = require('express')
const router = Router()

// CONTROLLERS MODULES
const { authControllersUser } = require('../controllers/AuthUser')
const { authControllersAdmin } = require('../controllers/AuthAdmin')
const { authControllersSudo } = require('../controllers/AuthSudo')
const { userControllers } = require('../controllers/User')
const { adminController } = require('../controllers/Admins')
const { sudoController } = require('../controllers/Sudo')

// MIDDLEWARES MODULES
const { userValidator } = require('../middlewares/Accounts/UserValidator')
const { userPatchValidator } = require('../middlewares/Accounts/UserPatchValidator')
const { adminValidator } = require('../middlewares/Accounts/AdminValidator')
const { passwordPatchValidator } = require('../middlewares/Accounts/PasswordPatchValidator')
const { photoUpload } = require('../middlewares/Storage/MulterUpload')
const ValidateAuth = require('../middlewares/Auth/ValidateAuth')

// SERVICES MODULES
const UserService = require('../services/UserService')
const AdminService = require('../services/AdminService')
const SudoService = require('../services/SudoService')
const { checkSudoAvailability } = require('../middlewares/Accounts/CheckSudoAvailability')

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

// ADMINS ROUTES
router.post('/admins', validateAuthSudo.validate, adminValidator, adminController.addAdmin)
router.patch('/admins', validateAuthAdmin.validate, adminController.patchAdminDetailInfo)
router.delete('/admins/:id', validateAuthSudo.validate, adminController.deleteAdmin)
router.patch('/admins/credential', validateAuthAdmin.validate, passwordPatchValidator, adminController.patchAdminPassword)

// SUDO ROUTES
router.get('/sudo/create', checkSudoAvailability, sudoController.addSudo)
router.patch('/sudo/credential', validateAuthSudo.validate, sudoController.patchSudoPassword)

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

module.exports = router
