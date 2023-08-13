const winston = require('winston')

const logger = winston.createLogger({
  level: 'info', // Tingkat log minimal yang akan dicetak
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`
    })
  ),
  transports: [
    new winston.transports.Console(), // Mencetak log ke konsol
    new winston.transports.File({ filename: 'webs.log' }) // Menyimpan log ke file
  ]
})

module.exports = logger
