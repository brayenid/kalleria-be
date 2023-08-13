const config = require('../config')
exports.getUrlPath = (fullPath, start, end) => {
  if (config.env === 'dev') {
    return fullPath.path.split('\\').splice(start, end).join('/')
  } else {
    return fullPath.path.split('/').splice(start, end).join('/')
  }
}
