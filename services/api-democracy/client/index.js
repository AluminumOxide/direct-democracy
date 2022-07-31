const ApiClient = require('@aluminumoxide/direct-democracy-lib-client')
const api_client = new ApiClient(require('./spec.json'), process.env.ENV,'../direct-democracy-democracy-api-client/errors.json')
module.exports = api_client
