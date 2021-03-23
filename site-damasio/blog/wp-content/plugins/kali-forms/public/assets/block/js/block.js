/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./resources/assets/js/block/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/assertThisInitialized.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _assertThisInitialized(self) {\n  if (self === void 0) {\n    throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");\n  }\n\n  return self;\n}\n\nmodule.exports = _assertThisInitialized;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/assertThisInitialized.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/classCallCheck.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _classCallCheck(instance, Constructor) {\n  if (!(instance instanceof Constructor)) {\n    throw new TypeError(\"Cannot call a class as a function\");\n  }\n}\n\nmodule.exports = _classCallCheck;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/classCallCheck.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/createClass.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _defineProperties(target, props) {\n  for (var i = 0; i < props.length; i++) {\n    var descriptor = props[i];\n    descriptor.enumerable = descriptor.enumerable || false;\n    descriptor.configurable = true;\n    if (\"value\" in descriptor) descriptor.writable = true;\n    Object.defineProperty(target, descriptor.key, descriptor);\n  }\n}\n\nfunction _createClass(Constructor, protoProps, staticProps) {\n  if (protoProps) _defineProperties(Constructor.prototype, protoProps);\n  if (staticProps) _defineProperties(Constructor, staticProps);\n  return Constructor;\n}\n\nmodule.exports = _createClass;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/createClass.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _defineProperty(obj, key, value) {\n  if (key in obj) {\n    Object.defineProperty(obj, key, {\n      value: value,\n      enumerable: true,\n      configurable: true,\n      writable: true\n    });\n  } else {\n    obj[key] = value;\n  }\n\n  return obj;\n}\n\nmodule.exports = _defineProperty;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/defineProperty.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/getPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _getPrototypeOf(o) {\n  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {\n    return o.__proto__ || Object.getPrototypeOf(o);\n  };\n  return _getPrototypeOf(o);\n}\n\nmodule.exports = _getPrototypeOf;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/getPrototypeOf.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/inherits.js":
/*!*********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/inherits.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf */ \"./node_modules/@babel/runtime/helpers/setPrototypeOf.js\");\n\nfunction _inherits(subClass, superClass) {\n  if (typeof superClass !== \"function\" && superClass !== null) {\n    throw new TypeError(\"Super expression must either be null or a function\");\n  }\n\n  subClass.prototype = Object.create(superClass && superClass.prototype, {\n    constructor: {\n      value: subClass,\n      writable: true,\n      configurable: true\n    }\n  });\n  if (superClass) setPrototypeOf(subClass, superClass);\n}\n\nmodule.exports = _inherits;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/inherits.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var _typeof = __webpack_require__(/*! ../helpers/typeof */ \"./node_modules/@babel/runtime/helpers/typeof.js\");\n\nvar assertThisInitialized = __webpack_require__(/*! ./assertThisInitialized */ \"./node_modules/@babel/runtime/helpers/assertThisInitialized.js\");\n\nfunction _possibleConstructorReturn(self, call) {\n  if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) {\n    return call;\n  }\n\n  return assertThisInitialized(self);\n}\n\nmodule.exports = _possibleConstructorReturn;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _setPrototypeOf(o, p) {\n  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {\n    o.__proto__ = p;\n    return o;\n  };\n\n  return _setPrototypeOf(o, p);\n}\n\nmodule.exports = _setPrototypeOf;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/setPrototypeOf.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _typeof(obj) {\n  \"@babel/helpers - typeof\";\n\n  if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") {\n    module.exports = _typeof = function _typeof(obj) {\n      return typeof obj;\n    };\n  } else {\n    module.exports = _typeof = function _typeof(obj) {\n      return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj;\n    };\n  }\n\n  return _typeof(obj);\n}\n\nmodule.exports = _typeof;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/typeof.js?");

/***/ }),

