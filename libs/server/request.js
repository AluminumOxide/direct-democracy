const querystring = require('querystring')

const reqData = function(request) {
	const data = { ...request.params, ...request.body, ...request.query }
	return data
}

const queryParser = (str) => {
	let query = querystring.parse(str)
	for (field of Object.keys(query)) {
		const val = query[field]
		if(!isNaN(val)) {
			query[field] = Number(val)
		}
		if(val[0] === '{' && val[val.length-1] === '}') {
			query[field] = JSON.parse(val)
		}
	}
	return query
}

module.exports = { reqData, queryParser }
