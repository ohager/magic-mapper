'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Direct = '@@MagicMapper.Direct'; // I prefer Symbol, but doesn't work in IE

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
 * This JSON Mapper helps you to map JSON objects to other ones.
 */

var MagicMapper = function () {
	_createClass(MagicMapper, null, [{
		key: 'Direct',


		/**
   * Symbol to declare an object to be mapped as it is.
   * @returns {Symbol}
   * @constructor
   */
		get: function get() {
			return Direct;
		}

		/**
   * @param {object} options Options that the Mapper uses on _all_ mappings. Available options are:
   * - propertyTransform: transform function _fn(propertyName)_ for property
   * - valueTransform: transform function _fn(value)_ for value
   * - exclusive: flag to indicate whether _all_ properties shall be mapped (false), or only properties defined in passed schema (true)
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
  * Maps properties of src to a new object
  * @param {object} from The source object
  * @param {object} schema Optional Schema, that will be applied selectively. When using _options.exclusive=true_ schema is mandatory.
  * @returns {object} A new object with all properties and values from source object
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
				var isArray = fromValue && Array.isArray(fromValue);
				var isObject = fromValue && (typeof fromValue === 'undefined' ? 'undefined' : _typeof(fromValue)) === 'object' && !isArray;

				if (_this.options.exclusive && !schema[tp]) return;

				if (!isObject && schema && schema.hasOwnProperty(tp)) {
					mapped[tp] = mapWithSchema(tp, schema, fromValue);
				} else if (isArray) {
					mapped[tp] = fromValue.map(function (v) {
						return (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' ? _this.map(v, schema) : v;
					});
				} else if (isObject) {
					var s = schema && schema[tp];
					if (typeof s === 'function') {
						mapped[tp] = schema[tp].call(null, fromValue);
					} else {
						mapped[tp] = _this.map(fromValue, s);
					}
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