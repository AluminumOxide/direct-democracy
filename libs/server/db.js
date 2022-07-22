const pageQuery = async function(limit=100, last, sort='date_updated', order='ASC', filter={}, subquery) {

	let query = this.select('*')
		.from(subquery.as('t1'))
		.limit(limit)
		.orderBy(sort, order)

	for (const field in filter) {
		const op = filter[field]['op']
		const val = filter[field]['val']
		if(op === 'IN') {
			query.whereIn(field, val)
		} else if(op === 'NOT IN') {
			query.whereNotIn(field, val)
		} else if(op === '=') {
			if(val === null) {
				query.whereNull(field)
			} else {
				query.where(field, val)
			}
		} else if(op === '!=') {
			if(val === null) {
				query.whereNotNull(field)
			} else {
				query.whereNot(field, val)
			}
		} else {
			query.where(field, op, val)
		}
	}

	if(last) {
		query.andWhere(sort, order === 'ASC' ? '>' : '<', last)
	}

	return await query
}

module.exports = { pageQuery }
