const ApiClient = require('@aluminumoxide/openapi-3.1-client')
const api_client = new ApiClient('node_modules/@aluminumoxide/direct-democracy-proposal-api-client/spec.json', process.env.ENV)
module.exports = api_client
