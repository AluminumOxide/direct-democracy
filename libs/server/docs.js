const fs = require('node:fs/promises')
class AutoDoc {

	constructor() {
		this.routes = []
		this.schemas = {
			schemas: {},
			headers: {},
			params: {},
			queries: {},
			bodies: {},
			responses: {}
		}
	}

	add_route(method, url, schema) {
		this.routes.push({ method, url, schema })
	}

	add_schema(category, name, schema) {
		this.schemas[category][name] = schema
	}

	async write_docs(file_name) {
		try {
			let contents = this._get_docs()
			await fs.writeFile(file_name, contents)
		} catch(e) {
			console.log(e)
		}
	}

	_get_docs() {
		let docs = ''

		// legend
		docs += this._get_doc_preamble()

		// routes
		docs += this._get_heading('Routes', 'Routes', 2, '\n')
		this.routes.forEach(r => {
			docs += this._get_route(r.method, r.url, r.schema)
		})

		// schemas
		//docs += this._get_heading('Schemas', 'Schemas', 2, '\n')

		// headers
		docs += this._get_heading('Headers', 'Headers', 2, '\n')
		docs += this._get_schema(this.schemas['headers'])

		// params
		docs += this._get_heading('Params', 'Params', 2, '\n')
		docs += this._get_schema(this.schemas['params'])

		// queries
		docs += this._get_heading('Queries', 'Queries', 2, '\n')
		docs += this._get_schema(this.schemas['queries'])

		// bodies
		docs += this._get_heading('Bodies', 'Bodies', 2, '\n')
		docs += this._get_schema(this.schemas['bodies'])

		// responses
		docs += this._get_heading('Responses', 'Responses', 2, '\n')
		docs += this._get_schema(this.schemas['responses'])

		// data
		docs += this._get_heading('Data', 'Data', 2, '\n')
		docs += this._get_schema(this.schemas['schemas'])	

		return docs
	}

	_escape(text) {
		return text.replace(">", "\\>")
	}

	_get_heading(text, id, level, prefix) {
//		if(!!id) {
//			return `${prefix}${'#'.repeat(level)} ${text} {#${id}}\n`
//		} else {
			return `${prefix}${'#'.repeat(level)} ${text}\n`
//		}
	}

	_get_title(text, prefix) {
		return `\n${prefix}**${text}**\n`
	}

	_get_desc(desc, prefix) {
		return `\n${prefix}*${desc}*\n`
	}
	
	_get_doc_preamble() {
		let ret = "# API Documentation"
		//ret += "\n- [Routes](#Routes)"
		//ret += "\n- [Schemas](#Schemas)"
		//ret += "\n    - [Headers](#Headers)"
		//ret += "\n    - [Params](#Params)"
		//ret += "\n    - [Queries](#Queries)"
		//ret += "\n    - [Bodies](#Bodies)"
		//ret += "\n    - [Responses](#Responses)"
		//ret += "\n    - [Data](#Data)"
		return ret+'\n'
	}
	
	_get_route(method, url, schema) {
		let ret = ''
		ret += this._get_heading(`${method} ${url}`, schema.operationId, 3, '')
		ret += this._get_desc(schema.description, '')
		let input_formats = {type_ref: "{0} - [{1}](#{1})", recurse:["{0}- [{1}]{2}","(#{1})"]}
		if('query' in schema) {
			ret += this._get_title('Queries', '')
			ret += this._get_schema(schema.query, input_formats, 0)
			ret += '\n'
		}
		if('param' in schema) {
			ret += this._get_title('Params', '')
			ret += this._get_schema(schema.param, input_formats, 0)
			ret += '\n'
		}
		if('body' in schema) {
			ret += this._get_title('Bodies', '')
			ret += this._get_schema(schema.body, input_formats, 0)
			ret += '\n'
		}
		if('responses' in schema) {
			ret += this._get_title('Responses', '')
			ret += this._get_schema(schema.responses, input_formats, 0)
			ret += '\n'
		}
		ret += '\n'
		return ret
	}

