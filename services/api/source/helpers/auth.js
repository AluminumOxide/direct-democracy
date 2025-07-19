
const validate_jwt = async function(jwt) {
	// TODO: validate jwt
	return JSON.parse(jwt).profile_id
}

module.exports = { validate_jwt }
