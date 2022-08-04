
const get_profile_id = async function(request, log) {
	// TODO: get from auth
	const { profile_id } = request
	return profile_id
}

const get_membership_id = async function(profile_id, democracy_id, log) {
	// TODO: get membership id
	return profile_id
}


module.exports = { get_profile_id, get_membership_id }
