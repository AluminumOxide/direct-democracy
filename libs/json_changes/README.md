# Usage

## Data Format

### Content
`content` is a tree, represented by a json object.

### Changes
`changes` is a tree, represented by a json object, where all leaves have only the following nodes:
* `add`: { key_to_add: new_key_value }
* `update`: { key_to_update: updated_key_value }
* `delete`: [ key_to_delete ]
`changes` tree structure should mirror content structure. However, if there are no changes for a branch, it needn't be included in `changes`.

## Check Changes
```
const json_changes = require('@aluminumoxide/direct-democracy-lib-json-changes')
const can_apply = check_changes({ a: { add: { b: 1 }, update: { c: 2}, delete: ['d'] }, add: { e: 3 }, update: { f: 4 }, delete: ['g'] }, { a: { c: 1, d: 2}, f: 3, g: 4 })
// can_apply should be true
```

## Apply Changes
```
const json_changes = require('@aluminumoxide/direct-democracy-lib-json-changes')
try {
	const update_content = json_changes.apply_changes({ a: { add: { b: 1 }, update: { c: 2}, delete: ['d'] }, add: { e: 3 }, update: { f: 4 }, delete: ['g'] }, { a: { c: 1, d: 2}, f: 3, g: 4 })
	// update_content is now { a: { b: 1, c: 2 }, e: 3, f: 4 }
} catch(e) {
	if(e.message === json_changes.error.changes_invalid) {
		...
	}
}
```
