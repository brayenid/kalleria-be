const TransaksiBeliKelasController = require('./TransaksiBeliKelasController')
const TransaksiBeliKelasService = require('../../services/TransaksiBeliKelasService')
const KelasService = require('../../services/KelasService')
const KelasUsersService = require('../../services/KelasUsersService')

const transaksiBeliKelasService = new TransaksiBeliKelasService()
const kelasService = new KelasService()
const kelasUsersService = new KelasUsersService()

exports.transaksiBeliKelasController = new TransaksiBeliKelasController(transaksiBeliKelasService, kelasService, kelasUsersService)
