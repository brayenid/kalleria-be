require('dotenv').config()

const config = {
  server: {
    port: process.env.PORT
  },
  token: {
    access: process.env.ACCESS_TOKEN_KEY,
    refresh: process.env.REFRESH_TOKEN_KEY
  },
  cookies: {
    secret: process.env.SIGNED_COOKIE,
    age: 7 * 24 * 60 * 60 * 1000 // 7days
  },
  sudo: {
    username: process.env.SUDO_USERNAME,
    password: process.env.SUDO_PASSWORD
  }
}

module.exports = config