/***/ "./resources/assets/js/block/edit.js":
/*!*******************************************!*\
  !*** ./resources/assets/js/block/edit.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ \"./node_modules/@babel/runtime/helpers/classCallCheck.js\");\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ \"./node_modules/@babel/runtime/helpers/createClass.js\");\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ \"./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js\");\n/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ \"./node_modules/@babel/runtime/helpers/getPrototypeOf.js\");\n/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ \"./node_modules/@babel/runtime/helpers/assertThisInitialized.js\");\n/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ \"./node_modules/@babel/runtime/helpers/inherits.js\");\n/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/@babel/runtime/helpers/defineProperty.js\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./editor.scss */ \"./resources/assets/js/block/editor.scss\");\n/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_editor_scss__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _partials_get_field_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./partials/get-field-component */ \"./resources/assets/js/block/partials/get-field-component.js\");\n\n\n\n\n\n\n\n\nvar __ = wp.i18n.__;\nvar InspectorControls = wp.blockEditor.InspectorControls;\nvar _wp$element = wp.element,\n    Fragment = _wp$element.Fragment,\n    Component = _wp$element.Component;\nvar _wp$components = wp.components,\n    SelectControl = _wp$components.SelectControl,\n    Spinner = _wp$components.Spinner,\n    PanelBody = _wp$components.PanelBody;\n/**\n * Import the get field component function ( separated because of lots of code in the switch )\n */\n\n\n/**\n * Edit class\n */\n\nvar Edit =\n/*#__PURE__*/\nfunction (_Component) {\n  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(Edit, _Component);\n\n  /**\n   * Class constructor\n   */\n  function Edit() {\n    var _this;\n\n    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Edit);\n\n    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Edit).apply(this, arguments));\n\n    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), \"updatePlaceholderValue\", function (key, value) {\n      var currentState = _this.props.attributes.values;\n\n      if (typeof currentState === 'undefined') {\n        currentState = {};\n      }\n\n      currentState[key] = value;\n\n      _this.props.setAttributes({\n        values: JSON.parse(JSON.stringify(currentState))\n      });\n    });\n\n    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), \"getFieldValue\", function (name) {\n      if (typeof _this.props.attributes.values === 'undefined') {\n        return '';\n      }\n\n      if (!_this.props.attributes.values.hasOwnProperty(name)) {\n        return '';\n      }\n\n      return _this.props.attributes.values[name];\n    });\n\n    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), \"updateFieldValue\", function (val) {\n      _this.props.setAttributes({\n        loading: true,\n        form: val,\n        values: {}\n      });\n\n      if (parseFloat(val) === 0) {\n        _this.props.setAttributes({\n          loading: false,\n          form: 0,\n          rows: {}\n        });\n\n        return;\n      }\n\n      jQuery.ajax({\n        type: 'POST',\n        data: {\n          action: 'kaliforms_get_grid',\n          id: val,\n          nonce: KaliFormsGeneralObject.ajax_nonce\n        },\n        url: KaliFormsGeneralObject.ajaxurl,\n        success: function success(result) {\n          _this.props.setAttributes({\n            loading: false,\n            rows: JSON.parse(result)\n          });\n        }\n      });\n    });\n\n    _this.onChangeContent = _this.onChangeContent.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this));\n    _this.state = {\n      formWithFields: [],\n      formArr: [],\n      forms: [],\n      loading: false\n    };\n    return _this;\n  }\n  /**\n   * When changing content, save it the way it should be saved\n   * @param {*} data\n   */\n\n\n  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Edit, [{\n    key: \"onChangeContent\",\n    value: function onChangeContent(data) {\n      this.props.setAttributes({\n        content: data\n      });\n    }\n    /**\n     * Component did update\n     * @param {*} newVal\n     * @param {*} oldVal\n     */\n\n  }, {\n    key: \"componentDidUpdate\",\n    value: function componentDidUpdate(newVal, oldVal) {\n      if (this.props.forms !== null && this.props.forms.length && oldVal.forms.length !== this.props.forms.length) {\n        var formWithFields = [];\n        var formArr = [{\n          value: 0,\n          label: __('Please select a form', 'kaliforms')\n        }];\n        this.props.forms.map(function (e) {\n          formArr.push({\n            value: e.id,\n            label: e.title.rendered\n          });\n          formWithFields.push({\n            id: e.id,\n            fields: JSON.parse(e.meta.kaliforms_field_components),\n            grid: JSON.parse(e.meta.kaliforms_grid)\n          });\n        });\n        this.setState({\n          forms: this.props.forms,\n          formArr: [].concat(formArr),\n          formWithFields: [].concat(formWithFields)\n        });\n      }\n    }\n    /**\n     * Component did mount hook\n     */\n\n  }, {\n    key: \"componentDidMount\",\n    value: function componentDidMount() {\n      var _this2 = this;\n\n      if (typeof this.props.attributes.form === 'undefined' || parseFloat(this.props.attributes.form) === 0) {\n        return;\n      }\n\n      this.props.setAttributes({\n        loading: true\n      });\n      jQuery.ajax({\n        type: 'POST',\n        data: {\n          action: 'kaliforms_get_grid',\n          id: this.props.attributes.form,\n          nonce: KaliFormsGeneralObject.ajax_nonce\n        },\n        url: KaliFormsGeneralObject.ajaxurl,\n        success: function success(result) {\n          _this2.props.setAttributes({\n            loading: false,\n            rows: JSON.parse(result)\n          });\n        }\n      });\n    }\n    /**\n     * Update the placeholder value (default values in the frontend)\n     * @param {*} key\n     * @param {*} value\n     */\n\n  }, {\n    key: \"render\",\n    value: function render() {\n      var _this3 = this;\n\n      if (!this.props.forms) {\n        return React.createElement(Spinner, null);\n      }\n\n      if (this.props.forms && this.props.forms.length === 0) {\n        return __('No forms available!', 'kaliforms');\n      }\n\n      if (typeof this.props.attributes.form === 'undefined' || parseFloat(this.props.attributes.form) === 0) {\n        return React.createElement(Fragment, null, React.createElement(\"p\", null, __('Select a form created through Kali Forms in the sidebar!', 'kaliforms')), React.createElement(InspectorControls, null, React.createElement(PanelBody, {\n          title: __('Form selection', 'kaliforms')\n        }, React.createElement(SelectControl, {\n          label: __('Select a form created through Kali!', 'kaliforms'),\n          value: this.props.attributes.form,\n          options: this.state.formArr,\n          onChange: function onChange(form) {\n            return _this3.updateFieldValue(form);\n          }\n        }))));\n      }\n\n      return React.createElement(Fragment, null, React.createElement(InspectorControls, null, React.createElement(PanelBody, {\n        title: __('Form selection', 'kaliforms')\n      }, React.createElement(SelectControl, {\n        label: __('Select a form created through Kali!', 'kaliforms'),\n        value: this.props.attributes.form,\n        options: this.state.formArr,\n        onChange: function onChange(form) {\n          return _this3.updateFieldValue(form);\n        }\n      }))), typeof this.props.attributes.form !== 'undefined' && parseFloat(this.props.attributes.form) !== 0 ? this.props.attributes.loading ? React.createElement(Spinner, null) : React.createElement(\"div\", {\n        className: \"bootstrap-wrapper\"\n      }, Object.keys(this.props.attributes.rows).map(function (row) {\n        return React.createElement(\"div\", {\n          className: 'row'\n        }, _this3.props.attributes.rows[row].map(function (col) {\n          return React.createElement(\"div\", {\n            className: 'col-' + col.col\n          }, Object(_partials_get_field_component__WEBPACK_IMPORTED_MODULE_8__[\"default\"])(col, _this3.getFieldValue, _this3.updatePlaceholderValue));\n        }));\n      })) : null);\n    }\n  }]);\n\n  return Edit;\n}(Component);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Edit);\n\n//# sourceURL=webpack:///./resources/assets/js/block/edit.js?");

