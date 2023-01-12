import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _initializerDefineProperty from '@babel/runtime/helpers/initializerDefineProperty';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _defineProperty$1 from '@babel/runtime/helpers/defineProperty';
import _applyDecoratedDescriptor from '@babel/runtime/helpers/applyDecoratedDescriptor';
import _typeof from '@babel/runtime/helpers/typeof';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import { toJS, computed, observable, runInAction, set, makeObservable, extendObservable, action, transaction } from 'mobx';
import _inherits from '@babel/runtime/helpers/inherits';
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import _wrapNativeSuper from '@babel/runtime/helpers/wrapNativeSuper';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var initializerWarningHelperExports = {};
var initializerWarningHelper = {
  get exports(){ return initializerWarningHelperExports; },
  set exports(v){ initializerWarningHelperExports = v; },
};

(function (module) {
	function _initializerWarningHelper(descriptor, context) {
	  throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.');
	}
	module.exports = _initializerWarningHelper, module.exports.__esModule = true, module.exports["default"] = module.exports;
} (initializerWarningHelper));

var setPrototypeOfExports = {};
var setPrototypeOf = {
  get exports(){ return setPrototypeOfExports; },
  set exports(v){ setPrototypeOfExports = v; },
};

(function (module) {
	function _setPrototypeOf(o, p) {
	  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
	  return _setPrototypeOf(o, p);
	}
	module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;
} (setPrototypeOf));

var _setPrototypeOf = /*@__PURE__*/getDefaultExportFromCjs(setPrototypeOfExports);

var dist = {};

var v1$1 = {};

var rng$1 = {};

Object.defineProperty(rng$1, "__esModule", {
  value: true
});
rng$1.default = rng;

var _crypto$3 = _interopRequireDefault$c(require("crypto"));

