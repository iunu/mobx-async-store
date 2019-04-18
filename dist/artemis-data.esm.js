import _initializerDefineProperty from '@babel/runtime/helpers/esm/initializerDefineProperty';
import _classCallCheck from '@babel/runtime/helpers/esm/classCallCheck';
import _createClass from '@babel/runtime/helpers/esm/createClass';
import _applyDecoratedDescriptor from '@babel/runtime/helpers/esm/applyDecoratedDescriptor';
import '@babel/runtime/helpers/esm/initializerWarningHelper';
import { observable } from 'mobx';

var _class, _descriptor, _temp;
/**
 * Defines the Artemis Data Store class.
 *
 * @class Store
 * @constructor
 */

var Store = (_class = (_temp =
/*#__PURE__*/
function () {
  function Store() {
    _classCallCheck(this, Store);

    _initializerDefineProperty(this, "data", _descriptor, this);
  }

  _createClass(Store, [{
    key: "ping",

    /**
     * Method for smoke test
     *
     * @method ping
     * @return {String} 'pong'
     */
    value: function ping() {
      return 'pong';
    }
  }]);

  return Store;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "data", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
})), _class);

export { Store };
