const obj_get = function(obj, keys) {
	let ptr = obj
	keys.map((k) => {
		if(Object.keys(ptr).indexOf(k) < 0) {
			ptr[k] = {}
		}
		ptr = ptr[k]
	})
	return ptr
}

const obj_set = function(obj, keys, val) {
	let o = Object.assign({}, obj)
	let k = keys.concat()
	let lst = k.pop()
	if(!lst) {
		o = val
		return o
	}
	let ptr = obj_get(o, k)
	ptr[lst] = val
	return o
}

const obj_add = function(obj, keys, val) {
	let o = Object.assign({}, obj)
	let k = keys.concat()
	if(Array.isArray(val)) {
		let a = obj_get(o, k)
		return obj_set(o, k, Array.isArray(a) ? a.concat(val) : val)
	} else if(typeof(val) === 'object') {
		return obj_set(o, k, {
			...obj_get(o, k),
			...val
		})
	} else {
		return obj_set(o, k, val)
	}

}

const obj_del = function(obj, keys, val) {
	let o = Object.assign({}, obj)
	let k = keys.concat()
	let lst = val
	let ptr = obj_get(o, k)
	while(k.length > 0 && Object.keys(ptr).every((v) => v === lst)) {
		lst = k.pop()
		ptr = obj_get(o, k)
	}
	let { [lst]:l, ...rst } = ptr
	return obj_set(o, k, rst)
}

module.exports = {
	obj_get,
	obj_set,
	obj_add,
	obj_del,
}