function _interopRequireDefault$c(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto$3.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

var stringify$3 = {};

var validate$1 = {};

var regex = {};

Object.defineProperty(regex, "__esModule", {
  value: true
});
regex.default = void 0;
var _default$c = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
regex.default = _default$c;

Object.defineProperty(validate$1, "__esModule", {
  value: true
});
validate$1.default = void 0;

var _regex = _interopRequireDefault$b(regex);

function _interopRequireDefault$b(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default$b = validate;
validate$1.default = _default$b;

Object.defineProperty(stringify$3, "__esModule", {
  value: true
});
stringify$3.default = void 0;
stringify$3.unsafeStringify = unsafeStringify;

var _validate$2 = _interopRequireDefault$a(validate$1);

function _interopRequireDefault$a(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

function stringify$2(arr, offset = 0) {
  const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate$2.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default$a = stringify$2;
stringify$3.default = _default$a;

Object.defineProperty(v1$1, "__esModule", {
  value: true
});
v1$1.default = void 0;

var _rng$1 = _interopRequireDefault$9(rng$1);

var _stringify$2 = stringify$3;

function _interopRequireDefault$9(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng$1.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify$2.unsafeStringify)(b);
}

var _default$9 = v1;
v1$1.default = _default$9;

var v3$1 = {};

var v35$1 = {};

var parse$3 = {};

Object.defineProperty(parse$3, "__esModule", {
  value: true
});
parse$3.default = void 0;

var _validate$1 = _interopRequireDefault$8(validate$1);

function _interopRequireDefault$8(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse$2(uuid) {
  if (!(0, _validate$1.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default$8 = parse$2;
parse$3.default = _default$8;

Object.defineProperty(v35$1, "__esModule", {
  value: true
});
v35$1.URL = v35$1.DNS = void 0;
v35$1.default = v35;

var _stringify$1 = stringify$3;

var _parse = _interopRequireDefault$7(parse$3);

function _interopRequireDefault$7(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
v35$1.DNS = DNS;
const URL$1 = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
v35$1.URL = URL$1;

function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    var _namespace;

    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify$1.unsafeStringify)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL$1;
  return generateUUID;
}

var md5$1 = {};

Object.defineProperty(md5$1, "__esModule", {
  value: true
});
md5$1.default = void 0;

var _crypto$2 = _interopRequireDefault$6(require("crypto"));

function _interopRequireDefault$6(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto$2.default.createHash('md5').update(bytes).digest();
}

var _default$7 = md5;
md5$1.default = _default$7;

Object.defineProperty(v3$1, "__esModule", {
  value: true
});
v3$1.default = void 0;

var _v$1 = _interopRequireDefault$5(v35$1);

var _md = _interopRequireDefault$5(md5$1);

function _interopRequireDefault$5(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v$1.default)('v3', 0x30, _md.default);
var _default$6 = v3;
v3$1.default = _default$6;

var v4$1 = {};

var native = {};

Object.defineProperty(native, "__esModule", {
  value: true
});
native.default = void 0;

var _crypto$1 = _interopRequireDefault$4(require("crypto"));

function _interopRequireDefault$4(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default$5 = {
  randomUUID: _crypto$1.default.randomUUID
};
native.default = _default$5;

Object.defineProperty(v4$1, "__esModule", {
  value: true
});
v4$1.default = void 0;

var _native = _interopRequireDefault$3(native);

var _rng = _interopRequireDefault$3(rng$1);

var _stringify = stringify$3;

function _interopRequireDefault$3(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  if (_native.default.randomUUID && !buf && !options) {
    return _native.default.randomUUID();
  }

  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.unsafeStringify)(rnds);
}

var _default$4 = v4;
v4$1.default = _default$4;

var v5$1 = {};

var sha1$1 = {};

Object.defineProperty(sha1$1, "__esModule", {
  value: true
});
sha1$1.default = void 0;

var _crypto = _interopRequireDefault$2(require("crypto"));

function _interopRequireDefault$2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default$3 = sha1;
sha1$1.default = _default$3;

Object.defineProperty(v5$1, "__esModule", {
  value: true
});
v5$1.default = void 0;

var _v = _interopRequireDefault$1(v35$1);

var _sha = _interopRequireDefault$1(sha1$1);

function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default$2 = v5;
v5$1.default = _default$2;

var nil = {};

Object.defineProperty(nil, "__esModule", {
  value: true
});
nil.default = void 0;
var _default$1 = '00000000-0000-0000-0000-000000000000';
nil.default = _default$1;

var version$1 = {};

Object.defineProperty(version$1, "__esModule", {
  value: true
});
version$1.default = void 0;

var _validate = _interopRequireDefault(validate$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.slice(14, 15), 16);
}

var _default = version;
version$1.default = _default;

(function (exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	Object.defineProperty(exports, "NIL", {
	  enumerable: true,
	  get: function () {
	    return _nil.default;
	  }
	});
	Object.defineProperty(exports, "parse", {
	  enumerable: true,
	  get: function () {
	    return _parse.default;
	  }
	});
	Object.defineProperty(exports, "stringify", {
	  enumerable: true,
	  get: function () {
	    return _stringify.default;
	  }
	});
	Object.defineProperty(exports, "v1", {
	  enumerable: true,
	  get: function () {
	    return _v.default;
	  }
	});
	Object.defineProperty(exports, "v3", {
	  enumerable: true,
	  get: function () {
	    return _v2.default;
	  }
	});
	Object.defineProperty(exports, "v4", {
	  enumerable: true,
	  get: function () {
	    return _v3.default;
	  }
	});
	Object.defineProperty(exports, "v5", {
	  enumerable: true,
	  get: function () {
	    return _v4.default;
	  }
	});
	Object.defineProperty(exports, "validate", {
	  enumerable: true,
	  get: function () {
	    return _validate.default;
	  }
	});
	Object.defineProperty(exports, "version", {
	  enumerable: true,
	  get: function () {
	    return _version.default;
	  }
	});

	var _v = _interopRequireDefault(v1$1);

	var _v2 = _interopRequireDefault(v3$1);

	var _v3 = _interopRequireDefault(v4$1);

	var _v4 = _interopRequireDefault(v5$1);

	var _nil = _interopRequireDefault(nil);

	var _version = _interopRequireDefault(version$1);

	var _validate = _interopRequireDefault(validate$1);

	var _stringify = _interopRequireDefault(stringify$3);

	var _parse = _interopRequireDefault(parse$3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
} (dist));

/* eslint complexity: [2, 18], max-statements: [2, 33] */
var shams = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = shams;

var hasSymbols$1 = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr$1 = Object.prototype.toString;
var funcType = '[object Function]';

var implementation$1 = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr$1.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

var implementation = implementation$1;

var functionBind = Function.prototype.bind || implementation;

var bind$1 = functionBind;

var src = bind$1.call(Function.call, Object.prototype.hasOwnProperty);

var undefined$1;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError$1 = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError$1();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = hasSymbols$1();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined$1 : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined$1 : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined$1,
	'%AsyncFromSyncIteratorPrototype%': undefined$1,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined$1 : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined$1 : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined$1,
	'%Map%': typeof Map === 'undefined' ? undefined$1 : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined$1 : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined$1 : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined$1,
	'%Symbol%': hasSymbols ? Symbol : undefined$1,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError$1,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined$1 : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = functionBind;
var hasOwn$1 = src;
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName$1 = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar$1 = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath$2 = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName$1, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar$1, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn$1(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn$1(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError$1('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

var getIntrinsic = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError$1('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError$1('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath$2(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn$1(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError$1('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined$1;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn$1(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

var callBindExports = {};
var callBind$1 = {
  get exports(){ return callBindExports; },
  set exports(v){ callBindExports = v; },
};

(function (module) {

	var bind = functionBind;
	var GetIntrinsic = getIntrinsic;

	var $apply = GetIntrinsic('%Function.prototype.apply%');
	var $call = GetIntrinsic('%Function.prototype.call%');
	var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

	var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
	var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
	var $max = GetIntrinsic('%Math.max%');

	if ($defineProperty) {
		try {
			$defineProperty({}, 'a', { value: 1 });
		} catch (e) {
			// IE 8 has a broken defineProperty
			$defineProperty = null;
		}
	}

	module.exports = function callBind(originalFunction) {
		var func = $reflectApply(bind, $call, arguments);
		if ($gOPD && $defineProperty) {
			var desc = $gOPD(func, 'length');
			if (desc.configurable) {
				// original length, plus the receiver, minus any additional arguments (after the receiver)
				$defineProperty(
					func,
					'length',
					{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
				);
			}
		}
		return func;
	};

	var applyBind = function applyBind() {
		return $reflectApply(bind, $apply, arguments);
	};

	if ($defineProperty) {
		$defineProperty(module.exports, 'apply', { value: applyBind });
	} else {
		module.exports.apply = applyBind;
	}
} (callBind$1));

var GetIntrinsic$1 = getIntrinsic;

var callBind = callBindExports;

var $indexOf = callBind(GetIntrinsic$1('String.prototype.indexOf'));

var callBound$1 = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic$1(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

var util_inspect = require('util').inspect;

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString$2 = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var match = String.prototype.match;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
    [].__proto__ === Array.prototype // eslint-disable-line no-proto
        ? function (O) {
            return O.__proto__; // eslint-disable-line no-proto
        }
        : null
);

var inspectCustom = util_inspect.custom;
var inspectSymbol = inspectCustom && isSymbol$5(inspectCustom) ? inspectCustom : null;
var toStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag !== 'undefined' ? Symbol.toStringTag : null;

var objectInspect = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has$3(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has$3(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has$3(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean') {
        throw new TypeError('option "customInspect", if provided, must be `true` or `false`');
    }

    if (
        has$3(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('options "indent" must be "\\t", an integer > 0, or `null`');
    }

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        return String(obj);
    }
    if (typeof obj === 'bigint') {
        return String(obj) + 'n';
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray$e(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has$3(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function') {
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + keys.join(', ') + ' }' : '');
    }
    if (isSymbol$5(obj)) {
        var symString = hasShammedSymbols ? String(obj).replace(/^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + String(obj.nodeName).toLowerCase() + '>';
        return s;
    }
    if (isArray$e(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + xs.join(', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + parts.join(', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function') {
            return obj[inspectSymbol]();
        } else if (typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap$2(obj)) {
        var mapParts = [];
        mapForEach.call(obj, function (value, key) {
            mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
        });
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet$2(obj)) {
        var setParts = [];
        setForEach.call(obj, function (value) {
            setParts.push(inspect(value, obj));
        });
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isWeakRef(obj)) {
        return weakCollectionOf('WeakRef');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate(obj) && !isRegExp$1(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? '' : 'null prototype';
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? toStr(obj).slice(8, -1) : protoTag ? 'Object' : '';
        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
        var tag = constructorTag + (stringTag || protoTag ? '[' + [].concat(stringTag || [], protoTag || []).join(': ') + '] ' : '');
        if (ys.length === 0) { return tag + '{}'; }
        if (indent) {
            return tag + '{' + indentedJoin(ys, indent) + '}';
        }
        return tag + '{ ' + ys.join(', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray$e(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isRegExp$1(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isString(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol$5(obj) {
    if (hasShammedSymbols) {
        return obj && typeof obj === 'object' && obj instanceof Symbol;
    }
    if (typeof obj === 'symbol') {
        return true;
    }
    if (!obj || typeof obj !== 'object' || !symToString) {
        return false;
    }
    try {
        symToString.call(obj);
        return true;
    } catch (e) {}
    return false;
}

function isBigInt(obj) {
    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
        return false;
    }
    try {
        bigIntValueOf.call(obj);
        return true;
    } catch (e) {}
    return false;
}

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has$3(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString$2.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap$2(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakRefDeref.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet$2(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString(str.slice(0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16).toUpperCase();
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : entries.join(', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = Array(opts.indent + 1).join(' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: Array(depth + 1).join(baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + xs.join(',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray$e(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has$3(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
            symMap['$' + syms[k]] = syms[k];
        }
    }

    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has$3(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        } else if ((/[^\w$]/).test(key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}

var GetIntrinsic = getIntrinsic;
var callBound = callBound$1;
var inspect = objectInspect;

var $TypeError = GetIntrinsic('%TypeError%');
var $WeakMap = GetIntrinsic('%WeakMap%', true);
var $Map = GetIntrinsic('%Map%', true);

var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas = callBound('Map.prototype.has', true);

/*
 * This function traverses the list returning the node corresponding to the
 * given key.
 *
 * That node is also moved to the head of the list, so that if it's accessed
 * again we don't need to traverse the whole list. By doing so, all the recently
 * used nodes can be accessed relatively quickly.
 */
var listGetNode = function (list, key) { // eslint-disable-line consistent-return
	for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
		if (curr.key === key) {
			prev.next = curr.next;
			curr.next = list.next;
			list.next = curr; // eslint-disable-line no-param-reassign
			return curr;
		}
	}
};

var listGet = function (objects, key) {
	var node = listGetNode(objects, key);
	return node && node.value;
};
var listSet = function (objects, key, value) {
	var node = listGetNode(objects, key);
	if (node) {
		node.value = value;
	} else {
		// Prepend the new node to the beginning of the list
		objects.next = { // eslint-disable-line no-param-reassign
			key: key,
			next: objects.next,
			value: value
		};
	}
};
var listHas = function (objects, key) {
	return !!listGetNode(objects, key);
};

var sideChannel = function getSideChannel() {
	var $wm;
	var $m;
	var $o;
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapGet($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapGet($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listGet($o, key);
				}
			}
		},
		has: function (key) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapHas($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapHas($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listHas($o, key);
				}
			}
			return false;
		},
		set: function (key, value) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if (!$wm) {
					$wm = new $WeakMap();
				}
				$weakMapSet($wm, key, value);
			} else if ($Map) {
				if (!$m) {
					$m = new $Map();
				}
				$mapSet($m, key, value);
			} else {
				if (!$o) {
					/*
					 * Initialize the linked list as an empty node, so that we don't have
					 * to special-case handling of the first node: we can always refer to
					 * it as (previous node).next, instead of something like (list).head
					 */
					$o = { key: {}, next: null };
				}
				listSet($o, key, value);
			}
		}
	};
	return channel;
};

var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

var formats$3 = {
    'default': Format.RFC3986,
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return String(value);
        }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
};

var formats$2 = formats$3;

var has$2 = Object.prototype.hasOwnProperty;
var isArray$d = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray$d(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray$d(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has$2.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray$d(target) && !isArray$d(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray$d(target) && isArray$d(source)) {
        source.forEach(function (item, i) {
            if (has$2.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has$2.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset, kind, format) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
            || (format === formats$2.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        /* eslint operator-linebreak: [2, "before"] */
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer$4 = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray$d(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

var utils$2 = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer$4,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};

var getSideChannel = sideChannel;
var utils$1 = utils$2;
var formats$1 = formats$3;
var has$1 = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray$c = Array.isArray;
var split = String.prototype.split;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray$c(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats$1['default'];
var defaults$1 = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils$1.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats$1.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var sentinel = {};

var stringify$1 = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    commaRoundTrip,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    format,
    formatter,
    encodeValuesOnly,
    charset,
    sideChannel
) {
    var obj = object;

    var tmpSc = sideChannel;
    var step = 0;
    var findFlag = false;
    while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {
        // Where object last appeared in the ref tree
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== 'undefined') {
            if (pos === step) {
                throw new RangeError('Cyclic object value');
            } else {
                findFlag = true; // Break while
            }
        }
        if (typeof tmpSc.get(sentinel) === 'undefined') {
            step = 0;
        }
    }

    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray$c(obj)) {
        obj = utils$1.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        });
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults$1.encoder, charset, 'key', format) : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils$1.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults$1.encoder, charset, 'key', format);
            if (generateArrayPrefix === 'comma' && encodeValuesOnly) {
                var valuesArray = split.call(String(obj), ',');
                var valuesJoined = '';
                for (var i = 0; i < valuesArray.length; ++i) {
                    valuesJoined += (i === 0 ? '' : ',') + formatter(encoder(valuesArray[i], defaults$1.encoder, charset, 'value', format));
                }
                return [formatter(keyValue) + (commaRoundTrip && isArray$c(obj) && valuesArray.length === 1 ? '[]' : '') + '=' + valuesJoined];
            }
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults$1.encoder, charset, 'value', format))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (generateArrayPrefix === 'comma' && isArray$c(obj)) {
        // we need to join elements in
        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void undefined }];
    } else if (isArray$c(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    var adjustedPrefix = commaRoundTrip && isArray$c(obj) && obj.length === 1 ? prefix + '[]' : prefix;

    for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === 'object' && typeof key.value !== 'undefined' ? key.value : obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var keyPrefix = isArray$c(obj)
            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjustedPrefix, key) : adjustedPrefix
            : adjustedPrefix + (allowDots ? '.' + key : '[' + key + ']');

        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify(
            value,
            keyPrefix,
            generateArrayPrefix,
            commaRoundTrip,
            strictNullHandling,
            skipNulls,
            encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset,
            valueSideChannel
        ));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults$1;
    }

    if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults$1.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats$1['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has$1.call(formats$1.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats$1.formatters[format];

    var filter = defaults$1.filter;
    if (typeof opts.filter === 'function' || isArray$c(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults$1.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults$1.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults$1.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults$1.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults$1.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults$1.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults$1.encodeValuesOnly,
        filter: filter,
        format: format,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults$1.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults$1.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults$1.strictNullHandling
    };
};

var stringify_1 = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray$c(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
    if (opts && 'commaRoundTrip' in opts && typeof opts.commaRoundTrip !== 'boolean') {
        throw new TypeError('`commaRoundTrip` must be a boolean, or absent');
    }
    var commaRoundTrip = generateArrayPrefix === 'comma' && opts && opts.commaRoundTrip;

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    var sideChannel = getSideChannel();
    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify$1(
            obj[key],
            key,
            generateArrayPrefix,
            commaRoundTrip,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset,
            sideChannel
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};

var utils = utils$2;

var has = Object.prototype.hasOwnProperty;
var isArray$b = Array.isArray;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    allowSparse: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function (val, options) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
            val = utils.maybeMap(
                parseArrayValue(part.slice(pos + 1), options),
                function (encodedVal) {
                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');
                }
            );
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray$b(val) ? [val] : val;
        }

        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else if (cleanRoot !== '__proto__') {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

var parse$1 = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    if (options.allowSparse === true) {
        return obj;
    }

    return utils.compact(obj);
};

var stringify = stringify_1;
var parse = parse$1;
var formats = formats$3;

var lib = {
    formats: formats,
    parse: parse,
    stringify: stringify
};

var QueryString = {
  parse: function parse(str) {
    return lib.parse(str, {
      ignoreQueryPrefix: true
    });
  },
  stringify: function stringify(str) {
    return lib.stringify(str, {
      arrayFormat: 'brackets'
    });
  }
};

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var pluralizeExports = {};
var pluralize$1 = {
  get exports(){ return pluralizeExports; },
  set exports(v){ pluralizeExports = v; },
};

/* global define */

(function (module, exports) {
	(function (root, pluralize) {
	  /* istanbul ignore else */
	  if (typeof commonjsRequire === 'function' && 'object' === 'object' && 'object' === 'object') {
	    // Node.
	    module.exports = pluralize();
	  } else {
	    // Browser global.
	    root.pluralize = pluralize();
	  }
	})(commonjsGlobal, function () {
	  // Rule storage - pluralize and singularize need to be run sequentially,
	  // while other rules can be optimized using an object for instant lookups.
	  var pluralRules = [];
	  var singularRules = [];
	  var uncountables = {};
	  var irregularPlurals = {};
	  var irregularSingles = {};

	  /**
	   * Sanitize a pluralization rule to a usable regular expression.
	   *
	   * @param  {(RegExp|string)} rule
	   * @return {RegExp}
	   */
	  function sanitizeRule (rule) {
	    if (typeof rule === 'string') {
	      return new RegExp('^' + rule + '$', 'i');
	    }

	    return rule;
	  }

	  /**
	   * Pass in a word token to produce a function that can replicate the case on
	   * another word.
	   *
	   * @param  {string}   word
	   * @param  {string}   token
	   * @return {Function}
	   */
	  function restoreCase (word, token) {
	    // Tokens are an exact match.
	    if (word === token) return token;

	    // Lower cased words. E.g. "hello".
	    if (word === word.toLowerCase()) return token.toLowerCase();

	    // Upper cased words. E.g. "WHISKY".
	    if (word === word.toUpperCase()) return token.toUpperCase();

	    // Title cased words. E.g. "Title".
	    if (word[0] === word[0].toUpperCase()) {
	      return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
	    }

	    // Lower cased words. E.g. "test".
	    return token.toLowerCase();
	  }

	  /**
	   * Interpolate a regexp string.
	   *
	   * @param  {string} str
	   * @param  {Array}  args
	   * @return {string}
	   */
	  function interpolate (str, args) {
	    return str.replace(/\$(\d{1,2})/g, function (match, index) {
	      return args[index] || '';
	    });
	  }

	  /**
	   * Replace a word using a rule.
	   *
	   * @param  {string} word
	   * @param  {Array}  rule
	   * @return {string}
	   */
	  function replace (word, rule) {
	    return word.replace(rule[0], function (match, index) {
	      var result = interpolate(rule[1], arguments);

	      if (match === '') {
	        return restoreCase(word[index - 1], result);
	      }

	      return restoreCase(match, result);
	    });
	  }

	  /**
	   * Sanitize a word by passing in the word and sanitization rules.
	   *
	   * @param  {string}   token
	   * @param  {string}   word
	   * @param  {Array}    rules
	   * @return {string}
	   */
	  function sanitizeWord (token, word, rules) {
	    // Empty string or doesn't need fixing.
	    if (!token.length || uncountables.hasOwnProperty(token)) {
	      return word;
	    }

	    var len = rules.length;

	    // Iterate over the sanitization rules and use the first one to match.
	    while (len--) {
	      var rule = rules[len];

	      if (rule[0].test(word)) return replace(word, rule);
	    }

	    return word;
	  }

	  /**
	   * Replace a word with the updated word.
	   *
	   * @param  {Object}   replaceMap
	   * @param  {Object}   keepMap
	   * @param  {Array}    rules
	   * @return {Function}
	   */
	  function replaceWord (replaceMap, keepMap, rules) {
	    return function (word) {
	      // Get the correct token and case restoration functions.
	      var token = word.toLowerCase();

	      // Check against the keep object map.
	      if (keepMap.hasOwnProperty(token)) {
	        return restoreCase(word, token);
	      }

	      // Check against the replacement map for a direct word replacement.
	      if (replaceMap.hasOwnProperty(token)) {
	        return restoreCase(word, replaceMap[token]);
	      }

	      // Run all the rules against the word.
	      return sanitizeWord(token, word, rules);
	    };
	  }

	  /**
	   * Check if a word is part of the map.
	   */
	  function checkWord (replaceMap, keepMap, rules, bool) {
	    return function (word) {
	      var token = word.toLowerCase();

	      if (keepMap.hasOwnProperty(token)) return true;
	      if (replaceMap.hasOwnProperty(token)) return false;

	      return sanitizeWord(token, token, rules) === token;
	    };
	  }

	  /**
	   * Pluralize or singularize a word based on the passed in count.
	   *
	   * @param  {string}  word      The word to pluralize
	   * @param  {number}  count     How many of the word exist
	   * @param  {boolean} inclusive Whether to prefix with the number (e.g. 3 ducks)
	   * @return {string}
	   */
	  function pluralize (word, count, inclusive) {
	    var pluralized = count === 1
	      ? pluralize.singular(word) : pluralize.plural(word);

	    return (inclusive ? count + ' ' : '') + pluralized;
	  }

	  /**
	   * Pluralize a word.
	   *
	   * @type {Function}
	   */
	  pluralize.plural = replaceWord(
	    irregularSingles, irregularPlurals, pluralRules
	  );

	  /**
	   * Check if a word is plural.
	   *
	   * @type {Function}
	   */
	  pluralize.isPlural = checkWord(
	    irregularSingles, irregularPlurals, pluralRules
	  );

	  /**
	   * Singularize a word.
	   *
	   * @type {Function}
	   */
	  pluralize.singular = replaceWord(
	    irregularPlurals, irregularSingles, singularRules
	  );

	  /**
	   * Check if a word is singular.
	   *
	   * @type {Function}
	   */
	  pluralize.isSingular = checkWord(
	    irregularPlurals, irregularSingles, singularRules
	  );

	  /**
	   * Add a pluralization rule to the collection.
	   *
	   * @param {(string|RegExp)} rule
	   * @param {string}          replacement
	   */
	  pluralize.addPluralRule = function (rule, replacement) {
	    pluralRules.push([sanitizeRule(rule), replacement]);
	  };

	  /**
	   * Add a singularization rule to the collection.
	   *
	   * @param {(string|RegExp)} rule
	   * @param {string}          replacement
	   */
	  pluralize.addSingularRule = function (rule, replacement) {
	    singularRules.push([sanitizeRule(rule), replacement]);
	  };

	  /**
	   * Add an uncountable word rule.
	   *
	   * @param {(string|RegExp)} word
	   */
	  pluralize.addUncountableRule = function (word) {
	    if (typeof word === 'string') {
	      uncountables[word.toLowerCase()] = true;
	      return;
	    }

	    // Set singular and plural references for the word.
	    pluralize.addPluralRule(word, '$0');
	    pluralize.addSingularRule(word, '$0');
	  };

	  /**
	   * Add an irregular word definition.
	   *
	   * @param {string} single
	   * @param {string} plural
	   */
	  pluralize.addIrregularRule = function (single, plural) {
	    plural = plural.toLowerCase();
	    single = single.toLowerCase();

	    irregularSingles[single] = plural;
	    irregularPlurals[plural] = single;
	  };

	  /**
	   * Irregular rules.
	   */
	  [
	    // Pronouns.
	    ['I', 'we'],
	    ['me', 'us'],
	    ['he', 'they'],
	    ['she', 'they'],
	    ['them', 'them'],
	    ['myself', 'ourselves'],
	    ['yourself', 'yourselves'],
	    ['itself', 'themselves'],
	    ['herself', 'themselves'],
	    ['himself', 'themselves'],
	    ['themself', 'themselves'],
	    ['is', 'are'],
	    ['was', 'were'],
	    ['has', 'have'],
	    ['this', 'these'],
	    ['that', 'those'],
	    // Words ending in with a consonant and `o`.
	    ['echo', 'echoes'],
	    ['dingo', 'dingoes'],
	    ['volcano', 'volcanoes'],
	    ['tornado', 'tornadoes'],
	    ['torpedo', 'torpedoes'],
	    // Ends with `us`.
	    ['genus', 'genera'],
	    ['viscus', 'viscera'],
	    // Ends with `ma`.
	    ['stigma', 'stigmata'],
	    ['stoma', 'stomata'],
	    ['dogma', 'dogmata'],
	    ['lemma', 'lemmata'],
	    ['schema', 'schemata'],
	    ['anathema', 'anathemata'],
	    // Other irregular rules.
	    ['ox', 'oxen'],
	    ['axe', 'axes'],
	    ['die', 'dice'],
	    ['yes', 'yeses'],
	    ['foot', 'feet'],
	    ['eave', 'eaves'],
	    ['goose', 'geese'],
	    ['tooth', 'teeth'],
	    ['quiz', 'quizzes'],
	    ['human', 'humans'],
	    ['proof', 'proofs'],
	    ['carve', 'carves'],
	    ['valve', 'valves'],
	    ['looey', 'looies'],
	    ['thief', 'thieves'],
	    ['groove', 'grooves'],
	    ['pickaxe', 'pickaxes'],
	    ['passerby', 'passersby']
	  ].forEach(function (rule) {
	    return pluralize.addIrregularRule(rule[0], rule[1]);
	  });

	  /**
	   * Pluralization rules.
	   */
	  [
	    [/s?$/i, 's'],
	    [/[^\u0000-\u007F]$/i, '$0'],
	    [/([^aeiou]ese)$/i, '$1'],
	    [/(ax|test)is$/i, '$1es'],
	    [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, '$1es'],
	    [/(e[mn]u)s?$/i, '$1s'],
	    [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, '$1'],
	    [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
	    [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
	    [/(seraph|cherub)(?:im)?$/i, '$1im'],
	    [/(her|at|gr)o$/i, '$1oes'],
	    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
	    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
	    [/sis$/i, 'ses'],
	    [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
	    [/([^aeiouy]|qu)y$/i, '$1ies'],
	    [/([^ch][ieo][ln])ey$/i, '$1ies'],
	    [/(x|ch|ss|sh|zz)$/i, '$1es'],
	    [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
	    [/\b((?:tit)?m|l)(?:ice|ouse)$/i, '$1ice'],
	    [/(pe)(?:rson|ople)$/i, '$1ople'],
	    [/(child)(?:ren)?$/i, '$1ren'],
	    [/eaux$/i, '$0'],
	    [/m[ae]n$/i, 'men'],
	    ['thou', 'you']
	  ].forEach(function (rule) {
	    return pluralize.addPluralRule(rule[0], rule[1]);
	  });

	  /**
	   * Singularization rules.
	   */
	  [
	    [/s$/i, ''],
	    [/(ss)$/i, '$1'],
	    [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
	    [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
	    [/ies$/i, 'y'],
	    [/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i, '$1ie'],
	    [/\b(mon|smil)ies$/i, '$1ey'],
	    [/\b((?:tit)?m|l)ice$/i, '$1ouse'],
	    [/(seraph|cherub)im$/i, '$1'],
	    [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, '$1'],
	    [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, '$1sis'],
	    [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'],
	    [/(test)(?:is|es)$/i, '$1is'],
	    [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
	    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
	    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
	    [/(alumn|alg|vertebr)ae$/i, '$1a'],
	    [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
	    [/(matr|append)ices$/i, '$1ix'],
	    [/(pe)(rson|ople)$/i, '$1rson'],
	    [/(child)ren$/i, '$1'],
	    [/(eau)x?$/i, '$1'],
	    [/men$/i, 'man']
	  ].forEach(function (rule) {
	    return pluralize.addSingularRule(rule[0], rule[1]);
	  });

	  /**
	   * Uncountable rules.
	   */
	  [
	    // Singular words with no plurals.
	    'adulthood',
	    'advice',
	    'agenda',
	    'aid',
	    'aircraft',
	    'alcohol',
	    'ammo',
	    'analytics',
	    'anime',
	    'athletics',
	    'audio',
	    'bison',
	    'blood',
	    'bream',
	    'buffalo',
	    'butter',
	    'carp',
	    'cash',
	    'chassis',
	    'chess',
	    'clothing',
	    'cod',
	    'commerce',
	    'cooperation',
	    'corps',
	    'debris',
	    'diabetes',
	    'digestion',
	    'elk',
	    'energy',
	    'equipment',
	    'excretion',
	    'expertise',
	    'firmware',
	    'flounder',
	    'fun',
	    'gallows',
	    'garbage',
	    'graffiti',
	    'hardware',
	    'headquarters',
	    'health',
	    'herpes',
	    'highjinks',
	    'homework',
	    'housework',
	    'information',
	    'jeans',
	    'justice',
	    'kudos',
	    'labour',
	    'literature',
	    'machinery',
	    'mackerel',
	    'mail',
	    'media',
	    'mews',
	    'moose',
	    'music',
	    'mud',
	    'manga',
	    'news',
	    'only',
	    'personnel',
	    'pike',
	    'plankton',
	    'pliers',
	    'police',
	    'pollution',
	    'premises',
	    'rain',
	    'research',
	    'rice',
	    'salmon',
	    'scissors',
	    'series',
	    'sewage',
	    'shambles',
	    'shrimp',
	    'software',
	    'species',
	    'staff',
	    'swine',
	    'tennis',
	    'traffic',
	    'transportation',
	    'trout',
	    'tuna',
	    'wealth',
	    'welfare',
	    'whiting',
	    'wildebeest',
	    'wildlife',
	    'you',
	    /pok[eé]mon$/i,
	    // Regexes.
	    /[^aeiou]ese$/i, // "chinese", "japanese"
	    /deer$/i, // "deer", "reindeer"
	    /fish$/i, // "fish", "blowfish", "angelfish"
	    /measles$/i,
	    /o[iu]s$/i, // "carnivorous"
	    /pox$/i, // "chickpox", "smallpox"
	    /sheep$/i
	  ].forEach(pluralize.addUncountableRule);

	  return pluralize;
	});
} (pluralize$1));

var pluralize = pluralizeExports;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */

var isArray$a = Array.isArray;

var isArray_1 = isArray$a;

/** Detect free variable `global` from Node.js. */

var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal$1;

var freeGlobal = _freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$8 = freeGlobal || freeSelf || Function('return this')();

var _root = root$8;

var root$7 = _root;

/** Built-in value references. */
var Symbol$7 = root$7.Symbol;

var _Symbol = Symbol$7;

var Symbol$6 = _Symbol;

/** Used for built-in method references. */
var objectProto$e = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$b = objectProto$e.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$e.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$6 ? Symbol$6.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$1(value) {
  var isOwn = hasOwnProperty$b.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag$1;

/** Used for built-in method references. */

var objectProto$d = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$d.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$1(value) {
  return nativeObjectToString.call(value);
}

var _objectToString = objectToString$1;

var Symbol$5 = _Symbol,
    getRawTag = _getRawTag,
    objectToString = _objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$5 ? Symbol$5.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$5(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

var _baseGetTag = baseGetTag$5;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */

function isObjectLike$8(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike$8;

var baseGetTag$4 = _baseGetTag,
    isObjectLike$7 = isObjectLike_1;

/** `Object#toString` result references. */
var symbolTag$3 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$4(value) {
  return typeof value == 'symbol' ||
    (isObjectLike$7(value) && baseGetTag$4(value) == symbolTag$3);
}

var isSymbol_1 = isSymbol$4;

var isArray$9 = isArray_1,
    isSymbol$3 = isSymbol_1;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey$3(value, object) {
  if (isArray$9(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol$3(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey$3;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */

function isObject$8(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject$8;

var baseGetTag$3 = _baseGetTag,
    isObject$7 = isObject_1;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$2(value) {
  if (!isObject$7(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag$3(value);
  return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction$2;

var root$6 = _root;

/** Used to detect overreaching core-js shims. */
var coreJsData$1 = root$6['__core-js_shared__'];

var _coreJsData = coreJsData$1;

var coreJsData = _coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$1(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked$1;

/** Used for built-in method references. */

var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource$2(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource$2;

var isFunction$1 = isFunction_1,
    isMasked = _isMasked,
    isObject$6 = isObject_1,
    toSource$1 = _toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto$c = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$c.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty$a).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$1(value) {
  if (!isObject$6(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction$1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource$1(value));
}

var _baseIsNative = baseIsNative$1;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */

function getValue$1(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue$1;

var baseIsNative = _baseIsNative,
    getValue = _getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$7(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

var _getNative = getNative$7;

var getNative$6 = _getNative;

/* Built-in method references that are verified to be native. */
var nativeCreate$4 = getNative$6(Object, 'create');

var _nativeCreate = nativeCreate$4;

var nativeCreate$3 = _nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear$1() {
  this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
  this.size = 0;
}

var _hashClear = hashClear$1;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function hashDelete$1(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete$1;

var nativeCreate$2 = _nativeCreate;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet$1(key) {
  var data = this.__data__;
  if (nativeCreate$2) {
    var result = data[key];
    return result === HASH_UNDEFINED$2 ? undefined : result;
  }
  return hasOwnProperty$9.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet$1;

var nativeCreate$1 = _nativeCreate;

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas$1(key) {
  var data = this.__data__;
  return nativeCreate$1 ? (data[key] !== undefined) : hasOwnProperty$8.call(data, key);
}

var _hashHas = hashHas$1;

var nativeCreate = _nativeCreate;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet$1(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet$1;

var hashClear = _hashClear,
    hashDelete = _hashDelete,
    hashGet = _hashGet,
    hashHas = _hashHas,
    hashSet = _hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash$1.prototype.clear = hashClear;
Hash$1.prototype['delete'] = hashDelete;
Hash$1.prototype.get = hashGet;
Hash$1.prototype.has = hashHas;
Hash$1.prototype.set = hashSet;

var _Hash = Hash$1;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */

function listCacheClear$1() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear$1;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */

function eq$3(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq$3;

var eq$2 = eq_1;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf$4(array, key) {
  var length = array.length;
  while (length--) {
    if (eq$2(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf$4;

var assocIndexOf$3 = _assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete$1(key) {
  var data = this.__data__,
      index = assocIndexOf$3(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete$1;

var assocIndexOf$2 = _assocIndexOf;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet$1(key) {
  var data = this.__data__,
      index = assocIndexOf$2(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet$1;

var assocIndexOf$1 = _assocIndexOf;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas$1(key) {
  return assocIndexOf$1(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas$1;

var assocIndexOf = _assocIndexOf;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet$1(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet$1;

var listCacheClear = _listCacheClear,
    listCacheDelete = _listCacheDelete,
    listCacheGet = _listCacheGet,
    listCacheHas = _listCacheHas,
    listCacheSet = _listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache$4(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache$4.prototype.clear = listCacheClear;
ListCache$4.prototype['delete'] = listCacheDelete;
ListCache$4.prototype.get = listCacheGet;
ListCache$4.prototype.has = listCacheHas;
ListCache$4.prototype.set = listCacheSet;

var _ListCache = ListCache$4;

var getNative$5 = _getNative,
    root$5 = _root;

/* Built-in method references that are verified to be native. */
var Map$4 = getNative$5(root$5, 'Map');

var _Map = Map$4;

var Hash = _Hash,
    ListCache$3 = _ListCache,
    Map$3 = _Map;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear$1() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map$3 || ListCache$3),
    'string': new Hash
  };
}

var _mapCacheClear = mapCacheClear$1;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */

function isKeyable$1(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable$1;

var isKeyable = _isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData$4(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData$4;

var getMapData$3 = _getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete$1(key) {
  var result = getMapData$3(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete$1;

var getMapData$2 = _getMapData;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet$1(key) {
  return getMapData$2(this, key).get(key);
}

var _mapCacheGet = mapCacheGet$1;

var getMapData$1 = _getMapData;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas$1(key) {
  return getMapData$1(this, key).has(key);
}

var _mapCacheHas = mapCacheHas$1;

var getMapData = _getMapData;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet$1(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet$1;

var mapCacheClear = _mapCacheClear,
    mapCacheDelete = _mapCacheDelete,
    mapCacheGet = _mapCacheGet,
    mapCacheHas = _mapCacheHas,
    mapCacheSet = _mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache$3(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache$3.prototype.clear = mapCacheClear;
MapCache$3.prototype['delete'] = mapCacheDelete;
MapCache$3.prototype.get = mapCacheGet;
MapCache$3.prototype.has = mapCacheHas;
MapCache$3.prototype.set = mapCacheSet;

var _MapCache = MapCache$3;

var MapCache$2 = _MapCache;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize$1(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize$1.Cache || MapCache$2);
  return memoized;
}

// Expose `MapCache`.
memoize$1.Cache = MapCache$2;

var memoize_1 = memoize$1;

var memoize = memoize_1;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped$1(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped$1;

var memoizeCapped = _memoizeCapped;

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath$1 = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath$1;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */

function arrayMap$1(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap$1;

var Symbol$4 = _Symbol,
    arrayMap = _arrayMap,
    isArray$8 = isArray_1,
    isSymbol$2 = isSymbol_1;

/** Used as references for various `Number` constants. */
var INFINITY$4 = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$2 = Symbol$4 ? Symbol$4.prototype : undefined,
    symbolToString = symbolProto$2 ? symbolProto$2.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString$1(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray$8(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString$1) + '';
  }
  if (isSymbol$2(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$4) ? '-0' : result;
}

var _baseToString = baseToString$1;

var baseToString = _baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString$1(value) {
  return value == null ? '' : baseToString(value);
}

var toString_1 = toString$1;

var isArray$7 = isArray_1,
    isKey$2 = _isKey,
    stringToPath = _stringToPath,
    toString = toString_1;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath$4(value, object) {
  if (isArray$7(value)) {
    return value;
  }
  return isKey$2(value, object) ? [value] : stringToPath(toString(value));
}

var _castPath = castPath$4;

var isSymbol$1 = isSymbol_1;

/** Used as references for various `Number` constants. */
var INFINITY$3 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey$5(value) {
  if (typeof value == 'string' || isSymbol$1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$3) ? '-0' : result;
}

var _toKey = toKey$5;

var castPath$3 = _castPath,
    toKey$4 = _toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet$3(object, path) {
  path = castPath$3(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey$4(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet$3;

var baseGet$2 = _baseGet;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get$1(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet$2(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get$1;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */

function arrayPush$3(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush$3;

var baseGetTag$2 = _baseGetTag,
    isObjectLike$6 = isObjectLike_1;

/** `Object#toString` result references. */
var argsTag$3 = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments$1(value) {
  return isObjectLike$6(value) && baseGetTag$2(value) == argsTag$3;
}

var _baseIsArguments = baseIsArguments$1;

var baseIsArguments = _baseIsArguments,
    isObjectLike$5 = isObjectLike_1;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments$3 = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike$5(value) && hasOwnProperty$7.call(value, 'callee') &&
    !propertyIsEnumerable$1.call(value, 'callee');
};

var isArguments_1 = isArguments$3;

var Symbol$3 = _Symbol,
    isArguments$2 = isArguments_1,
    isArray$6 = isArray_1;

/** Built-in value references. */
var spreadableSymbol = Symbol$3 ? Symbol$3.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable$1(value) {
  return isArray$6(value) || isArguments$2(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

var _isFlattenable = isFlattenable$1;

var arrayPush$2 = _arrayPush,
    isFlattenable = _isFlattenable;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten$3(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten$3(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush$2(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

var _baseFlatten = baseFlatten$3;

var baseFlatten$2 = _baseFlatten;

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0;

/**
 * Recursively flattens `array`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flattenDeep([1, [2, [3, [4]], 5]]);
 * // => [1, 2, 3, 4, 5]
 */
function flattenDeep(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten$2(array, INFINITY$2) : [];
}

var flattenDeep_1 = flattenDeep;

function _wrapRegExp() { _wrapRegExp = function _wrapRegExp(re, groups) { return new BabelRegExp(re, void 0, groups); }; var _super = RegExp.prototype, _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = new RegExp(re, flags); return _groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype); } function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { var i = g[name]; if ("number" == typeof i) groups[name] = result[i];else { for (var k = 0; void 0 === result[i[k]] && k + 1 < i.length;) { k++; } groups[name] = result[i[k]]; } return groups; }, Object.create(null)); } return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); if (result) { result.groups = buildGroups(result, this); var indices = result.indices; indices && (indices.groups = buildGroups(indices, this)); } return result; }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if ("string" == typeof substitution) { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { var group = groups[name]; return "$" + (Array.isArray(group) ? group.join("$") : group); })); } if ("function" == typeof substitution) { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = arguments; return "object" != _typeof(args[args.length - 1]) && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args); }); } return _super[Symbol.replace].call(this, str, substitution); }, _wrapRegExp.apply(this, arguments); }
var pending = {};
var counter = {};
var URL_MAX_LENGTH = 1024;
var ENCODED_COMMA = encodeURIComponent(',');
var arrayType = function arrayType(value) {
  return toJS(value);
};
var objectType = function objectType(value) {
  return toJS(value);
};
var dateType = function dateType(value) {
  return makeDate(value).toISOString();
};
var stringType = function stringType(value) {
  return value.toString();
};
var numberType = function numberType(value) {
  return Number(value);
};
var incrementor = function incrementor(key) {
  return function () {
    var count = (counter[key] || 0) + 1;
    counter[key] = count;
    return count;
  };
};
var decrementor = function decrementor(key) {
  return function () {
    var count = (counter[key] || 0) - 1;
    counter[key] = count;
    return count;
  };
};

/**
 * Singularizes record type

 * @param {string} recordType type of record
 * @returns {string}
 */
function singularizeType(recordType) {
  var typeParts = recordType.split('_');
  var endPart = typeParts[typeParts.length - 1];
  typeParts = typeParts.slice(0, -1);
  endPart = pluralize.singular(endPart);
  return [].concat(_toConsumableArray(typeParts), [endPart]).join('_');
}

/**
 * Build request url from base url, endpoint, query params, and ids.
 *

 * @returns {string} formatted url string
 */
function requestUrl(baseUrl, endpoint) {
  var queryParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var id = arguments.length > 3 ? arguments[3] : undefined;
  var queryParamString = '';
  if (Object.keys(queryParams).length > 0) {
    queryParamString = "?".concat(QueryString.stringify(queryParams));
  }
  var idForPath = '';
  if (id) {
    idForPath = "/".concat(id);
  }
  // Return full url
  return "".concat(baseUrl, "/").concat(endpoint).concat(idForPath).concat(queryParamString);
}
function newId() {
  return "tmp-".concat(dist.v1());
}
function idOrNewId(id) {
  return id || newId();
}

/**
 * Avoids making racing requests by blocking a request if an identical one is
 * already in-flight. Blocked requests will be resolved when the initial request
 * resolves by cloning the response.
 *

 * @param {string} key the unique key for the request
 * @param {Function} fn the function the generates the promise
 * @returns {Promise}
 */
function combineRacedRequests(key, fn) {
  var incrementBlocked = incrementor(key);
  var decrementBlocked = decrementor(key);

  // keep track of the number of callers waiting for this promise to resolve
  incrementBlocked();

  // Add the current call to our pending list in case another request comes in
  // before it resolves. If there is a request already pending, we'll use the
  // existing one instead
  if (!pending[key]) {
    pending[key] = fn.call();
  }
  return pending[key].finally(function () {
    var count = decrementBlocked();
    // if there are no more callers waiting for this promise to resolve (i.e. if
    // this is the last one), we can remove the reference to the pending promise
    // allowing subsequent requests to proceed unblocked.
    if (count === 0) delete pending[key];
  }).then(
  // if there are other callers waiting for this request to resolve, clone the
  // response before returning so that we can re-use it for the remaining callers
  function (response) {
    return response.clone();
  },
  // Bubble the error up to be handled by the consuming code
  function (error) {
    return Promise.reject(error);
  });
}
function fetchWithRetry(url, fetchOptions, attempts, delay) {
  var key = JSON.stringify({
    url: url,
    fetchOptions: fetchOptions
  });
  return combineRacedRequests(key, function () {
    return fetch(url, fetchOptions);
  }).catch(function (error) {
    var attemptsRemaining = attempts - 1;
    if (!attemptsRemaining) {
      throw error;
    }
    return new Promise(function (resolve) {
      return setTimeout(resolve, delay);
    }).then(function () {
      return fetchWithRetry(url, fetchOptions, attemptsRemaining, delay);
    });
  });
}

/**
 * convert a value into a date, pass Date or Moment instances thru
 * untouched

 * @param {*} value
 * @return {Date|Moment}
 */
function makeDate(value) {
  if (value instanceof Date || value._isAMomentObject) return value;
  return new Date(Date.parse(value));
}

/**
 * recursively walk an object and call the `iteratee` function for
 * each property. returns an array of results of calls to the iteratee.

 * @param {*} obj
 * @param {Function} iteratee
 * @param {string} prefix
 * @return Array
 */
function walk(obj, iteratee, prefix) {
  if (obj != null && _typeof(obj) === 'object') {
    return Object.keys(obj).map(function (prop) {
      return walk(obj[prop], iteratee, [prefix, prop].filter(function (x) {
        return x;
      }).join('.'));
    });
  }
  return iteratee(obj, prefix);
}

/**
 * deeply compare objects a and b and return object paths for attributes
 * which differ. it is important to note that this comparison is biased
 * toward object a. object a is walked and compared against values in
 * object b. if a property exists in object b, but not in object a, it
 * will not be counted as a difference.

 * @param {object} a
 * @param {object} b
 * @return Array<String>
 */
function diff() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return flattenDeep_1(walk(a, function (prevValue, path) {
    var currValue = get_1(b, path);
    return prevValue === currValue ? undefined : path;
  })).filter(function (x) {
    return x;
  });
}

/**
 * Parses JSONAPI error objects from a fetch response.
 * If the response's body is undefined or is not formatted with a top-level `errors` key
 * containing an array of errors, it builds a JSONAPI error object from the response status
 * and a `errorMessages` configuration.
 *
 * Errors that are returned which contain a status also have their `detail` overridden with
 * values from this configuration.
 *

 * @param {object} response
 *   a fetch response
 * @param {object} errorMessages
 *   store configuration of error messages corresponding to HTTP status codes
 * @return Array<Object> An array of JSONAPI errors
 */
function parseErrors(_x, _x2) {
  return _parseErrors.apply(this, arguments);
}

/**
 * Parses the pointer of the error to retrieve the index of the
 * record the error belongs to and the full path to the attribute
 * which will serve as the key for the error.
 *
 * If there is no parsed index, then assume the payload was for
 * a single record and default to 0.
 *
 * ex.
 *   error = {
 *     detail: "Foo can't be blank",
 *     source: { pointer: '/data/1/attributes/options/foo' },
 *     title: 'Invalid foo'
 *   }
 *
 * parsePointer(error)
 * > {
 *     index: 1,
 *     key: 'options.foo'
 *   }
 *

 * @param {object} error
 * @returns {object} the matching parts of the pointer
 */
function _parseErrors() {
  _parseErrors = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(response, errorMessages) {
    var json, statusError, _statusError, _statusError2;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            json = {};
            _context.prev = 1;
            _context.next = 4;
            return response.json();
          case 4:
            json = _context.sent;
            _context.next = 11;
            break;
          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](1);
            // server doesn't return a parsable response
            statusError = {
              detail: errorMessages[response.status] || errorMessages.default,
              status: response.status
            };
            return _context.abrupt("return", [statusError]);
          case 11:
            if (json.errors) {
              _context.next = 14;
              break;
            }
            _statusError = {
              detail: errorMessages[response.status] || errorMessages.default,
              status: response.status
            };
            return _context.abrupt("return", [_statusError]);
          case 14:
            if (Array.isArray(json.errors)) {
              _context.next = 17;
              break;
            }
            _statusError2 = {
              detail: 'Top level errors in response are not an array.',
              status: response.status
            };
            return _context.abrupt("return", [_statusError2]);
          case 17:
            return _context.abrupt("return", json.errors.map(function (error) {
              // override or add the configured error message based on response status
              if (error.status && errorMessages[error.status]) {
                error.detail = errorMessages[error.status];
              }
              return error;
            }));
          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 7]]);
  }));
  return _parseErrors.apply(this, arguments);
}
function parseErrorPointer() {
  var error = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var regex = /*#__PURE__*/_wrapRegExp(/\/data\/(\d+)?\/?attributes\/(.*)$/, {
    index: 1,
    key: 2
  });
  var match = get_1(error, 'source.pointer', '').match(regex);
  var _ref = (match === null || match === void 0 ? void 0 : match.groups) || {},
    _ref$index = _ref.index,
    index = _ref$index === void 0 ? 0 : _ref$index,
    key = _ref.key;
  return {
    index: parseInt(index),
    key: key === null || key === void 0 ? void 0 : key.replace(/\//g, '.')
  };
}

/**
 * Splits an array of ids into a series of strings that can be used to form
 * queries that conform to a max length of URL_MAX_LENGTH. This is to prevent 414 errors.

 * @param {Array} ids an array of ids that will be used in the string
 * @param {string} restOfUrl the additional text URL that will be passed to the server
 */

function deriveIdQueryStrings(ids) {
  var restOfUrl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var maxLength = URL_MAX_LENGTH - restOfUrl.length - encodeURIComponent('filter[ids]=,,').length;
  ids = ids.map(String);
  var firstId = ids.shift();
  var encodedIds = ids.reduce(function (nestedArray, id) {
    var workingString = nestedArray[nestedArray.length - 1];
    var longerString = "".concat(workingString).concat(ENCODED_COMMA).concat(id);
    if (longerString.length < maxLength) {
      nestedArray[nestedArray.length - 1] = longerString;
    } else {
      nestedArray.push(id);
    }
    return nestedArray;
  }, [firstId]);
  return encodedIds.map(decodeURIComponent);
}

/**
 * Utility class used to store the schema
 * of model attribute definitions
 *
 * @class Schema
 */
var Schema = /*#__PURE__*/function () {
  function Schema() {
    _classCallCheck(this, Schema);
    _defineProperty$1(this, "relations", {});
  }
  _createClass(Schema, [{
    key: "addRelationship",
    value: function addRelationship(_ref) {
      var type = _ref.type,
        property = _ref.property,
        dataType = _ref.dataType;
      this.relations[type] = this.relations[type] || {};
      this.relations[type][property] = {
        dataType: dataType
      };
    }

    /**
     * Adds a validation to either the schema `structure` (for attributes) or `relations` (for relationships)
      * @param {object} options includes `type`, `property`, and `validator`
     */
  }, {
    key: "addValidation",
    value: function addValidation(_ref2) {
      var type = _ref2.type,
        property = _ref2.property,
        validator = _ref2.validator;
      this.relations[type][property].validator = validator;
    }
  }]);
  return Schema;
}();
var schema = new Schema();

var ListCache$2 = _ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear$1() {
  this.__data__ = new ListCache$2;
  this.size = 0;
}

var _stackClear = stackClear$1;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function stackDelete$1(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete$1;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function stackGet$1(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet$1;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function stackHas$1(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas$1;

var ListCache$1 = _ListCache,
    Map$2 = _Map,
    MapCache$1 = _MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE$1 = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet$1(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache$1) {
    var pairs = data.__data__;
    if (!Map$2 || (pairs.length < LARGE_ARRAY_SIZE$1 - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache$1(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet$1;

var ListCache = _ListCache,
    stackClear = _stackClear,
    stackDelete = _stackDelete,
    stackGet = _stackGet,
    stackHas = _stackHas,
    stackSet = _stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack$3(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack$3.prototype.clear = stackClear;
Stack$3.prototype['delete'] = stackDelete;
Stack$3.prototype.get = stackGet;
Stack$3.prototype.has = stackHas;
Stack$3.prototype.set = stackSet;

var _Stack = Stack$3;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */

function arrayEach$1(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var _arrayEach = arrayEach$1;

var getNative$4 = _getNative;

var defineProperty$2 = (function() {
  try {
    var func = getNative$4(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty = defineProperty$2;

var defineProperty$1 = _defineProperty;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue$2(object, key, value) {
  if (key == '__proto__' && defineProperty$1) {
    defineProperty$1(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue$2;

var baseAssignValue$1 = _baseAssignValue,
    eq$1 = eq_1;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue$3(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$6.call(object, key) && eq$1(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue$1(object, key, value);
  }
}

var _assignValue = assignValue$3;

var assignValue$2 = _assignValue,
    baseAssignValue = _baseAssignValue;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject$4(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue$2(object, key, newValue);
    }
  }
  return object;
}

var _copyObject = copyObject$4;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */

function baseTimes$2(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes$2;

var isBufferExports = {};
var isBuffer$3 = {
  get exports(){ return isBufferExports; },
  set exports(v){ isBufferExports = v; },
};

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */

function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

(function (module, exports) {
	var root = _root,
	    stubFalse = stubFalse_1;

	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse;

	module.exports = isBuffer;
} (isBuffer$3, isBufferExports));

/** Used as references for various `Number` constants. */

var MAX_SAFE_INTEGER$2 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex$3(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$2 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex$3;

/** Used as references for various `Number` constants. */

var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$3(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var isLength_1 = isLength$3;

var baseGetTag$1 = _baseGetTag,
    isLength$2 = isLength_1,
    isObjectLike$4 = isObjectLike_1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$2 = '[object Array]',
    boolTag$3 = '[object Boolean]',
    dateTag$3 = '[object Date]',
    errorTag$2 = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$5 = '[object Map]',
    numberTag$3 = '[object Number]',
    objectTag$3 = '[object Object]',
    regexpTag$3 = '[object RegExp]',
    setTag$5 = '[object Set]',
    stringTag$3 = '[object String]',
    weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag$3 = '[object ArrayBuffer]',
    dataViewTag$4 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] =
typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] =
typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] =
typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] =
typedArrayTags[uint32Tag$2] = true;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] =
typedArrayTags[arrayBufferTag$3] = typedArrayTags[boolTag$3] =
typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$3] =
typedArrayTags[errorTag$2] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag$5] = typedArrayTags[numberTag$3] =
typedArrayTags[objectTag$3] = typedArrayTags[regexpTag$3] =
typedArrayTags[setTag$5] = typedArrayTags[stringTag$3] =
typedArrayTags[weakMapTag$2] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray$1(value) {
  return isObjectLike$4(value) &&
    isLength$2(value.length) && !!typedArrayTags[baseGetTag$1(value)];
}

var _baseIsTypedArray = baseIsTypedArray$1;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */

function baseUnary$3(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary$3;

var _nodeUtilExports = {};
var _nodeUtil = {
  get exports(){ return _nodeUtilExports; },
  set exports(v){ _nodeUtilExports = v; },
};

(function (module, exports) {
	var freeGlobal = _freeGlobal;

	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && freeGlobal.process;

	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    // Use `util.types` for Node.js 10+.
	    var types = freeModule && freeModule.require && freeModule.require('util').types;

	    if (types) {
	      return types;
	    }

	    // Legacy `process.binding('util')` for Node.js < 10.
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());

	module.exports = nodeUtil;
} (_nodeUtil, _nodeUtilExports));

var baseIsTypedArray = _baseIsTypedArray,
    baseUnary$2 = _baseUnary,
    nodeUtil$2 = _nodeUtilExports;

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil$2 && nodeUtil$2.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray$2 = nodeIsTypedArray ? baseUnary$2(nodeIsTypedArray) : baseIsTypedArray;

var isTypedArray_1 = isTypedArray$2;

var baseTimes$1 = _baseTimes,
    isArguments$1 = isArguments_1,
    isArray$5 = isArray_1,
    isBuffer$2 = isBufferExports,
    isIndex$2 = _isIndex,
    isTypedArray$1 = isTypedArray_1;

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys$2(value, inherited) {
  var isArr = isArray$5(value),
      isArg = !isArr && isArguments$1(value),
      isBuff = !isArr && !isArg && isBuffer$2(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray$1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes$1(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$5.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex$2(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys$2;

/** Used for built-in method references. */

var objectProto$6 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype$3(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$6;

  return value === proto;
}

var _isPrototype = isPrototype$3;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */

function overArg$2(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg$2;

var overArg$1 = _overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys$1 = overArg$1(Object.keys, Object);

var _nativeKeys = nativeKeys$1;

var isPrototype$2 = _isPrototype,
    nativeKeys = _nativeKeys;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys$1(object) {
  if (!isPrototype$2(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$4.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys$1;

var isFunction = isFunction_1,
    isLength$1 = isLength_1;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$4(value) {
  return value != null && isLength$1(value.length) && !isFunction(value);
}

var isArrayLike_1 = isArrayLike$4;

var arrayLikeKeys$1 = _arrayLikeKeys,
    baseKeys = _baseKeys,
    isArrayLike$3 = isArrayLike_1;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys$5(object) {
  return isArrayLike$3(object) ? arrayLikeKeys$1(object) : baseKeys(object);
}

var keys_1 = keys$5;

var copyObject$3 = _copyObject,
    keys$4 = keys_1;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign$1(object, source) {
  return object && copyObject$3(source, keys$4(source), object);
}

var _baseAssign = baseAssign$1;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function nativeKeysIn$1(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn$1;

var isObject$5 = isObject_1,
    isPrototype$1 = _isPrototype,
    nativeKeysIn = _nativeKeysIn;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn$1(object) {
  if (!isObject$5(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype$1(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$3.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn$1;

var arrayLikeKeys = _arrayLikeKeys,
    baseKeysIn = _baseKeysIn,
    isArrayLike$2 = isArrayLike_1;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn$3(object) {
  return isArrayLike$2(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

var keysIn_1 = keysIn$3;

var copyObject$2 = _copyObject,
    keysIn$2 = keysIn_1;

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn$1(object, source) {
  return object && copyObject$2(source, keysIn$2(source), object);
}

var _baseAssignIn = baseAssignIn$1;

var _cloneBufferExports = {};
var _cloneBuffer = {
  get exports(){ return _cloneBufferExports; },
  set exports(v){ _cloneBufferExports = v; },
};

(function (module, exports) {
	var root = _root;

	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined,
	    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var length = buffer.length,
	      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

	  buffer.copy(result);
	  return result;
	}

	module.exports = cloneBuffer;
} (_cloneBuffer, _cloneBufferExports));

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */

function copyArray$1(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

var _copyArray = copyArray$1;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */

function arrayFilter$1(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter$1;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */

function stubArray$2() {
  return [];
}

var stubArray_1 = stubArray$2;

var arrayFilter = _arrayFilter,
    stubArray$1 = stubArray_1;

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols$3 = !nativeGetSymbols$1 ? stubArray$1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols$1(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

var _getSymbols = getSymbols$3;

var copyObject$1 = _copyObject,
    getSymbols$2 = _getSymbols;

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols$1(source, object) {
  return copyObject$1(source, getSymbols$2(source), object);
}

var _copySymbols = copySymbols$1;

var overArg = _overArg;

/** Built-in value references. */
var getPrototype$2 = overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype$2;

var arrayPush$1 = _arrayPush,
    getPrototype$1 = _getPrototype,
    getSymbols$1 = _getSymbols,
    stubArray = stubArray_1;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn$2 = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush$1(result, getSymbols$1(object));
    object = getPrototype$1(object);
  }
  return result;
};

var _getSymbolsIn = getSymbolsIn$2;

var copyObject = _copyObject,
    getSymbolsIn$1 = _getSymbolsIn;

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn$1(source, object) {
  return copyObject(source, getSymbolsIn$1(source), object);
}

var _copySymbolsIn = copySymbolsIn$1;

var arrayPush = _arrayPush,
    isArray$4 = isArray_1;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys$2(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray$4(object) ? result : arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys$2;

var baseGetAllKeys$1 = _baseGetAllKeys,
    getSymbols = _getSymbols,
    keys$3 = keys_1;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys$2(object) {
  return baseGetAllKeys$1(object, keys$3, getSymbols);
}

var _getAllKeys = getAllKeys$2;

var baseGetAllKeys = _baseGetAllKeys,
    getSymbolsIn = _getSymbolsIn,
    keysIn$1 = keysIn_1;

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn$1(object) {
  return baseGetAllKeys(object, keysIn$1, getSymbolsIn);
}

var _getAllKeysIn = getAllKeysIn$1;

var getNative$3 = _getNative,
    root$4 = _root;

/* Built-in method references that are verified to be native. */
var DataView$2 = getNative$3(root$4, 'DataView');

var _DataView = DataView$2;

var getNative$2 = _getNative,
    root$3 = _root;

/* Built-in method references that are verified to be native. */
var Promise$2 = getNative$2(root$3, 'Promise');

var _Promise = Promise$2;

var getNative$1 = _getNative,
    root$2 = _root;

/* Built-in method references that are verified to be native. */
var Set$3 = getNative$1(root$2, 'Set');

var _Set = Set$3;

var getNative = _getNative,
    root$1 = _root;

/* Built-in method references that are verified to be native. */
var WeakMap$2 = getNative(root$1, 'WeakMap');

var _WeakMap = WeakMap$2;

var DataView$1 = _DataView,
    Map$1 = _Map,
    Promise$1 = _Promise,
    Set$2 = _Set,
    WeakMap$1 = _WeakMap,
    baseGetTag = _baseGetTag,
    toSource = _toSource;

/** `Object#toString` result references. */
var mapTag$4 = '[object Map]',
    objectTag$2 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$4 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$3 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView$1),
    mapCtorString = toSource(Map$1),
    promiseCtorString = toSource(Promise$1),
    setCtorString = toSource(Set$2),
    weakMapCtorString = toSource(WeakMap$1);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag$4 = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView$1 && getTag$4(new DataView$1(new ArrayBuffer(1))) != dataViewTag$3) ||
    (Map$1 && getTag$4(new Map$1) != mapTag$4) ||
    (Promise$1 && getTag$4(Promise$1.resolve()) != promiseTag) ||
    (Set$2 && getTag$4(new Set$2) != setTag$4) ||
    (WeakMap$1 && getTag$4(new WeakMap$1) != weakMapTag$1)) {
  getTag$4 = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$3;
        case mapCtorString: return mapTag$4;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$4;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag$4;

/** Used for built-in method references. */

var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray$1(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty$2.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

var _initCloneArray = initCloneArray$1;

var root = _root;

/** Built-in value references. */
var Uint8Array$3 = root.Uint8Array;

var _Uint8Array = Uint8Array$3;

var Uint8Array$2 = _Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer$3(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array$2(result).set(new Uint8Array$2(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer$3;

var cloneArrayBuffer$2 = _cloneArrayBuffer;

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView$1(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer$2(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

var _cloneDataView = cloneDataView$1;

/** Used to match `RegExp` flags from their coerced string values. */

var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp$1(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

var _cloneRegExp = cloneRegExp$1;

var Symbol$2 = _Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : undefined,
    symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol$1(symbol) {
  return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
}

var _cloneSymbol = cloneSymbol$1;

var cloneArrayBuffer$1 = _cloneArrayBuffer;

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray$1(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer$1(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray$1;

var cloneArrayBuffer = _cloneArrayBuffer,
    cloneDataView = _cloneDataView,
    cloneRegExp = _cloneRegExp,
    cloneSymbol = _cloneSymbol,
    cloneTypedArray = _cloneTypedArray;

/** `Object#toString` result references. */
var boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    mapTag$3 = '[object Map]',
    numberTag$2 = '[object Number]',
    regexpTag$2 = '[object RegExp]',
    setTag$3 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$2 = '[object Symbol]';

var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag$1(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$2:
      return cloneArrayBuffer(object);

    case boolTag$2:
    case dateTag$2:
      return new Ctor(+object);

    case dataViewTag$2:
      return cloneDataView(object, isDeep);

    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return cloneTypedArray(object, isDeep);

    case mapTag$3:
      return new Ctor;

    case numberTag$2:
    case stringTag$2:
      return new Ctor(object);

    case regexpTag$2:
      return cloneRegExp(object);

    case setTag$3:
      return new Ctor;

    case symbolTag$2:
      return cloneSymbol(object);
  }
}

var _initCloneByTag = initCloneByTag$1;

var isObject$4 = isObject_1;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate$1 = (function() {
  function object() {}
  return function(proto) {
    if (!isObject$4(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

var _baseCreate = baseCreate$1;

var baseCreate = _baseCreate,
    getPrototype = _getPrototype,
    isPrototype = _isPrototype;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject$1(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

var _initCloneObject = initCloneObject$1;

var getTag$3 = _getTag,
    isObjectLike$3 = isObjectLike_1;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap$1(value) {
  return isObjectLike$3(value) && getTag$3(value) == mapTag$2;
}

var _baseIsMap = baseIsMap$1;

var baseIsMap = _baseIsMap,
    baseUnary$1 = _baseUnary,
    nodeUtil$1 = _nodeUtilExports;

/* Node.js helper references. */
var nodeIsMap = nodeUtil$1 && nodeUtil$1.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap$1 = nodeIsMap ? baseUnary$1(nodeIsMap) : baseIsMap;

var isMap_1 = isMap$1;

var getTag$2 = _getTag,
    isObjectLike$2 = isObjectLike_1;

/** `Object#toString` result references. */
var setTag$2 = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet$1(value) {
  return isObjectLike$2(value) && getTag$2(value) == setTag$2;
}

var _baseIsSet = baseIsSet$1;

var baseIsSet = _baseIsSet,
    baseUnary = _baseUnary,
    nodeUtil = _nodeUtilExports;

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet$1 = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

var isSet_1 = isSet$1;

var Stack$2 = _Stack,
    arrayEach = _arrayEach,
    assignValue$1 = _assignValue,
    baseAssign = _baseAssign,
    baseAssignIn = _baseAssignIn,
    cloneBuffer = _cloneBufferExports,
    copyArray = _copyArray,
    copySymbols = _copySymbols,
    copySymbolsIn = _copySymbolsIn,
    getAllKeys$1 = _getAllKeys,
    getAllKeysIn = _getAllKeysIn,
    getTag$1 = _getTag,
    initCloneArray = _initCloneArray,
    initCloneByTag = _initCloneByTag,
    initCloneObject = _initCloneObject,
    isArray$3 = isArray_1,
    isBuffer$1 = isBufferExports,
    isMap = isMap_1,
    isObject$3 = isObject_1,
    isSet = isSet_1,
    keys$2 = keys_1,
    keysIn = keysIn_1;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG$2 = 4;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag$1 = '[object Map]',
    numberTag$1 = '[object Number]',
    objectTag$1 = '[object Object]',
    regexpTag$1 = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1 = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] =
cloneableTags[arrayBufferTag$1] = cloneableTags[dataViewTag$1] =
cloneableTags[boolTag$1] = cloneableTags[dateTag$1] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag$1] =
cloneableTags[numberTag$1] = cloneableTags[objectTag$1] =
cloneableTags[regexpTag$1] = cloneableTags[setTag$1] =
cloneableTags[stringTag$1] = cloneableTags[symbolTag$1] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone$2(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG$1,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG$2;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject$3(value)) {
    return value;
  }
  var isArr = isArray$3(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag$1(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer$1(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$1 || tag == argsTag$1 || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack$2);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone$2(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone$2(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys$1)
    : (isFlat ? keysIn : keys$2);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue$1(result, key, baseClone$2(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

var _baseClone = baseClone$2;

var baseClone$1 = _baseClone;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG$1 = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone$1(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG$1);
}

var cloneDeep_1 = cloneDeep;

/** Used to stand-in for `undefined` hash values. */

var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd$1(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

var _setCacheAdd = setCacheAdd$1;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */

function setCacheHas$1(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas$1;

var MapCache = _MapCache,
    setCacheAdd = _setCacheAdd,
    setCacheHas = _setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache$2(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache$2.prototype.add = SetCache$2.prototype.push = setCacheAdd;
SetCache$2.prototype.has = setCacheHas;

var _SetCache = SetCache$2;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */

function arraySome$1(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome$1;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function cacheHas$2(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas$2;

var SetCache$1 = _SetCache,
    arraySome = _arraySome,
    cacheHas$1 = _cacheHas;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays$2(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG$3) ? new SetCache$1 : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas$1(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays$2;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */

function mapToArray$1(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray$1;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */

function setToArray$3(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray$3;

var Symbol$1 = _Symbol,
    Uint8Array$1 = _Uint8Array,
    eq = eq_1,
    equalArrays$1 = _equalArrays,
    mapToArray = _mapToArray,
    setToArray$2 = _setToArray;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag$1(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array$1(object), new Uint8Array$1(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
      convert || (convert = setToArray$2);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$2;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays$1(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag$1;

var getAllKeys = _getAllKeys;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects$1(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects$1;

var Stack$1 = _Stack,
    equalArrays = _equalArrays,
    equalByTag = _equalByTag,
    equalObjects = _equalObjects,
    getTag = _getTag,
    isArray$2 = isArray_1,
    isBuffer = isBufferExports,
    isTypedArray = isTypedArray_1;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep$1(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray$2(object),
      othIsArr = isArray$2(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack$1);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack$1);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack$1);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep$1;

var baseIsEqualDeep = _baseIsEqualDeep,
    isObjectLike$1 = isObjectLike_1;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual$3(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike$1(value) && !isObjectLike$1(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual$3, stack);
}

var _baseIsEqual = baseIsEqual$3;

var baseIsEqual$2 = _baseIsEqual;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual$2(value, other);
}

var isEqual_1 = isEqual;

var Stack = _Stack,
    baseIsEqual$1 = _baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch$1(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual$1(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch$1;

var isObject$2 = isObject_1;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable$2(value) {
  return value === value && !isObject$2(value);
}

var _isStrictComparable = isStrictComparable$2;

var isStrictComparable$1 = _isStrictComparable,
    keys$1 = keys_1;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData$1(object) {
  var result = keys$1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable$1(value)];
  }
  return result;
}

var _getMatchData = getMatchData$1;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */

function matchesStrictComparable$2(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable$2;

var baseIsMatch = _baseIsMatch,
    getMatchData = _getMatchData,
    matchesStrictComparable$1 = _matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches$1(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable$1(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches$1;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */

function baseHasIn$1(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn$1;

var castPath$2 = _castPath,
    isArguments = isArguments_1,
    isArray$1 = isArray_1,
    isIndex$1 = _isIndex,
    isLength = isLength_1,
    toKey$3 = _toKey;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath$1(object, path, hasFunc) {
  path = castPath$2(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey$3(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex$1(key, length) &&
    (isArray$1(object) || isArguments(object));
}

var _hasPath = hasPath$1;

var baseHasIn = _baseHasIn,
    hasPath = _hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn$2(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

var hasIn_1 = hasIn$2;

var baseIsEqual = _baseIsEqual,
    get = get_1,
    hasIn$1 = hasIn_1,
    isKey$1 = _isKey,
    isStrictComparable = _isStrictComparable,
    matchesStrictComparable = _matchesStrictComparable,
    toKey$2 = _toKey;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty$1(path, srcValue) {
  if (isKey$1(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey$2(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn$1(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

var _baseMatchesProperty = baseMatchesProperty$1;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */

function identity$4(value) {
  return value;
}

var identity_1 = identity$4;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */

function baseProperty$1(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty$1;

var baseGet$1 = _baseGet;

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep$1(path) {
  return function(object) {
    return baseGet$1(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep$1;

var baseProperty = _baseProperty,
    basePropertyDeep = _basePropertyDeep,
    isKey = _isKey,
    toKey$1 = _toKey;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property$1(path) {
  return isKey(path) ? baseProperty(toKey$1(path)) : basePropertyDeep(path);
}

var property_1 = property$1;

var baseMatches = _baseMatches,
    baseMatchesProperty = _baseMatchesProperty,
    identity$3 = identity_1,
    isArray = isArray_1,
    property = property_1;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee$3(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity$3;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

var _baseIteratee = baseIteratee$3;

var baseIteratee$2 = _baseIteratee,
    isArrayLike$1 = isArrayLike_1,
    keys = keys_1;

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind$1(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike$1(collection)) {
      var iteratee = baseIteratee$2(predicate);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

var _createFind = createFind$1;

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */

function baseFindIndex$2(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

var _baseFindIndex = baseFindIndex$2;

/** Used to match a single whitespace character. */

var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex$1(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

var _trimmedEndIndex = trimmedEndIndex$1;

var trimmedEndIndex = _trimmedEndIndex;

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim$1(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

var _baseTrim = baseTrim$1;

var baseTrim = _baseTrim,
    isObject$1 = isObject_1,
    isSymbol = isSymbol_1;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber$1(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject$1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject$1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber$1;

var toNumber = toNumber_1;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite$1(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY$1 || value === -INFINITY$1) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

var toFinite_1 = toFinite$1;

var toFinite = toFinite_1;

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger$2(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

var toInteger_1 = toInteger$2;

var baseFindIndex$1 = _baseFindIndex,
    baseIteratee$1 = _baseIteratee,
    toInteger$1 = toInteger_1;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$1 = Math.max,
    nativeMin$1 = Math.min;

/**
 * This method is like `_.findIndex` except that it iterates over elements
 * of `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=array.length-1] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': true },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': false }
 * ];
 *
 * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
 * // => 2
 *
 * // The `_.matches` iteratee shorthand.
 * _.findLastIndex(users, { 'user': 'barney', 'active': true });
 * // => 0
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findLastIndex(users, ['active', false]);
 * // => 2
 *
 * // The `_.property` iteratee shorthand.
 * _.findLastIndex(users, 'active');
 * // => 0
 */
function findLastIndex$1(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = length - 1;
  if (fromIndex !== undefined) {
    index = toInteger$1(fromIndex);
    index = fromIndex < 0
      ? nativeMax$1(length + index, 0)
      : nativeMin$1(index, length - 1);
  }
  return baseFindIndex$1(array, baseIteratee$1(predicate), index, true);
}

var findLastIndex_1 = findLastIndex$1;

var createFind = _createFind,
    findLastIndex = findLastIndex_1;

/**
 * This method is like `_.find` except that it iterates over elements of
 * `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=collection.length-1] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * _.findLast([1, 2, 3, 4], function(n) {
 *   return n % 2 == 1;
 * });
 * // => 3
 */
var findLast = createFind(findLastIndex);

var findLast_1 = findLast;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */

function apply$1(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply$1;

var apply = _apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest$2(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

var _overRest = overRest$2;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */

function constant$1(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant$1;

var constant = constant_1,
    defineProperty = _defineProperty,
    identity$2 = identity_1;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString$1 = !defineProperty ? identity$2 : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString$1;

/** Used to detect hot functions by number of calls within a span of milliseconds. */

var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut$1(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut$1;

var baseSetToString = _baseSetToString,
    shortOut = _shortOut;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString$2 = shortOut(baseSetToString);

var _setToString = setToString$2;

var identity$1 = identity_1,
    overRest$1 = _overRest,
    setToString$1 = _setToString;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest$1(func, start) {
  return setToString$1(overRest$1(func, start, identity$1), func + '');
}

var _baseRest = baseRest$1;

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */

function baseIsNaN$1(value) {
  return value !== value;
}

var _baseIsNaN = baseIsNaN$1;

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */

function strictIndexOf$1(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

var _strictIndexOf = strictIndexOf$1;

var baseFindIndex = _baseFindIndex,
    baseIsNaN = _baseIsNaN,
    strictIndexOf = _strictIndexOf;

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf$1(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

var _baseIndexOf = baseIndexOf$1;

var baseIndexOf = _baseIndexOf;

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes$1(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

var _arrayIncludes = arrayIncludes$1;

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */

function arrayIncludesWith$1(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

var _arrayIncludesWith = arrayIncludesWith$1;

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */

function noop$1() {
  // No operation performed.
}

var noop_1 = noop$1;

var Set$1 = _Set,
    noop = noop_1,
    setToArray$1 = _setToArray;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet$1 = !(Set$1 && (1 / setToArray$1(new Set$1([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set$1(values);
};

var _createSet = createSet$1;

var SetCache = _SetCache,
    arrayIncludes = _arrayIncludes,
    arrayIncludesWith = _arrayIncludesWith,
    cacheHas = _cacheHas,
    createSet = _createSet,
    setToArray = _setToArray;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq$2(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

var _baseUniq = baseUniq$2;

var isArrayLike = isArrayLike_1,
    isObjectLike = isObjectLike_1;

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$1(value) {
  return isObjectLike(value) && isArrayLike(value);
}

var isArrayLikeObject_1 = isArrayLikeObject$1;

var baseFlatten$1 = _baseFlatten,
    baseRest = _baseRest,
    baseUniq$1 = _baseUniq,
    isArrayLikeObject = isArrayLikeObject_1;

/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */
var union = baseRest(function(arrays) {
  return baseUniq$1(baseFlatten$1(arrays, 1, isArrayLikeObject, true));
});

var union_1 = union;

var _class$1, _descriptor$1, _class2;
function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$4(Object(source), !0).forEach(function (key) { _defineProperty$1(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/**
 * Maps the passed-in property names through and runs validations against those properties
 *
 * @param {object} model the model to check
 * @param {Array} propertyNames the names of the model properties to check
 * @param {object} propertyDefinitions a hash map containing validators by property
 * @returns {Array} an array of booleans representing results of validations
 */
function validateProperties(model, propertyNames, propertyDefinitions) {
  return propertyNames.map(function (propertyName) {
    if (propertyDefinitions) {
      var validator = propertyDefinitions[propertyName].validator;
      if (!validator) return true;
      var validationResult = validator(model[propertyName], model, propertyName);
      if (!validationResult.isValid) {
        model.errors[propertyName] = validationResult.errors;
      }
      return validationResult.isValid;
    } else return true;
  });
}

/**
 * Coerces all ids to strings
 *
 * @param {object} object object to coerce
 */
function stringifyIds(object) {
  Object.keys(object).forEach(function (key) {
    var property = object[key];
    if (_typeof(property) === 'object') {
      if (property.id) {
        property.id = String(property.id);
      }
      stringifyIds(property);
    }
  });
}

/**
 * The base class for data records
 */
var Model = (_class$1 = (_class2 = /*#__PURE__*/function () {
  /**
   * Initializer for model
   *
   * @param {object} initialAttributes relationships and attributes to override defaults
   */
  function Model() {
    var initialAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Model);
    _defineProperty$1(this, "isInFlight", false);
    _initializerDefineProperty(this, "errors", _descriptor$1, this);
    _defineProperty$1(this, "_snapshots", []);
    makeObservable(this);
    var definedAttributesWithDefaults = this.definedAttributesWithDefaults;
    extendObservable(this, _objectSpread$4(_objectSpread$4({}, definedAttributesWithDefaults), initialAttributes));
    this._takeSnapshot({
      persisted: !this.isNew
    });
  }
  _createClass(Model, [{
    key: "definedAttributesWithDefaults",
    get: function get() {
      var attributeDefinitions = this.attributeDefinitions;
      return Object.keys(attributeDefinitions).reduce(function (allAttrs, key) {
        allAttrs[key] = attributeDefinitions[key].defaultValue;
        return allAttrs;
      }, {});
    }

    /**
     * The type of the model. Defined on the class. Defaults to the underscored version of the class name
     * (eg 'calendar_events').
     *
     * @type {string}
     * @static
     */
  }, {
    key: "isDirty",
    get:
    /**
     * True if the instance has been modified from its persisted state
     *
     * NOTE that isDirty does _NOT_ track changes to the related objects
     * but it _does_ track changes to the relationships themselves.
     *
     * For example, adding or removing a related object will mark this record as dirty,
     * but changing a related object's properties will not mark this record as dirty.
     *
     * The caller is reponsible for asking related objects about their
     * own dirty state.
     *
     * ```
     * todo = store.add('todos', { name: 'A good thing to measure' })
     * todo.isDirty
     * => true
     * todo.name
     * => "A good thing to measure"
     * await todo.save()
     * todo.isDirty
     * => false
     * todo.name = "Another good thing to measure"
     * todo.isDirty
     * => true
     * await todo.save()
     * todo.isDirty
     * => false
     * ```
     *
     * @type {boolean}
     */
    function get() {
      return this.dirtyAttributes.length > 0 || this.dirtyRelationships.length > 0;
    }

    /**
     * A list of any attribute paths which have been changed since the previous snapshot
     *
     * const todo = new Todo({ title: 'Buy Milk' })
     * todo.dirtyAttributes
     * => []
     * todo.title = 'Buy Cheese'
     * todo.dirtyAttributes
     * => ['title']
     * todo.options = { variety: 'Cheddar' }
     * todo.dirtyAttributes
     * => ['title', 'options.variety']
     *
     * @type {Array}
     */
  }, {
    key: "dirtyAttributes",
    get: function get() {
      var _this2 = this;
      return Array.from(Object.keys(this.attributes).reduce(function (dirtyAccumulator, attr) {
        var currentValue = _this2.attributes[attr];
        var previousValue = _this2.previousSnapshot.attributes[attr];
        if (isObject_1(currentValue)) {
          var currentToPreviousDiff = diff(currentValue, previousValue);
          var previousToCurrentDiff = diff(previousValue, currentValue);
          union_1(currentToPreviousDiff, previousToCurrentDiff).forEach(function (property) {
            dirtyAccumulator.add("".concat(attr, ".").concat(property));
          });
        } else if (!isEqual_1(previousValue, currentValue)) {
          dirtyAccumulator.add(attr);
        }
        return dirtyAccumulator;
      }, new Set()));
    }

    /**
     * A list of any relationship paths which have been changed since the previous snapshot
     * We check changes to both ids and types in case there are polymorphic relationships
     *
     * const todo = new Todo({ title: 'Buy Milk' })
     * todo.dirtyRelationships
     * => []
     * todo.note = note1
     * todo.dirtyRelationships
     * => ['relationships.note']
     *
     * @type {Array}
     */
  }, {
    key: "dirtyRelationships",
    get: function get() {
      // TODO: make what returns from this.relationships to be more consistent
      var previousRelationships = this.previousSnapshot.relationships || {};
      var currentRelationships = this.relationships || {};
      var schemaRelationships = this.relationshipNames;
      if (Object.keys(currentRelationships).length === 0) {
        return Object.keys(previousRelationships);
      }
      return Array.from(schemaRelationships.reduce(function (dirtyAccumulator, name) {
        var _currentRelationships, _previousRelationship;
        var currentValues = ((_currentRelationships = currentRelationships[name]) === null || _currentRelationships === void 0 ? void 0 : _currentRelationships.data) || [];
        var previousValues = ((_previousRelationship = previousRelationships[name]) === null || _previousRelationship === void 0 ? void 0 : _previousRelationship.data) || [];
        var currentIds = Array.isArray(currentValues) ? currentValues.map(function (value) {
          return [value.id, value.type];
        }).sort() : [currentValues.id, currentValues.type];
        var previousIds = Array.isArray(previousValues) ? previousValues.map(function (value) {
          return [value.id, value.type];
        }).sort() : [previousValues.id, previousValues.type];
        if (!isEqual_1(currentIds, previousIds)) {
          dirtyAccumulator.add(name);
        }
        return dirtyAccumulator;
      }, new Set()));
    }

    /**
     * Have any changes been made since this record was last persisted?
     *
     * @type {boolean}
     */
  }, {
    key: "hasUnpersistedChanges",
    get: function get() {
      return this.isDirty || !this.previousSnapshot.persisted;
    }

    /**
     * True if the model has not been sent to the store
     *
     * @type {boolean}
     */
  }, {
    key: "isNew",
    get: function get() {
      var id = this.id;
      if (!id) return true;
      if (String(id).indexOf('tmp') === -1) return false;
      return true;
    }

    /**
     * True if the instance is coming from / going to the server
     * ```
     * todo = store.find('todos', 5)
     * // fetch started
     * todo.isInFlight
     * => true
     * // fetch finished
     * todo.isInFlight
     * => false
     * ```
     *
     * @type {boolean}
     * @default false
     */
  }, {
    key: "rollback",
    value:
    /**
     * restores data to its last snapshot state
     * ```
     * todo = store.find('todos', 5)
     * todo.name
     * => "A good thing to measure"
     * todo.name = "Another good thing to measure"
     * todo.rollback()
     * todo.name
     * => "A good thing to measure"
     * ```
     */
    function rollback() {
      this._applySnapshot(this.previousSnapshot);
    }

    /**
     * restores data to its last persisted state or the oldest snapshot
     * state if the model was never persisted
     */
  }, {
    key: "rollbackToPersisted",
    value: function rollbackToPersisted() {
      this._applySnapshot(this.persistedSnapshot);
      this._takeSnapshot({
        persisted: true
      });
    }

    /**
     * creates or updates a record.
     *
     * @param {object} options query params and sparse fields to use
     * @returns {Promise} the persisted record
     */
  }, {
    key: "save",
    value: function save() {
      var _this3 = this;
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (!options.skip_validations && !this.validate(options)) {
        var errorString = JSON.stringify(this.errors);
        return Promise.reject(new Error(errorString));
      }
      var queryParams = options.queryParams,
        relationships = options.relationships,
        attributes = options.attributes;
      var constructor = this.constructor,
        id = this.id,
        isNew = this.isNew;
      var requestId = id;
      var method = 'PATCH';
      if (isNew) {
        method = 'POST';
        requestId = null;
      }
      var url = this.store.fetchUrl(constructor.type, queryParams, requestId);
      var body = JSON.stringify({
        data: this.jsonapi({
          relationships: relationships,
          attributes: attributes
        })
      });
      if (relationships) {
        relationships.forEach(function (rel) {
          if (Array.isArray(_this3[rel])) {
            _this3[rel].forEach(function (item, i) {
              if (item && item.isNew) {
                throw new Error("Invariant violated: tried to save a relationship to an unpersisted record: \"".concat(rel, "[").concat(i, "]\""));
              }
            });
          } else if (_this3[rel] && _this3[rel].isNew) {
            throw new Error("Invariant violated: tried to save a relationship to an unpersisted record: \"".concat(rel, "\""));
          }
        });
      }
      var response = this.store.fetch(url, {
        method: method,
        body: body
      });
      var result = this.store.updateRecords(response, this);
      return result;
    }

    /**
     * Replaces the record with the canonical version from the server.
     *
     * @param {object} options props to use for the fetch
     * @returns {Promise} the refreshed record
     */
  }, {
    key: "reload",
    value: function reload() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var constructor = this.constructor,
        id = this.id,
        isNew = this.isNew;
      if (isNew) {
        return this.rollback();
      } else {
        return this.store.fetchOne(constructor.type, id, options);
      }
    }

    /**
     * Checks all validations, adding errors where necessary and returning `false` if any are not valid
     * Default is to check all validations, but they can be selectively run via options:
     *  - attributes - an array of names of attributes to validate
     *  - relationships - an array of names of relationships to validate
     *
     * @param {object} options attributes and relationships to use for the validation
     * @returns {boolean} key / value of attributes and relationship validations
     */
  }, {
    key: "validate",
    value: function validate() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.errors = {};
      var attributeDefinitions = this.attributeDefinitions,
        relationshipDefinitions = this.relationshipDefinitions;
      var attributeNames = options.attributes || Object.keys(attributeDefinitions);
      var relationshipNames = options.relationships || this.relationshipNames;
      var validAttributes = validateProperties(this, attributeNames, attributeDefinitions);
      var validRelationships = validateProperties(this, relationshipNames, relationshipDefinitions);
      return validAttributes.concat(validRelationships).every(function (value) {
        return value;
      });
    }

    /**
     * deletes a record from the store and server
     *
     * @param {object} options params and option to skip removal from the store
     * @returns {Promise} an empty promise with any success/error status
     */
  }, {
    key: "destroy",
    value: function destroy() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var type = this.constructor.type,
        id = this.id,
        snapshot = this.snapshot,
        isNew = this.isNew;
      if (isNew) {
        this.store.remove(type, id);
        return snapshot;
      }
      var _options$params = options.params,
        params = _options$params === void 0 ? {} : _options$params,
        _options$skipRemove = options.skipRemove,
        skipRemove = _options$skipRemove === void 0 ? false : _options$skipRemove;
      var url = this.store.fetchUrl(type, params, id);
      this.isInFlight = true;
      var promise = this.store.fetch(url, {
        method: 'DELETE'
      });
      var _this = this;
      _this.errors = {};
      return promise.then( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(response) {
          var json, errors;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _this.isInFlight = false;
                  if (![200, 202, 204].includes(response.status)) {
                    _context.next = 17;
                    break;
                  }
                  if (!skipRemove) {
                    _this.store.remove(type, id);
                  }
                  _context.prev = 3;
                  _context.next = 6;
                  return response.json();
                case 6:
                  json = _context.sent;
                  if (json.data && json.data.attributes) {
                    runInAction(function () {
                      Object.keys(json.data.attributes).forEach(function (key) {
                        set(_this, key, json.data.attributes[key]);
                      });
                    });
                  }
                  _context.next = 13;
                  break;
                case 10:
                  _context.prev = 10;
                  _context.t0 = _context["catch"](3);
                  console.log(_context.t0);
                  // It is text, do you text handling here
                case 13:
                  // NOTE: If deleting a record changes other related model
                  // You can return then in the delete response
                  if (json && json.included) {
                    _this.store.createModelsFromData(json.included);
                  }
                  return _context.abrupt("return", _this);
                case 17:
                  _context.next = 19;
                  return parseErrors(response, _this.store.errorMessages);
                case 19:
                  errors = _context.sent;
                  throw new Error(JSON.stringify(errors));
                case 21:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[3, 10]]);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }(), function (error) {
        // TODO: Handle error states correctly
        _this.isInFlight = false;
        throw error;
      });
    }

    /* Private Methods */

    /**
     * The current state of defined attributes and relationships of the instance
     * Really just an alias for attributes
     * ```
     * todo = store.find('todos', 5)
     * todo.title
     * => "Buy the eggs"
     * snapshot = todo.snapshot
     * todo.title = "Buy the eggs and bacon"
     * snapshot.title
     * => "Buy the eggs and bacon"
     * ```
     *
     * @type {object}
     */
  }, {
    key: "snapshot",
    get: function get() {
      return {
        attributes: this.attributes,
        relationships: toJS(this.relationships)
      };
    }

    /**
     * Sets previous snapshot to current snapshot
     */
  }, {
    key: "setPreviousSnapshot",
    value: function setPreviousSnapshot() {
      this._takeSnapshot();
    }

    /**
     * the latest snapshot
     *
     * @type {object}
     */
  }, {
    key: "previousSnapshot",
    get: function get() {
      var length = this._snapshots.length;
      if (length === 0) throw new Error('Invariant violated: model has no snapshots');
      return this._snapshots[length - 1];
    }

    /**
     * the latest persisted snapshot or the first snapshot if the model was never persisted
     *
     * @type {object}
     */
  }, {
    key: "persistedSnapshot",
    get: function get() {
      return findLast_1(this._snapshots, function (ss) {
        return ss.persisted;
      }) || this._snapshots[0];
    }

    /**
     * take a snapshot of the current model state.
     * if persisted, clear the stack and push this snapshot to the top
     * if not persisted, push this snapshot to the top of the stack
     *
     * @param {object} options options to use to set the persisted state
     */
  }, {
    key: "_takeSnapshot",
    value: function _takeSnapshot() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var persisted = options.persisted || false;
      var _this$snapshot = this.snapshot,
        attributes = _this$snapshot.attributes,
        relationships = _this$snapshot.relationships;
      var snapshot = {
        persisted: persisted,
        attributes: attributes,
        relationships: relationships
      };
      if (persisted) {
        this._snapshots = [];
      }
      this._snapshots.push(snapshot);
    }

    /**
     * set the current attributes and relationships to the attributes
     * and relationships of the snapshot to be applied. also reset errors
     *
     * @param {object} snapshot the snapshot to apply
     */
  }, {
    key: "_applySnapshot",
    value: function _applySnapshot(snapshot) {
      var _this4 = this;
      if (!snapshot) throw new Error('Invariant violated: tried to apply undefined snapshot');
      runInAction(function () {
        _this4.attributeNames.forEach(function (key) {
          _this4[key] = snapshot.attributes[key];
        });
        _this4.relationships = snapshot.relationships;
        _this4.errors = {};
      });
    }

    /**
     * shortcut to get the static
     *
     * @type {string}
     */
  }, {
    key: "type",
    get: function get() {
      return this.constructor.type;
    }

    /**
     * current attributes of record
     *
     * @type {object}
     */
  }, {
    key: "attributes",
    get: function get() {
      var _this5 = this;
      return this.attributeNames.reduce(function (attributes, key) {
        var value = toJS(_this5[key]);
        if (value == null) {
          delete attributes[key];
        } else {
          attributes[key] = value;
        }
        return attributes;
      }, {});
    }

    /**
     * Getter find the attribute definition for the model type.
     *
     * @type {object}
     */
  }, {
    key: "attributeDefinitions",
    get: function get() {
      return this.constructor.attributeDefinitions;
    }

    /**
     * Getter find the relationship definitions for the model type.
     *
     * @type {object}
     */
  }, {
    key: "relationshipDefinitions",
    get: function get() {
      var type = this.constructor.type;
      return schema.relations[type] || {};
    }

    /**
     * Getter to check if the record has errors.
     *
     * @type {boolean}
     */
  }, {
    key: "hasErrors",
    get: function get() {
      return Object.keys(this.errors).length > 0;
    }

    /**
     * Getter to check if the record has errors.
     *
     * @param {string} key the key to check
     * @returns {string} the error text
     */
  }, {
    key: "errorForKey",
    value: function errorForKey(key) {
      return this.errors[key];
    }

    /**
     * Getter to just get the names of a records attributes.
     *
     * @returns {Array} the keys of the attribute definitions
     */
  }, {
    key: "attributeNames",
    get: function get() {
      return Object.keys(this.attributeDefinitions);
    }

    /**
     * Getter to just get the names of a records relationships.
     *
     * @returns {Array} the keys of the relationship definitions
     */
  }, {
    key: "relationshipNames",
    get: function get() {
      return Object.keys(this.relationshipDefinitions);
    }

    /**
     * getter method to get the default attributes
     *
     * @returns {object} key / value of attributes and defaults
     */
  }, {
    key: "defaultAttributes",
    get: function get() {
      var attributeDefinitions = this.attributeDefinitions;
      return this.attributeNames.reduce(function (defaults, key) {
        var defaultValue = attributeDefinitions[key].defaultValue;
        defaults[key] = defaultValue;
        return defaults;
      }, {
        relationships: {}
      });
    }

    /**
     * getter method to get data in api compliance format
     * TODO: Figure out how to handle unpersisted ids
     *
     * @param {object} options serialization options
     * @returns {object} data in JSON::API format
     */
  }, {
    key: "jsonapi",
    value: function jsonapi() {
      var _this6 = this;
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var attributeDefinitions = this.attributeDefinitions,
        attributeNames = this.attributeNames,
        meta = this.meta,
        id = this.id,
        type = this.constructor.type;
      var filteredAttributeNames = attributeNames;
      var filteredRelationshipNames = [];
      if (options.attributes) {
        filteredAttributeNames = attributeNames.filter(function (name) {
          return options.attributes.includes(name);
        });
      }
      var attributes = filteredAttributeNames.reduce(function (attrs, key) {
        var value = _this6[key];
        if (value) {
          if (attributeDefinitions[key].transformer) {
            value = attributeDefinitions[key].transformer(value);
          }
        }
        attrs[key] = value;
        return attrs;
      }, {});
      var data = {
        type: type,
        attributes: attributes,
        id: String(id)
      };
      if (options.relationships) {
        filteredRelationshipNames = Object.keys(this.relationships).filter(function (name) {
          return options.relationships.includes(name);
        });
        var relationships = filteredRelationshipNames.reduce(function (rels, key) {
          rels[key] = toJS(_this6.relationships[key]);
          stringifyIds(rels[key]);
          return rels;
        }, {});
        data.relationships = relationships;
      }
      if (meta) {
        data.meta = meta;
      }
      if (String(id).match(/tmp/)) {
        delete data.id;
      }
      return data;
    }
  }, {
    key: "updateAttributes",
    value: function updateAttributes(attributes) {
      var _this7 = this;
      runInAction(function () {
        Object.keys(attributes).forEach(function (key) {
          _this7[key] = attributes[key];
        });
      });
    }

    /**
     * Used after a save. TODO: move to store with other fetch methods
     *
     * @param {object} data in jsonapi format
     * @param {Array} included array of data in jsonapi format
     */
  }, {
    key: "updateAttributesFromResponse",
    value: function updateAttributesFromResponse(data, included) {
      var _this8 = this;
      var tmpId = this.id;
      var id = data.id,
        attributes = data.attributes,
        relationships = data.relationships;
      runInAction(function () {
        set(_this8, 'id', id);
        Object.keys(attributes).forEach(function (key) {
          set(_this8, key, attributes[key]);
        });
        if (relationships) {
          Object.keys(relationships).forEach(function (key) {
            var _relationships$key$me;
            // Don't try to create relationship if meta included false
            if (((_relationships$key$me = relationships[key].meta) === null || _relationships$key$me === void 0 ? void 0 : _relationships$key$me.included) !== false) {
              set(_this8.relationships, key, relationships[key]);
            }
          });
        }
        if (included) {
          _this8.store.createModelsFromData(included);
        }
      });

      // Update target isInFlight
      this.isInFlight = false;
      this._takeSnapshot({
        persisted: true
      });
      runInAction(function () {
        // NOTE: This resolves an issue where a record is persisted but the
        // index key is still a temp uuid. We can't simply remove the temp
        // key because there may be associated records that have the temp
        // uuid id as its only reference to the newly persisted record.
        // TODO: Figure out a way to update associated records to use the
        // newly persisted id.
        _this8.store.data[_this8.type].records.set(String(tmpId), _this8);
        _this8.store.data[_this8.type].records.set(String(_this8.id), _this8);
      });
    }

    /**
     * Clones this model TODO: REMOVE
     *
     * @returns {object} a clone of this model
     */
  }, {
    key: "clone",
    value: function clone() {
      var attributes = cloneDeep_1(this.snapshot.attributes);
      var relationships = cloneDeep_1(this.snapshot.relationships);
      return this.store.createModel(this.type, this.id, {
        attributes: attributes,
        relationships: relationships
      });
    }

    /**
     * Comparison by identity
     * returns `true` if this object has the same type and id as the
     * "other" object, ignores differences in attrs and relationships
     *
     * @param {object} other other model object
     * @returns {boolean} if this object has the same type and id
     */
  }, {
    key: "isSame",
    value: function isSame(other) {
      if (!other) return false;
      return this.type === other.type && this.id === other.id;
    }
  }]);
  return Model;
}(), _defineProperty$1(_class2, "type", ''), _defineProperty$1(_class2, "endpoint", ''), _class2), (_applyDecoratedDescriptor(_class$1.prototype, "isNew", [computed], Object.getOwnPropertyDescriptor(_class$1.prototype, "isNew"), _class$1.prototype), _descriptor$1 = _applyDecoratedDescriptor(_class$1.prototype, "errors", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
})), _class$1);

var assignValue = _assignValue,
    castPath$1 = _castPath,
    isIndex = _isIndex,
    isObject = isObject_1,
    toKey = _toKey;

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet$1(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath$1(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return object;
    }

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

var _baseSet = baseSet$1;

var baseGet = _baseGet,
    baseSet = _baseSet,
    castPath = _castPath;

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy$1(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = baseGet(object, path);

    if (predicate(value, path)) {
      baseSet(result, castPath(path, object), value);
    }
  }
  return result;
}

var _basePickBy = basePickBy$1;

var basePickBy = _basePickBy,
    hasIn = hasIn_1;

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */
function basePick$1(object, paths) {
  return basePickBy(object, paths, function(value, path) {
    return hasIn(object, path);
  });
}

var _basePick = basePick$1;

var baseFlatten = _baseFlatten;

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten$1(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

var flatten_1 = flatten$1;

var flatten = flatten_1,
    overRest = _overRest,
    setToString = _setToString;

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest$1(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

var _flatRest = flatRest$1;

var basePick = _basePick,
    flatRest = _flatRest;

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = flatRest(function(object, paths) {
  return object == null ? {} : basePick(object, paths);
});

var pick_1 = pick;

var baseIteratee = _baseIteratee,
    baseUniq = _baseUniq;

/**
 * This method is like `_.uniq` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * uniqueness is computed. The order of result values is determined by the
 * order they occur in the array. The iteratee is invoked with one argument:
 * (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
function uniqBy(array, iteratee) {
  return (array && array.length) ? baseUniq(array, baseIteratee(iteratee)) : [];
}

var uniqBy_1 = uniqBy;

var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;
function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$3(Object(source), !0).forEach(function (key) { _defineProperty$1(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/**
 * Defines the Data Store class.
 */
var Store = (_class = /*#__PURE__*/function () {
  /**
   * Observable property used to store data and
   * handle changes to state
   *
   * @type {object}
   * @default {}
   */

  /**
   * Observable property used to store values for most recent response headers
   * according to settings specified as `headersOfInterest`
   *
   * @type {object}
   * @default {}
   */

  /**
   * Data that is in flight
   * Map(key: queryTag, value: Set([{ url, type, queryParams, queryTag }]))
   *
   * @type {Map}
   */

  /**
   * Data that has been loaded
   * Map(key: queryTag, value: Set([{ url, type, queryParams, queryTag }]))
   *
   * @type {Map}
   */

  /**
   * Initializer for Store class
   *
   * @param {object} options options to use for initialization
   */
  function Store(_options) {
    var _this = this;
    _classCallCheck(this, Store);
    _initializerDefineProperty(this, "data", _descriptor, this);
    _initializerDefineProperty(this, "lastResponseHeaders", _descriptor2, this);
    _defineProperty$1(this, "loadingStates", observable.map());
    _defineProperty$1(this, "loadedStates", observable.map());
    _defineProperty$1(this, "add", function (type, data) {
      if (data.constructor.name === 'Array') {
        return _this.addModels(type, data);
      } else {
        return _this.addModel(type, toJS(data));
      }
    });
    _defineProperty$1(this, "pickAttributes", function (properties, type) {
      var ModelKlass = _this.getKlass(type);
      var attributeNames = Object.keys(ModelKlass.attributeDefinitions);
      return pick_1(properties, attributeNames);
    });
    _defineProperty$1(this, "pickRelationships", function (properties, type) {
      var relationshipNames = Object.keys(_this.schema.relations[type] || {});
      var allRelationships = pick_1(properties, relationshipNames);
      return Object.keys(allRelationships).reduce(function (references, key) {
        var relatedModel = allRelationships[key];
        var data;
        if (Array.isArray(relatedModel)) {
          data = relatedModel.map(function (model) {
            return {
              id: model.id,
              type: model.type
            };
          });
        } else {
          data = {
            id: relatedModel.id,
            type: relatedModel.type
          };
        }
        references[key] = {
          data: data
        };
        return references;
      }, {});
    });
    _defineProperty$1(this, "build", function (type, properties) {
      var id = idOrNewId(properties.id);
      var attributes = _this.pickAttributes(properties, type);
      var model = _this.createModel(type, id, {
        attributes: attributes
      });
      return model;
    });
    _initializerDefineProperty(this, "addModel", _descriptor3, this);
    _defineProperty$1(this, "addModels", function (type, data) {
      return runInAction(function () {
        return data.map(function (obj) {
          return _this.addModel(type, obj);
        });
      });
    });
    _defineProperty$1(this, "bulkSave", function (type, records) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      console.warn('bulkSave is deprecated. Please use either bulkCreate or bulkUpdate to be more precise about your request.');
      return _this._bulkSave(type, records, options, 'POST');
    });
    _defineProperty$1(this, "_bulkSave", function (type, records) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var method = arguments.length > 3 ? arguments[3] : undefined;
      var queryParams = options.queryParams,
        extensions = options.extensions;

      // get url for record type
      var url = _this.fetchUrl(type, queryParams, null);

      // convert records to an appropriate jsonapi attribute/relationship format
      var recordAttributes = records.map(function (record) {
        return record.jsonapi(options);
      });

      // build a data payload
      var body = JSON.stringify({
        data: recordAttributes
      });

      // build the json api extension string
      var extensionStr = extensions !== null && extensions !== void 0 && extensions.length ? "ext=\"bulk,".concat(extensions.join(), "\"") : 'ext="bulk"';

      // send request
      var response = _this.fetch(url, {
        headers: _objectSpread$3(_objectSpread$3({}, _this.defaultFetchOptions.headers), {}, {
          'Content-Type': "application/vnd.api+json; ".concat(extensionStr)
        }),
        method: method,
        body: body
      });

      // update records based on response
      return _this.updateRecords(response, records);
    });
    _defineProperty$1(this, "bulkCreate", function (type, records) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (records.some(function (record) {
        return !record.isNew;
      })) {
        throw new Error('Invariant violated: all records must be new records to perform a create');
      }
      return _this._bulkSave(type, records, options, 'POST');
    });
    _defineProperty$1(this, "bulkUpdate", function (type, records) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (records.some(function (record) {
        return record.isNew;
      })) {
        throw new Error('Invariant violated: all records must have a persisted id to perform an update');
      }
      return _this._bulkSave(type, records, options, 'PATCH');
    });
    _initializerDefineProperty(this, "remove", _descriptor4, this);
    _defineProperty$1(this, "getOne", function (type, id) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (!id) {
        console.error("No id given while calling 'getOne' on ".concat(type));
        return undefined;
      }
      var queryParams = options.queryParams;
      if (queryParams) {
        return _this.getCachedRecord(type, id, queryParams);
      } else {
        return _this.getRecord(type, id);
      }
    });
    _defineProperty$1(this, "findOne", function (type, id) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (!id) {
        console.error("No id given while calling 'findOne' on ".concat(type));
        return undefined;
      }
      var record = _this.getOne(type, id, options);
      return record !== null && record !== void 0 && record.id ? record : _this.fetchOne(type, id, options);
    });
    _defineProperty$1(this, "getMany", function (type, ids) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var idsToQuery = ids.slice().map(String);
      var records = _this.getAll(type, options);
      return records.filter(function (record) {
        return idsToQuery.includes(record.id);
      });
    });
    _defineProperty$1(this, "fetchMany", function (type, ids) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var idsToQuery = ids.slice().map(String);
      var _options$queryParams = options.queryParams,
        queryParams = _options$queryParams === void 0 ? {} : _options$queryParams,
        queryTag = options.queryTag;
      queryParams.filter = queryParams.filter || {};
      var baseUrl = _this.fetchUrl(type, queryParams);
      var idQueries = deriveIdQueryStrings(idsToQuery, baseUrl);
      var queries = idQueries.map(function (queryIds) {
        var params = cloneDeep_1(queryParams);
        params.filter.ids = queryIds;
        return _this.fetchAll(type, {
          queryParams: params,
          queryTag: queryTag
        });
      });
      return Promise.all(queries).then(function (records) {
        var _ref;
        return (_ref = []).concat.apply(_ref, _toConsumableArray(records));
      }).catch(function (err) {
        return Promise.reject(err);
      });
    });
    _defineProperty$1(this, "findMany", function (type, ids) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var idsToQuery = _toConsumableArray(new Set(ids)).map(String);
      var recordsInStore = _this.getAll(type, options).filter(function (record) {
        return idsToQuery.includes(String(record.id));
      });
      if (recordsInStore.length === idsToQuery.length) {
        return recordsInStore;
      }
      var recordIdsInStore = recordsInStore.map(function (_ref2) {
        var id = _ref2.id;
        return String(id);
      });
      idsToQuery = idsToQuery.filter(function (id) {
        return !recordIdsInStore.includes(id);
      });
      var _options$queryParams2 = options.queryParams,
        queryParams = _options$queryParams2 === void 0 ? {} : _options$queryParams2,
        queryTag = options.queryTag;
      queryParams.filter = queryParams.filter || {};
      var baseUrl = _this.fetchUrl(type, queryParams);
      var idQueries = deriveIdQueryStrings(idsToQuery, baseUrl);
      var query = Promise.all(idQueries.map(function (queryIds) {
        queryParams.filter.ids = queryIds;
        return _this.fetchAll(type, {
          queryParams: queryParams,
          queryTag: queryTag
        });
      }));
      return query.then(function (recordsFromServer) {
        return recordsInStore.concat.apply(recordsInStore, _toConsumableArray(recordsFromServer));
      });
    });
    _defineProperty$1(this, "getAll", function (type) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var queryParams = options.queryParams;
      if (queryParams) {
        return _this.getCachedRecords(type, queryParams);
      } else {
        return _this.getRecords(type);
      }
    });
    _initializerDefineProperty(this, "setLoadingState", _descriptor5, this);
    _initializerDefineProperty(this, "deleteLoadingState", _descriptor6, this);
    _defineProperty$1(this, "fetchAll", /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(type) {
        var options,
          queryParams,
          url,
          state,
          response,
          json,
          records,
          errors,
          _args = arguments;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                queryParams = options.queryParams;
                url = _this.fetchUrl(type, queryParams);
                state = _this.setLoadingState(_objectSpread$3(_objectSpread$3({}, options), {}, {
                  type: type,
                  url: url
                }));
                _context.next = 6;
                return _this.fetch(url, {
                  method: 'GET'
                });
              case 6:
                response = _context.sent;
                if (!(response.status === 200)) {
                  _context.next = 17;
                  break;
                }
                _this.data[type].cache.set(url, []);
                _context.next = 11;
                return response.json();
              case 11:
                json = _context.sent;
                runInAction(function () {
                  if (json.included) {
                    _this.createModelsFromData(json.included);
                  }
                  records = json.data.map(function (dataObject) {
                    var id = dataObject.id,
                      _dataObject$attribute = dataObject.attributes,
                      attributes = _dataObject$attribute === void 0 ? {} : _dataObject$attribute,
                      _dataObject$relations = dataObject.relationships,
                      relationships = _dataObject$relations === void 0 ? {} : _dataObject$relations;
                    var record = _this.createModel(type, id, {
                      attributes: attributes,
                      relationships: relationships
                    });
                    var cachedIds = _this.data[type].cache.get(url);
                    _this.data[type].cache.set(url, [].concat(_toConsumableArray(cachedIds), [id]));
                    _this.data[type].records.set(String(id), record);
                    return record;
                  });
                  _this.deleteLoadingState(state);
                });
                if (json.meta) {
                  records.meta = json.meta;
                  _this.getType(type).meta.set(url, json.meta);
                }
                return _context.abrupt("return", records);
              case 17:
                runInAction(function () {
                  _this.deleteLoadingState(state);
                });
                _context.next = 20;
                return parseErrors(response, _this.errorMessages);
              case 20:
                errors = _context.sent;
                throw new Error(JSON.stringify(errors));
              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }());
    _defineProperty$1(this, "findAll", function (type) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var records = _this.getAll(type, options);
      if (records.length > 0) {
        return records;
      } else {
        return _this.fetchAll(type, options);
      }
    });
    makeObservable(this);
    this.init(_options);
    this.schema = schema;
  }

  /**
   * Adds an instance or an array of instances to the store.
   * ```
   * kpiHash = { name: "A good thing to measure" }
   * kpi = store.add('kpis', kpiHash)
   * kpi.name
   * => "A good thing to measure"
   * ```
   *
   * @param {string} type the model type
   * @param {object|Array} data the properties to use
   * @returns {object} the new record
   */
  _createClass(Store, [{
    key: "fetchOne",
    value:
    /**
     * Fetches record by `id` from the server and returns a Promise.
     *
     * @async
     * @param {string} type the record type to fetch
     * @param {string} id the id of the record to fetch
     * @param {object} options { queryParams }
     * @returns {object} record
     */
    function () {
      var _fetchOne = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(type, id) {
        var options,
          queryParams,
          url,
          state,
          response,
          json,
          data,
          included,
          record,
          errors,
          _args2 = arguments;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
                if (id) {
                  _context2.next = 4;
                  break;
                }
                console.error("No id given while calling 'fetchOne' on ".concat(type));
                return _context2.abrupt("return", undefined);
              case 4:
                queryParams = options.queryParams;
                url = this.fetchUrl(type, queryParams, id);
                state = this.setLoadingState(_objectSpread$3(_objectSpread$3({}, options), {}, {
                  type: type,
                  id: id,
                  url: url
                }));
                _context2.next = 9;
                return this.fetch(url, {
                  method: 'GET'
                });
              case 9:
                response = _context2.sent;
                if (!(response.status === 200)) {
                  _context2.next = 22;
                  break;
                }
                _context2.next = 13;
                return response.json();
              case 13:
                json = _context2.sent;
                data = json.data, included = json.included;
                if (included) {
                  this.createModelsFromData(included);
                }
                record = this.createOrUpdateModel(data);
                this.data[type].cache.set(url, [record.id]);
                this.deleteLoadingState(state);
                return _context2.abrupt("return", record);
              case 22:
                this.deleteLoadingState(state);
                _context2.next = 25;
                return parseErrors(response, this.errorMessages);
              case 25:
                errors = _context2.sent;
                throw new Error(JSON.stringify(errors));
              case 27:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
      function fetchOne(_x2, _x3) {
        return _fetchOne.apply(this, arguments);
      }
      return fetchOne;
    }()
    /**
     * Finds a record by `id`.
     * If available in the store, it returns that record. Otherwise, it fetches the record from the server.
     *
     *   store.findOne('todos', 5)
     *   // fetch triggered
     *   => event1
     *   store.findOne('todos', 5)
     *   // no fetch triggered
     *   => event1
     *
     * @param {string} type the type to find
     * @param {string} id the id of the record to find
     * @param {object} options { queryParams }
     * @returns {Promise} a promise that will resolve to the record
     */
  }, {
    key: "fetchUrl",
    value:
    /**
     * Builds fetch url based
     *
     * @param {string} type the type to find
     * @param {object} queryParams params to be used in the fetch
     * @param {string} id a model id
     * @param {object} options options for fetching
     * @returns {string} a formatted url
     */
    function fetchUrl(type, queryParams, id, options) {
      var baseUrl = this.baseUrl,
        modelTypeIndex = this.modelTypeIndex;
      var endpoint = modelTypeIndex[type].endpoint;
      return requestUrl(baseUrl, endpoint, queryParams, id, options);
    }

    /**
     * Gets all records with the given `type` from the store. This will never fetch from the server.
     *
     * @param {string} type the type to find
     * @param {object} options options for fetching queryParams
     * @returns {Array} array of records
     */
  }, {
    key: "reset",
    value:
    /**
     * Clears the store of a given type, or clears all if no type given
     *
     *   store.reset('todos')
     *   // removes all todos from store
     *   store.reset()
     *   // clears store
     *
     * @param {string} type the model type
     */
    function reset(type) {
      if (type) {
        this.data[type] = {
          records: observable.map(),
          cache: observable.map(),
          meta: observable.map()
        };
      } else {
        this.initializeObservableDataProperty();
      }
    }

    /* Private Methods */

    /**
     * Entry point for configuring the store
     *
     * @param {object} options passed to constructor
     */
  }, {
    key: "init",
    value: function init(options) {
      this.initializeNetworkConfiguration(options);
      this.initializeModelTypeIndex();
      this.initializeObservableDataProperty();
      this.initializeErrorMessages(options);
    }

    /**
     * Configures the store's network options
     *
     * @param {object} options for network config
     */
  }, {
    key: "initializeNetworkConfiguration",
    value: function initializeNetworkConfiguration() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.baseUrl = options.baseUrl || '';
      this.defaultFetchOptions = options.defaultFetchOptions || {};
      this.headersOfInterest = options.headersOfInterest || [];
      this.retryOptions = options.retryOptions || {
        attempts: 1,
        delay: 0
      }; // do not retry by default
    }

    /**
     * Creates the key/value index of model types
     */
  }, {
    key: "initializeModelTypeIndex",
    value: function initializeModelTypeIndex() {
      var types = this.constructor.types;
      this.modelTypeIndex = types.reduce(function (modelTypeIndex, modelKlass) {
        modelTypeIndex[modelKlass.type] = modelKlass;
        return modelTypeIndex;
      }, {});
    }

    /**
     * Creates an obserable index with model types
     * as the primary key
     *
     * Observable({ todos: {} })
     *
     */
  }, {
    key: "initializeObservableDataProperty",
    value: function initializeObservableDataProperty() {
      var _this2 = this;
      var types = this.constructor.types;

      // NOTE: Is there a performance cost to setting
      // each property individually?
      // Is Map the most efficient structure?
      types.forEach(function (modelKlass) {
        _this2.data[modelKlass.type] = {
          records: observable.map(),
          cache: observable.map(),
          meta: observable.map()
        };
      });
    }

    /**
     * Configure the error messages returned from the store when API requests fail
     *
     * @param {object} options for initializing the store
     *   options for initializing error messages for different HTTP status codes
     */
  }, {
    key: "initializeErrorMessages",
    value: function initializeErrorMessages() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var errorMessages = _objectSpread$3({}, options.errorMessages);
      this.errorMessages = _objectSpread$3({
        default: 'Something went wrong.'
      }, errorMessages);
    }

    /**
     * Wrapper around fetch applies user defined fetch options
     *
     * @param {string} url the url to fetch
     * @param {object} options override options to use for fetching
     * @returns {Promise} the data from the server
     */
  }, {
    key: "fetch",
    value: function fetch(url) {
      var _this3 = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var defaultFetchOptions = this.defaultFetchOptions,
        headersOfInterest = this.headersOfInterest,
        retryOptions = this.retryOptions;
      var fetchOptions = _objectSpread$3(_objectSpread$3({}, defaultFetchOptions), options);
      var attempts = retryOptions.attempts,
        delay = retryOptions.delay;
      var handleResponse = function handleResponse(response) {
        // Capture headers of interest
        if (headersOfInterest) {
          runInAction(function () {
            headersOfInterest.forEach(function (header) {
              var value = response.headers.get(header);
              // Only set if it has changed, to minimize observable changes
              if (_this3.lastResponseHeaders[header] !== value) _this3.lastResponseHeaders[header] = value;
            });
          });
        }
        return response;
      };
      return fetchWithRetry(url, fetchOptions, attempts, delay).then(handleResponse);
    }

    /**
     * Gets type of collection from data observable
     *
     * @param {string} type the model type
     * @returns {object} observable type object structure
     */
  }, {
    key: "getType",
    value: function getType(type) {
      return this.data[type];
    }

    /**
     * Gets individual record from store
     *
     * @param {string} type the model type
     * @param {number} id the model id
     * @returns {object} record
     */
  }, {
    key: "getRecord",
    value: function getRecord(type, id) {
      if (!this.getType(type)) {
        throw new Error("Could not find a collection for type '".concat(type, "'"));
      }
      var record = this.getType(type).records.get(String(id));
      return !record || record === 'undefined' ? undefined : record;
    }

    /**
     * Gets records for type of collection from observable
     *
     * NOTE: We only return records by unique id, this handles a scenario
     * where the store keeps around a reference to a newly persisted record by its temp uuid.
     * We can't simply remove the temp uuid reference because other
     * related models may be still using the temp uuid in their relationships
     * data object. However, when we are listing out records we want them
     * to be unique by the persisted id (which is updated after a Model.save)
     *
     * @param {string} type the model type
     * @returns {Array} array of objects
     */
  }, {
    key: "getRecords",
    value: function getRecords(type) {
      var records = Array.from(this.getType(type).records.values()).filter(function (value) {
        return value && value !== 'undefined';
      });
      return uniqBy_1(records, 'id');
    }

    /**
     * Get multiple records by id
     *
     * @param {string} type the model type
     * @param {Array} ids the ids to find
     * @returns {Array} array or records
     */
  }, {
    key: "getRecordsById",
    value: function getRecordsById(type) {
      var _this4 = this;
      var ids = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      // NOTE: Is there a better way to do this?
      return ids.map(function (id) {
        return _this4.getRecord(type, id);
      }).filter(function (record) {
        return record;
      }).filter(function (record) {
        return typeof record !== 'undefined';
      });
    }

    /**
     * Clears the cache for provided record type
     *
     * @param {string} type the model type
     * @returns {Set} the cleared set
     */
  }, {
    key: "clearCache",
    value: function clearCache(type) {
      return this.getType(type).cache.clear();
    }

    /**
     * Gets single from store based on cached query
     *
     * @param {string} type the model type
     * @param {string} id the model id
     * @param {object} queryParams the params to be searched
     * @returns {object} record
     */
  }, {
    key: "getCachedRecord",
    value: function getCachedRecord(type, id, queryParams) {
      var cachedRecords = this.getCachedRecords(type, queryParams, id);
      return cachedRecords && cachedRecords[0];
    }

    /**
     * Gets records from store based on cached query
     *
     * @param {string} type type of records to get
     * @param {object} queryParams query params that were used for the query
     * @param {string} id optional param if only getting 1 cached record by id
     * @returns {Array} array of records
     */
  }, {
    key: "getCachedRecords",
    value: function getCachedRecords(type, queryParams, id) {
      // Get the url the request would use
      var url = this.fetchUrl(type, queryParams, id);
      // Get the matching ids from the response
      var ids = this.getCachedIds(type, url);
      // get the meta for the request
      var meta = this.getType(type).meta.get(url);
      // Get the records matching the ids
      var cachedRecords = this.getRecordsById(type, ids);
      if (meta) cachedRecords.meta = meta;
      return cachedRecords;
    }

    /**
     * Gets records from store based on cached query
     *
     * @param {string} type the model type
     * @param {string} url the url that was requested
     * @returns {Array} array of ids
     */
  }, {
    key: "getCachedIds",
    value: function getCachedIds(type, url) {
      var ids = this.getType(type).cache.get(url);
      if (!ids) return [];
      var idsSet = new Set(toJS(ids));
      return Array.from(idsSet);
    }

    /**
     * Gets a record from store based on cached query
     *
     * @param {string} type the model type
     * @param {string} id the id to get
     * @returns {object} the cached object
     */
  }, {
    key: "getCachedId",
    value: function getCachedId(type, id) {
      return this.getType(type).cache.get(String(id));
    }

    /**
     * Helper to look up model class for type.
     *
     * @param {string} type the model type
     * @returns {Function} model constructor
     */
  }, {
    key: "getKlass",
    value: function getKlass(type) {
      return this.modelTypeIndex[type];
    }

    /**
     * Creates or updates a model
     *
     * @param {object} dataObject the object will be used to update or create a model
     * @returns {object} the record
     */
  }, {
    key: "createOrUpdateModel",
    value: function createOrUpdateModel(dataObject) {
      var _dataObject$attribute2 = dataObject.attributes,
        attributes = _dataObject$attribute2 === void 0 ? {} : _dataObject$attribute2,
        id = dataObject.id,
        _dataObject$relations2 = dataObject.relationships,
        relationships = _dataObject$relations2 === void 0 ? {} : _dataObject$relations2,
        type = dataObject.type;
      var record = this.getRecord(type, id);
      if (record) {
        record.updateAttributesFromResponse({
          attributes: attributes,
          id: id,
          relationships: relationships
        });
      } else {
        record = this.createModel(type, id, {
          attributes: attributes,
          relationships: relationships
        });
      }
      this.data[type].records.set(String(record.id), record);
      return record;
    }

    /**
     * Create multiple models from an array of data
     *
     * @param {Array} data the array of jsonapi data
     * @returns {Array} an array of the models serialized
     */
  }, {
    key: "createModelsFromData",
    value: function createModelsFromData(data) {
      var _this5 = this;
      return data.map(function (dataObject) {
        // Only build objects for which we have a type defined.
        // And ignore silently anything else included in the JSON response.
        // TODO: Put some console message in development mode
        if (_this5.getType(dataObject.type)) {
          return _this5.createOrUpdateModel(dataObject);
        } else {
          console.warn("no type defined for ".concat(dataObject.type));
          return null;
        }
      });
    }

    /**
     * Helper to create a new model
     *
     * @param {string} type the model type
     * @param {string} id the model id
     * @param {object} data attributes and relationships
     * @returns {object} model instance
     */
  }, {
    key: "createModel",
    value: function createModel(type, id, data) {
      var _toJS = toJS(data),
        _toJS$attributes = _toJS.attributes,
        attributes = _toJS$attributes === void 0 ? {} : _toJS$attributes,
        _toJS$relationships = _toJS.relationships,
        relationships = _toJS$relationships === void 0 ? {} : _toJS$relationships;
      var store = this;
      var ModelKlass = this.getKlass(type);
      if (!ModelKlass) {
        throw new Error("Could not find a model for '".concat(type, "'"));
      }
      return new ModelKlass(_objectSpread$3({
        id: id,
        store: store,
        relationships: relationships
      }, attributes));
    }

    /**
     * Defines a resolution for an API call that will update a record or
     * set of records with the data returned from the API
     *
     * @param {Promise} promise a request to the API
     * @param {object|Array} records to be updated
     * @returns {Promise} a resolved promise after operations have been performed
     */
  }, {
    key: "updateRecords",
    value: function updateRecords(promise, records) {
      var _this6 = this;
      // records may be a single record, if so wrap it in an array to make
      // iteration simpler
      var recordsArray = Array.isArray(records) ? records : [records];
      recordsArray.forEach(function (record) {
        record.isInFlight = true;
      });
      return promise.then( /*#__PURE__*/function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(response) {
          var status, json, data, included, errors;
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  status = response.status;
                  recordsArray.forEach(function (record) {
                    record.isInFlight = false;
                  });
                  if (!(status === 200 || status === 201)) {
                    _context3.next = 15;
                    break;
                  }
                  _context3.next = 5;
                  return response.json();
                case 5:
                  json = _context3.sent;
                  data = Array.isArray(json.data) ? json.data : [json.data];
                  included = json.included;
                  if (!(data.length !== recordsArray.length)) {
                    _context3.next = 10;
                    break;
                  }
                  throw new Error('Invariant violated: API response data and records to update do not match');
                case 10:
                  data.forEach(function (targetData, index) {
                    recordsArray[index].updateAttributesFromResponse(targetData, included);
                  });
                  if (json.included) {
                    _this6.createModelsFromData(json.included);
                  }

                  // on success, return the original record(s).
                  // again - this may be a single record so preserve the structure
                  return _context3.abrupt("return", records);
                case 15:
                  _context3.next = 17;
                  return parseErrors(response, _this6.errorMessages);
                case 17:
                  errors = _context3.sent;
                  runInAction(function () {
                    errors.forEach(function (error) {
                      var _parseErrorPointer = parseErrorPointer(error),
                        index = _parseErrorPointer.index,
                        key = _parseErrorPointer.key;
                      if (key != null) {
                        // add the error to the record
                        var _errors = recordsArray[index].errors[key] || [];
                        _errors.push(error);
                        recordsArray[index].errors[key] = _errors;
                      }
                    });
                  });
                  throw new Error(JSON.stringify(errors));
                case 20:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));
        return function (_x4) {
          return _ref4.apply(this, arguments);
        };
      }(), function (error) {
        // TODO: Handle error states correctly, including handling errors for multiple targets
        recordsArray.forEach(function (record) {
          record.isInFlight = false;
        });
        recordsArray[0].errors = error;
        throw error;
      });
    }
  }]);
  return Store;
}(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "data", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "lastResponseHeaders", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "addModel", [action], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this7 = this;
    return function (type, properties) {
      var id = idOrNewId(properties.id);
      var attributes = _this7.pickAttributes(properties, type);
      var relationships = _this7.pickRelationships(properties, type);
      var model = _this7.createModel(type, id, {
        attributes: attributes,
        relationships: relationships
      });

      // Add the model to the type records index
      _this7.data[type].records.set(String(model.id), model);
      return model;
    };
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "remove", [action], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this8 = this;
    return function (type, id) {
      _this8.data[type].records.delete(String(id));
    };
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "setLoadingState", [action], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this9 = this;
    return function (_ref5) {
      var url = _ref5.url,
        type = _ref5.type,
        queryParams = _ref5.queryParams,
        queryTag = _ref5.queryTag;
      queryTag = queryTag || type;
      var loadingStateInfo = {
        url: url,
        type: type,
        queryParams: queryParams,
        queryTag: queryTag
      };
      if (!_this9.loadingStates.get(queryTag)) {
        _this9.loadingStates.set(queryTag, new Set());
      }
      _this9.loadingStates.get(queryTag).add(JSON.stringify(loadingStateInfo));
      return loadingStateInfo;
    };
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "deleteLoadingState", [action], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this10 = this;
    return function (state) {
      var loadingStates = _this10.loadingStates,
        loadedStates = _this10.loadedStates;
      var queryTag = state.queryTag;
      var encodedState = JSON.stringify(state);
      if (!loadedStates.get(queryTag)) {
        loadedStates.set(queryTag, new Set());
      }
      loadedStates.get(queryTag).add(encodedState);
      if (loadingStates.get(queryTag)) {
        loadingStates.get(queryTag).delete(encodedState);
        if (loadingStates.get(queryTag).size === 0) {
          loadingStates.delete(queryTag);
        }
      } else {
        console.warn("no loadingState found for ".concat(encodedState));
      }
    };
  }
}), _applyDecoratedDescriptor(_class.prototype, "reset", [action], Object.getOwnPropertyDescriptor(_class.prototype, "reset"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "init", [action], Object.getOwnPropertyDescriptor(_class.prototype, "init"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "initializeNetworkConfiguration", [action], Object.getOwnPropertyDescriptor(_class.prototype, "initializeNetworkConfiguration"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "initializeModelTypeIndex", [action], Object.getOwnPropertyDescriptor(_class.prototype, "initializeModelTypeIndex"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "initializeObservableDataProperty", [action], Object.getOwnPropertyDescriptor(_class.prototype, "initializeObservableDataProperty"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "initializeErrorMessages", [action], Object.getOwnPropertyDescriptor(_class.prototype, "initializeErrorMessages"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "createOrUpdateModel", [action], Object.getOwnPropertyDescriptor(_class.prototype, "createOrUpdateModel"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "createModelsFromData", [action], Object.getOwnPropertyDescriptor(_class.prototype, "createModelsFromData"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "createModel", [action], Object.getOwnPropertyDescriptor(_class.prototype, "createModel"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateRecords", [action], Object.getOwnPropertyDescriptor(_class.prototype, "updateRecords"), _class.prototype)), _class);

var objectWithoutPropertiesExports = {};
var objectWithoutProperties = {
  get exports(){ return objectWithoutPropertiesExports; },
  set exports(v){ objectWithoutPropertiesExports = v; },
};

var objectWithoutPropertiesLooseExports = {};
var objectWithoutPropertiesLoose = {
  get exports(){ return objectWithoutPropertiesLooseExports; },
  set exports(v){ objectWithoutPropertiesLooseExports = v; },
};

(function (module) {
	function _objectWithoutPropertiesLoose(source, excluded) {
	  if (source == null) return {};
	  var target = {};
	  var sourceKeys = Object.keys(source);
	  var key, i;
	  for (i = 0; i < sourceKeys.length; i++) {
	    key = sourceKeys[i];
	    if (excluded.indexOf(key) >= 0) continue;
	    target[key] = source[key];
	  }
	  return target;
	}
	module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;
} (objectWithoutPropertiesLoose));

(function (module) {
	var objectWithoutPropertiesLoose = objectWithoutPropertiesLooseExports;
	function _objectWithoutProperties(source, excluded) {
	  if (source == null) return {};
	  var target = objectWithoutPropertiesLoose(source, excluded);
	  var key, i;
	  if (Object.getOwnPropertySymbols) {
	    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
	    for (i = 0; i < sourceSymbolKeys.length; i++) {
	      key = sourceSymbolKeys[i];
	      if (excluded.indexOf(key) >= 0) continue;
	      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
	      target[key] = source[key];
	    }
	  }
	  return target;
	}
	module.exports = _objectWithoutProperties, module.exports.__esModule = true, module.exports["default"] = module.exports;
} (objectWithoutProperties));

var _objectWithoutProperties = /*@__PURE__*/getDefaultExportFromCjs(objectWithoutPropertiesExports);

var baseClone = _baseClone;

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG);
}

var clone_1 = clone;

var identity = identity_1;

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction$1(value) {
  return typeof value == 'function' ? value : identity;
}

var _castFunction = castFunction$1;

var baseTimes = _baseTimes,
    castFunction = _castFunction,
    toInteger = toInteger_1;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Invokes the iteratee `n` times, returning an array of the results of
 * each invocation. The iteratee is invoked with one argument; (index).
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 * @example
 *
 * _.times(3, String);
 * // => ['0', '1', '2']
 *
 *  _.times(4, _.constant(0));
 * // => [0, 0, 0, 0]
 */
function times(n, iteratee) {
  n = toInteger(n);
  if (n < 1 || n > MAX_SAFE_INTEGER) {
    return [];
  }
  var index = MAX_ARRAY_LENGTH,
      length = nativeMin(n, MAX_ARRAY_LENGTH);

  iteratee = castFunction(iteratee);
  n -= MAX_ARRAY_LENGTH;

  var result = baseTimes(length, iteratee);
  while (++index < n) {
    iteratee(index);
  }
  return result;
}

var times_1 = times;

var _excluded = ["type"],
  _excluded2 = ["type", "parent"];
function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) { _defineProperty$1(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/**
 * A class to create and use factories
 *
 * @class FactoryFarm
 */
var FactoryFarm = /*#__PURE__*/function () {
  function FactoryFarm(store) {
    var _this = this;
    _classCallCheck(this, FactoryFarm);
    _defineProperty$1(this, "factories", {});
    _defineProperty$1(this, "singletons", {});
    _defineProperty$1(this, "add", function () {
      var _this$store;
      return (_this$store = _this.store).add.apply(_this$store, arguments);
    });
    _defineProperty$1(this, "_verifyFactory", function (factoryName) {
      var factory = _this.factories[factoryName];
      if (!factory) {
        throw new Error("Factory ".concat(factoryName, " does not exist"));
      }
    });
    _defineProperty$1(this, "_buildModel", function (factoryName, properties) {
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      properties = clone_1(properties);
      Object.keys(properties).forEach(function (key) {
        if (Array.isArray(properties[key])) {
          properties[key] = properties[key].map(function (propDefinition) {
            return _this._callPropertyDefinition(propDefinition, index, factoryName, properties);
          });
        } else {
          properties[key] = _this._callPropertyDefinition(properties[key], index, factoryName, properties);
        }
      });
      return properties;
    });
    _defineProperty$1(this, "_callPropertyDefinition", function (definition, index, factoryName, properties) {
      return typeof definition === 'function' ? definition.call(_this, index, factoryName, properties) : definition;
    });
    this.store = store || new Store();
    this.store.__usedForFactoryFarm__ = true;
  }

  /**
   * A hash of available factories. A factory is an object with a structure like:
   * { name, type, attributes, relationships }.
   *
   * @type {object}
   */
  _createClass(FactoryFarm, [{
    key: "build",
    value:
    /**
     * Allows easy building of Store objects, including relationships.
     * Takes parameters `attributes` and `relationships` to use for building.
     *
     *   const batchAction = store.build('cropBatchAction')
     *   store.build('basilBatch', {
     *     arbitrary_id: 'new_id'
     *     zone: 'bay1',
     *     crop_batch_actions: [
     *       batchAction,
     *       store.build('batchAction')
     *     ]
     *   })
     *
     * @param {string} factoryName the name of the factory to use
     * @param {object} overrideOptions overrides for the factory
     * @param {number} numberOfRecords optional number of models to build
     * @returns {object} instance of an Store model
     */
    function build(factoryName) {
      var overrideOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var numberOfRecords = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var store = this.store,
        factories = this.factories,
        singletons = this.singletons,
        _verifyFactory = this._verifyFactory,
        _buildModel = this._buildModel;
      _verifyFactory(factoryName);
      var _factories$factoryNam = factories[factoryName],
        type = _factories$factoryNam.type,
        properties = _objectWithoutProperties(_factories$factoryNam, _excluded);
      var newModelProperties = _objectSpread$2(_objectSpread$2({
        id: function id(i) {
          return String(store.getAll(type).length + i + 1);
        }
      }, properties), overrideOptions);
      var identity = false;
      if (newModelProperties.identity) {
        if (typeof newModelProperties.identity === 'string') {
          identity = newModelProperties.identity;
        } else {
          identity = factoryName;
        }
        delete newModelProperties.identity;
        if (numberOfRecords === 1) {
          if (singletons[identity]) return singletons[identity];
        }
      }
      var addProperties;
      if (numberOfRecords > 1) {
        addProperties = times_1(numberOfRecords, function (i) {
          return _buildModel(factoryName, newModelProperties, i);
        });
      } else {
        addProperties = _buildModel(factoryName, newModelProperties);
      }
      var results = store.add(type, addProperties);
      if (identity) {
        singletons[identity] = results;
      }
      return results;
    }

    /**
     * Creates a factory with { name, type, parent, ...attributesAndRelationships }, which can be used for
     * building test data.
     * The factory is named, with a set of options to use to configure it.
     *   - parent - use another factory as a basis for this one
     *   - type - the type of model to use (for use if no parent)
     *   - identity - whether this factory should be a singleton
     * attributesAndRelationships - attributes and relationships. If properties are a function or an array of functions, they
     *   will be executed at runtime.
     *
     * @param {string} name the name to use for the factory
     * @param {object} options options that can be used to configure the factory
     */
  }, {
    key: "define",
    value: function define(name) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var type = options.type,
        parent = options.parent,
        properties = _objectWithoutProperties(options, _excluded2);
      var factory;
      if (parent) {
        var fromFactory = this.factories[parent];
        if (!fromFactory) {
          throw new Error("Factory ".concat(parent, " does not exist"));
        }
        factory = _objectSpread$2(_objectSpread$2({}, fromFactory), properties);
      } else {
        factory = _objectSpread$2({
          type: type
        }, properties);
      }
      this.factories[name] = factory;
    }

    /**
     * Alias for `this.store.add`
     *
     * @param  {...any} params attributes and relationships to be added to the store
     * @returns {*} object or array
     */
  }]);
  return FactoryFarm;
}();

/**
 * JSONAPI uses `included` only at the top level. To recursively add models to this array,
 * we preserve the top-level object and pass it in to the next round
 * Because objects can have multiple relationships, we do a check of the array to make sure
 * it's not already there.

 * @param {object} store
 * @param {object} encodedData the jsonapi document
 * @param {object} topLevel the object with `inlcluded` array
 */
var addIncluded = function addIncluded(store, encodedModel, included) {
  var allEncoded = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [encodedModel];
  var relationships = encodedModel.relationships;
  Object.keys(relationships).forEach(function (key) {
    var data = relationships[key].data;
    if (!Array.isArray(data)) {
      data = [data];
    }
    var notAlreadyIncluded = data.filter(function (_ref) {
      var id = _ref.id,
        type = _ref.type;
      return !allEncoded.some(function (encodedModel) {
        return encodedModel.type === type && encodedModel.id === id;
      });
    });
    notAlreadyIncluded.forEach(function (relationship) {
      var relatedModel = store.getOne(relationship.type, relationship.id);
      var encodedRelatedModel = toFullJsonapi(relatedModel);
      included.push(encodedRelatedModel);
      addIncluded(store, encodedRelatedModel, included, [].concat(_toConsumableArray(allEncoded), _toConsumableArray(included), [encodedModel]));
    });
  });
};

/**
 * Encodes models into full compliant JSONAPI payload, as if it were being sent with all
 * relevant relationships and inclusions. The resulting payload will look like
 * {
 *   data: {
 *     id: '1',
 *     type: 'zones',
 *     attributes: {},
 *     relationships: {},
 *   },
 *   included: []
 * }

 * @param {*} modelOrArray the data being encoded
 * @returns {string} JSON encoded data
 */

var serverResponse = function serverResponse(modelOrArray) {
  var model;
  var array;
  var encodedData;
  if (modelOrArray == null) {
    throw new Error('Cannot encode a null reference');
  } else if (Array.isArray(modelOrArray)) {
    array = modelOrArray;
  } else {
    model = modelOrArray;
  }
  if (model) {
    encodedData = {
      data: toFullJsonapi(model),
      included: []
    };
    addIncluded(model.store, encodedData.data, encodedData.included);
  } else if (array.length > 0) {
    encodedData = {
      data: array.map(toFullJsonapi),
      included: []
    };
    encodedData.data.forEach(function (encodedModel) {
      addIncluded(array[0].store, encodedModel, encodedData.included, [].concat(_toConsumableArray(encodedData.data), _toConsumableArray(encodedData.included)));
    });
  } else {
    encodedData = {
      data: []
    };
  }
  return JSON.stringify(encodedData);
};
var toFullJsonapi = function toFullJsonapi(model) {
  return model.jsonapi({
    relationships: Object.keys(model.relationships)
  });
};

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty$1(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var simulatePost = function simulatePost(store, type, body) {
  var _JSON$parse = JSON.parse(body.toString()),
    data = _JSON$parse.data;
  if (Array.isArray(data)) {
    var records = data.map(function (record) {
      var attributes = record.attributes,
        _record$relationships = record.relationships,
        relationships = _record$relationships === void 0 ? {} : _record$relationships;
      var id = String(store.getAll(type).length + 1);
      var properties = _objectSpread$1(_objectSpread$1(_objectSpread$1({}, attributes), relationships.data), {}, {
        id: id
      });
      return store.add(type, properties);
    });
    return records;
  } else {
    var attributes = data.attributes,
      _data$relationships = data.relationships,
      relationships = _data$relationships === void 0 ? {} : _data$relationships;
    var id = String(store.getAll(type).length + 1);
    var properties = _objectSpread$1(_objectSpread$1(_objectSpread$1({}, attributes), relationships.data), {}, {
      id: id
    });
    return store.add(type, properties);
  }
};
var simulatePatch = function simulatePatch(store, type, body) {
  var _JSON$parse2 = JSON.parse(body.toString()),
    data = _JSON$parse2.data;
  if (Array.isArray(data)) {
    var records = data.map(function (recordData) {
      var record = store.getOne(type, String(recordData.id));
      record.updateAttributesFromResponse(recordData);
      return record;
    });
    return records;
  } else {
    var record = store.getOne(type, String(data.id));
    record.updateAttributesFromResponse(data);
    return record;
  }
};
var getOneFromFactory = function getOneFromFactory(_backendFactoryFarm, factory, type, id) {
  factory = factory || Object.keys(_backendFactoryFarm.factories).find(function (factoryName) {
    return _backendFactoryFarm.factories[factoryName].type === type;
  });
  if (!factory) {
    throw new Error("No default factory for ".concat(type, " exists"));
  }
  return _backendFactoryFarm.build(factory, {
    id: id
  });
};

/**
 * Will throw an error if `fetch` is called from the mockServer, usually due to a `POST` or `PATCH` called by a `save`
 *
 * @param {string} url the url that is attempted
 * @param {object} options options including the http method
 */
var circularFetchError = function circularFetchError(url, options) {
  throw new Error("You tried to call fetch from MockServer with ".concat(options.method, " ").concat(url, ", which is circular and would call itself. This was caused by calling a method such as 'save' on a model that was created from MockServer. To fix the problem, use FactoryFarm without MockServer"));
};

/**
 * Throws an error if MockServer tries to `findOne` or `findAll` from itself.
 *
 * @param {string} type the model type
 * @param {string} id the model id
 */
var circularFindError = function circularFindError(type, id) {
  var idText = id ? " with id ".concat(id) : '';
  throw new Error("You tried to find ".concat(type).concat(idText, " from MockServer which is circular and would call itself. To fix the problem, use FactoryFarm without MockServer"));
};

/**
 * Overrides store methods that could trigger a `fetch` to throw errors. MockServer should only provide data for fetches, never call a fetch itself.
 *
 * @param {object} store the internal store
 */
var disallowFetches = function disallowFetches(store) {
  store.fetch = circularFetchError;
  store.findOne = circularFindError;
  store.findAll = circularFindError;
  store.findMany = circularFindError;
  store.fetchOne = circularFindError;
  store.fetchAll = circularFindError;
  store.fetchMany = circularFindError;
};

/**
 * Wraps response JSON or object in a Response object that is itself wrapped in a
 * resolved Promise. If no status is given then it will fill in a default based on
 * the method.
 *
 * @param {*} response JSON string
 * @param {string} method the http method
 * @param {number} status the http status
 * @returns {Promise} a promise wrapping the response
 */

var wrapResponse = function wrapResponse(response, method, status) {
  if (!status) {
    status = method === 'POST' ? 201 : 200;
  }
  return Promise.resolve(new Response(response, {
    status: status
  }));
};

/**
 * A backend "server" to be used for creating jsonapi-compliant responses.
 */
var MockServer = /*#__PURE__*/_createClass(
/**
 * Sets properties needed internally
 *   - factoryFarm: a pre-existing factory to use on this server
 *   - responseOverrides: An array of alternative responses that can be used to override the ones that would be served
 *     from the internal store.
 *
 * @param {object} options currently `responseOverrides` and `factoriesForTypes`
 */
function MockServer() {
  var _this = this;
  var _options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, MockServer);
  _defineProperty$1(this, "respond", function (options) {
    _this.responseOverrides.push(options);
  });
  _defineProperty$1(this, "start", function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var factoriesForTypes = options.factoriesForTypes;
    var combinedOverrides = [].concat(_toConsumableArray(options.responseOverrides || []), _toConsumableArray(_this.responseOverrides || []));
    fetch.resetMocks();
    fetch.mockResponse(function (req) {
      var foundQuery = combinedOverrides.find(function (definition) {
        if (!(definition !== null && definition !== void 0 && definition.path)) {
          throw new Error('No path defined for mock server override. Did you define a path?');
        }
        var method = definition.method || 'GET';
        return req.url.match(definition.path) && req.method.match(method);
      });
      var response = foundQuery ? foundQuery.response(_this, req) : serverResponse(_this._findFromStore(req, factoriesForTypes));
      return wrapResponse(response, req.method, foundQuery === null || foundQuery === void 0 ? void 0 : foundQuery.status);
    });
  });
  _defineProperty$1(this, "stop", function () {
    fetch.resetMocks();
    _this._backendFactoryFarm.store.reset();
  });
  _defineProperty$1(this, "build", function (factoryName, overrideOptions, numberOfRecords) {
    return _this._backendFactoryFarm.build(factoryName, overrideOptions, numberOfRecords);
  });
  _defineProperty$1(this, "define", function (name, options) {
    return _this._backendFactoryFarm.define(name, options);
  });
  _defineProperty$1(this, "add", function (name, options) {
    return _this._backendFactoryFarm.add(name, options);
  });
  _defineProperty$1(this, "_findFromStore", function (req) {
    var factoriesForTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _backendFactoryFarm = _this._backendFactoryFarm;
    var method = req.method,
      url = req.url,
      body = req.body;
    var store = _backendFactoryFarm.store;
    var _URL = new URL(url, 'http://example.com'),
      pathname = _URL.pathname;
    var type = Object.keys(store.data).find(function (model_type) {
      return pathname.match(model_type);
    });
    var id = pathname.match(/\d+$/);
    id = id && String(id);
    if (method === 'POST') {
      return simulatePost(store, type, body);
    } else if (method === 'PATCH') {
      return simulatePatch(store, type, body);
    } else if (id) {
      return store.getOne(type, id) || getOneFromFactory(_backendFactoryFarm, factoriesForTypes[type], type, id);
    } else {
      var records = store.getAll(type);
      return records.length > 0 ? records : factoriesForTypes[type] && [getOneFromFactory(_backendFactoryFarm, factoriesForTypes[type], type, '1')] || [];
    }
  });
  this._backendFactoryFarm = _options.factoryFarm || new FactoryFarm();
  this._backendFactoryFarm.__usedForMockServer__ = true;
  this._backendFactoryFarm.store.__usedForMockServer__ = true;
  this.responseOverrides = _options.responseOverrides || [];
  disallowFetches(this._backendFactoryFarm.store);
}

/**
 * Adds a response override to the server
 *
 * @param {object} options path, method, status, and response to override
 *   - path
 *   - method: defaults to GET
 *   - status: defaults to 200
 *   - response: a method that takes the server as an argument and returns the body of the response
 */);

/**
 * returns `true` as long as the `value` is not `null`, `undefined`, or `''`
 *

 * @param value
 * @returns {boolean}
 */
function isPresent(value) {
  return value !== null && value !== undefined && value !== '';
}

/**
 * returns `true` as long as the `value` is not `null`, `undefined`, or `''`

 * @param value
 */
function validatePresence(value) {
  return {
    isValid: isPresent(value),
    errors: [{
      key: 'blank',
      message: 'can\'t be blank'
    }]
  };
}

/**
 * Helper method for apply the correct defaults to attributes.

 */
function defaultValueForDescriptor(descriptor, DataType) {
  if (typeof descriptor.initializer === 'function') {
    var value = descriptor.initializer();
    if (DataType.name === 'Date') {
      return makeDate(value);
    } else {
      return DataType(value);
    }
  }
  if (DataType.name === 'String') return '';
  if (DataType.name === 'Array') return [];
  return null;
}

/**
 * Defines attributes that will be serialized and deserialized. Takes one argument, a class that the attribute will be coerced to.
 * This can be a Javascript primitive or another class. `id` cannot be defined as it is assumed to exist.
 * Attributes can be defined with a default.
 * ```
 * class Todo extends Model {
 *   @attribute(Date) start_time = new Date()
 * }
 * ```

 */
function attribute() {
  var dataType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (obj) {
    return obj;
  };
  return function (target, property, descriptor) {
    var type = target.constructor.type;
    var defaultValue = defaultValueForDescriptor(descriptor, dataType);
    // Update the schema
    schema.addAttribute({
      dataType: dataType,
      defaultValue: defaultValue,
      property: property,
      type: type
    });
    // Return custom descriptor
    return {
      get: function get() {
        return defaultValue;
      },
      set: function set$1(value) {
        set(target, property, value);
      }
    };
  };
}

/**
 * Defines validations for attributes that will be applied before saving. Takes one argument, a function to validate
 * the attribute. The default validator is `presence`: not `null`, `undefined`, or `''`.
 * ```
 * function nonzero(value => value !== 0)
 *
 * class Todo extends Model {
 *   `@validates`
 *   `@attribute`(nonzero) numberOfAssignees
 * }
 * ```

 */
function validates(target, property) {
  var validator = validatePresence;
  if (typeof target === 'function') {
    validator = target;
    return function (target, property) {
      var type = target.constructor.type;
      schema.addValidation({
        property: property,
        type: type,
        validator: validator
      });
    };
  } else {
    var type = target.constructor.type;
    schema.addValidation({
      property: property,
      type: type,
      validator: validator
    });
  }
}

var _Symbol$species;
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty$1(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/*
 * Defines a one-to-many relationship. Defaults to the class with camelized singular name of the property
 * An optional argument specifies the data model, if different from the property name
 * ```
 * class CropVariety extends Model {
 *   @relatedToMany growth_cycles
 * }
 *
 * class Crop extends Model {
 *   @relatedToMany(CropVariety) varieties
 * }
 * ```

 */
function relatedToMany(targetOrModelKlass, property, descriptor) {
  schema.addRelationship({
    type: targetOrModelKlass.constructor.type,
    property: property,
    dataType: Array
  });
  return {
    get: function get() {
      return getRelatedRecords(this, property);
    }
  };
}

/**
 * Syntactic sugar of relatedToMany relationship. Basically
 * everything the same except it only returns a single record.
 *

 */
function relatedToOne(targetOrModelKlass, property, descriptor) {
  schema.addRelationship({
    type: targetOrModelKlass.constructor.type,
    property: property,
    dataType: Object
  });
  return {
    get: function get() {
      return getRelatedRecord(this, property);
    },
    set: function set(record) {
      return setRelatedRecord(this, record, property);
    }
  };
}

/**
 * Handles getting polymorphic records or only a specific
 * type if specified.
 *

 * @param {object} record the record with the relationship
 * @param {string} property the related property to set
 * @param {string} modelType an override of the modelType
 */
function getRelatedRecords(record, property) {
  var modelType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var relationships = record.relationships,
    cachedRelationships = record.cachedRelationships;
  var relationType = modelType || property;
  var references = relationships && relationships[relationType];
  if (!references || !references.data) {
    references = cachedRelationships && cachedRelationships[relationType];
  }
  var relatedRecords = [];

  // NOTE: If the record doesn't have a matching references for the relation type
  // fall back to looking up records by a foreign id i.e record.related_record_id
  if (references && references.data) {
    // Ignore any records of unknown types
    relatedRecords = references.data.filter(function (ref) {
      return record.store.getType(ref.type);
    }).map(function (ref) {
      var recordType = ref.type;
      return record.store.getRecord(recordType, ref.id);
    });
  } else {
    var foreignReferenceName = singularizeType(record.type);
    var foreignId = "".concat(foreignReferenceName, "_id");
    if (record.store.getType(relationType)) {
      var _allRecords$, _allRecords$$relation, _allRecords$$relation2, _allRecords$2;
      var allRecords = record.store.getRecords(relationType);
      if (allRecords !== null && allRecords !== void 0 && (_allRecords$ = allRecords[0]) !== null && _allRecords$ !== void 0 && (_allRecords$$relation = _allRecords$.relationships) !== null && _allRecords$$relation !== void 0 && (_allRecords$$relation2 = _allRecords$$relation[foreignReferenceName]) !== null && _allRecords$$relation2 !== void 0 && _allRecords$$relation2.data) {
        relatedRecords = allRecords.filter(function (rel) {
          var _rel$relationships$fo, _rel$relationships$fo2;
          return String((_rel$relationships$fo = rel.relationships[foreignReferenceName]) === null || _rel$relationships$fo === void 0 ? void 0 : (_rel$relationships$fo2 = _rel$relationships$fo.data) === null || _rel$relationships$fo2 === void 0 ? void 0 : _rel$relationships$fo2.id) === String(record.id);
        });
      } else if (allRecords !== null && allRecords !== void 0 && (_allRecords$2 = allRecords[0]) !== null && _allRecords$2 !== void 0 && _allRecords$2[foreignId]) {
        console.warn("Support for including non-canonical jsonapi references will be removed in future versions. Record type: ".concat(record.type, ". Relation: ").concat(relationType, ". Reference: ").concat(foreignId, "."));
        relatedRecords = allRecords.filter(function (rel) {
          return String(rel[foreignId]) === String(record.id);
        });
      }
    }
    record.cachedRelationships = _objectSpread(_objectSpread({}, cachedRelationships), {}, _defineProperty$1({}, relationType, {
      data: relatedRecords.map(function (r) {
        return {
          type: r.type,
          id: r.id
        };
      })
    }));
  }
  return new RelatedRecordsArray(relatedRecords, record, relationType);
}

/**
 * Handles getting polymorphic has_one/belong_to.
 *

 */
function getRelatedRecord(record, property) {
  // Get relationships
  var relationships = record.relationships;

  // Short circuit if no relationships are present
  if (!relationships) return;

  // Use property name unless model type is provided
  var reference = relationships[property];

  // Short circuit if matching reference is not found
  if (!reference || !reference.data) return;
  var _reference$data = reference.data,
    id = _reference$data.id,
    type = _reference$data.type;
  var recordType = type;
  return record.store.getRecord(recordType, id);
}

/**
 * Handles setting polymorphic has_one/belong_to.
 * - Validates the related record to make sure it inherits from `Model` class
 * - Sets the relationship
 * - Attempts to find an inverse relationship, and if successful adds it as well
 *

 * @param {object} record the record with the relationship
 * @param {object} relatedRecord the record that will be related
 * @param {string} property the related property to set
 * @param {string} modelType an override of the modelType
 */
function setRelatedRecord(record, relatedRecord, property) {
  var modelType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  if (relatedRecord && !(relatedRecord instanceof Model)) {
    throw new Error('Related record must be a valid Model object');
  }
  var relationships = record.relationships;
  var relationType = modelType || property;
  var referenceRecord = relatedRecord || getRelatedRecord(record, relationType);
  if (!referenceRecord) {
    return;
  }
  var id = referenceRecord.id;
  var type = referenceRecord.constructor.type;
  var data = relationships[relationType] && relationships[relationType].data;
  if (!relatedRecord) {
    delete relationships[relationType];
  } else if (!data || !(data.type === type && data.id === id)) {
    relationships[relationType] = {
      data: {
        id: id,
        type: type
      }
    };
  } else {
    return relatedRecord;
  }

  // hack we don't have a reference to the inverse name so we just use the record type.
  // this may cause problems with polymorphic relationships
  var inverseRelatedToMany = getRelatedRecords(referenceRecord, null, record.constructor.type);
  if (inverseRelatedToMany) {
    var inverseMethod = relatedRecord ? 'add' : 'remove';
    inverseRelatedToMany[inverseMethod](record);
  }
  return relatedRecord;
}

/**
 * An array that allows for updating store references and relationships
 * @class RelatedRecordsArray
 * @constructor
 * @param {Array} array the array to extend
 * @param {object} record the record with the referenced array
 * @param {string} property the property on the record that references the array
 */
_Symbol$species = Symbol.species;
var RelatedRecordsArray = /*#__PURE__*/function (_Array) {
  _inherits(RelatedRecordsArray, _Array);
  var _super = _createSuper(RelatedRecordsArray);
  function RelatedRecordsArray(_array, _record, _property) {
    var _this;
    _classCallCheck(this, RelatedRecordsArray);
    _this = _super.call.apply(_super, [this].concat(_toConsumableArray(_array)));
    _defineProperty$1(_assertThisInitialized(_this), "add", function (relatedRecord) {
      var _assertThisInitialize = _assertThisInitialized(_this),
        record = _assertThisInitialize.record,
        property = _assertThisInitialize.property;
      var recordType = record.constructor.type;
      var id = relatedRecord.id,
        type = relatedRecord.constructor.type;
      if (!relatedRecord || !(relatedRecord instanceof Model)) {
        throw new Error('Related record must be a valid Model object');
      }
      if (!record.relationships) {
        record.relationships = {};
      }
      var relationships = record.relationships;
      if (!relationships[property]) {
        relationships[property] = {};
      }
      if (!relationships[property].data) {
        relationships[property].data = [];
      }
      var existingRelationships = relationships[property];
      var alreadyThere = existingRelationships && existingRelationships.data.find(function (model) {
        return model.id === id && model.type === type;
      });
      if (!alreadyThere) {
        relationships[property].data.push({
          id: id,
          type: type
        });
        _this.push(relatedRecord);
        // setting the inverse - hack this will only work with singularized relationships.
        setRelatedRecord(relatedRecord, record, recordType.slice(0, recordType.length - 1));
      }
      return relatedRecord;
    });
    _defineProperty$1(_assertThisInitialized(_this), "remove", function (relatedRecord) {
      var _assertThisInitialize2 = _assertThisInitialized(_this),
        record = _assertThisInitialize2.record,
        property = _assertThisInitialize2.property;
      var relationships = record.relationships,
        recordType = record.constructor.type;
      var id = relatedRecord.id,
        type = relatedRecord.constructor.type;
      if (relationships && relationships[property] && relatedRecord) {
        var referenceIndexToRemove = relationships[property].data.findIndex(function (model) {
          return model.id.toString() === id.toString() && model.type === type;
        });
        if (referenceIndexToRemove >= 0) {
          relationships[property].data.splice(referenceIndexToRemove, 1);
        }
        var recordIndexToRemove = _this.findIndex(function (model) {
          return (model === null || model === void 0 ? void 0 : model.id.toString()) === id.toString() && model.type === type;
        });
        if (recordIndexToRemove >= 0) _this.splice(recordIndexToRemove, 1);
        if (!relationships[property].data.length) {
          delete relationships[property];
        }

        // hack this will only work with singularized relationships.
        setRelatedRecord(relatedRecord, null, recordType.slice(0, recordType.length - 1));
      }
      return relatedRecord;
    });
    _defineProperty$1(_assertThisInitialized(_this), "replace", function (array) {
      var _assertThisInitialize3 = _assertThisInitialized(_this),
        record = _assertThisInitialize3.record,
        property = _assertThisInitialize3.property;
      var relationships = record.relationships;
      transaction(function () {
        relationships[property] = {
          data: []
        };
        array.forEach(function (object) {
          return _this.add(object);
        });
      });
    });
    _this.property = _property;
    _this.record = _record;
    return _this;
  }

  /*
   * This method is used by Array internals to decide
   * which class to use for resulting derived objects from array manipulation methods
   * such as `map` or `filter`
   *
   * Without this, `RelatedRecordsArray.map` would return a `RelatedRecordsArray` instance
   * but such derived arrays should not maintain the behavior of the source `RelatedRecordsArray`
   *
   * For more details, see:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species
   */
  _createClass(RelatedRecordsArray, null, [{
    key: _Symbol$species,
    get: function get() {
      return Array;
    }

    /**
     * Adds a record to the array, and updates references in the store, as well as inverse references
      * @param {object} relatedRecord the record to add to the array
     * @returns {object} the original relatedRecord
     */
  }]);
  return RelatedRecordsArray;
}( /*#__PURE__*/_wrapNativeSuper(Array));

export { FactoryFarm, MockServer, Model, QueryString, Store, arrayType, attribute, dateType, numberType, objectType, relatedToMany, relatedToOne, serverResponse, stringType, validates };
//# sourceMappingURL=mobx-async-store.esm.js.map
