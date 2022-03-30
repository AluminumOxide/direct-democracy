const ApiClient = require('@aluminumoxide/openapi-3.1-client')
const api_client = new ApiClient('node_modules/@aluminumoxide/direct-democracy-membership-api-client/spec.json', process.env.ENV, '../direct-democracy-membership-api-client/errors.json')
module.exports = api_client
