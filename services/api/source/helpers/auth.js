
const get_profile_id = async function(request, log) {
	// TODO: get from auth
	const { profile_id } = request
	return profile_id
}

const get_membership_id = async function(profile_id, democracy_id, log) {
	// TODO: get membership id
	return profile_id
}

const get_membership_ids = async function(profile_id) {
	// TODO: get membership_ids
	return [{ 
		membership_id: profile_id,
		democracy_id: 'a062d797-8b6a-499c-9d8b-9a0cdf0871bf'
	},{
		membership_id: profile_id,
		democracy_id: '51a9a676-3b1e-47eb-845b-2784ccdd1d59'
	},{
		membership_id: profile_id,
		democracy_id: '430488ba-7c63-49da-b22d-0435be67f4ef' 
	}]
}




module.exports = { get_profile_id, get_membership_id, get_membership_ids }