/***/ }),

/***/ "./resources/assets/js/block/editor.scss":
/*!***********************************************!*\
  !*** ./resources/assets/js/block/editor.scss ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin\n\n//# sourceURL=webpack:///./resources/assets/js/block/editor.scss?");

/***/ }),

/***/ "./resources/assets/js/block/index.js":
/*!********************************************!*\
  !*** ./resources/assets/js/block/index.js ***!
  \********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.scss */ \"./resources/assets/js/block/style.scss\");\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _kali_icon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./kali-icon */ \"./resources/assets/js/block/kali-icon.js\");\n/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ \"./resources/assets/js/block/edit.js\");\n/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ \"./resources/assets/js/block/save.js\");\nvar registerBlockType = wp.blocks.registerBlockType;\nvar __ = wp.i18n.__;\n\n\n\n\nvar withSelect = wp.data.withSelect;\nregisterBlockType('kali-forms/kali-forms-block', {\n  title: __('Kali Forms Block (BETA)', 'kaliforms'),\n  description: __('Add a form to your page using this block', 'kaliforms'),\n  category: 'common',\n  icon: _kali_icon__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  supports: {\n    html: false\n  },\n  attributes: {\n    form: {\n      type: 'string'\n    },\n    values: {\n      type: 'json'\n    },\n    loading: {\n      type: 'boolean'\n    },\n    rows: {\n      type: 'object'\n    }\n  },\n  edit: withSelect(function (select) {\n    return {\n      forms: select('core').getEntityRecords('postType', 'kaliforms_forms', {\n        per_page: -1\n      })\n    };\n  })(_edit__WEBPACK_IMPORTED_MODULE_2__[\"default\"]),\n  save: _save__WEBPACK_IMPORTED_MODULE_3__[\"default\"]\n});\n\n//# sourceURL=webpack:///./resources/assets/js/block/index.js?");

