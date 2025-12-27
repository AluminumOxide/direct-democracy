module.exports = {
	democracy_list: require('./democracy/list'),
	democracy_read: require('./democracy/read'),
	proposal_list: require('./proposal/list'),
	proposal_read: require('./proposal/read'),
	membership_list: require('./membership/list'),
	membership_create: require('./membership/create'),
	membership_read: require('./membership/read'),
	membership_delete: require('./membership/delete'),
	proposal_my_list: require('./proposal/my_list'),
	proposal_create: require('./proposal/create'),
	proposal_my_read: require('./proposal/my_read'),
	proposal_delete: require('./proposal/delete'),
	ballot_my_list: require('./ballot/my_list'),
	ballot_create: require('./ballot/create'),
	ballot_my_read: require('./ballot/my_read'),
	ballot_update: require('./ballot/update'),
	ballot_delete: require('./ballot/delete')
}
