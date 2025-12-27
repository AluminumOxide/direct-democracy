
const proposal_list = async function(request, reply, db, log, lib) {

 	let { limit, last, sort, order, filter } = request
	const { api_proposal, api_democracy } = lib
	try {

		// fetch from proposal service
		let props = await api_proposal.proposal_list({ limit, last, sort, order, filter })

		// fetch democracy names
		let dems = (await api_democracy.democracy_list({
			filter:{
				democracy_id:{
					op: 'IN',
					val: Array.from(new Set(props.map(k => k.democracy_id)))
				}
			}
		})).reduce((a,v) => Object.assign(a, {
			[v.democracy_id]:{id:v.democracy_id,name:v.democracy_name}
		}), {})

		// update proposal democracy id/names
		props.forEach((p,i) => {
			props[i].democracy_id = dems[p.democracy_id]
		})

		// return results
		log.info(`Proposal/List: Success`)
		return reply.code(200).send(props)

	} catch(e) {

		// handle errors
		log.error(`Proposal/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(api_proposal.errors.internal_error))
	}
}

module.exports = proposal_list
