
function mapWithSchema(propertyName, schema, sourceValue){
	const schemaValue = schema[propertyName];
	if(schemaValue === undefined){
		return sourceValue;
	}
	else if (typeof schemaValue === 'function'){
		return schemaValue.call(null, sourceValue);
	}
	else{
		return schemaValue;
	}
}

/**
 * Object Mapping Helper
 */
class MagicMapper{

	/**
	 *
	 * @param options
	 * - transform: fn(propName) : string - The function is used to transform property names _before_ mapping. Applies for all mapping functions in this class.
	 * - exclusive: bool - Determines if all props shall be mapped, or only the props defined in the schema
	 * @example
	 * const mapper = new MagicMapper( pname => pname.toLowerCase());
	 * const mapped = mapper.map({ Foo: "value", Bar : "rabatz" })
	 * // mapped => { foo: "value", bar : "rabatz" }
	 */
	constructor(options = {}){

		this.options = Object.assign({
			propertyTransform: null,
			valueTransform: null,
			exclusive : false
		}, options);

		if(this.options.propertyTransform && (typeof this.options.propertyTransform !== 'function'))
			throw "'propertyTransform' must be a function";

		if(this.options.valueTransform && (typeof this.options.valueTransform !== 'function'))
			throw "'valueTransform ' must be a function";
	}

	/**
	 * Maps _all_ properties of src to a new object
	 * @param from The source object
	 * @param schema Optional Schema, that will be applied selectively
	 * @returns A new object with all properties and values from source object
	 */
	map(from, schema = null){
		let mapped = {};

		if(this.options.exclusive && !schema) throw "Exclusive option requires a schema!";

		Object.keys(from).forEach( p => {
			const tp = this.options.propertyTransform ? this.options.propertyTransform(p) : p;
			const fromValue = this.options.valueTransform ? this.options.valueTransform(from[p]) : from[p];

			//if(!this.options.exclusive && !schema[tp]) return;

			if(schema && schema.hasOwnProperty(tp)){
				mapped[tp] = mapWithSchema(tp, schema, fromValue);
			}
			else if(Array.isArray(fromValue)){
				mapped[tp] = fromValue.map( v => this.map(v,schema) );
			}
			else if (fromValue && (typeof fromValue === 'object')){
				mapped[tp] = this.map(fromValue, schema);
			}
			else if(!this.options.exclusive){
				mapped[tp] = fromValue;
			}
		});
		return mapped;
	}
}

export default MagicMapper;