const energyRequestRoute = require('./energyRequest/energyRequest')
const authRoute = require('./auth/signUp')
const cmRoute = require('./customerMatching/customerMatching')
const blockchainRoute = require('./blockchain/writeBlockchain')

module.exports = {
    energyRequestRoute,
    authRoute,
    cmRoute,
    blockchainRoute
}