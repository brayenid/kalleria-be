const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const app = express()
const config = require('./config')
const router = require('./routes')
const path = require('path')

app.use(
  cors({
    origin: ['*'],
    credentials: true
  })
)
app.use(cookieParser(config.cookies.secret))
app.use(express.json())
app.use(helmet())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', router)

app.listen(config.server.port, () => {
  console.info(`Server is running on http://localhost:${config.server.port}`)
})
