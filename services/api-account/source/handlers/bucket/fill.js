const { bucket_dne, internal_error } = require('../../errors.json')

const fill_bucket = async function(request, reply, db, log) {

	const { bucket, tokens } = request

	try {
		// check bucket
		if(bucket != 'account' && bucket != 'email') {
			log.warn(`Bucket/Fill: Failure: ${bucket} Error: Bucket DNE`)
			return reply.code(400).send(new Error(bucket_dne))
		}

		// insert tokens
		await db('token').insert(tokens.map(token => { return { bucket, token } }))

		// return success
		log.info(`Fill/Buckets: Success: ${bucket} ${tokens.length}`)
		return reply.code(200).send()
	
	// handle errors
	} catch(e) {
		log.error(`Fill/Buckets: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

}

module.exports = fill_bucket
