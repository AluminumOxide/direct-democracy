#!/usr/bin/env node

const readline = require('node:readline/promises')
const signin = require('./signin')
const signup = require('./signup')

const run = async function () {

	const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
        })

	try {
		const op = await rl.question('enter 1 for sign in or 2 for sign up ')

		if(op === '1') {
			await signin(rl)

		} else if(op === '2') {
			await signup(rl)
		}

		rl.close()

	} catch(e) {
		console.log("sorry that didn't work ", e)
		rl.close()
	}
}

run()
