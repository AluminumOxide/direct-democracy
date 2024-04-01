const { test_config } = require('@AluminumOxide/direct-democracy-lib-server')

const reset_test_data = function () {
 	test_config()
	return require('./.testdata.json')
}

module.exports = { reset_test_data }
