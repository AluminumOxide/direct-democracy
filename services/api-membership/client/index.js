const ApiClient = require('@aluminumoxide/direct-democracy-lib-client')
const api_client = new ApiClient('node_modules/@aluminumoxide/direct-democracy-membership-api-client/spec.json', process.env.ENV, '../direct-democracy-membership-api-client/errors.json')
module.exports = api_client
