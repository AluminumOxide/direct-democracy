const get_client = require('@aluminumoxide/direct-democracy-lib-client')
module.exports = get_client(require('./spec.json'), require('./errors.json'))
