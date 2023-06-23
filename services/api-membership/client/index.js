const get_client = require('@AluminumOxide/direct-democracy-lib-client')
module.exports = get_client(require('./spec.json'), require('./errors.json'))
