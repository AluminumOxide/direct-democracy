const json_changes = require('./index.js')
const { changes_invalid } = require('./errors.json')

const tests = function() {
	let changes, content
	
	/*** check_changes ***/
	
	// check valid string changes
	content = 'asdf'
	changes = { '_update': { 'whatever': 'test' } }
	assert('check_changes', 'valid string', changes, content)
	
	// check invalid string changes
	changes = { }
	assert('check_changes', 'invalid string changes - empty', changes, content, false)

	changes = { '_update': { 'whatever': ['a','b'] } }
	assert('check_changes', 'invalid string changes - bad type', changes, content, false)

	changes = { 'a':'b', '_update': { 'whatever': 'test' } }
	assert('check_changes', 'invalid string changes - extras', changes, content, false)

	changes = { '_update': { 'a':'b', 'whatever': 'test' } }
	assert('check_changes', 'invalid string changes - more extras', changes, content, false)
	
	// check valid number changes
	content = 123
	changes = { '_update': { 'whatever': 456 } }
	assert('check_changes', 'valid number', changes, content)
	
	// check invalid number changes
	changes = { }
	assert('check_changes', 'invalid number changes - empty', changes, content, false)

	changes = { '_update': { 'whatever': [1,2] } }
	assert('check_changes', 'invalid number changes - bad type', changes, content, false)

	changes = { 'a':'b', '_update': { 'whatever': 456 } }
	assert('check_changes', 'invalid number changes - extras', changes, content, false)

	changes = { '_update': { 'a':'b', 'whatever': 456 } }
	assert('check_changes', 'invalid number changes - more extras', changes, content, false)
	
	// check valid array changes
	content = ['a','b','c']
	changes = { '_add': { 0:'d', 3:'e' }, '_delete': ['b'] }
	assert('check_changes', 'valid array', changes, content)

	// check invalid array changes
	changes = {}
	assert('check_changes', 'invalid array changes - empty', changes, content, false)

	changes = { '_update': { 0: 'd' }}
	assert('check_changes', 'invalid array changes - update', changes, content, false)

	changes = { 'a':'b', '_add':{ 0:'d', 3:'e' }, '_delete':['b']}
	assert('check_changes', 'invalid array changes - extras', changes, content, false)

	changes = { '_add':{ 0:'d', 3:'e' }, '_delete':['x']}
	assert('check_changes', 'invalid array changes - missing delete', changes, content, false)

	changes = { 'a':'b', '_add':{ '-1':'d', 3:'e' }, '_delete':['b']}	
	assert('check_changes', 'invalid array changes - negative add', changes, content, false)

	changes = { 'a':'b', '_add':{ 'a':'d', 3:'e' }, '_delete':['b']}
	assert('check_changes', 'invalid array changes - alpha add', changes, content, false)

	// check valid object changes
	content = { a: { c: 1, d: 2}, f: 3, g: 4 } 
	changes = { a: { '_add': { b: 1 }, '_update': { c: 2}, '_delete': ['d'] }, '_add': { e: 3 }, '_update': { f: 4 }, '_delete': ['g'] } 
	assert('check_changes', 'valid object', changes, content)

	// check invalid object changes
	changes = {}
	assert('check_changes', 'invalid object changes - empty', changes, content, false)

	changes = { '_add': { f: 1 } }
	assert('check_changes', 'invalid object changes - add existing', changes, content, false)

	changes = { '_update': { x: 2 } }
	assert('check_changes', 'invalid object changes - update non-existing', changes, content, false)

	changes = { '_delete': ['x'] }
	assert('check_changes', 'invalid object changes - delete non-existing', changes, content, false)

	changes = { x: { '_add': { y: 3 } }}
	assert('check_changes', 'invalid object changes - invalid sub-object', changes, content, false)
	
	/*** apply_changes ***/
	
	// apply valid string changes
	content = 'asdf'
	changes = { '_update': { 'whatever': 'test' } }
	expected = 'test'
	assert('apply_changes', 'valid string', changes, content, expected)

	// apply invalid string changes
	changes = { }
	assert('apply_changes', 'invalid string changes - empty', changes, content, changes_invalid, true)

	changes = { '_update': { 'whatever': ['a','b'] } }
	assert('apply_changes', 'invalid string changes - bad type', changes, content, changes_invalid, true)

	changes = { 'a':'b', '_update': { 'whatever': 'test' } }
	assert('apply_changes', 'invalid string changes - extras', changes, content, changes_invalid, true)

	changes = { '_update': { 'a':'b', 'whatever': 'test' } }
	assert('apply_changes', 'invalid string changes - more extras', changes, content, changes_invalid, true)

	// apply valid number changes
	content = 123
	changes = { '_update': { 'whatever': 456 } }
	expected = 456
	assert('apply_changes', 'valid number', changes, content, expected)
	
	// check invalid number changes
	changes = { }
	assert('apply_changes', 'invalid number changes - empty', changes, content, changes_invalid, true)

	changes = { '_update': { 'whatever': [1,2] } }
	assert('apply_changes', 'invalid number changes - bad type', changes, content, changes_invalid, true)

	changes = { 'a':'b', '_update': { 'whatever': 456 } }
	assert('apply_changes', 'invalid number changes - extras', changes, content, changes_invalid, true)

	changes = { '_update': { 'a':'b', 'whatever': 456 } }
	assert('apply_changes', 'invalid number changes - more extras', changes, content, changes_invalid, true)

	// apply valid array changes
	changes = { '_add': { 0:'d', 3:'e' }, '_delete': ['b'] }
	content = ['a','b','c']
	expected = ['d','a','e','c']
	assert('apply_changes', 'valid array', changes, content, expected)
	
	// apply invalid array changes
	changes = {}
	assert('apply_changes', 'invalid array changes - empty', changes, content, changes_invalid, true)

	changes = { '_update': { 0: 'd' }}
	assert('apply_changes', 'invalid array changes - update', changes, content, changes_invalid, true)

	changes = { 'a':'b', '_add':{ 0:'d', 3:'e' }, '_delete':['b']}
	assert('apply_changes', 'invalid array changes - extras', changes, content, changes_invalid, true)

	changes = { '_add':{ 0:'d', 3:'e' }, '_delete':['x']}
	assert('apply_changes', 'invalid array changes - missing delete', changes, content, changes_invalid, true)

	changes = { 'a':'b', '_add':{ '-1':'d', 3:'e' }, '_delete':['b']}	
	assert('apply_changes', 'invalid array changes - negative add', changes, content, changes_invalid, true)

	changes = { 'a':'b', '_add':{ 'a':'d', 3:'e' }, '_delete':['b']}
	assert('apply_changes', 'invalid array changes - alpha add', changes, content, changes_invalid, true)

	// apply valid object changes
	content = { a: { c: 1, d: 2}, f: 3, g: 4 } 
	changes = { a: { '_add': { b: 1 }, '_update': { c: 2}, '_delete': ['d'] }, '_add': { e: 3 }, '_update': { f: 4 }, '_delete': ['g'] } 
	expected = { a: { c: 2, b: 1 }, f: 4, e: 3 }
	assert('apply_changes', 'valid object', changes, content, expected)
	
	// apply invalid object changes
	changes = {}
	assert('apply_changes', 'invalid object changes - empty', changes, content, changes_invalid, true)

	changes = { '_add': { f: 1 } }
	assert('apply_changes', 'invalid object changes - add existing', changes, content, changes_invalid, true)

	changes = { '_update': { x: 2 } }
	assert('apply_changes', 'invalid object changes - update non-existing', changes, content, changes_invalid, true)

	changes = { '_delete': ['x'] }
	assert('apply_changes', 'invalid object changes - delete non-existing', changes, content, changes_invalid, true)

	changes = { x: { '_add': { y: 3 } }}
	assert('apply_changes', 'invalid object changes - invalid sub-object', changes, content, changes_invalid, true)
}

/*** helper ***/
const assert = function(fxn, tst, chg, cnts, exp, err) {
	let act
	try {
		act = json_changes[fxn](chg, JSON.parse(JSON.stringify(cnts)))
	} catch(e) {
		if(!err) {
			console.assert(false, `${fxn}: ${tst} - expected no error but received error: ${e.message}`)
		} else {
			console.assert(e.message === exp, `${fxn}: ${tst} - expected error: ${exp} received error: ${e.message}`)
		}
		return
	}
	if(!err) {
		if(Array.isArray(exp)) {
			console.assert(exp.every((v,i) => v === act[i]), `${fxn}: ${tst} - expected: ${exp} received: ${act}`)
		} else if(typeof(exp) === 'object') {
			console.assert(exp.toString() === act.toString(), `${fxn}: ${tst} - expected: ${exp} received: ${act}`)
		} else if(exp == null) {
			console.assert(act, `${fxn}: ${tst} - expected: true received: ${act}`)
		} else {
			console.assert(exp === act, `${fxn}: ${tst} - expected: ${exp} received: ${act}`)
		}
	} else {
		console.assert(false, `${fxn}: ${tst} - expected error: ${exp} received no error`)
	}
}

tests()
