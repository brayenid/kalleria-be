const config = require('./')

exports.cookieOptRefresh = () => {
  if (config.env === 'dev') {
    return {
      domain: 'localhost',
      httpOnly: true,
      signed: true,
      maxAge: config.cookies.age
    }
  } else {
    return {
      domain: '.kalleriagroup.com',
      httpOnly: true,
      signed: true,
      maxAge: config.cookies.age,
      secure: true,
      sameSite: 'none'
    }
  }
}

exports.cookieOptRole = () => {
  if (config.env === 'dev') {
    return {
      domain: 'localhost',
      maxAge: config.cookies.age
    }
  } else {
    return {
      domain: '.kalleriagroup.com',
      maxAge: config.cookies.age,
      secure: true,
      sameSite: 'none'
    }
  }
}

exports.clearCookieOpt = () => {
  if (config.env === 'dev') {
    return {
      domain: 'localhost'
    }
  } else {
    return {
      domain: '.kalleriagroup.com'
    }
  }
}
