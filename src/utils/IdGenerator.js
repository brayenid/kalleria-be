const { customAlphabet } = require('nanoid')

exports.generateId = (number) => {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', number)
  return nanoid()
}