	_get_schema(schema, formats={}, indents, postfix='') {
		let ret = ''
		let prefix = '\n'
		if(!!indents) {
			prefix += '\t'.repeat(indents)
		} else {
			indents = 0
		}
		if(!schema) {
			return
		}
		if('description' in schema) {
			ret += this._get_desc(schema.description, prefix)
			ret += '\n'
		}
		if('$ref' in schema) {
			if('type_ref' in formats) {
				let r = formats.type_ref
				r = r.replace(/\{0\}/g, prefix)
				r = r.replace(/\{1\}/g, schema['$ref'])
				ret += r
			} else {
				ret += `${prefix}${postfix}Type: [${schema['$ref']}](#${schema['$ref']})`
			}
		} else if('type' in schema) {
			if(schema.type === 'array') {
				ret += `${prefix}${postfix}Type: array`
				if(!!postfix) {	
					ret += `\n${prefix}\tItems:\n`
					ret += this._get_schema(schema.items, formats, indents+1, '- ')
				} else {
					ret += `\n${prefix}Items:\n`
					ret += this._get_schema(schema.items, formats, indents, '- ')
				}
			} else if(schema.type === 'object') {
				ret += `${prefix}${postfix}Type: object`
				if('required' in schema) {
					ret += `\n${prefix}${postfix}Required:\n`
					schema.required.forEach(req => {
						ret += prefix
						ret += '- '
						ret += req
					})
				}
				if('additionalProperties' in schema) {
					if(typeof(schema.additionalProperties) == 'object') {
						ret += `\n${prefix}Additional Properties:`
						//ret += `${prefix}- `
						ret += this._get_schema(schema.additionalProperties, formats, indents+1)
					} else {
						ret += `\n${prefix}Additional Properties: ${schema.additionalProperties}`
					}
				}
				if('patternProperties' in schema) {
					ret += `\n${prefix}Pattern Properties:`
					Object.keys(schema.patternProperties).forEach(prop => {
						ret += this._get_title(prop, prefix+'- ')
						ret += this._get_schema(schema.patternProperties[prop], formats, indents+1)
					})
				}
				if('properties' in schema) {
					ret += `\n${prefix}Properties:`
					Object.keys(schema.properties).forEach(prop => {
						ret += this._get_title(prop, prefix+'- ')
						ret += this._get_schema(schema.properties[prop], formats, indents+1)
					})
				}
				ret += '\n'
			} else {
				ret += `${prefix}${postfix}Type: ${schema.type}`
			}
		}
		if('oneOf' in schema) {
			ret += `\n${prefix}One Of:\n`
			schema.oneOf.forEach((x) => {
				ret += this._get_schema(x, formats, indents, '- ')
				ret += '\n'
			})
		}
		if('anyOf' in schema) {
			ret += `\n${prefix}Any Of:\n`
			schema.anyOf.forEach((x) => {
				ret += this._get_schema(x, formats, indents, '- ')
				ret += '\n'
			})
		}
		if('enum' in schema) {
			ret += `\n${prefix}Enum:\n`
			schema.enum.forEach(enm => {
				ret += prefix
				ret += '- '
				ret += this._escape(enm)
			})
		}
		if('pattern' in schema) {
			ret += `\n${prefix}Pattern: ${schema.pattern}`
		}
		if(ret === '') {
			Object.keys(schema).forEach(j => {
				if('recurse' in formats) {
					let r = formats.recurse[0]
					r = r.replace(/\{0\}/g, prefix)
					r = r.replace(/\{1\}/g, j)
					r = r.replace(/\{2\}/g, this._get_schema(schema[j], {"type_ref":formats.recurse[1]}, 0))
					ret += r
				} else {
					ret += this._get_heading(schema[j]['$id'], schema[j]['$id'], 4, '\n')
					ret += this._get_schema(schema[j], formats, 0)
				}
			})
		}
		return ret
	}
}

module.exports = { AutoDoc }
