module.exports = {
	membership_list: require('./membership/list'),
	membership_read: require('./membership/read'),
	membership_create: require('./membership/create'),
	membership_delete: require('./membership/delete'),
	membership_verify: require('./membership/verify'),
	membership_unverify: require('./membership/unverify'),
	membership_population: require('./membership/population'),
	democracy_members: require('./membership/democracy')
}
