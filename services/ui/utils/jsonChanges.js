const objGet = function(obj, keys) {
	let ptr = obj
	keys.map((k) => {
		if(Object.keys(ptr).indexOf(k) < 0) {
			ptr[k] = {}
		}
		ptr = ptr[k]
	})
	return ptr
}

const objSet = function(obj, keys, val) {
	let o = Object.assign({}, obj)
	let k = keys.concat()
	let lst = k.pop()
	if(!lst) {
		o = val
		return o
	}
	let ptr = objGet(o, k)
	ptr[lst] = val
	return o
}

const objAdd = function(obj, keys, val) {
	let o = Object.assign({}, obj)
	let k = keys.concat()
	if(Array.isArray(val)) {
		let a = objGet(o, k)
		return objSet(o, k, Array.isArray(a) ? a.concat(val) : val)
	} else if(typeof(val) === 'object') {
		return objSet(o, k, {
			...objGet(o, k),
			...val
		})
	} else {
		return objSet(o, k, val)
	}

}

const objDel = function(obj, keys, val) {
	let o = Object.assign({}, obj)
	let k = keys.concat()
	let lst = val
	let ptr = objGet(o, k)
	while(k.length > 0 && Object.keys(ptr).every((v) => v === lst)) {
		lst = k.pop()
		ptr = objGet(o, k)
	}
	let { [lst]:l, ...rst } = ptr
	return objSet(o, k, rst)
}

const objAlt = function(obj, keys, branch) {
	let ptr = obj
	let k = keys.shift()
	let ret = [k]
	let og = true
	while(typeof(ptr) === 'object' && !!k && k.length > 0) {
		if(!!ptr[branch] && ptr[branch][k]) {
			ret.pop()
			ret = ret.concat([branch, k])
			og = false
			ptr = ptr[branch][k]
		} else if(Object.keys(ptr).indexOf(k) < 0) {
			if(og) { return false }
			ptr[k] = {}
			ptr = ptr[k]
		} else {
			ptr = ptr[k]
		}
		k = keys.shift()
		if(!k) { return !!og ? false : ret }
		ret = ret.concat(k)	
	}
	return false
}

const jsonChanges = {
	objGet,
	objSet,
	objAdd,
	objDel,
	objAlt,
}

export default jsonChanges
