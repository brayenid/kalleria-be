const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const app = express()
const config = require('./config')
const router = require('./routes')
const path = require('path')
const origin = config.env === 'dev' ? 'http://localhost:5173' : ['https://lpk.kalleriagroup.com']

app.use(
  cors({
    origin,
    credentials: true
  })
)

console.log(origin)

app.use(cookieParser(config.cookies.secret))
app.use(express.json())
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
)
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', router)

app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Anda salah alamat, endpoint ini tidak ada'
  })
})

app.listen(config.server.port, () => {
  console.info(`Server is running on http://localhost:${config.server.port}`)
})
