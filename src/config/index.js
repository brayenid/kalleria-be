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
    secret: process.env.SIGNED_COOKIE
  },
  sudo: {
    username: process.env.SUDO_USERNAME,
    password: process.env.SUDO_PASSWORD
  }
}

module.exports = config
