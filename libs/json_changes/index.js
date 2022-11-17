const { changes_invalid } = require('./errors.json')

/*
 * Verify that changes can be applied to contents
 * Input:
 * 	changes: { _add:{}, _update:{}, _delete:[] }
 * 	contents: object || array || string || number
 * Output: boolean 
 */
const check_changes = function(changes, contents) {
	if(Object.keys(changes).length === 0) { return false }
	if(Array.isArray(contents)) {
		// changes: { _add: { 0:'d', 3:'e' }, _delete: ['b'] }
		// content: ['a','b','c']
		for(const change in changes) {
			if(change === '_add') {
				const mlen = contents.length + Object.keys(changes[change]).length
				for(const i in changes[change]) {
					let j = parseInt(i)
					if(isNaN(j) || j < 0 || j > mlen) {
						return false
					}
				}
			} else if(change === '_delete') {
				for(const i of changes[change]) {
					if(contents.indexOf(i) < 0) {
						return false
					}
				}
			} else {
				return false
			}
		}
		return true
	} else if(typeof(contents) === 'object') {
 		// changes: { a: { _add: { b: 1 }, _update: { c: 2}, _delete: ['d'] }, _add: { e: 3 }, _update: { f: 4 }, _delete: ['g'] }
 		// contents: { a: { c: 1, d: 2}, f: 3, g: 4 }
		for(const change in changes) {
			if(change === '_add') {
				for(const i in changes[change]) {
					if(i in contents) {
						return false
					}
				}
			} else if(change === '_update') {
				for(const i in changes[change]) {
					if(!(i in contents)) {
						return false
					}
				}
			} else if(change === '_delete') {
				for(const i of changes[change]) {
					if(!(i in contents)) {
						return false
					}
				}
			} else if(change in contents) {
				if(!check_changes(changes[change], contents[change])) {
					return false
				}
			} else {
				return false
			}
		}
		return true
	} else {
		// changes: { _update: { field: value } }
		// content: 'asdf' or 123
		return Object.keys(changes).toString() === '_update'
			&& Object.keys(changes['_update']).length === 1
			&& typeof(Object.values(changes['_update'])[0]) === typeof(contents)
	}
}

/*
 * Apply changes to contents
 * Input:
 * 	changes: { _add:{}, _update:{}, _delete:[] }
 * 	contents: object || array || string || number
 * Output: same as contents
 * Error:
 * 	changes_invalid: changes cannot be applied to contents	
 */
const apply_changes = function(changes, contents) {
	if(!check_changes(changes, contents)) {
		throw new Error(changes_invalid)
	}
	if(Array.isArray(contents)) {
		// changes: { _add: { 0:'d', 3:'e' }, _delete: ['b'] }
		// content: ['a','b','c']
		// 	=> ['d','a','e','c']
		if('_add' in changes) {
			for(const i in changes['_add']) {
				let j = parseInt(i)
				if(isNaN(j) || j < 0) {
					throw new Error(changes_invalid)
				}
				contents.splice(j, 0, changes['_add'][i])
			}
		}
		if('_delete' in changes) {
			for(const i of changes['_delete']) {
				let j = contents.indexOf(i)
				if(j < 0) {
					throw new Error(changes_invalid)
				}
				contents.splice(j, 1)
			}
		}

	} else if(typeof(contents) === 'object') {
 		// changes: { a: { _add: { b: 1 }, _update: { c: 2}, _delete: ['d'] }, _add: { e: 3 }, _update: { f: 4 }, _delete: ['g'] }
 		// contents: { a: { c: 1, d: 2}, f: 3, g: 4 }
		// 	=> { a: { b: 1, c: 2 }, e: 3, f: 4 }
		for(const i in changes) {
			if(i === '_add') {
				for(const j in changes[i]) {
					if(j in contents) {
						throw new Error(changes_invalid)
					} else {
						contents[j] = changes[i][j]
					}
				}
			} else if(i === '_update') {
				for(const j in changes[i]) {
					if(j in contents) {
						contents[j] = changes[i][j]
					} else {
						throw new Error(changes_invalid)
					}
				}
			} else if(i === '_delete') {
				for(const j of changes[i]) {
					if(j in contents) {
						delete contents[j]
					} else {
						throw new Error(changes_invalid)
					}
				}
			} else {
				if(!(i in contents)) {
					throw new Error(changes_invalid)
				}
				contents[i] = apply_changes(changes[i], contents[i])
			}
		}

	} else {
		// changes: { _update: { field: value } }
		// content: 'asdf' or 123
		// 	=> value
		if('_update' in changes && Object.keys(changes['_update']).length === 1) {
			contents = Object.values(changes['_update'])[0]
		} else {
			throw new Error(changes_invalid)
		}
	}
	return contents
}

module.exports = { check_changes, apply_changes }
