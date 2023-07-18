class AuthController {
  async getToken() {
    throw new Error('GET_TOKEN_METHOD_NOT_IMPLEMENTED')
  }

  async putToken() {
    throw new Error('PUT_TOKEN_METHOD_NOT_IMPLEMENTED')
  }

  async removeToken() {
    throw new Error('REMOVE_TOKEN_METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = AuthController
