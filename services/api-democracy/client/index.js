const ApiClient = require('@aluminumoxide/direct-democracy-democracy-api-client')
const api_client = new ApiClient('node_modules/@aluminumoxide/direct-democracy-democracy-api-client/spec.json', process.env.ENV,'../direct-democracy-democracy-api-client/errors.json')
module.exports = api_client
