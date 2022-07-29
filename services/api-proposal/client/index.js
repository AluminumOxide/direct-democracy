const ApiClient = require('@aluminumoxide/direct-democracy-lib-client')
const api_client = new ApiClient('node_modules/@aluminumoxide/direct-democracy-proposal-api-client/spec.json', process.env.ENV, '../direct-democracy-proposal-api-client/errors.json')
module.exports = api_client
