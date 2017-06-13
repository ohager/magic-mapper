
const Direct = '@@MagicMapper.Direct'; // I prefer Symbol, but doesn't work in IE

function mapWithSchema(propertyName, schema, sourceValue){
	const schemaValue = schema[propertyName];
	if(schemaValue === Direct){
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
 * This JSON Mapper helps you to map JSON objects to other ones.
 */
class MagicMapper{

	/**
	 * Symbol to declare an object to be mapped as it is.
	 * @returns {Symbol}
	 * @constructor
	 */
	static get Direct() { return Direct; }

	/**
	 * @param {object} options Options that the Mapper uses on _all_ mappings. Available options are:
	 * - propertyTransform: transform function _fn(propertyName)_ for property
	 * - valueTransform: transform function _fn(value)_ for value
	 * - exclusive: flag to indicate whether _all_ properties shall be mapped (false), or only properties defined in passed schema (true)
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
	 * Maps properties of src to a new object
	 * @param {object} from The source object
	 * @param {object} schema Optional Schema, that will be applied selectively. When using _options.exclusive=true_ schema is mandatory.
	 * @returns {object} A new object with all properties and values from source object
	 */
	map(from, schema = null){
		let mapped = {};

		if(this.options.exclusive && !schema) throw "Exclusive option requires a schema!";

		Object.keys(from).forEach( p => {
			const tp = this.options.propertyTransform ? this.options.propertyTransform(p) : p;
			const fromValue = this.options.valueTransform ? this.options.valueTransform(from[p]) : from[p];
			const isArray = fromValue && Array.isArray(fromValue);
			const isObject = fromValue && (typeof fromValue === 'object') && !isArray;

			if(this.options.exclusive && !schema[tp]) return;

			if(!isObject && schema && schema.hasOwnProperty(tp)){
				mapped[tp] = mapWithSchema(tp, schema, fromValue);
			}
			else if(isArray){
				mapped[tp] = fromValue.map( v => typeof v === 'object' ? this.map(v,schema) : v );
			}
			else if (isObject){
				const s = schema && schema[tp];
				if(typeof s === 'function'){
					mapped[tp] = schema[tp].call(null, fromValue);
				}
				else{
					mapped[tp] = this.map(fromValue, s );
				}
			}
			else if(!this.options.exclusive){
				mapped[tp] = fromValue;
			}
		});
		return mapped;
	}
}

export default MagicMapper;