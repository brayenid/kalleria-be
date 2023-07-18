class AccountService {
  async addAccount() {
    throw new Error('ADD_ACCOUNT_METHOD_NOT_IMPLEMENTED')
  }

  async removeAccount() {
    throw new Error('REMOVE_ACCOUNT_METHOD_NOT_IMPLEMENTED')
  }

  async getAccounts() {
    throw new Error('GET_ACCOUNTS_METHOD_NOT_IMPLEMENTED')
  }

  async getAccountById() {
    throw new Error('GET_ACCOUNT_BY_ID_METHOD_NOT_IMPLEMENTED')
  }

  async getAccountByEmail() {
    throw new Error('GET_ACCOUNT_BY_EMAIL_METHOD_NOT_IMPLEMENTED')
  }

  async getAccountByUsername() {
    throw new Error('GET_ACCOUNT_BY_USERNAME_NOT_IMPLEMENTED')
  }

  async verifyAccountCredential() {
    throw new Error('VERIFIY_ACCOUNT_CREDENTIAL_NOT_IMPLEMENTED')
  }

  async activeEmailAccount() {
    throw new Error('ACTIVE_EMAIL_ACCOUNT_NOT_IMPLEMENTED')
  }
}

module.exports = AccountService