/***/ }),

/***/ "./resources/assets/js/block/kali-icon.js":
/*!************************************************!*\
  !*** ./resources/assets/js/block/kali-icon.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar el = wp.element.createElement;\nvar KaliIcon = el('svg', {\n  width: 20,\n  height: 20\n}, el('rect', {\n  width: 20,\n  height: 20\n}), el('path', {\n  d: \"M 10.867188 9.15625 L 15.507812 15.703125 L 11.777344 15.703125 L 8.785156 11.367188 L 7.519531 12.710938 L 7.519531 15.703125 L 4.492188 15.703125 L 4.492188 4.296875 L 7.519531 4.296875 L 7.519531 8.589844 L 11.433594 4.382812 L 15.421875 4.382812 Z M 10.867188 9.15625\",\n  fill: \"#fcfcfc\"\n}));\n/* harmony default export */ __webpack_exports__[\"default\"] = (KaliIcon);\n\n//# sourceURL=webpack:///./resources/assets/js/block/kali-icon.js?");

/***/ }),

/***/ "./resources/assets/js/block/partials/get-field-component.js":
/*!*******************************************************************!*\
  !*** ./resources/assets/js/block/partials/get-field-component.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar _wp$components = wp.components,\n    Button = _wp$components.Button,\n    TextareaControl = _wp$components.TextareaControl,\n    TextControl = _wp$components.TextControl,\n    SelectControl = _wp$components.SelectControl,\n    CheckboxControl = _wp$components.CheckboxControl,\n    RadioControl = _wp$components.RadioControl;\nvar __ = wp.i18n.__;\n/**\n * Get the field compoent\n */\n\nvar getFieldComponent = function getFieldComponent(col, valueGetter, callback) {\n  if (col.type === 'textbox') {\n    col.type = col['properties.type'];\n  }\n\n  switch (col.type) {\n    case 'freeText':\n    case 'smartTextOutput':\n      return React.createElement(\"span\", null, col.content);\n\n    case 'submitButton':\n    case 'button':\n      return React.createElement(Button, {\n        isPrimary: true\n      }, col.caption === '' ? col.name : col.caption);\n\n    case 'textarea':\n      return React.createElement(TextareaControl, {\n        label: col.caption === '' ? col.name : col.caption,\n        value: valueGetter(col.name),\n        onChange: function onChange(value) {\n          return callback(col.name, value);\n        }\n      });\n\n    case 'select':\n    case 'choices':\n    case 'dropdown':\n      return React.createElement(SelectControl, {\n        label: col.caption === '' ? col.name : col.caption,\n        value: valueGetter(col.name),\n        options: col.choices,\n        onChange: function onChange(value) {\n          return callback(col.name, value);\n        }\n      });\n\n    case 'radio':\n      return React.createElement(RadioControl, {\n        label: col.caption === '' ? col.name : col.caption,\n        selected: valueGetter(col.name),\n        options: col.choices,\n        onChange: function onChange(value) {\n          return callback(col.name, value);\n        }\n      });\n\n    case 'checkbox':\n      var values = valueGetter(col.name);\n      values = values.split(',');\n\n      var parseValue = function parseValue(state, val) {\n        if (values.includes(val) && state) {\n          return;\n        }\n\n        if (state) {\n          values.push(val);\n        }\n\n        if (!state) {\n          values = values.filter(function (vl) {\n            return vl !== val;\n          });\n        }\n\n        callback(col.name, values.join(','));\n      };\n\n      return col.choices.map(function (choice) {\n        return React.createElement(CheckboxControl, {\n          label: choice.label === '' ? choice.label : choice.value,\n          checked: values.includes(choice.value),\n          onChange: function onChange(value) {\n            return parseValue(value, choice.value);\n          }\n        });\n      });\n\n    case 'pageBreak':\n      return React.createElement(\"span\", {\n        className: 'pagebreak-placeholder'\n      }, React.createElement(\"div\", null, React.createElement(\"button\", {\n        className: \"button\"\n      }, __('Back', 'kaliforms'))), React.createElement(\"div\", null, \" \", col.caption === '' ? col.name : col.caption, \" \"), React.createElement(\"div\", null, React.createElement(\"button\", {\n        className: \"button\"\n      }, __('Next', 'kaliforms'))));\n\n    case 'text':\n    case 'email':\n    case 'number':\n    case 'tel':\n    case 'telephone':\n    case 'hidden':\n    case 'date':\n    case 'dateTimePicker':\n    case 'password':\n      return React.createElement(TextControl, {\n        label: col.caption === '' ? col.name : col.caption,\n        value: valueGetter(col.name),\n        onChange: function onChange(value) {\n          return callback(col.name, value);\n        },\n        type: col.type\n      });\n\n    case 'range':\n      return React.createElement(TextControl, {\n        label: col.caption === '' ? col.name : col.caption,\n        value: valueGetter(col.name),\n        onChange: function onChange(value) {\n          return callback(col.name, value);\n        },\n        max: col.max,\n        min: col.min,\n        type: col.type\n      });\n\n    case 'colorPicker':\n      return React.createElement(TextControl, {\n        label: col.caption === '' ? col.name : col.caption,\n        value: valueGetter(col.name),\n        onChange: function onChange(value) {\n          return callback(col.name, value);\n        },\n        type: 'color',\n        className: \"kali-color-picker\"\n      });\n\n    case 'divider':\n      return React.createElement(\"hr\", null);\n\n    case 'fileUpload':\n      return React.createElement(\"span\", {\n        className: 'fileUpload-placeholder'\n      }, __('Drag & drop', 'kaliforms'));\n\n    default:\n      return React.createElement(\"span\", {\n        className: \"kali-placeholder\"\n      }, col.caption === '' ? col.name : col.caption);\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (getFieldComponent);\n\n//# sourceURL=webpack:///./resources/assets/js/block/partials/get-field-component.js?");

/***/ }),

/***/ "./resources/assets/js/block/save.js":
/*!*******************************************!*\
  !*** ./resources/assets/js/block/save.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return save; });\nfunction save(_ref) {\n  var attributes = _ref.attributes;\n  return null;\n}\n\n//# sourceURL=webpack:///./resources/assets/js/block/save.js?");

/***/ }),

/***/ "./resources/assets/js/block/style.scss":
/*!**********************************************!*\
  !*** ./resources/assets/js/block/style.scss ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin\n\n//# sourceURL=webpack:///./resources/assets/js/block/style.scss?");

/***/ })

/******/ });