const { changes_invalid } = require('./errors.json')

/*
 * Verify that changes can be applied to contents
 * Input:
 * 	changes: { a: { add: { b: 1 }, update: { c: 2}, delete: ['d'] }, add: { e: 3 }, update: { f: 4 }, delete: ['g'] }
 * 	contents: { a: { c: 1, d: 2}, f: 3, g: 4 }
 * Output: boolean 
 */
const check_changes = function(changes, contents) {
	for(const change in changes) {
		if(change === 'add') {
			for(const i in changes[change]) {
				if(i in contents) {
					return false
				}
			}
		} else if(change === 'update') {
			for(const i in changes[change]) {
				if(!(i in contents)) {
					return false
				}
			}
		} else if(change === 'delete') {
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
}

/*
 * Apply changes to contents
 * Input:
 * 	changes: { a: { add: { b: 1 }, update: { c: 2}, delete: ['d'] }, add: { e: 3 }, update: { f: 4 }, delete: ['g'] }
 * 	contents: { a: { c: 1, d: 2}, f: 3, g: 4 }
 * Output: { a: { b: 1, c: 2 }, e: 3, f: 4 }
 * Error:
 * 	changes_invalid: changes cannot be applied to contents	
 */
const apply_changes = function(changes, content) {
	for(const i in changes) {
		if(i === 'add' || i === 'update') {
			for(const j in changes[i]) {
				content[j] = changes[i][j]
			}
		} else if(i === 'delete') {
			for(const j of changes[i]) {
				delete content[j]
			}
		} else {
			if(!(i in content)) {
				throw new Error(changes_invalid)
			}
			content[i] = apply_changes(changes[i], content[i])
		}
	}
	return content
}

module.exports = { check_changes, apply_changes }
