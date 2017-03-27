'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Direct = Symbol('MagicMapper.Direct');

function mapWithSchema(propertyName, schema, sourceValue) {
	var schemaValue = schema[propertyName];
	if (schemaValue === Direct) {
		return sourceValue;
	} else if (typeof schemaValue === 'function') {
		return schemaValue.call(null, sourceValue);
	} else {
		return schemaValue;
	}
}

/**
 * Object Mapping Helper
 */

var MagicMapper = function () {
	_createClass(MagicMapper, null, [{
		key: 'Direct',
		get: function get() {
			return Direct;
		}

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

	}]);

	function MagicMapper() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, MagicMapper);

		this.options = Object.assign({
			propertyTransform: null,
			valueTransform: null,
			exclusive: false
		}, options);

		if (this.options.propertyTransform && typeof this.options.propertyTransform !== 'function') throw "'propertyTransform' must be a function";

		if (this.options.valueTransform && typeof this.options.valueTransform !== 'function') throw "'valueTransform ' must be a function";
	}

	/**
  * Maps _all_ properties of src to a new object
  * @param from The source object
  * @param schema Optional Schema, that will be applied selectively
  * @returns A new object with all properties and values from source object
  */


	_createClass(MagicMapper, [{
		key: 'map',
		value: function map(from) {
			var _this = this;

			var schema = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var mapped = {};

			if (this.options.exclusive && !schema) throw "Exclusive option requires a schema!";

			Object.keys(from).forEach(function (p) {
				var tp = _this.options.propertyTransform ? _this.options.propertyTransform(p) : p;
				var fromValue = _this.options.valueTransform ? _this.options.valueTransform(from[p]) : from[p];

				if (_this.options.exclusive && !schema[tp]) return;

				if (schema && schema.hasOwnProperty(tp)) {
					mapped[tp] = mapWithSchema(tp, schema, fromValue);
				} else if (Array.isArray(fromValue)) {
					mapped[tp] = fromValue.map(function (v) {
						return _this.map(v, schema);
					});
				} else if (fromValue && (typeof fromValue === 'undefined' ? 'undefined' : _typeof(fromValue)) === 'object') {
					mapped[tp] = _this.map(fromValue, schema);
				} else if (!_this.options.exclusive) {
					mapped[tp] = fromValue;
				}
			});
			return mapped;
		}
	}]);

	return MagicMapper;
}();

exports.default = MagicMapper;