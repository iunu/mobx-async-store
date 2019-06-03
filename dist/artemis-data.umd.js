(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('crypto')) :
  typeof define === 'function' && define.amd ? define(['exports', 'crypto'], factory) :
  (global = global || self, factory(global.artemisData = {}, global.crypto));
}(this, function (exports, crypto) { 'use strict';

  crypto = crypto && crypto.hasOwnProperty('default') ? crypto['default'] : crypto;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _initializerDefineProperty(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object.keys(descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object.defineProperty(target, property, desc);
      desc = null;
    }

    return desc;
  }

  /** MobX - (c) Michel Weststrate 2015 - 2018 - MIT Licensed */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };















  function __values(o) {
      var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
      if (m) return m.call(o);
      return {
          next: function () {
              if (o && i >= o.length) o = void 0;
              return { value: o && o[i++], done: !o };
          }
      };
  }

  function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      }
      catch (error) { e = { error: error }; }
      finally {
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          }
          finally { if (e) throw e.error; }
      }
      return ar;
  }

  function __spread() {
      for (var ar = [], i = 0; i < arguments.length; i++)
          ar = ar.concat(__read(arguments[i]));
      return ar;
  }

  var OBFUSCATED_ERROR$$1 = "An invariant failed, however the error is obfuscated because this is an production build.";
  var EMPTY_ARRAY$$1 = [];
  Object.freeze(EMPTY_ARRAY$$1);
  var EMPTY_OBJECT$$1 = {};
  Object.freeze(EMPTY_OBJECT$$1);
  function getNextId$$1() {
      return ++globalState$$1.mobxGuid;
  }
  function fail$$1(message) {
      invariant$$1(false, message);
      throw "X"; // unreachable
  }
  function invariant$$1(check, message) {
      if (!check)
          throw new Error("[mobx] " + (message || OBFUSCATED_ERROR$$1));
  }
  /**
   * Makes sure that the provided function is invoked at most once.
   */
  function once$$1(func) {
      var invoked = false;
      return function () {
          if (invoked)
              return;
          invoked = true;
          return func.apply(this, arguments);
      };
  }
  var noop$$1 = function () { };
  function unique$$1(list) {
      var res = [];
      list.forEach(function (item) {
          if (res.indexOf(item) === -1)
              res.push(item);
      });
      return res;
  }
  function isObject$$1(value) {
      return value !== null && typeof value === "object";
  }
  function isPlainObject$$1(value) {
      if (value === null || typeof value !== "object")
          return false;
      var proto = Object.getPrototypeOf(value);
      return proto === Object.prototype || proto === null;
  }

  function addHiddenProp$$1(object, propName, value) {
      Object.defineProperty(object, propName, {
          enumerable: false,
          writable: true,
          configurable: true,
          value: value
      });
  }
  function addHiddenFinalProp$$1(object, propName, value) {
      Object.defineProperty(object, propName, {
          enumerable: false,
          writable: false,
          configurable: true,
          value: value
      });
  }
  function isPropertyConfigurable$$1(object, prop) {
      var descriptor = Object.getOwnPropertyDescriptor(object, prop);
      return !descriptor || (descriptor.configurable !== false && descriptor.writable !== false);
  }
  function assertPropertyConfigurable$$1(object, prop) {
      if (process.env.NODE_ENV !== "production" && !isPropertyConfigurable$$1(object, prop))
          fail$$1("Cannot make property '" + prop.toString() + "' observable, it is not configurable and writable in the target object");
  }
  function createInstanceofPredicate$$1(name, clazz) {
      var propName = "isMobX" + name;
      clazz.prototype[propName] = true;
      return function (x) {
          return isObject$$1(x) && x[propName] === true;
      };
  }
  function isES6Map$$1(thing) {
      return thing instanceof Map;
  }
  function isES6Set$$1(thing) {
      return thing instanceof Set;
  }
  function getMapLikeKeys$$1(map) {
      if (isPlainObject$$1(map))
          return Object.keys(map);
      if (Array.isArray(map))
          return map.map(function (_a) {
              var _b = __read(_a, 1), key = _b[0];
              return key;
          });
      if (isES6Map$$1(map) || isObservableMap$$1(map))
          return Array.from(map.keys());
      return fail$$1("Cannot get keys from '" + map + "'");
  }
  function toPrimitive$$1(value) {
      return value === null ? null : typeof value === "object" ? "" + value : value;
  }

  var $mobx$$1 = Symbol("mobx administration");
  var Atom$$1 = /** @class */ (function () {
      /**
       * Create a new atom. For debugging purposes it is recommended to give it a name.
       * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
       */
      function Atom$$1(name) {
          if (name === void 0) { name = "Atom@" + getNextId$$1(); }
          this.name = name;
          this.isPendingUnobservation = false; // for effective unobserving. BaseAtom has true, for extra optimization, so its onBecomeUnobserved never gets called, because it's not needed
          this.isBeingObserved = false;
          this.observers = new Set();
          this.diffValue = 0;
          this.lastAccessedBy = 0;
          this.lowestObserverState = IDerivationState.NOT_TRACKING;
      }
      Atom$$1.prototype.onBecomeObserved = function () {
          if (this.onBecomeObservedListeners) {
              this.onBecomeObservedListeners.forEach(function (listener) { return listener(); });
          }
      };
      Atom$$1.prototype.onBecomeUnobserved = function () {
          if (this.onBecomeUnobservedListeners) {
              this.onBecomeUnobservedListeners.forEach(function (listener) { return listener(); });
          }
      };
      /**
       * Invoke this method to notify mobx that your atom has been used somehow.
       * Returns true if there is currently a reactive context.
       */
      Atom$$1.prototype.reportObserved = function () {
          return reportObserved$$1(this);
      };
      /**
       * Invoke this method _after_ this method has changed to signal mobx that all its observers should invalidate.
       */
      Atom$$1.prototype.reportChanged = function () {
          startBatch$$1();
          propagateChanged$$1(this);
          endBatch$$1();
      };
      Atom$$1.prototype.toString = function () {
          return this.name;
      };
      return Atom$$1;
  }());
  var isAtom$$1 = createInstanceofPredicate$$1("Atom", Atom$$1);
  function createAtom$$1(name, onBecomeObservedHandler, onBecomeUnobservedHandler) {
      if (onBecomeObservedHandler === void 0) { onBecomeObservedHandler = noop$$1; }
      if (onBecomeUnobservedHandler === void 0) { onBecomeUnobservedHandler = noop$$1; }
      var atom = new Atom$$1(name);
      // default `noop` listener will not initialize the hook Set
      if (onBecomeObservedHandler !== noop$$1) {
          onBecomeObserved$$1(atom, onBecomeObservedHandler);
      }
      if (onBecomeUnobservedHandler !== noop$$1) {
          onBecomeUnobserved$$1(atom, onBecomeUnobservedHandler);
      }
      return atom;
  }

  function identityComparer(a, b) {
      return a === b;
  }
  function structuralComparer(a, b) {
      return deepEqual$$1(a, b);
  }
  function defaultComparer(a, b) {
      return Object.is(a, b);
  }
  var comparer$$1 = {
      identity: identityComparer,
      structural: structuralComparer,
      default: defaultComparer
  };

  var mobxDidRunLazyInitializersSymbol$$1 = Symbol("mobx did run lazy initializers");
  var mobxPendingDecorators$$1 = Symbol("mobx pending decorators");
  var enumerableDescriptorCache = {};
  var nonEnumerableDescriptorCache = {};
  function createPropertyInitializerDescriptor(prop, enumerable) {
      var cache = enumerable ? enumerableDescriptorCache : nonEnumerableDescriptorCache;
      return (cache[prop] ||
          (cache[prop] = {
              configurable: true,
              enumerable: enumerable,
              get: function () {
                  initializeInstance$$1(this);
                  return this[prop];
              },
              set: function (value) {
                  initializeInstance$$1(this);
                  this[prop] = value;
              }
          }));
  }
  function initializeInstance$$1(target) {
      if (target[mobxDidRunLazyInitializersSymbol$$1] === true)
          return;
      var decorators = target[mobxPendingDecorators$$1];
      if (decorators) {
          addHiddenProp$$1(target, mobxDidRunLazyInitializersSymbol$$1, true);
          for (var key in decorators) {
              var d = decorators[key];
              d.propertyCreator(target, d.prop, d.descriptor, d.decoratorTarget, d.decoratorArguments);
          }
      }
  }
  function createPropDecorator$$1(propertyInitiallyEnumerable, propertyCreator) {
      return function decoratorFactory() {
          var decoratorArguments;
          var decorator = function decorate$$1(target, prop, descriptor, applyImmediately
          // This is a special parameter to signal the direct application of a decorator, allow extendObservable to skip the entire type decoration part,
          // as the instance to apply the decorator to equals the target
          ) {
              if (applyImmediately === true) {
                  propertyCreator(target, prop, descriptor, target, decoratorArguments);
                  return null;
              }
              if (process.env.NODE_ENV !== "production" && !quacksLikeADecorator$$1(arguments))
                  fail$$1("This function is a decorator, but it wasn't invoked like a decorator");
              if (!Object.prototype.hasOwnProperty.call(target, mobxPendingDecorators$$1)) {
                  var inheritedDecorators = target[mobxPendingDecorators$$1];
                  addHiddenProp$$1(target, mobxPendingDecorators$$1, __assign({}, inheritedDecorators));
              }
              target[mobxPendingDecorators$$1][prop] = {
                  prop: prop,
                  propertyCreator: propertyCreator,
                  descriptor: descriptor,
                  decoratorTarget: target,
                  decoratorArguments: decoratorArguments
              };
              return createPropertyInitializerDescriptor(prop, propertyInitiallyEnumerable);
          };
          if (quacksLikeADecorator$$1(arguments)) {
              // @decorator
              decoratorArguments = EMPTY_ARRAY$$1;
              return decorator.apply(null, arguments);
          }
          else {
              // @decorator(args)
              decoratorArguments = Array.prototype.slice.call(arguments);
              return decorator;
          }
      };
  }
  function quacksLikeADecorator$$1(args) {
      return (((args.length === 2 || args.length === 3) && typeof args[1] === "string") ||
          (args.length === 4 && args[3] === true));
  }

  function deepEnhancer$$1(v, _, name) {
      // it is an observable already, done
      if (isObservable$$1(v))
          return v;
      // something that can be converted and mutated?
      if (Array.isArray(v))
          return observable$$1.array(v, { name: name });
      if (isPlainObject$$1(v))
          return observable$$1.object(v, undefined, { name: name });
      if (isES6Map$$1(v))
          return observable$$1.map(v, { name: name });
      if (isES6Set$$1(v))
          return observable$$1.set(v, { name: name });
      return v;
  }
  function shallowEnhancer$$1(v, _, name) {
      if (v === undefined || v === null)
          return v;
      if (isObservableObject$$1(v) || isObservableArray$$1(v) || isObservableMap$$1(v) || isObservableSet$$1(v))
          return v;
      if (Array.isArray(v))
          return observable$$1.array(v, { name: name, deep: false });
      if (isPlainObject$$1(v))
          return observable$$1.object(v, undefined, { name: name, deep: false });
      if (isES6Map$$1(v))
          return observable$$1.map(v, { name: name, deep: false });
      if (isES6Set$$1(v))
          return observable$$1.set(v, { name: name, deep: false });
      return fail$$1(process.env.NODE_ENV !== "production" &&
          "The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
  }
  function referenceEnhancer$$1(newValue) {
      // never turn into an observable
      return newValue;
  }
  function refStructEnhancer$$1(v, oldValue, name) {
      if (process.env.NODE_ENV !== "production" && isObservable$$1(v))
          throw "observable.struct should not be used with observable values";
      if (deepEqual$$1(v, oldValue))
          return oldValue;
      return v;
  }

  function createDecoratorForEnhancer$$1(enhancer) {
      invariant$$1(enhancer);
      var decorator = createPropDecorator$$1(true, function (target, propertyName, descriptor, _decoratorTarget, decoratorArgs) {
          if (process.env.NODE_ENV !== "production") {
              invariant$$1(!descriptor || !descriptor.get, "@observable cannot be used on getter (property \"" + propertyName + "\"), use @computed instead.");
          }
          var initialValue = descriptor
              ? descriptor.initializer
                  ? descriptor.initializer.call(target)
                  : descriptor.value
              : undefined;
          asObservableObject$$1(target).addObservableProp(propertyName, initialValue, enhancer);
      });
      var res = 
      // Extra process checks, as this happens during module initialization
      typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production"
          ? function observableDecorator() {
              // This wrapper function is just to detect illegal decorator invocations, deprecate in a next version
              // and simply return the created prop decorator
              if (arguments.length < 2)
                  return fail$$1("Incorrect decorator invocation. @observable decorator doesn't expect any arguments");
              return decorator.apply(null, arguments);
          }
          : decorator;
      res.enhancer = enhancer;
      return res;
  }

  // Predefined bags of create observable options, to avoid allocating temporarily option objects
  // in the majority of cases
  var defaultCreateObservableOptions$$1 = {
      deep: true,
      name: undefined,
      defaultDecorator: undefined,
      proxy: true
  };
  Object.freeze(defaultCreateObservableOptions$$1);
  function assertValidOption(key) {
      if (!/^(deep|name|equals|defaultDecorator|proxy)$/.test(key))
          fail$$1("invalid option for (extend)observable: " + key);
  }
  function asCreateObservableOptions$$1(thing) {
      if (thing === null || thing === undefined)
          return defaultCreateObservableOptions$$1;
      if (typeof thing === "string")
          return { name: thing, deep: true, proxy: true };
      if (process.env.NODE_ENV !== "production") {
          if (typeof thing !== "object")
              return fail$$1("expected options object");
          Object.keys(thing).forEach(assertValidOption);
      }
      return thing;
  }
  var deepDecorator$$1 = createDecoratorForEnhancer$$1(deepEnhancer$$1);
  var shallowDecorator = createDecoratorForEnhancer$$1(shallowEnhancer$$1);
  var refDecorator$$1 = createDecoratorForEnhancer$$1(referenceEnhancer$$1);
  var refStructDecorator = createDecoratorForEnhancer$$1(refStructEnhancer$$1);
  function getEnhancerFromOptions(options) {
      return options.defaultDecorator
          ? options.defaultDecorator.enhancer
          : options.deep === false
              ? referenceEnhancer$$1
              : deepEnhancer$$1;
  }
  /**
   * Turns an object, array or function into a reactive structure.
   * @param v the value which should become observable.
   */
  function createObservable(v, arg2, arg3) {
      // @observable someProp;
      if (typeof arguments[1] === "string") {
          return deepDecorator$$1.apply(null, arguments);
      }
      // it is an observable already, done
      if (isObservable$$1(v))
          return v;
      // something that can be converted and mutated?
      var res = isPlainObject$$1(v)
          ? observable$$1.object(v, arg2, arg3)
          : Array.isArray(v)
              ? observable$$1.array(v, arg2)
              : isES6Map$$1(v)
                  ? observable$$1.map(v, arg2)
                  : isES6Set$$1(v)
                      ? observable$$1.set(v, arg2)
                      : v;
      // this value could be converted to a new observable data structure, return it
      if (res !== v)
          return res;
      // otherwise, just box it
      fail$$1(process.env.NODE_ENV !== "production" &&
          "The provided value could not be converted into an observable. If you want just create an observable reference to the object use 'observable.box(value)'");
  }
  var observableFactories = {
      box: function (value, options) {
          if (arguments.length > 2)
              incorrectlyUsedAsDecorator("box");
          var o = asCreateObservableOptions$$1(options);
          return new ObservableValue$$1(value, getEnhancerFromOptions(o), o.name, true, o.equals);
      },
      array: function (initialValues, options) {
          if (arguments.length > 2)
              incorrectlyUsedAsDecorator("array");
          var o = asCreateObservableOptions$$1(options);
          return createObservableArray$$1(initialValues, getEnhancerFromOptions(o), o.name);
      },
      map: function (initialValues, options) {
          if (arguments.length > 2)
              incorrectlyUsedAsDecorator("map");
          var o = asCreateObservableOptions$$1(options);
          return new ObservableMap$$1(initialValues, getEnhancerFromOptions(o), o.name);
      },
      set: function (initialValues, options) {
          if (arguments.length > 2)
              incorrectlyUsedAsDecorator("set");
          var o = asCreateObservableOptions$$1(options);
          return new ObservableSet$$1(initialValues, getEnhancerFromOptions(o), o.name);
      },
      object: function (props, decorators, options) {
          if (typeof arguments[1] === "string")
              incorrectlyUsedAsDecorator("object");
          var o = asCreateObservableOptions$$1(options);
          if (o.proxy === false) {
              return extendObservable$$1({}, props, decorators, o);
          }
          else {
              var defaultDecorator = getDefaultDecoratorFromObjectOptions$$1(o);
              var base = extendObservable$$1({}, undefined, undefined, o);
              var proxy = createDynamicObservableObject$$1(base);
              extendObservableObjectWithProperties$$1(proxy, props, decorators, defaultDecorator);
              return proxy;
          }
      },
      ref: refDecorator$$1,
      shallow: shallowDecorator,
      deep: deepDecorator$$1,
      struct: refStructDecorator
  };
  var observable$$1 = createObservable;
  // weird trick to keep our typings nicely with our funcs, and still extend the observable function
  Object.keys(observableFactories).forEach(function (name) { return (observable$$1[name] = observableFactories[name]); });
  function incorrectlyUsedAsDecorator(methodName) {
      fail$$1(
      // process.env.NODE_ENV !== "production" &&
      "Expected one or two arguments to observable." + methodName + ". Did you accidentally try to use observable." + methodName + " as decorator?");
  }

  var computedDecorator$$1 = createPropDecorator$$1(false, function (instance, propertyName, descriptor, decoratorTarget, decoratorArgs) {
      var get$$1 = descriptor.get, set$$1 = descriptor.set; // initialValue is the descriptor for get / set props
      // Optimization: faster on decorator target or instance? Assuming target
      // Optimization: find out if declaring on instance isn't just faster. (also makes the property descriptor simpler). But, more memory usage..
      // Forcing instance now, fixes hot reloadig issues on React Native:
      var options = decoratorArgs[0] || {};
      asObservableObject$$1(instance).addComputedProp(instance, propertyName, __assign({ get: get$$1,
          set: set$$1, context: instance }, options));
  });
  var computedStructDecorator = computedDecorator$$1({ equals: comparer$$1.structural });

  function createAction$$1(actionName, fn, ref) {
      if (process.env.NODE_ENV !== "production") {
          invariant$$1(typeof fn === "function", "`action` can only be invoked on functions");
          if (typeof actionName !== "string" || !actionName)
              fail$$1("actions should have valid names, got: '" + actionName + "'");
      }
      var res = function () {
          return executeAction$$1(actionName, fn, ref || this, arguments);
      };
      res.isMobxAction = true;
      return res;
  }
  function executeAction$$1(actionName, fn, scope, args) {
      var runInfo = startAction(actionName, fn, scope, args);
      var shouldSupressReactionError = true;
      try {
          var res = fn.apply(scope, args);
          shouldSupressReactionError = false;
          return res;
      }
      finally {
          if (shouldSupressReactionError) {
              globalState$$1.suppressReactionErrors = shouldSupressReactionError;
              endAction(runInfo);
              globalState$$1.suppressReactionErrors = false;
          }
          else {
              endAction(runInfo);
          }
      }
  }
  function startAction(actionName, fn, scope, args) {
      var notifySpy = isSpyEnabled$$1() && !!actionName;
      var startTime = 0;
      if (notifySpy && process.env.NODE_ENV !== "production") {
          startTime = Date.now();
          var l = (args && args.length) || 0;
          var flattendArgs = new Array(l);
          if (l > 0)
              for (var i = 0; i < l; i++)
                  flattendArgs[i] = args[i];
          spyReportStart$$1({
              type: "action",
              name: actionName,
              object: scope,
              arguments: flattendArgs
          });
      }
      var prevDerivation = untrackedStart$$1();
      startBatch$$1();
      var prevAllowStateChanges = allowStateChangesStart$$1(true);
      return {
          prevDerivation: prevDerivation,
          prevAllowStateChanges: prevAllowStateChanges,
          notifySpy: notifySpy,
          startTime: startTime
      };
  }
  function endAction(runInfo) {
      allowStateChangesEnd$$1(runInfo.prevAllowStateChanges);
      endBatch$$1();
      untrackedEnd$$1(runInfo.prevDerivation);
      if (runInfo.notifySpy && process.env.NODE_ENV !== "production")
          spyReportEnd$$1({ time: Date.now() - runInfo.startTime });
  }
  function allowStateChangesStart$$1(allowStateChanges$$1) {
      var prev = globalState$$1.allowStateChanges;
      globalState$$1.allowStateChanges = allowStateChanges$$1;
      return prev;
  }
  function allowStateChangesEnd$$1(prev) {
      globalState$$1.allowStateChanges = prev;
  }

  var ObservableValue$$1 = /** @class */ (function (_super) {
      __extends(ObservableValue$$1, _super);
      function ObservableValue$$1(value, enhancer, name, notifySpy, equals) {
          if (name === void 0) { name = "ObservableValue@" + getNextId$$1(); }
          if (notifySpy === void 0) { notifySpy = true; }
          if (equals === void 0) { equals = comparer$$1.default; }
          var _this = _super.call(this, name) || this;
          _this.enhancer = enhancer;
          _this.name = name;
          _this.equals = equals;
          _this.hasUnreportedChange = false;
          _this.value = enhancer(value, undefined, name);
          if (notifySpy && isSpyEnabled$$1() && process.env.NODE_ENV !== "production") {
              // only notify spy if this is a stand-alone observable
              spyReport$$1({ type: "create", name: _this.name, newValue: "" + _this.value });
          }
          return _this;
      }
      ObservableValue$$1.prototype.dehanceValue = function (value) {
          if (this.dehancer !== undefined)
              return this.dehancer(value);
          return value;
      };
      ObservableValue$$1.prototype.set = function (newValue) {
          var oldValue = this.value;
          newValue = this.prepareNewValue(newValue);
          if (newValue !== globalState$$1.UNCHANGED) {
              var notifySpy = isSpyEnabled$$1();
              if (notifySpy && process.env.NODE_ENV !== "production") {
                  spyReportStart$$1({
                      type: "update",
                      name: this.name,
                      newValue: newValue,
                      oldValue: oldValue
                  });
              }
              this.setNewValue(newValue);
              if (notifySpy && process.env.NODE_ENV !== "production")
                  spyReportEnd$$1();
          }
      };
      ObservableValue$$1.prototype.prepareNewValue = function (newValue) {
          checkIfStateModificationsAreAllowed$$1(this);
          if (hasInterceptors$$1(this)) {
              var change = interceptChange$$1(this, {
                  object: this,
                  type: "update",
                  newValue: newValue
              });
              if (!change)
                  return globalState$$1.UNCHANGED;
              newValue = change.newValue;
          }
          // apply modifier
          newValue = this.enhancer(newValue, this.value, this.name);
          return this.equals(this.value, newValue) ? globalState$$1.UNCHANGED : newValue;
      };
      ObservableValue$$1.prototype.setNewValue = function (newValue) {
          var oldValue = this.value;
          this.value = newValue;
          this.reportChanged();
          if (hasListeners$$1(this)) {
              notifyListeners$$1(this, {
                  type: "update",
                  object: this,
                  newValue: newValue,
                  oldValue: oldValue
              });
          }
      };
      ObservableValue$$1.prototype.get = function () {
          this.reportObserved();
          return this.dehanceValue(this.value);
      };
      ObservableValue$$1.prototype.intercept = function (handler) {
          return registerInterceptor$$1(this, handler);
      };
      ObservableValue$$1.prototype.observe = function (listener, fireImmediately) {
          if (fireImmediately)
              listener({
                  object: this,
                  type: "update",
                  newValue: this.value,
                  oldValue: undefined
              });
          return registerListener$$1(this, listener);
      };
      ObservableValue$$1.prototype.toJSON = function () {
          return this.get();
      };
      ObservableValue$$1.prototype.toString = function () {
          return this.name + "[" + this.value + "]";
      };
      ObservableValue$$1.prototype.valueOf = function () {
          return toPrimitive$$1(this.get());
      };
      ObservableValue$$1.prototype[Symbol.toPrimitive] = function () {
          return this.valueOf();
      };
      return ObservableValue$$1;
  }(Atom$$1));
  var isObservableValue$$1 = createInstanceofPredicate$$1("ObservableValue", ObservableValue$$1);

  /**
   * A node in the state dependency root that observes other nodes, and can be observed itself.
   *
   * ComputedValue will remember the result of the computation for the duration of the batch, or
   * while being observed.
   *
   * During this time it will recompute only when one of its direct dependencies changed,
   * but only when it is being accessed with `ComputedValue.get()`.
   *
   * Implementation description:
   * 1. First time it's being accessed it will compute and remember result
   *    give back remembered result until 2. happens
   * 2. First time any deep dependency change, propagate POSSIBLY_STALE to all observers, wait for 3.
   * 3. When it's being accessed, recompute if any shallow dependency changed.
   *    if result changed: propagate STALE to all observers, that were POSSIBLY_STALE from the last step.
   *    go to step 2. either way
   *
   * If at any point it's outside batch and it isn't observed: reset everything and go to 1.
   */
  var ComputedValue$$1 = /** @class */ (function () {
      /**
       * Create a new computed value based on a function expression.
       *
       * The `name` property is for debug purposes only.
       *
       * The `equals` property specifies the comparer function to use to determine if a newly produced
       * value differs from the previous value. Two comparers are provided in the library; `defaultComparer`
       * compares based on identity comparison (===), and `structualComparer` deeply compares the structure.
       * Structural comparison can be convenient if you always produce a new aggregated object and
       * don't want to notify observers if it is structurally the same.
       * This is useful for working with vectors, mouse coordinates etc.
       */
      function ComputedValue$$1(options) {
          this.dependenciesState = IDerivationState.NOT_TRACKING;
          this.observing = []; // nodes we are looking at. Our value depends on these nodes
          this.newObserving = null; // during tracking it's an array with new observed observers
          this.isBeingObserved = false;
          this.isPendingUnobservation = false;
          this.observers = new Set();
          this.diffValue = 0;
          this.runId = 0;
          this.lastAccessedBy = 0;
          this.lowestObserverState = IDerivationState.UP_TO_DATE;
          this.unboundDepsCount = 0;
          this.__mapid = "#" + getNextId$$1();
          this.value = new CaughtException$$1(null);
          this.isComputing = false; // to check for cycles
          this.isRunningSetter = false;
          this.isTracing = TraceMode$$1.NONE;
          if (process.env.NODE_ENV !== "production" && !options.get)
              throw "[mobx] missing option for computed: get";
          this.derivation = options.get;
          this.name = options.name || "ComputedValue@" + getNextId$$1();
          if (options.set)
              this.setter = createAction$$1(this.name + "-setter", options.set);
          this.equals =
              options.equals ||
                  (options.compareStructural || options.struct
                      ? comparer$$1.structural
                      : comparer$$1.default);
          this.scope = options.context;
          this.requiresReaction = !!options.requiresReaction;
          this.keepAlive = !!options.keepAlive;
      }
      ComputedValue$$1.prototype.onBecomeStale = function () {
          propagateMaybeChanged$$1(this);
      };
      ComputedValue$$1.prototype.onBecomeObserved = function () {
          if (this.onBecomeObservedListeners) {
              this.onBecomeObservedListeners.forEach(function (listener) { return listener(); });
          }
      };
      ComputedValue$$1.prototype.onBecomeUnobserved = function () {
          if (this.onBecomeUnobservedListeners) {
              this.onBecomeUnobservedListeners.forEach(function (listener) { return listener(); });
          }
      };
      /**
       * Returns the current value of this computed value.
       * Will evaluate its computation first if needed.
       */
      ComputedValue$$1.prototype.get = function () {
          if (this.isComputing)
              fail$$1("Cycle detected in computation " + this.name + ": " + this.derivation);
          if (globalState$$1.inBatch === 0 && this.observers.size === 0 && !this.keepAlive) {
              if (shouldCompute$$1(this)) {
                  this.warnAboutUntrackedRead();
                  startBatch$$1(); // See perf test 'computed memoization'
                  this.value = this.computeValue(false);
                  endBatch$$1();
              }
          }
          else {
              reportObserved$$1(this);
              if (shouldCompute$$1(this))
                  if (this.trackAndCompute())
                      propagateChangeConfirmed$$1(this);
          }
          var result = this.value;
          if (isCaughtException$$1(result))
              throw result.cause;
          return result;
      };
      ComputedValue$$1.prototype.peek = function () {
          var res = this.computeValue(false);
          if (isCaughtException$$1(res))
              throw res.cause;
          return res;
      };
      ComputedValue$$1.prototype.set = function (value) {
          if (this.setter) {
              invariant$$1(!this.isRunningSetter, "The setter of computed value '" + this.name + "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?");
              this.isRunningSetter = true;
              try {
                  this.setter.call(this.scope, value);
              }
              finally {
                  this.isRunningSetter = false;
              }
          }
          else
              invariant$$1(false, process.env.NODE_ENV !== "production" &&
                  "[ComputedValue '" + this.name + "'] It is not possible to assign a new value to a computed value.");
      };
      ComputedValue$$1.prototype.trackAndCompute = function () {
          if (isSpyEnabled$$1() && process.env.NODE_ENV !== "production") {
              spyReport$$1({
                  object: this.scope,
                  type: "compute",
                  name: this.name
              });
          }
          var oldValue = this.value;
          var wasSuspended = 
          /* see #1208 */ this.dependenciesState === IDerivationState.NOT_TRACKING;
          var newValue = this.computeValue(true);
          var changed = wasSuspended ||
              isCaughtException$$1(oldValue) ||
              isCaughtException$$1(newValue) ||
              !this.equals(oldValue, newValue);
          if (changed) {
              this.value = newValue;
          }
          return changed;
      };
      ComputedValue$$1.prototype.computeValue = function (track) {
          this.isComputing = true;
          globalState$$1.computationDepth++;
          var res;
          if (track) {
              res = trackDerivedFunction$$1(this, this.derivation, this.scope);
          }
          else {
              if (globalState$$1.disableErrorBoundaries === true) {
                  res = this.derivation.call(this.scope);
              }
              else {
                  try {
                      res = this.derivation.call(this.scope);
                  }
                  catch (e) {
                      res = new CaughtException$$1(e);
                  }
              }
          }
          globalState$$1.computationDepth--;
          this.isComputing = false;
          return res;
      };
      ComputedValue$$1.prototype.suspend = function () {
          if (!this.keepAlive) {
              clearObserving$$1(this);
              this.value = undefined; // don't hold on to computed value!
          }
      };
      ComputedValue$$1.prototype.observe = function (listener, fireImmediately) {
          var _this = this;
          var firstTime = true;
          var prevValue = undefined;
          return autorun$$1(function () {
              var newValue = _this.get();
              if (!firstTime || fireImmediately) {
                  var prevU = untrackedStart$$1();
                  listener({
                      type: "update",
                      object: _this,
                      newValue: newValue,
                      oldValue: prevValue
                  });
                  untrackedEnd$$1(prevU);
              }
              firstTime = false;
              prevValue = newValue;
          });
      };
      ComputedValue$$1.prototype.warnAboutUntrackedRead = function () {
          if (process.env.NODE_ENV === "production")
              return;
          if (this.requiresReaction === true) {
              fail$$1("[mobx] Computed value " + this.name + " is read outside a reactive context");
          }
          if (this.isTracing !== TraceMode$$1.NONE) {
              console.log("[mobx.trace] '" + this.name + "' is being read outside a reactive context. Doing a full recompute");
          }
          if (globalState$$1.computedRequiresReaction) {
              console.warn("[mobx] Computed value " + this.name + " is being read outside a reactive context. Doing a full recompute");
          }
      };
      ComputedValue$$1.prototype.toJSON = function () {
          return this.get();
      };
      ComputedValue$$1.prototype.toString = function () {
          return this.name + "[" + this.derivation.toString() + "]";
      };
      ComputedValue$$1.prototype.valueOf = function () {
          return toPrimitive$$1(this.get());
      };
      ComputedValue$$1.prototype[Symbol.toPrimitive] = function () {
          return this.valueOf();
      };
      return ComputedValue$$1;
  }());
  var isComputedValue$$1 = createInstanceofPredicate$$1("ComputedValue", ComputedValue$$1);

  var IDerivationState;
  (function (IDerivationState$$1) {
      // before being run or (outside batch and not being observed)
      // at this point derivation is not holding any data about dependency tree
      IDerivationState$$1[IDerivationState$$1["NOT_TRACKING"] = -1] = "NOT_TRACKING";
      // no shallow dependency changed since last computation
      // won't recalculate derivation
      // this is what makes mobx fast
      IDerivationState$$1[IDerivationState$$1["UP_TO_DATE"] = 0] = "UP_TO_DATE";
      // some deep dependency changed, but don't know if shallow dependency changed
      // will require to check first if UP_TO_DATE or POSSIBLY_STALE
      // currently only ComputedValue will propagate POSSIBLY_STALE
      //
      // having this state is second big optimization:
      // don't have to recompute on every dependency change, but only when it's needed
      IDerivationState$$1[IDerivationState$$1["POSSIBLY_STALE"] = 1] = "POSSIBLY_STALE";
      // A shallow dependency has changed since last computation and the derivation
      // will need to recompute when it's needed next.
      IDerivationState$$1[IDerivationState$$1["STALE"] = 2] = "STALE";
  })(IDerivationState || (IDerivationState = {}));
  var TraceMode$$1;
  (function (TraceMode$$1) {
      TraceMode$$1[TraceMode$$1["NONE"] = 0] = "NONE";
      TraceMode$$1[TraceMode$$1["LOG"] = 1] = "LOG";
      TraceMode$$1[TraceMode$$1["BREAK"] = 2] = "BREAK";
  })(TraceMode$$1 || (TraceMode$$1 = {}));
  var CaughtException$$1 = /** @class */ (function () {
      function CaughtException$$1(cause) {
          this.cause = cause;
          // Empty
      }
      return CaughtException$$1;
  }());
  function isCaughtException$$1(e) {
      return e instanceof CaughtException$$1;
  }
  /**
   * Finds out whether any dependency of the derivation has actually changed.
   * If dependenciesState is 1 then it will recalculate dependencies,
   * if any dependency changed it will propagate it by changing dependenciesState to 2.
   *
   * By iterating over the dependencies in the same order that they were reported and
   * stopping on the first change, all the recalculations are only called for ComputedValues
   * that will be tracked by derivation. That is because we assume that if the first x
   * dependencies of the derivation doesn't change then the derivation should run the same way
   * up until accessing x-th dependency.
   */
  function shouldCompute$$1(derivation) {
      switch (derivation.dependenciesState) {
          case IDerivationState.UP_TO_DATE:
              return false;
          case IDerivationState.NOT_TRACKING:
          case IDerivationState.STALE:
              return true;
          case IDerivationState.POSSIBLY_STALE: {
              var prevUntracked = untrackedStart$$1(); // no need for those computeds to be reported, they will be picked up in trackDerivedFunction.
              var obs = derivation.observing, l = obs.length;
              for (var i = 0; i < l; i++) {
                  var obj = obs[i];
                  if (isComputedValue$$1(obj)) {
                      if (globalState$$1.disableErrorBoundaries) {
                          obj.get();
                      }
                      else {
                          try {
                              obj.get();
                          }
                          catch (e) {
                              // we are not interested in the value *or* exception at this moment, but if there is one, notify all
                              untrackedEnd$$1(prevUntracked);
                              return true;
                          }
                      }
                      // if ComputedValue `obj` actually changed it will be computed and propagated to its observers.
                      // and `derivation` is an observer of `obj`
                      // invariantShouldCompute(derivation)
                      if (derivation.dependenciesState === IDerivationState.STALE) {
                          untrackedEnd$$1(prevUntracked);
                          return true;
                      }
                  }
              }
              changeDependenciesStateTo0$$1(derivation);
              untrackedEnd$$1(prevUntracked);
              return false;
          }
      }
  }
  function checkIfStateModificationsAreAllowed$$1(atom) {
      var hasObservers$$1 = atom.observers.size > 0;
      // Should never be possible to change an observed observable from inside computed, see #798
      if (globalState$$1.computationDepth > 0 && hasObservers$$1)
          fail$$1(process.env.NODE_ENV !== "production" &&
              "Computed values are not allowed to cause side effects by changing observables that are already being observed. Tried to modify: " + atom.name);
      // Should not be possible to change observed state outside strict mode, except during initialization, see #563
      if (!globalState$$1.allowStateChanges && (hasObservers$$1 || globalState$$1.enforceActions === "strict"))
          fail$$1(process.env.NODE_ENV !== "production" &&
              (globalState$$1.enforceActions
                  ? "Since strict-mode is enabled, changing observed observable values outside actions is not allowed. Please wrap the code in an `action` if this change is intended. Tried to modify: "
                  : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, the render function of a React component? Tried to modify: ") +
                  atom.name);
  }
  /**
   * Executes the provided function `f` and tracks which observables are being accessed.
   * The tracking information is stored on the `derivation` object and the derivation is registered
   * as observer of any of the accessed observables.
   */
  function trackDerivedFunction$$1(derivation, f, context) {
      // pre allocate array allocation + room for variation in deps
      // array will be trimmed by bindDependencies
      changeDependenciesStateTo0$$1(derivation);
      derivation.newObserving = new Array(derivation.observing.length + 100);
      derivation.unboundDepsCount = 0;
      derivation.runId = ++globalState$$1.runId;
      var prevTracking = globalState$$1.trackingDerivation;
      globalState$$1.trackingDerivation = derivation;
      var result;
      if (globalState$$1.disableErrorBoundaries === true) {
          result = f.call(context);
      }
      else {
          try {
              result = f.call(context);
          }
          catch (e) {
              result = new CaughtException$$1(e);
          }
      }
      globalState$$1.trackingDerivation = prevTracking;
      bindDependencies(derivation);
      return result;
  }
  /**
   * diffs newObserving with observing.
   * update observing to be newObserving with unique observables
   * notify observers that become observed/unobserved
   */
  function bindDependencies(derivation) {
      // invariant(derivation.dependenciesState !== IDerivationState.NOT_TRACKING, "INTERNAL ERROR bindDependencies expects derivation.dependenciesState !== -1");
      var prevObserving = derivation.observing;
      var observing = (derivation.observing = derivation.newObserving);
      var lowestNewObservingDerivationState = IDerivationState.UP_TO_DATE;
      // Go through all new observables and check diffValue: (this list can contain duplicates):
      //   0: first occurrence, change to 1 and keep it
      //   1: extra occurrence, drop it
      var i0 = 0, l = derivation.unboundDepsCount;
      for (var i = 0; i < l; i++) {
          var dep = observing[i];
          if (dep.diffValue === 0) {
              dep.diffValue = 1;
              if (i0 !== i)
                  observing[i0] = dep;
              i0++;
          }
          // Upcast is 'safe' here, because if dep is IObservable, `dependenciesState` will be undefined,
          // not hitting the condition
          if (dep.dependenciesState > lowestNewObservingDerivationState) {
              lowestNewObservingDerivationState = dep.dependenciesState;
          }
      }
      observing.length = i0;
      derivation.newObserving = null; // newObserving shouldn't be needed outside tracking (statement moved down to work around FF bug, see #614)
      // Go through all old observables and check diffValue: (it is unique after last bindDependencies)
      //   0: it's not in new observables, unobserve it
      //   1: it keeps being observed, don't want to notify it. change to 0
      l = prevObserving.length;
      while (l--) {
          var dep = prevObserving[l];
          if (dep.diffValue === 0) {
              removeObserver$$1(dep, derivation);
          }
          dep.diffValue = 0;
      }
      // Go through all new observables and check diffValue: (now it should be unique)
      //   0: it was set to 0 in last loop. don't need to do anything.
      //   1: it wasn't observed, let's observe it. set back to 0
      while (i0--) {
          var dep = observing[i0];
          if (dep.diffValue === 1) {
              dep.diffValue = 0;
              addObserver$$1(dep, derivation);
          }
      }
      // Some new observed derivations may become stale during this derivation computation
      // so they have had no chance to propagate staleness (#916)
      if (lowestNewObservingDerivationState !== IDerivationState.UP_TO_DATE) {
          derivation.dependenciesState = lowestNewObservingDerivationState;
          derivation.onBecomeStale();
      }
  }
  function clearObserving$$1(derivation) {
      // invariant(globalState.inBatch > 0, "INTERNAL ERROR clearObserving should be called only inside batch");
      var obs = derivation.observing;
      derivation.observing = [];
      var i = obs.length;
      while (i--)
          removeObserver$$1(obs[i], derivation);
      derivation.dependenciesState = IDerivationState.NOT_TRACKING;
  }
  function untracked$$1(action$$1) {
      var prev = untrackedStart$$1();
      try {
          return action$$1();
      }
      finally {
          untrackedEnd$$1(prev);
      }
  }
  function untrackedStart$$1() {
      var prev = globalState$$1.trackingDerivation;
      globalState$$1.trackingDerivation = null;
      return prev;
  }
  function untrackedEnd$$1(prev) {
      globalState$$1.trackingDerivation = prev;
  }
  /**
   * needed to keep `lowestObserverState` correct. when changing from (2 or 1) to 0
   *
   */
  function changeDependenciesStateTo0$$1(derivation) {
      if (derivation.dependenciesState === IDerivationState.UP_TO_DATE)
          return;
      derivation.dependenciesState = IDerivationState.UP_TO_DATE;
      var obs = derivation.observing;
      var i = obs.length;
      while (i--)
          obs[i].lowestObserverState = IDerivationState.UP_TO_DATE;
  }
  var MobXGlobals$$1 = /** @class */ (function () {
      function MobXGlobals$$1() {
          /**
           * MobXGlobals version.
           * MobX compatiblity with other versions loaded in memory as long as this version matches.
           * It indicates that the global state still stores similar information
           *
           * N.B: this version is unrelated to the package version of MobX, and is only the version of the
           * internal state storage of MobX, and can be the same across many different package versions
           */
          this.version = 5;
          /**
           * globally unique token to signal unchanged
           */
          this.UNCHANGED = {};
          /**
           * Currently running derivation
           */
          this.trackingDerivation = null;
          /**
           * Are we running a computation currently? (not a reaction)
           */
          this.computationDepth = 0;
          /**
           * Each time a derivation is tracked, it is assigned a unique run-id
           */
          this.runId = 0;
          /**
           * 'guid' for general purpose. Will be persisted amongst resets.
           */
          this.mobxGuid = 0;
          /**
           * Are we in a batch block? (and how many of them)
           */
          this.inBatch = 0;
          /**
           * Observables that don't have observers anymore, and are about to be
           * suspended, unless somebody else accesses it in the same batch
           *
           * @type {IObservable[]}
           */
          this.pendingUnobservations = [];
          /**
           * List of scheduled, not yet executed, reactions.
           */
          this.pendingReactions = [];
          /**
           * Are we currently processing reactions?
           */
          this.isRunningReactions = false;
          /**
           * Is it allowed to change observables at this point?
           * In general, MobX doesn't allow that when running computations and React.render.
           * To ensure that those functions stay pure.
           */
          this.allowStateChanges = true;
          /**
           * If strict mode is enabled, state changes are by default not allowed
           */
          this.enforceActions = false;
          /**
           * Spy callbacks
           */
          this.spyListeners = [];
          /**
           * Globally attached error handlers that react specifically to errors in reactions
           */
          this.globalReactionErrorHandlers = [];
          /**
           * Warn if computed values are accessed outside a reactive context
           */
          this.computedRequiresReaction = false;
          /*
           * Don't catch and rethrow exceptions. This is useful for inspecting the state of
           * the stack when an exception occurs while debugging.
           */
          this.disableErrorBoundaries = false;
          /*
           * If true, we are already handling an exception in an action. Any errors in reactions should be supressed, as
           * they are not the cause, see: https://github.com/mobxjs/mobx/issues/1836
           */
          this.suppressReactionErrors = false;
      }
      return MobXGlobals$$1;
  }());
  var canMergeGlobalState = true;
  var isolateCalled = false;
  var globalState$$1 = (function () {
      var global = getGlobal$$1();
      if (global.__mobxInstanceCount > 0 && !global.__mobxGlobals)
          canMergeGlobalState = false;
      if (global.__mobxGlobals && global.__mobxGlobals.version !== new MobXGlobals$$1().version)
          canMergeGlobalState = false;
      if (!canMergeGlobalState) {
          setTimeout(function () {
              if (!isolateCalled) {
                  fail$$1("There are multiple, different versions of MobX active. Make sure MobX is loaded only once or use `configure({ isolateGlobalState: true })`");
              }
          }, 1);
          return new MobXGlobals$$1();
      }
      else if (global.__mobxGlobals) {
          global.__mobxInstanceCount += 1;
          if (!global.__mobxGlobals.UNCHANGED)
              global.__mobxGlobals.UNCHANGED = {}; // make merge backward compatible
          return global.__mobxGlobals;
      }
      else {
          global.__mobxInstanceCount = 1;
          return (global.__mobxGlobals = new MobXGlobals$$1());
      }
  })();
  function getGlobal$$1() {
      return typeof window !== "undefined" ? window : global;
  }
  // function invariantObservers(observable: IObservable) {
  //     const list = observable.observers
  //     const map = observable.observersIndexes
  //     const l = list.length
  //     for (let i = 0; i < l; i++) {
  //         const id = list[i].__mapid
  //         if (i) {
  //             invariant(map[id] === i, "INTERNAL ERROR maps derivation.__mapid to index in list") // for performance
  //         } else {
  //             invariant(!(id in map), "INTERNAL ERROR observer on index 0 shouldn't be held in map.") // for performance
  //         }
  //     }
  //     invariant(
  //         list.length === 0 || Object.keys(map).length === list.length - 1,
  //         "INTERNAL ERROR there is no junk in map"
  //     )
  // }
  function addObserver$$1(observable$$1, node) {
      // invariant(node.dependenciesState !== -1, "INTERNAL ERROR, can add only dependenciesState !== -1");
      // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR add already added node");
      // invariantObservers(observable);
      observable$$1.observers.add(node);
      if (observable$$1.lowestObserverState > node.dependenciesState)
          observable$$1.lowestObserverState = node.dependenciesState;
      // invariantObservers(observable);
      // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR didn't add node");
  }
  function removeObserver$$1(observable$$1, node) {
      // invariant(globalState.inBatch > 0, "INTERNAL ERROR, remove should be called only inside batch");
      // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR remove already removed node");
      // invariantObservers(observable);
      observable$$1.observers.delete(node);
      if (observable$$1.observers.size === 0) {
          // deleting last observer
          queueForUnobservation$$1(observable$$1);
      }
      // invariantObservers(observable);
      // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR remove already removed node2");
  }
  function queueForUnobservation$$1(observable$$1) {
      if (observable$$1.isPendingUnobservation === false) {
          // invariant(observable._observers.length === 0, "INTERNAL ERROR, should only queue for unobservation unobserved observables");
          observable$$1.isPendingUnobservation = true;
          globalState$$1.pendingUnobservations.push(observable$$1);
      }
  }
  /**
   * Batch starts a transaction, at least for purposes of memoizing ComputedValues when nothing else does.
   * During a batch `onBecomeUnobserved` will be called at most once per observable.
   * Avoids unnecessary recalculations.
   */
  function startBatch$$1() {
      globalState$$1.inBatch++;
  }
  function endBatch$$1() {
      if (--globalState$$1.inBatch === 0) {
          runReactions$$1();
          // the batch is actually about to finish, all unobserving should happen here.
          var list = globalState$$1.pendingUnobservations;
          for (var i = 0; i < list.length; i++) {
              var observable$$1 = list[i];
              observable$$1.isPendingUnobservation = false;
              if (observable$$1.observers.size === 0) {
                  if (observable$$1.isBeingObserved) {
                      // if this observable had reactive observers, trigger the hooks
                      observable$$1.isBeingObserved = false;
                      observable$$1.onBecomeUnobserved();
                  }
                  if (observable$$1 instanceof ComputedValue$$1) {
                      // computed values are automatically teared down when the last observer leaves
                      // this process happens recursively, this computed might be the last observabe of another, etc..
                      observable$$1.suspend();
                  }
              }
          }
          globalState$$1.pendingUnobservations = [];
      }
  }
  function reportObserved$$1(observable$$1) {
      var derivation = globalState$$1.trackingDerivation;
      if (derivation !== null) {
          /**
           * Simple optimization, give each derivation run an unique id (runId)
           * Check if last time this observable was accessed the same runId is used
           * if this is the case, the relation is already known
           */
          if (derivation.runId !== observable$$1.lastAccessedBy) {
              observable$$1.lastAccessedBy = derivation.runId;
              // Tried storing newObserving, or observing, or both as Set, but performance didn't come close...
              derivation.newObserving[derivation.unboundDepsCount++] = observable$$1;
              if (!observable$$1.isBeingObserved) {
                  observable$$1.isBeingObserved = true;
                  observable$$1.onBecomeObserved();
              }
          }
          return true;
      }
      else if (observable$$1.observers.size === 0 && globalState$$1.inBatch > 0) {
          queueForUnobservation$$1(observable$$1);
      }
      return false;
  }
  // function invariantLOS(observable: IObservable, msg: string) {
  //     // it's expensive so better not run it in produciton. but temporarily helpful for testing
  //     const min = getObservers(observable).reduce((a, b) => Math.min(a, b.dependenciesState), 2)
  //     if (min >= observable.lowestObserverState) return // <- the only assumption about `lowestObserverState`
  //     throw new Error(
  //         "lowestObserverState is wrong for " +
  //             msg +
  //             " because " +
  //             min +
  //             " < " +
  //             observable.lowestObserverState
  //     )
  // }
  /**
   * NOTE: current propagation mechanism will in case of self reruning autoruns behave unexpectedly
   * It will propagate changes to observers from previous run
   * It's hard or maybe impossible (with reasonable perf) to get it right with current approach
   * Hopefully self reruning autoruns aren't a feature people should depend on
   * Also most basic use cases should be ok
   */
  // Called by Atom when its value changes
  function propagateChanged$$1(observable$$1) {
      // invariantLOS(observable, "changed start");
      if (observable$$1.lowestObserverState === IDerivationState.STALE)
          return;
      observable$$1.lowestObserverState = IDerivationState.STALE;
      // Ideally we use for..of here, but the downcompiled version is really slow...
      observable$$1.observers.forEach(function (d) {
          if (d.dependenciesState === IDerivationState.UP_TO_DATE) {
              if (d.isTracing !== TraceMode$$1.NONE) {
                  logTraceInfo(d, observable$$1);
              }
              d.onBecomeStale();
          }
          d.dependenciesState = IDerivationState.STALE;
      });
      // invariantLOS(observable, "changed end");
  }
  // Called by ComputedValue when it recalculate and its value changed
  function propagateChangeConfirmed$$1(observable$$1) {
      // invariantLOS(observable, "confirmed start");
      if (observable$$1.lowestObserverState === IDerivationState.STALE)
          return;
      observable$$1.lowestObserverState = IDerivationState.STALE;
      observable$$1.observers.forEach(function (d) {
          if (d.dependenciesState === IDerivationState.POSSIBLY_STALE)
              d.dependenciesState = IDerivationState.STALE;
          else if (d.dependenciesState === IDerivationState.UP_TO_DATE // this happens during computing of `d`, just keep lowestObserverState up to date.
          )
              observable$$1.lowestObserverState = IDerivationState.UP_TO_DATE;
      });
      // invariantLOS(observable, "confirmed end");
  }
  // Used by computed when its dependency changed, but we don't wan't to immediately recompute.
  function propagateMaybeChanged$$1(observable$$1) {
      // invariantLOS(observable, "maybe start");
      if (observable$$1.lowestObserverState !== IDerivationState.UP_TO_DATE)
          return;
      observable$$1.lowestObserverState = IDerivationState.POSSIBLY_STALE;
      observable$$1.observers.forEach(function (d) {
          if (d.dependenciesState === IDerivationState.UP_TO_DATE) {
              d.dependenciesState = IDerivationState.POSSIBLY_STALE;
              if (d.isTracing !== TraceMode$$1.NONE) {
                  logTraceInfo(d, observable$$1);
              }
              d.onBecomeStale();
          }
      });
      // invariantLOS(observable, "maybe end");
  }
  function logTraceInfo(derivation, observable$$1) {
      console.log("[mobx.trace] '" + derivation.name + "' is invalidated due to a change in: '" + observable$$1.name + "'");
      if (derivation.isTracing === TraceMode$$1.BREAK) {
          var lines = [];
          printDepTree(getDependencyTree$$1(derivation), lines, 1);
          // prettier-ignore
          new Function("debugger;\n/*\nTracing '" + derivation.name + "'\n\nYou are entering this break point because derivation '" + derivation.name + "' is being traced and '" + observable$$1.name + "' is now forcing it to update.\nJust follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update\nThe stackframe you are looking for is at least ~6-8 stack-frames up.\n\n" + (derivation instanceof ComputedValue$$1 ? derivation.derivation.toString().replace(/[*]\//g, "/") : "") + "\n\nThe dependencies for this derivation are:\n\n" + lines.join("\n") + "\n*/\n    ")();
      }
  }
  function printDepTree(tree, lines, depth) {
      if (lines.length >= 1000) {
          lines.push("(and many more)");
          return;
      }
      lines.push("" + new Array(depth).join("\t") + tree.name); // MWE: not the fastest, but the easiest way :)
      if (tree.dependencies)
          tree.dependencies.forEach(function (child) { return printDepTree(child, lines, depth + 1); });
  }

  var Reaction$$1 = /** @class */ (function () {
      function Reaction$$1(name, onInvalidate, errorHandler) {
          if (name === void 0) { name = "Reaction@" + getNextId$$1(); }
          this.name = name;
          this.onInvalidate = onInvalidate;
          this.errorHandler = errorHandler;
          this.observing = []; // nodes we are looking at. Our value depends on these nodes
          this.newObserving = [];
          this.dependenciesState = IDerivationState.NOT_TRACKING;
          this.diffValue = 0;
          this.runId = 0;
          this.unboundDepsCount = 0;
          this.__mapid = "#" + getNextId$$1();
          this.isDisposed = false;
          this._isScheduled = false;
          this._isTrackPending = false;
          this._isRunning = false;
          this.isTracing = TraceMode$$1.NONE;
      }
      Reaction$$1.prototype.onBecomeStale = function () {
          this.schedule();
      };
      Reaction$$1.prototype.schedule = function () {
          if (!this._isScheduled) {
              this._isScheduled = true;
              globalState$$1.pendingReactions.push(this);
              runReactions$$1();
          }
      };
      Reaction$$1.prototype.isScheduled = function () {
          return this._isScheduled;
      };
      /**
       * internal, use schedule() if you intend to kick off a reaction
       */
      Reaction$$1.prototype.runReaction = function () {
          if (!this.isDisposed) {
              startBatch$$1();
              this._isScheduled = false;
              if (shouldCompute$$1(this)) {
                  this._isTrackPending = true;
                  try {
                      this.onInvalidate();
                      if (this._isTrackPending &&
                          isSpyEnabled$$1() &&
                          process.env.NODE_ENV !== "production") {
                          // onInvalidate didn't trigger track right away..
                          spyReport$$1({
                              name: this.name,
                              type: "scheduled-reaction"
                          });
                      }
                  }
                  catch (e) {
                      this.reportExceptionInDerivation(e);
                  }
              }
              endBatch$$1();
          }
      };
      Reaction$$1.prototype.track = function (fn) {
          if (this.isDisposed) {
              fail$$1("Reaction already disposed");
          }
          startBatch$$1();
          var notify = isSpyEnabled$$1();
          var startTime;
          if (notify && process.env.NODE_ENV !== "production") {
              startTime = Date.now();
              spyReportStart$$1({
                  name: this.name,
                  type: "reaction"
              });
          }
          this._isRunning = true;
          var result = trackDerivedFunction$$1(this, fn, undefined);
          this._isRunning = false;
          this._isTrackPending = false;
          if (this.isDisposed) {
              // disposed during last run. Clean up everything that was bound after the dispose call.
              clearObserving$$1(this);
          }
          if (isCaughtException$$1(result))
              this.reportExceptionInDerivation(result.cause);
          if (notify && process.env.NODE_ENV !== "production") {
              spyReportEnd$$1({
                  time: Date.now() - startTime
              });
          }
          endBatch$$1();
      };
      Reaction$$1.prototype.reportExceptionInDerivation = function (error) {
          var _this = this;
          if (this.errorHandler) {
              this.errorHandler(error, this);
              return;
          }
          if (globalState$$1.disableErrorBoundaries)
              throw error;
          var message = "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'";
          if (globalState$$1.suppressReactionErrors) {
              console.warn("[mobx] (error in reaction '" + this.name + "' suppressed, fix error of causing action below)"); // prettier-ignore
          }
          else {
              console.error(message, error);
              /** If debugging brought you here, please, read the above message :-). Tnx! */
          }
          if (isSpyEnabled$$1()) {
              spyReport$$1({
                  type: "error",
                  name: this.name,
                  message: message,
                  error: "" + error
              });
          }
          globalState$$1.globalReactionErrorHandlers.forEach(function (f) { return f(error, _this); });
      };
      Reaction$$1.prototype.dispose = function () {
          if (!this.isDisposed) {
              this.isDisposed = true;
              if (!this._isRunning) {
                  // if disposed while running, clean up later. Maybe not optimal, but rare case
                  startBatch$$1();
                  clearObserving$$1(this);
                  endBatch$$1();
              }
          }
      };
      Reaction$$1.prototype.getDisposer = function () {
          var r = this.dispose.bind(this);
          r[$mobx$$1] = this;
          return r;
      };
      Reaction$$1.prototype.toString = function () {
          return "Reaction[" + this.name + "]";
      };
      Reaction$$1.prototype.trace = function (enterBreakPoint) {
          if (enterBreakPoint === void 0) { enterBreakPoint = false; }
          trace$$1(this, enterBreakPoint);
      };
      return Reaction$$1;
  }());
  /**
   * Magic number alert!
   * Defines within how many times a reaction is allowed to re-trigger itself
   * until it is assumed that this is gonna be a never ending loop...
   */
  var MAX_REACTION_ITERATIONS = 100;
  var reactionScheduler = function (f) { return f(); };
  function runReactions$$1() {
      // Trampolining, if runReactions are already running, new reactions will be picked up
      if (globalState$$1.inBatch > 0 || globalState$$1.isRunningReactions)
          return;
      reactionScheduler(runReactionsHelper);
  }
  function runReactionsHelper() {
      globalState$$1.isRunningReactions = true;
      var allReactions = globalState$$1.pendingReactions;
      var iterations = 0;
      // While running reactions, new reactions might be triggered.
      // Hence we work with two variables and check whether
      // we converge to no remaining reactions after a while.
      while (allReactions.length > 0) {
          if (++iterations === MAX_REACTION_ITERATIONS) {
              console.error("Reaction doesn't converge to a stable state after " + MAX_REACTION_ITERATIONS + " iterations." +
                  (" Probably there is a cycle in the reactive function: " + allReactions[0]));
              allReactions.splice(0); // clear reactions
          }
          var remainingReactions = allReactions.splice(0);
          for (var i = 0, l = remainingReactions.length; i < l; i++)
              remainingReactions[i].runReaction();
      }
      globalState$$1.isRunningReactions = false;
  }
  var isReaction$$1 = createInstanceofPredicate$$1("Reaction", Reaction$$1);

  function isSpyEnabled$$1() {
      return process.env.NODE_ENV !== "production" && !!globalState$$1.spyListeners.length;
  }
  function spyReport$$1(event) {
      if (process.env.NODE_ENV === "production")
          return; // dead code elimination can do the rest
      if (!globalState$$1.spyListeners.length)
          return;
      var listeners = globalState$$1.spyListeners;
      for (var i = 0, l = listeners.length; i < l; i++)
          listeners[i](event);
  }
  function spyReportStart$$1(event) {
      if (process.env.NODE_ENV === "production")
          return;
      var change = __assign({}, event, { spyReportStart: true });
      spyReport$$1(change);
  }
  var END_EVENT = { spyReportEnd: true };
  function spyReportEnd$$1(change) {
      if (process.env.NODE_ENV === "production")
          return;
      if (change)
          spyReport$$1(__assign({}, change, { spyReportEnd: true }));
      else
          spyReport$$1(END_EVENT);
  }
  function spy$$1(listener) {
      if (process.env.NODE_ENV === "production") {
          console.warn("[mobx.spy] Is a no-op in production builds");
          return function () { };
      }
      else {
          globalState$$1.spyListeners.push(listener);
          return once$$1(function () {
              globalState$$1.spyListeners = globalState$$1.spyListeners.filter(function (l) { return l !== listener; });
          });
      }
  }
  function isAction$$1(thing) {
      return typeof thing === "function" && thing.isMobxAction === true;
  }

  /**
   * Creates a named reactive view and keeps it alive, so that the view is always
   * updated if one of the dependencies changes, even when the view is not further used by something else.
   * @param view The reactive view
   * @returns disposer function, which can be used to stop the view from being updated in the future.
   */
  function autorun$$1(view, opts) {
      if (opts === void 0) { opts = EMPTY_OBJECT$$1; }
      if (process.env.NODE_ENV !== "production") {
          invariant$$1(typeof view === "function", "Autorun expects a function as first argument");
          invariant$$1(isAction$$1(view) === false, "Autorun does not accept actions since actions are untrackable");
      }
      var name = (opts && opts.name) || view.name || "Autorun@" + getNextId$$1();
      var runSync = !opts.scheduler && !opts.delay;
      var reaction$$1;
      if (runSync) {
          // normal autorun
          reaction$$1 = new Reaction$$1(name, function () {
              this.track(reactionRunner);
          }, opts.onError);
      }
      else {
          var scheduler_1 = createSchedulerFromOptions(opts);
          // debounced autorun
          var isScheduled_1 = false;
          reaction$$1 = new Reaction$$1(name, function () {
              if (!isScheduled_1) {
                  isScheduled_1 = true;
                  scheduler_1(function () {
                      isScheduled_1 = false;
                      if (!reaction$$1.isDisposed)
                          reaction$$1.track(reactionRunner);
                  });
              }
          }, opts.onError);
      }
      function reactionRunner() {
          view(reaction$$1);
      }
      reaction$$1.schedule();
      return reaction$$1.getDisposer();
  }
  var run = function (f) { return f(); };
  function createSchedulerFromOptions(opts) {
      return opts.scheduler
          ? opts.scheduler
          : opts.delay
              ? function (f) { return setTimeout(f, opts.delay); }
              : run;
  }

  function onBecomeObserved$$1(thing, arg2, arg3) {
      return interceptHook("onBecomeObserved", thing, arg2, arg3);
  }
  function onBecomeUnobserved$$1(thing, arg2, arg3) {
      return interceptHook("onBecomeUnobserved", thing, arg2, arg3);
  }
  function interceptHook(hook, thing, arg2, arg3) {
      var atom = typeof arg2 === "string" ? getAtom$$1(thing, arg2) : getAtom$$1(thing);
      var cb = typeof arg2 === "string" ? arg3 : arg2;
      var listenersKey = hook + "Listeners";
      if (atom[listenersKey]) {
          atom[listenersKey].add(cb);
      }
      else {
          atom[listenersKey] = new Set([cb]);
      }
      var orig = atom[hook];
      if (typeof orig !== "function")
          return fail$$1(process.env.NODE_ENV !== "production" && "Not an atom that can be (un)observed");
      return function () {
          var hookListeners = atom[listenersKey];
          if (hookListeners) {
              hookListeners.delete(cb);
              if (hookListeners.size === 0) {
                  delete atom[listenersKey];
              }
          }
      };
  }

  function extendObservable$$1(target, properties, decorators, options) {
      if (process.env.NODE_ENV !== "production") {
          invariant$$1(arguments.length >= 2 && arguments.length <= 4, "'extendObservable' expected 2-4 arguments");
          invariant$$1(typeof target === "object", "'extendObservable' expects an object as first argument");
          invariant$$1(!isObservableMap$$1(target), "'extendObservable' should not be used on maps, use map.merge instead");
      }
      options = asCreateObservableOptions$$1(options);
      var defaultDecorator = getDefaultDecoratorFromObjectOptions$$1(options);
      initializeInstance$$1(target); // Fixes #1740
      asObservableObject$$1(target, options.name, defaultDecorator.enhancer); // make sure object is observable, even without initial props
      if (properties)
          extendObservableObjectWithProperties$$1(target, properties, decorators, defaultDecorator);
      return target;
  }
  function getDefaultDecoratorFromObjectOptions$$1(options) {
      return options.defaultDecorator || (options.deep === false ? refDecorator$$1 : deepDecorator$$1);
  }
  function extendObservableObjectWithProperties$$1(target, properties, decorators, defaultDecorator) {
      if (process.env.NODE_ENV !== "production") {
          invariant$$1(!isObservable$$1(properties), "Extending an object with another observable (object) is not supported. Please construct an explicit propertymap, using `toJS` if need. See issue #540");
          if (decorators)
              for (var key in decorators)
                  if (!(key in properties))
                      fail$$1("Trying to declare a decorator for unspecified property '" + key + "'");
      }
      startBatch$$1();
      try {
          for (var key in properties) {
              var descriptor = Object.getOwnPropertyDescriptor(properties, key);
              if (process.env.NODE_ENV !== "production") {
                  if (Object.getOwnPropertyDescriptor(target, key))
                      fail$$1("'extendObservable' can only be used to introduce new properties. Use 'set' or 'decorate' instead. The property '" + key + "' already exists on '" + target + "'");
                  if (isComputed$$1(descriptor.value))
                      fail$$1("Passing a 'computed' as initial property value is no longer supported by extendObservable. Use a getter or decorator instead");
              }
              var decorator = decorators && key in decorators
                  ? decorators[key]
                  : descriptor.get
                      ? computedDecorator$$1
                      : defaultDecorator;
              if (process.env.NODE_ENV !== "production" && typeof decorator !== "function")
                  fail$$1("Not a valid decorator for '" + key + "', got: " + decorator);
              var resultDescriptor = decorator(target, key, descriptor, true);
              if (resultDescriptor // otherwise, assume already applied, due to `applyToInstance`
              )
                  Object.defineProperty(target, key, resultDescriptor);
          }
      }
      finally {
          endBatch$$1();
      }
  }

  function getDependencyTree$$1(thing, property) {
      return nodeToDependencyTree(getAtom$$1(thing, property));
  }
  function nodeToDependencyTree(node) {
      var result = {
          name: node.name
      };
      if (node.observing && node.observing.length > 0)
          result.dependencies = unique$$1(node.observing).map(nodeToDependencyTree);
      return result;
  }

  function _isComputed$$1(value, property) {
      if (value === null || value === undefined)
          return false;
      if (property !== undefined) {
          if (isObservableObject$$1(value) === false)
              return false;
          if (!value[$mobx$$1].values.has(property))
              return false;
          var atom = getAtom$$1(value, property);
          return isComputedValue$$1(atom);
      }
      return isComputedValue$$1(value);
  }
  function isComputed$$1(value) {
      if (arguments.length > 1)
          return fail$$1(process.env.NODE_ENV !== "production" &&
              "isComputed expects only 1 argument. Use isObservableProp to inspect the observability of a property");
      return _isComputed$$1(value);
  }

  function _isObservable(value, property) {
      if (value === null || value === undefined)
          return false;
      if (property !== undefined) {
          if (process.env.NODE_ENV !== "production" &&
              (isObservableMap$$1(value) || isObservableArray$$1(value)))
              return fail$$1("isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.");
          if (isObservableObject$$1(value)) {
              return value[$mobx$$1].values.has(property);
          }
          return false;
      }
      // For first check, see #701
      return (isObservableObject$$1(value) ||
          !!value[$mobx$$1] ||
          isAtom$$1(value) ||
          isReaction$$1(value) ||
          isComputedValue$$1(value));
  }
  function isObservable$$1(value) {
      if (arguments.length !== 1)
          fail$$1(process.env.NODE_ENV !== "production" &&
              "isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property");
      return _isObservable(value);
  }

  function keys$$1(obj) {
      if (isObservableObject$$1(obj)) {
          return obj[$mobx$$1].getKeys();
      }
      if (isObservableMap$$1(obj)) {
          return Array.from(obj.keys());
      }
      if (isObservableSet$$1(obj)) {
          return Array.from(obj.keys());
      }
      if (isObservableArray$$1(obj)) {
          return obj.map(function (_, index) { return index; });
      }
      return fail$$1(process.env.NODE_ENV !== "production" &&
          "'keys()' can only be used on observable objects, arrays, sets and maps");
  }
  function set$$1(obj, key, value) {
      if (arguments.length === 2) {
          startBatch$$1();
          var values_1 = key;
          try {
              for (var key_1 in values_1)
                  set$$1(obj, key_1, values_1[key_1]);
          }
          finally {
              endBatch$$1();
          }
          return;
      }
      if (isObservableObject$$1(obj)) {
          var adm = obj[$mobx$$1];
          var existingObservable = adm.values.get(key);
          if (existingObservable) {
              adm.write(key, value);
          }
          else {
              adm.addObservableProp(key, value, adm.defaultEnhancer);
          }
      }
      else if (isObservableMap$$1(obj)) {
          obj.set(key, value);
      }
      else if (isObservableArray$$1(obj)) {
          if (typeof key !== "number")
              key = parseInt(key, 10);
          invariant$$1(key >= 0, "Not a valid index: '" + key + "'");
          startBatch$$1();
          if (key >= obj.length)
              obj.length = key + 1;
          obj[key] = value;
          endBatch$$1();
      }
      else {
          return fail$$1(process.env.NODE_ENV !== "production" &&
              "'set()' can only be used on observable objects, arrays and maps");
      }
  }

  var defaultOptions = {
      detectCycles: true,
      exportMapsAsObjects: true,
      recurseEverything: false
  };
  function cache(map, key, value, options) {
      if (options.detectCycles)
          map.set(key, value);
      return value;
  }
  function toJSHelper(source, options, __alreadySeen) {
      if (!options.recurseEverything && !isObservable$$1(source))
          return source;
      if (typeof source !== "object")
          return source;
      // Directly return null if source is null
      if (source === null)
          return null;
      // Directly return the Date object itself if contained in the observable
      if (source instanceof Date)
          return source;
      if (isObservableValue$$1(source))
          return toJSHelper(source.get(), options, __alreadySeen);
      // make sure we track the keys of the object
      if (isObservable$$1(source))
          keys$$1(source);
      var detectCycles = options.detectCycles === true;
      if (detectCycles && source !== null && __alreadySeen.has(source)) {
          return __alreadySeen.get(source);
      }
      if (isObservableArray$$1(source) || Array.isArray(source)) {
          var res_1 = cache(__alreadySeen, source, [], options);
          var toAdd = source.map(function (value) { return toJSHelper(value, options, __alreadySeen); });
          res_1.length = toAdd.length;
          for (var i = 0, l = toAdd.length; i < l; i++)
              res_1[i] = toAdd[i];
          return res_1;
      }
      if (isObservableSet$$1(source) || Object.getPrototypeOf(source) === Set.prototype) {
          if (options.exportMapsAsObjects === false) {
              var res_2 = cache(__alreadySeen, source, new Set(), options);
              source.forEach(function (value) {
                  res_2.add(toJSHelper(value, options, __alreadySeen));
              });
              return res_2;
          }
          else {
              var res_3 = cache(__alreadySeen, source, [], options);
              source.forEach(function (value) {
                  res_3.push(toJSHelper(value, options, __alreadySeen));
              });
              return res_3;
          }
      }
      if (isObservableMap$$1(source) || Object.getPrototypeOf(source) === Map.prototype) {
          if (options.exportMapsAsObjects === false) {
              var res_4 = cache(__alreadySeen, source, new Map(), options);
              source.forEach(function (value, key) {
                  res_4.set(key, toJSHelper(value, options, __alreadySeen));
              });
              return res_4;
          }
          else {
              var res_5 = cache(__alreadySeen, source, {}, options);
              source.forEach(function (value, key) {
                  res_5[key] = toJSHelper(value, options, __alreadySeen);
              });
              return res_5;
          }
      }
      // Fallback to the situation that source is an ObservableObject or a plain object
      var res = cache(__alreadySeen, source, {}, options);
      for (var key in source) {
          res[key] = toJSHelper(source[key], options, __alreadySeen);
      }
      return res;
  }
  function toJS$$1(source, options) {
      // backward compatibility
      if (typeof options === "boolean")
          options = { detectCycles: options };
      if (!options)
          options = defaultOptions;
      options.detectCycles =
          options.detectCycles === undefined
              ? options.recurseEverything === true
              : options.detectCycles === true;
      var __alreadySeen;
      if (options.detectCycles)
          __alreadySeen = new Map();
      return toJSHelper(source, options, __alreadySeen);
  }

  function trace$$1() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
      }
      var enterBreakPoint = false;
      if (typeof args[args.length - 1] === "boolean")
          enterBreakPoint = args.pop();
      var derivation = getAtomFromArgs(args);
      if (!derivation) {
          return fail$$1(process.env.NODE_ENV !== "production" &&
              "'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
      }
      if (derivation.isTracing === TraceMode$$1.NONE) {
          console.log("[mobx.trace] '" + derivation.name + "' tracing enabled");
      }
      derivation.isTracing = enterBreakPoint ? TraceMode$$1.BREAK : TraceMode$$1.LOG;
  }
  function getAtomFromArgs(args) {
      switch (args.length) {
          case 0:
              return globalState$$1.trackingDerivation;
          case 1:
              return getAtom$$1(args[0]);
          case 2:
              return getAtom$$1(args[0], args[1]);
      }
  }

  /**
   * During a transaction no views are updated until the end of the transaction.
   * The transaction will be run synchronously nonetheless.
   *
   * @param action a function that updates some reactive state
   * @returns any value that was returned by the 'action' parameter.
   */
  function transaction$$1(action$$1, thisArg) {
      if (thisArg === void 0) { thisArg = undefined; }
      startBatch$$1();
      try {
          return action$$1.apply(thisArg);
      }
      finally {
          endBatch$$1();
      }
  }

  function getAdm(target) {
      return target[$mobx$$1];
  }
  // Optimization: we don't need the intermediate objects and could have a completely custom administration for DynamicObjects,
  // and skip either the internal values map, or the base object with its property descriptors!
  var objectProxyTraps = {
      has: function (target, name) {
          if (name === $mobx$$1 || name === "constructor" || name === mobxDidRunLazyInitializersSymbol$$1)
              return true;
          var adm = getAdm(target);
          // MWE: should `in` operator be reactive? If not, below code path will be faster / more memory efficient
          // TODO: check performance stats!
          // if (adm.values.get(name as string)) return true
          if (typeof name === "string")
              return adm.has(name);
          return name in target;
      },
      get: function (target, name) {
          if (name === $mobx$$1 || name === "constructor" || name === mobxDidRunLazyInitializersSymbol$$1)
              return target[name];
          var adm = getAdm(target);
          var observable$$1 = adm.values.get(name);
          if (observable$$1 instanceof Atom$$1) {
              var result = observable$$1.get();
              if (result === undefined) {
                  // This fixes #1796, because deleting a prop that has an
                  // undefined value won't retrigger a observer (no visible effect),
                  // the autorun wouldn't subscribe to future key changes (see also next comment)
                  adm.has(name);
              }
              return result;
          }
          // make sure we start listening to future keys
          // note that we only do this here for optimization
          if (typeof name === "string")
              adm.has(name);
          return target[name];
      },
      set: function (target, name, value) {
          if (typeof name !== "string")
              return false;
          set$$1(target, name, value);
          return true;
      },
      deleteProperty: function (target, name) {
          if (typeof name !== "string")
              return false;
          var adm = getAdm(target);
          adm.remove(name);
          return true;
      },
      ownKeys: function (target) {
          var adm = getAdm(target);
          adm.keysAtom.reportObserved();
          return Reflect.ownKeys(target);
      },
      preventExtensions: function (target) {
          fail$$1("Dynamic observable objects cannot be frozen");
          return false;
      }
  };
  function createDynamicObservableObject$$1(base) {
      var proxy = new Proxy(base, objectProxyTraps);
      base[$mobx$$1].proxy = proxy;
      return proxy;
  }

  function hasInterceptors$$1(interceptable) {
      return interceptable.interceptors !== undefined && interceptable.interceptors.length > 0;
  }
  function registerInterceptor$$1(interceptable, handler) {
      var interceptors = interceptable.interceptors || (interceptable.interceptors = []);
      interceptors.push(handler);
      return once$$1(function () {
          var idx = interceptors.indexOf(handler);
          if (idx !== -1)
              interceptors.splice(idx, 1);
      });
  }
  function interceptChange$$1(interceptable, change) {
      var prevU = untrackedStart$$1();
      try {
          var interceptors = interceptable.interceptors;
          if (interceptors)
              for (var i = 0, l = interceptors.length; i < l; i++) {
                  change = interceptors[i](change);
                  invariant$$1(!change || change.type, "Intercept handlers should return nothing or a change object");
                  if (!change)
                      break;
              }
          return change;
      }
      finally {
          untrackedEnd$$1(prevU);
      }
  }

  function hasListeners$$1(listenable) {
      return listenable.changeListeners !== undefined && listenable.changeListeners.length > 0;
  }
  function registerListener$$1(listenable, handler) {
      var listeners = listenable.changeListeners || (listenable.changeListeners = []);
      listeners.push(handler);
      return once$$1(function () {
          var idx = listeners.indexOf(handler);
          if (idx !== -1)
              listeners.splice(idx, 1);
      });
  }
  function notifyListeners$$1(listenable, change) {
      var prevU = untrackedStart$$1();
      var listeners = listenable.changeListeners;
      if (!listeners)
          return;
      listeners = listeners.slice();
      for (var i = 0, l = listeners.length; i < l; i++) {
          listeners[i](change);
      }
      untrackedEnd$$1(prevU);
  }

  var MAX_SPLICE_SIZE = 10000; // See e.g. https://github.com/mobxjs/mobx/issues/859
  var arrayTraps = {
      get: function (target, name) {
          if (name === $mobx$$1)
              return target[$mobx$$1];
          if (name === "length")
              return target[$mobx$$1].getArrayLength();
          if (typeof name === "number") {
              return arrayExtensions.get.call(target, name);
          }
          if (typeof name === "string" && !isNaN(name)) {
              return arrayExtensions.get.call(target, parseInt(name));
          }
          if (arrayExtensions.hasOwnProperty(name)) {
              return arrayExtensions[name];
          }
          return target[name];
      },
      set: function (target, name, value) {
          if (name === "length") {
              target[$mobx$$1].setArrayLength(value);
              return true;
          }
          if (typeof name === "number") {
              arrayExtensions.set.call(target, name, value);
              return true;
          }
          if (!isNaN(name)) {
              arrayExtensions.set.call(target, parseInt(name), value);
              return true;
          }
          return false;
      },
      preventExtensions: function (target) {
          fail$$1("Observable arrays cannot be frozen");
          return false;
      }
  };
  function createObservableArray$$1(initialValues, enhancer, name, owned) {
      if (name === void 0) { name = "ObservableArray@" + getNextId$$1(); }
      if (owned === void 0) { owned = false; }
      var adm = new ObservableArrayAdministration(name, enhancer, owned);
      addHiddenFinalProp$$1(adm.values, $mobx$$1, adm);
      var proxy = new Proxy(adm.values, arrayTraps);
      adm.proxy = proxy;
      if (initialValues && initialValues.length) {
          var prev = allowStateChangesStart$$1(true);
          adm.spliceWithArray(0, 0, initialValues);
          allowStateChangesEnd$$1(prev);
      }
      return proxy;
  }
  var ObservableArrayAdministration = /** @class */ (function () {
      function ObservableArrayAdministration(name, enhancer, owned) {
          this.owned = owned;
          this.values = [];
          this.proxy = undefined;
          this.lastKnownLength = 0;
          this.atom = new Atom$$1(name || "ObservableArray@" + getNextId$$1());
          this.enhancer = function (newV, oldV) { return enhancer(newV, oldV, name + "[..]"); };
      }
      ObservableArrayAdministration.prototype.dehanceValue = function (value) {
          if (this.dehancer !== undefined)
              return this.dehancer(value);
          return value;
      };
      ObservableArrayAdministration.prototype.dehanceValues = function (values$$1) {
          if (this.dehancer !== undefined && values$$1.length > 0)
              return values$$1.map(this.dehancer);
          return values$$1;
      };
      ObservableArrayAdministration.prototype.intercept = function (handler) {
          return registerInterceptor$$1(this, handler);
      };
      ObservableArrayAdministration.prototype.observe = function (listener, fireImmediately) {
          if (fireImmediately === void 0) { fireImmediately = false; }
          if (fireImmediately) {
              listener({
                  object: this.proxy,
                  type: "splice",
                  index: 0,
                  added: this.values.slice(),
                  addedCount: this.values.length,
                  removed: [],
                  removedCount: 0
              });
          }
          return registerListener$$1(this, listener);
      };
      ObservableArrayAdministration.prototype.getArrayLength = function () {
          this.atom.reportObserved();
          return this.values.length;
      };
      ObservableArrayAdministration.prototype.setArrayLength = function (newLength) {
          if (typeof newLength !== "number" || newLength < 0)
              throw new Error("[mobx.array] Out of range: " + newLength);
          var currentLength = this.values.length;
          if (newLength === currentLength)
              return;
          else if (newLength > currentLength) {
              var newItems = new Array(newLength - currentLength);
              for (var i = 0; i < newLength - currentLength; i++)
                  newItems[i] = undefined; // No Array.fill everywhere...
              this.spliceWithArray(currentLength, 0, newItems);
          }
          else
              this.spliceWithArray(newLength, currentLength - newLength);
      };
      ObservableArrayAdministration.prototype.updateArrayLength = function (oldLength, delta) {
          if (oldLength !== this.lastKnownLength)
              throw new Error("[mobx] Modification exception: the internal structure of an observable array was changed.");
          this.lastKnownLength += delta;
      };
      ObservableArrayAdministration.prototype.spliceWithArray = function (index, deleteCount, newItems) {
          var _this = this;
          checkIfStateModificationsAreAllowed$$1(this.atom);
          var length = this.values.length;
          if (index === undefined)
              index = 0;
          else if (index > length)
              index = length;
          else if (index < 0)
              index = Math.max(0, length + index);
          if (arguments.length === 1)
              deleteCount = length - index;
          else if (deleteCount === undefined || deleteCount === null)
              deleteCount = 0;
          else
              deleteCount = Math.max(0, Math.min(deleteCount, length - index));
          if (newItems === undefined)
              newItems = EMPTY_ARRAY$$1;
          if (hasInterceptors$$1(this)) {
              var change = interceptChange$$1(this, {
                  object: this.proxy,
                  type: "splice",
                  index: index,
                  removedCount: deleteCount,
                  added: newItems
              });
              if (!change)
                  return EMPTY_ARRAY$$1;
              deleteCount = change.removedCount;
              newItems = change.added;
          }
          newItems = newItems.length === 0 ? newItems : newItems.map(function (v) { return _this.enhancer(v, undefined); });
          if (process.env.NODE_ENV !== "production") {
              var lengthDelta = newItems.length - deleteCount;
              this.updateArrayLength(length, lengthDelta); // checks if internal array wasn't modified
          }
          var res = this.spliceItemsIntoValues(index, deleteCount, newItems);
          if (deleteCount !== 0 || newItems.length !== 0)
              this.notifyArraySplice(index, newItems, res);
          return this.dehanceValues(res);
      };
      ObservableArrayAdministration.prototype.spliceItemsIntoValues = function (index, deleteCount, newItems) {
          var _a;
          if (newItems.length < MAX_SPLICE_SIZE) {
              return (_a = this.values).splice.apply(_a, __spread([index, deleteCount], newItems));
          }
          else {
              var res = this.values.slice(index, index + deleteCount);
              this.values = this.values
                  .slice(0, index)
                  .concat(newItems, this.values.slice(index + deleteCount));
              return res;
          }
      };
      ObservableArrayAdministration.prototype.notifyArrayChildUpdate = function (index, newValue, oldValue) {
          var notifySpy = !this.owned && isSpyEnabled$$1();
          var notify = hasListeners$$1(this);
          var change = notify || notifySpy
              ? {
                  object: this.proxy,
                  type: "update",
                  index: index,
                  newValue: newValue,
                  oldValue: oldValue
              }
              : null;
          // The reason why this is on right hand side here (and not above), is this way the uglifier will drop it, but it won't
          // cause any runtime overhead in development mode without NODE_ENV set, unless spying is enabled
          if (notifySpy && process.env.NODE_ENV !== "production")
              spyReportStart$$1(__assign({}, change, { name: this.atom.name }));
          this.atom.reportChanged();
          if (notify)
              notifyListeners$$1(this, change);
          if (notifySpy && process.env.NODE_ENV !== "production")
              spyReportEnd$$1();
      };
      ObservableArrayAdministration.prototype.notifyArraySplice = function (index, added, removed) {
          var notifySpy = !this.owned && isSpyEnabled$$1();
          var notify = hasListeners$$1(this);
          var change = notify || notifySpy
              ? {
                  object: this.proxy,
                  type: "splice",
                  index: index,
                  removed: removed,
                  added: added,
                  removedCount: removed.length,
                  addedCount: added.length
              }
              : null;
          if (notifySpy && process.env.NODE_ENV !== "production")
              spyReportStart$$1(__assign({}, change, { name: this.atom.name }));
          this.atom.reportChanged();
          // conform: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe
          if (notify)
              notifyListeners$$1(this, change);
          if (notifySpy && process.env.NODE_ENV !== "production")
              spyReportEnd$$1();
      };
      return ObservableArrayAdministration;
  }());
  var arrayExtensions = {
      intercept: function (handler) {
          return this[$mobx$$1].intercept(handler);
      },
      observe: function (listener, fireImmediately) {
          if (fireImmediately === void 0) { fireImmediately = false; }
          var adm = this[$mobx$$1];
          return adm.observe(listener, fireImmediately);
      },
      clear: function () {
          return this.splice(0);
      },
      replace: function (newItems) {
          var adm = this[$mobx$$1];
          return adm.spliceWithArray(0, adm.values.length, newItems);
      },
      /**
       * Converts this array back to a (shallow) javascript structure.
       * For a deep clone use mobx.toJS
       */
      toJS: function () {
          return this.slice();
      },
      toJSON: function () {
          // Used by JSON.stringify
          return this.toJS();
      },
      /*
       * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
       * since these functions alter the inner structure of the array, the have side effects.
       * Because the have side effects, they should not be used in computed function,
       * and for that reason the do not call dependencyState.notifyObserved
       */
      splice: function (index, deleteCount) {
          var newItems = [];
          for (var _i = 2; _i < arguments.length; _i++) {
              newItems[_i - 2] = arguments[_i];
          }
          var adm = this[$mobx$$1];
          switch (arguments.length) {
              case 0:
                  return [];
              case 1:
                  return adm.spliceWithArray(index);
              case 2:
                  return adm.spliceWithArray(index, deleteCount);
          }
          return adm.spliceWithArray(index, deleteCount, newItems);
      },
      spliceWithArray: function (index, deleteCount, newItems) {
          var adm = this[$mobx$$1];
          return adm.spliceWithArray(index, deleteCount, newItems);
      },
      push: function () {
          var items = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              items[_i] = arguments[_i];
          }
          var adm = this[$mobx$$1];
          adm.spliceWithArray(adm.values.length, 0, items);
          return adm.values.length;
      },
      pop: function () {
          return this.splice(Math.max(this[$mobx$$1].values.length - 1, 0), 1)[0];
      },
      shift: function () {
          return this.splice(0, 1)[0];
      },
      unshift: function () {
          var items = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              items[_i] = arguments[_i];
          }
          var adm = this[$mobx$$1];
          adm.spliceWithArray(0, 0, items);
          return adm.values.length;
      },
      reverse: function () {
          // reverse by default mutates in place before returning the result
          // which makes it both a 'derivation' and a 'mutation'.
          // so we deviate from the default and just make it an dervitation
          if (process.env.NODE_ENV !== "production") {
              console.warn("[mobx] `observableArray.reverse()` will not update the array in place. Use `observableArray.slice().reverse()` to supress this warning and perform the operation on a copy, or `observableArray.replace(observableArray.slice().reverse())` to reverse & update in place");
          }
          var clone = this.slice();
          return clone.reverse.apply(clone, arguments);
      },
      sort: function (compareFn) {
          // sort by default mutates in place before returning the result
          // which goes against all good practices. Let's not change the array in place!
          if (process.env.NODE_ENV !== "production") {
              console.warn("[mobx] `observableArray.sort()` will not update the array in place. Use `observableArray.slice().sort()` to supress this warning and perform the operation on a copy, or `observableArray.replace(observableArray.slice().sort())` to sort & update in place");
          }
          var clone = this.slice();
          return clone.sort.apply(clone, arguments);
      },
      remove: function (value) {
          var adm = this[$mobx$$1];
          var idx = adm.dehanceValues(adm.values).indexOf(value);
          if (idx > -1) {
              this.splice(idx, 1);
              return true;
          }
          return false;
      },
      get: function (index) {
          var adm = this[$mobx$$1];
          if (adm) {
              if (index < adm.values.length) {
                  adm.atom.reportObserved();
                  return adm.dehanceValue(adm.values[index]);
              }
              console.warn("[mobx.array] Attempt to read an array index (" + index + ") that is out of bounds (" + adm.values.length + "). Please check length first. Out of bound indices will not be tracked by MobX");
          }
          return undefined;
      },
      set: function (index, newValue) {
          var adm = this[$mobx$$1];
          var values$$1 = adm.values;
          if (index < values$$1.length) {
              // update at index in range
              checkIfStateModificationsAreAllowed$$1(adm.atom);
              var oldValue = values$$1[index];
              if (hasInterceptors$$1(adm)) {
                  var change = interceptChange$$1(adm, {
                      type: "update",
                      object: this,
                      index: index,
                      newValue: newValue
                  });
                  if (!change)
                      return;
                  newValue = change.newValue;
              }
              newValue = adm.enhancer(newValue, oldValue);
              var changed = newValue !== oldValue;
              if (changed) {
                  values$$1[index] = newValue;
                  adm.notifyArrayChildUpdate(index, newValue, oldValue);
              }
          }
          else if (index === values$$1.length) {
              // add a new item
              adm.spliceWithArray(index, 0, [newValue]);
          }
          else {
              // out of bounds
              throw new Error("[mobx.array] Index out of bounds, " + index + " is larger than " + values$$1.length);
          }
      }
  };
  [
      "concat",
      "every",
      "filter",
      "forEach",
      "indexOf",
      "join",
      "lastIndexOf",
      "map",
      "reduce",
      "reduceRight",
      "slice",
      "some",
      "toString",
      "toLocaleString"
  ].forEach(function (funcName) {
      arrayExtensions[funcName] = function () {
          var adm = this[$mobx$$1];
          adm.atom.reportObserved();
          var res = adm.dehanceValues(adm.values);
          return res[funcName].apply(res, arguments);
      };
  });
  var isObservableArrayAdministration = createInstanceofPredicate$$1("ObservableArrayAdministration", ObservableArrayAdministration);
  function isObservableArray$$1(thing) {
      return isObject$$1(thing) && isObservableArrayAdministration(thing[$mobx$$1]);
  }

  var _a;
  var ObservableMapMarker = {};
  // just extend Map? See also https://gist.github.com/nestharus/13b4d74f2ef4a2f4357dbd3fc23c1e54
  // But: https://github.com/mobxjs/mobx/issues/1556
  var ObservableMap$$1 = /** @class */ (function () {
      function ObservableMap$$1(initialData, enhancer, name) {
          if (enhancer === void 0) { enhancer = deepEnhancer$$1; }
          if (name === void 0) { name = "ObservableMap@" + getNextId$$1(); }
          this.enhancer = enhancer;
          this.name = name;
          this[_a] = ObservableMapMarker;
          this._keysAtom = createAtom$$1(this.name + ".keys()");
          this[Symbol.toStringTag] = "Map";
          if (typeof Map !== "function") {
              throw new Error("mobx.map requires Map polyfill for the current browser. Check babel-polyfill or core-js/es6/map.js");
          }
          this._data = new Map();
          this._hasMap = new Map();
          this.merge(initialData);
      }
      ObservableMap$$1.prototype._has = function (key) {
          return this._data.has(key);
      };
      ObservableMap$$1.prototype.has = function (key) {
          if (this._hasMap.has(key))
              return this._hasMap.get(key).get();
          return this._updateHasMapEntry(key, false).get();
      };
      ObservableMap$$1.prototype.set = function (key, value) {
          var hasKey = this._has(key);
          if (hasInterceptors$$1(this)) {
              var change = interceptChange$$1(this, {
                  type: hasKey ? "update" : "add",
                  object: this,
                  newValue: value,
                  name: key
              });
              if (!change)
                  return this;
              value = change.newValue;
          }
          if (hasKey) {
              this._updateValue(key, value);
          }
          else {
              this._addValue(key, value);
          }
          return this;
      };
      ObservableMap$$1.prototype.delete = function (key) {
          var _this = this;
          if (hasInterceptors$$1(this)) {
              var change = interceptChange$$1(this, {
                  type: "delete",
                  object: this,
                  name: key
              });
              if (!change)
                  return false;
          }
          if (this._has(key)) {
              var notifySpy = isSpyEnabled$$1();
              var notify = hasListeners$$1(this);
              var change = notify || notifySpy
                  ? {
                      type: "delete",
                      object: this,
                      oldValue: this._data.get(key).value,
                      name: key
                  }
                  : null;
              if (notifySpy && process.env.NODE_ENV !== "production")
                  spyReportStart$$1(__assign({}, change, { name: this.name, key: key }));
              transaction$$1(function () {
                  _this._keysAtom.reportChanged();
                  _this._updateHasMapEntry(key, false);
                  var observable$$1 = _this._data.get(key);
                  observable$$1.setNewValue(undefined);
                  _this._data.delete(key);
              });
              if (notify)
                  notifyListeners$$1(this, change);
              if (notifySpy && process.env.NODE_ENV !== "production")
                  spyReportEnd$$1();
              return true;
          }
          return false;
      };
      ObservableMap$$1.prototype._updateHasMapEntry = function (key, value) {
          // optimization; don't fill the hasMap if we are not observing, or remove entry if there are no observers anymore
          var entry = this._hasMap.get(key);
          if (entry) {
              entry.setNewValue(value);
          }
          else {
              entry = new ObservableValue$$1(value, referenceEnhancer$$1, this.name + "." + stringifyKey(key) + "?", false);
              this._hasMap.set(key, entry);
          }
          return entry;
      };
      ObservableMap$$1.prototype._updateValue = function (key, newValue) {
          var observable$$1 = this._data.get(key);
          newValue = observable$$1.prepareNewValue(newValue);
          if (newValue !== globalState$$1.UNCHANGED) {
              var notifySpy = isSpyEnabled$$1();
              var notify = hasListeners$$1(this);
              var change = notify || notifySpy
                  ? {
                      type: "update",
                      object: this,
                      oldValue: observable$$1.value,
                      name: key,
                      newValue: newValue
                  }
                  : null;
              if (notifySpy && process.env.NODE_ENV !== "production")
                  spyReportStart$$1(__assign({}, change, { name: this.name, key: key }));
              observable$$1.setNewValue(newValue);
              if (notify)
                  notifyListeners$$1(this, change);
              if (notifySpy && process.env.NODE_ENV !== "production")
                  spyReportEnd$$1();
          }
      };
      ObservableMap$$1.prototype._addValue = function (key, newValue) {
          var _this = this;
          checkIfStateModificationsAreAllowed$$1(this._keysAtom);
          transaction$$1(function () {
              var observable$$1 = new ObservableValue$$1(newValue, _this.enhancer, _this.name + "." + stringifyKey(key), false);
              _this._data.set(key, observable$$1);
              newValue = observable$$1.value; // value might have been changed
              _this._updateHasMapEntry(key, true);
              _this._keysAtom.reportChanged();
          });
          var notifySpy = isSpyEnabled$$1();
          var notify = hasListeners$$1(this);
          var change = notify || notifySpy
              ? {
                  type: "add",
                  object: this,
                  name: key,
                  newValue: newValue
              }
              : null;
          if (notifySpy && process.env.NODE_ENV !== "production")
              spyReportStart$$1(__assign({}, change, { name: this.name, key: key }));
          if (notify)
              notifyListeners$$1(this, change);
          if (notifySpy && process.env.NODE_ENV !== "production")
              spyReportEnd$$1();
      };
      ObservableMap$$1.prototype.get = function (key) {
          if (this.has(key))
              return this.dehanceValue(this._data.get(key).get());
          return this.dehanceValue(undefined);
      };
      ObservableMap$$1.prototype.dehanceValue = function (value) {
          if (this.dehancer !== undefined) {
              return this.dehancer(value);
          }
          return value;
      };
      ObservableMap$$1.prototype.keys = function () {
          this._keysAtom.reportObserved();
          return this._data.keys();
      };
      ObservableMap$$1.prototype.values = function () {
          var self = this;
          var nextIndex = 0;
          var keys$$1 = Array.from(this.keys());
          return makeIterable({
              next: function () {
                  return nextIndex < keys$$1.length
                      ? { value: self.get(keys$$1[nextIndex++]), done: false }
                      : { done: true };
              }
          });
      };
      ObservableMap$$1.prototype.entries = function () {
          var self = this;
          var nextIndex = 0;
          var keys$$1 = Array.from(this.keys());
          return makeIterable({
              next: function () {
                  if (nextIndex < keys$$1.length) {
                      var key = keys$$1[nextIndex++];
                      return {
                          value: [key, self.get(key)],
                          done: false
                      };
                  }
                  return { done: true };
              }
          });
      };
      ObservableMap$$1.prototype[(_a = $mobx$$1, Symbol.iterator)] = function () {
          return this.entries();
      };
      ObservableMap$$1.prototype.forEach = function (callback, thisArg) {
          var e_1, _a;
          try {
              for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                  var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                  callback.call(thisArg, value, key, this);
              }
          }
          catch (e_1_1) { e_1 = { error: e_1_1 }; }
          finally {
              try {
                  if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
              }
              finally { if (e_1) throw e_1.error; }
          }
      };
      /** Merge another object into this object, returns this. */
      ObservableMap$$1.prototype.merge = function (other) {
          var _this = this;
          if (isObservableMap$$1(other)) {
              other = other.toJS();
          }
          transaction$$1(function () {
              if (isPlainObject$$1(other))
                  Object.keys(other).forEach(function (key) { return _this.set(key, other[key]); });
              else if (Array.isArray(other))
                  other.forEach(function (_a) {
                      var _b = __read(_a, 2), key = _b[0], value = _b[1];
                      return _this.set(key, value);
                  });
              else if (isES6Map$$1(other)) {
                  if (other.constructor !== Map)
                      fail$$1("Cannot initialize from classes that inherit from Map: " + other.constructor.name); // prettier-ignore
                  other.forEach(function (value, key) { return _this.set(key, value); });
              }
              else if (other !== null && other !== undefined)
                  fail$$1("Cannot initialize map from " + other);
          });
          return this;
      };
      ObservableMap$$1.prototype.clear = function () {
          var _this = this;
          transaction$$1(function () {
              untracked$$1(function () {
                  var e_2, _a;
                  try {
                      for (var _b = __values(_this.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                          var key = _c.value;
                          _this.delete(key);
                      }
                  }
                  catch (e_2_1) { e_2 = { error: e_2_1 }; }
                  finally {
                      try {
                          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                      }
                      finally { if (e_2) throw e_2.error; }
                  }
              });
          });
      };
      ObservableMap$$1.prototype.replace = function (values$$1) {
          var _this = this;
          transaction$$1(function () {
              // grab all the keys that are present in the new map but not present in the current map
              // and delete them from the map, then merge the new map
              // this will cause reactions only on changed values
              var newKeys = getMapLikeKeys$$1(values$$1);
              var oldKeys = Array.from(_this.keys());
              var missingKeys = oldKeys.filter(function (k) { return newKeys.indexOf(k) === -1; });
              missingKeys.forEach(function (k) { return _this.delete(k); });
              _this.merge(values$$1);
          });
          return this;
      };
      Object.defineProperty(ObservableMap$$1.prototype, "size", {
          get: function () {
              this._keysAtom.reportObserved();
              return this._data.size;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * Returns a plain object that represents this map.
       * Note that all the keys being stringified.
       * If there are duplicating keys after converting them to strings, behaviour is undetermined.
       */
      ObservableMap$$1.prototype.toPOJO = function () {
          var e_3, _a;
          var res = {};
          try {
              for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                  var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                  // We lie about symbol key types due to https://github.com/Microsoft/TypeScript/issues/1863
                  res[typeof key === "symbol" ? key : stringifyKey(key)] = value;
              }
          }
          catch (e_3_1) { e_3 = { error: e_3_1 }; }
          finally {
              try {
                  if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
              }
              finally { if (e_3) throw e_3.error; }
          }
          return res;
      };
      /**
       * Returns a shallow non observable object clone of this map.
       * Note that the values migth still be observable. For a deep clone use mobx.toJS.
       */
      ObservableMap$$1.prototype.toJS = function () {
          return new Map(this);
      };
      ObservableMap$$1.prototype.toJSON = function () {
          // Used by JSON.stringify
          return this.toPOJO();
      };
      ObservableMap$$1.prototype.toString = function () {
          var _this = this;
          return (this.name +
              "[{ " +
              Array.from(this.keys())
                  .map(function (key) { return stringifyKey(key) + ": " + ("" + _this.get(key)); })
                  .join(", ") +
              " }]");
      };
      /**
       * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
       * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
       * for callback details
       */
      ObservableMap$$1.prototype.observe = function (listener, fireImmediately) {
          process.env.NODE_ENV !== "production" &&
              invariant$$1(fireImmediately !== true, "`observe` doesn't support fireImmediately=true in combination with maps.");
          return registerListener$$1(this, listener);
      };
      ObservableMap$$1.prototype.intercept = function (handler) {
          return registerInterceptor$$1(this, handler);
      };
      return ObservableMap$$1;
  }());
  function stringifyKey(key) {
      if (key && key.toString)
          return key.toString();
      else
          return new String(key).toString();
  }
  /* 'var' fixes small-build issue */
  var isObservableMap$$1 = createInstanceofPredicate$$1("ObservableMap", ObservableMap$$1);

  var _a$1;
  var ObservableSetMarker = {};
  var ObservableSet$$1 = /** @class */ (function () {
      function ObservableSet$$1(initialData, enhancer, name) {
          if (enhancer === void 0) { enhancer = deepEnhancer$$1; }
          if (name === void 0) { name = "ObservableSet@" + getNextId$$1(); }
          this.name = name;
          this[_a$1] = ObservableSetMarker;
          this._data = new Set();
          this._atom = createAtom$$1(this.name);
          this[Symbol.toStringTag] = "Set";
          if (typeof Set !== "function") {
              throw new Error("mobx.set requires Set polyfill for the current browser. Check babel-polyfill or core-js/es6/set.js");
          }
          this.enhancer = function (newV, oldV) { return enhancer(newV, oldV, name); };
          if (initialData) {
              this.replace(initialData);
          }
      }
      ObservableSet$$1.prototype.dehanceValue = function (value) {
          if (this.dehancer !== undefined) {
              return this.dehancer(value);
          }
          return value;
      };
      ObservableSet$$1.prototype.clear = function () {
          var _this = this;
          transaction$$1(function () {
              untracked$$1(function () {
                  var e_1, _a;
                  try {
                      for (var _b = __values(_this._data.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                          var value = _c.value;
                          _this.delete(value);
                      }
                  }
                  catch (e_1_1) { e_1 = { error: e_1_1 }; }
                  finally {
                      try {
                          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                      }
                      finally { if (e_1) throw e_1.error; }
                  }
              });
          });
      };
      ObservableSet$$1.prototype.forEach = function (callbackFn, thisArg) {
          var e_2, _a;
          try {
              for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                  var value = _c.value;
                  callbackFn.call(thisArg, value, value, this);
              }
          }
          catch (e_2_1) { e_2 = { error: e_2_1 }; }
          finally {
              try {
                  if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
              }
              finally { if (e_2) throw e_2.error; }
          }
      };
      Object.defineProperty(ObservableSet$$1.prototype, "size", {
          get: function () {
              this._atom.reportObserved();
              return this._data.size;
          },
          enumerable: true,
          configurable: true
      });
      ObservableSet$$1.prototype.add = function (value) {
          var _this = this;
          checkIfStateModificationsAreAllowed$$1(this._atom);
          if (hasInterceptors$$1(this)) {
              var change = interceptChange$$1(this, {
                  type: "add",
                  object: this,
                  newValue: value
              });
              if (!change)
                  return this;
              // TODO: ideally, value = change.value would be done here, so that values can be
              // changed by interceptor. Same applies for other Set and Map api's.
          }
          if (!this.has(value)) {
              transaction$$1(function () {
                  _this._data.add(_this.enhancer(value, undefined));
                  _this._atom.reportChanged();
              });
              var notifySpy = isSpyEnabled$$1();
              var notify = hasListeners$$1(this);
              var change = notify || notifySpy
                  ? {
                      type: "add",
                      object: this,
                      newValue: value
                  }
                  : null;
              if (notifySpy && process.env.NODE_ENV !== "production")
                  spyReportStart$$1(change);
              if (notify)
                  notifyListeners$$1(this, change);
              if (notifySpy && process.env.NODE_ENV !== "production")
                  spyReportEnd$$1();
          }
          return this;
      };
      ObservableSet$$1.prototype.delete = function (value) {
          var _this = this;
          if (hasInterceptors$$1(this)) {
              var change = interceptChange$$1(this, {
                  type: "delete",
                  object: this,
                  oldValue: value
              });
              if (!change)
                  return false;
          }
          if (this.has(value)) {
              var notifySpy = isSpyEnabled$$1();
              var notify = hasListeners$$1(this);
              var change = notify || notifySpy
                  ? {
                      type: "delete",
                      object: this,
                      oldValue: value
                  }
                  : null;
              if (notifySpy && process.env.NODE_ENV !== "production")
                  spyReportStart$$1(__assign({}, change, { name: this.name }));
              transaction$$1(function () {
                  _this._atom.reportChanged();
                  _this._data.delete(value);
              });
              if (notify)
                  notifyListeners$$1(this, change);
              if (notifySpy && process.env.NODE_ENV !== "production")
                  spyReportEnd$$1();
              return true;
          }
          return false;
      };
      ObservableSet$$1.prototype.has = function (value) {
          this._atom.reportObserved();
          return this._data.has(this.dehanceValue(value));
      };
      ObservableSet$$1.prototype.entries = function () {
          var nextIndex = 0;
          var keys$$1 = Array.from(this.keys());
          var values$$1 = Array.from(this.values());
          return makeIterable({
              next: function () {
                  var index = nextIndex;
                  nextIndex += 1;
                  return index < values$$1.length
                      ? { value: [keys$$1[index], values$$1[index]], done: false }
                      : { done: true };
              }
          });
      };
      ObservableSet$$1.prototype.keys = function () {
          return this.values();
      };
      ObservableSet$$1.prototype.values = function () {
          this._atom.reportObserved();
          var self = this;
          var nextIndex = 0;
          var observableValues = Array.from(this._data.values());
          return makeIterable({
              next: function () {
                  return nextIndex < observableValues.length
                      ? { value: self.dehanceValue(observableValues[nextIndex++]), done: false }
                      : { done: true };
              }
          });
      };
      ObservableSet$$1.prototype.replace = function (other) {
          var _this = this;
          if (isObservableSet$$1(other)) {
              other = other.toJS();
          }
          transaction$$1(function () {
              if (Array.isArray(other)) {
                  _this.clear();
                  other.forEach(function (value) { return _this.add(value); });
              }
              else if (isES6Set$$1(other)) {
                  _this.clear();
                  other.forEach(function (value) { return _this.add(value); });
              }
              else if (other !== null && other !== undefined) {
                  fail$$1("Cannot initialize set from " + other);
              }
          });
          return this;
      };
      ObservableSet$$1.prototype.observe = function (listener, fireImmediately) {
          // TODO 'fireImmediately' can be true?
          process.env.NODE_ENV !== "production" &&
              invariant$$1(fireImmediately !== true, "`observe` doesn't support fireImmediately=true in combination with sets.");
          return registerListener$$1(this, listener);
      };
      ObservableSet$$1.prototype.intercept = function (handler) {
          return registerInterceptor$$1(this, handler);
      };
      ObservableSet$$1.prototype.toJS = function () {
          return new Set(this);
      };
      ObservableSet$$1.prototype.toString = function () {
          return this.name + "[ " + Array.from(this).join(", ") + " ]";
      };
      ObservableSet$$1.prototype[(_a$1 = $mobx$$1, Symbol.iterator)] = function () {
          return this.values();
      };
      return ObservableSet$$1;
  }());
  var isObservableSet$$1 = createInstanceofPredicate$$1("ObservableSet", ObservableSet$$1);

  var ObservableObjectAdministration$$1 = /** @class */ (function () {
      function ObservableObjectAdministration$$1(target, values$$1, name, defaultEnhancer) {
          if (values$$1 === void 0) { values$$1 = new Map(); }
          this.target = target;
          this.values = values$$1;
          this.name = name;
          this.defaultEnhancer = defaultEnhancer;
          this.keysAtom = new Atom$$1(name + ".keys");
      }
      ObservableObjectAdministration$$1.prototype.read = function (key) {
          return this.values.get(key).get();
      };
      ObservableObjectAdministration$$1.prototype.write = function (key, newValue) {
          var instance = this.target;
          var observable$$1 = this.values.get(key);
          if (observable$$1 instanceof ComputedValue$$1) {
              observable$$1.set(newValue);
              return;
          }
          // intercept
          if (hasInterceptors$$1(this)) {
              var change = interceptChange$$1(this, {
                  type: "update",
                  object: this.proxy || instance,
                  name: key,
                  newValue: newValue
              });
              if (!change)
                  return;
              newValue = change.newValue;
          }
          newValue = observable$$1.prepareNewValue(newValue);
          // notify spy & observers
          if (newValue !== globalState$$1.UNCHANGED) {
              var notify = hasListeners$$1(this);
              var notifySpy = isSpyEnabled$$1();
              var change = notify || notifySpy
                  ? {
                      type: "update",
                      object: this.proxy || instance,
                      oldValue: observable$$1.value,
                      name: key,
                      newValue: newValue
                  }
                  : null;
              if (notifySpy && process.env.NODE_ENV !== "production")
                  spyReportStart$$1(__assign({}, change, { name: this.name, key: key }));
              observable$$1.setNewValue(newValue);
              if (notify)
                  notifyListeners$$1(this, change);
              if (notifySpy && process.env.NODE_ENV !== "production")
                  spyReportEnd$$1();
          }
      };
      ObservableObjectAdministration$$1.prototype.has = function (key) {
          var map = this.pendingKeys || (this.pendingKeys = new Map());
          var entry = map.get(key);
          if (entry)
              return entry.get();
          else {
              var exists = !!this.values.get(key);
              // Possible optimization: Don't have a separate map for non existing keys,
              // but store them in the values map instead, using a special symbol to denote "not existing"
              entry = new ObservableValue$$1(exists, referenceEnhancer$$1, this.name + "." + key.toString() + "?", false);
              map.set(key, entry);
              return entry.get(); // read to subscribe
          }
      };
      ObservableObjectAdministration$$1.prototype.addObservableProp = function (propName, newValue, enhancer) {
          if (enhancer === void 0) { enhancer = this.defaultEnhancer; }
          var target = this.target;
          assertPropertyConfigurable$$1(target, propName);
          if (hasInterceptors$$1(this)) {
              var change = interceptChange$$1(this, {
                  object: this.proxy || target,
                  name: propName,
                  type: "add",
                  newValue: newValue
              });
              if (!change)
                  return;
              newValue = change.newValue;
          }
          var observable$$1 = new ObservableValue$$1(newValue, enhancer, this.name + "." + propName, false);
          this.values.set(propName, observable$$1);
          newValue = observable$$1.value; // observableValue might have changed it
          Object.defineProperty(target, propName, generateObservablePropConfig$$1(propName));
          this.notifyPropertyAddition(propName, newValue);
      };
      ObservableObjectAdministration$$1.prototype.addComputedProp = function (propertyOwner, // where is the property declared?
      propName, options) {
          var target = this.target;
          options.name = options.name || this.name + "." + propName;
          this.values.set(propName, new ComputedValue$$1(options));
          if (propertyOwner === target || isPropertyConfigurable$$1(propertyOwner, propName))
              Object.defineProperty(propertyOwner, propName, generateComputedPropConfig$$1(propName));
      };
      ObservableObjectAdministration$$1.prototype.remove = function (key) {
          if (!this.values.has(key))
              return;
          var target = this.target;
          if (hasInterceptors$$1(this)) {
              var change = interceptChange$$1(this, {
                  object: this.proxy || target,
                  name: key,
                  type: "remove"
              });
              if (!change)
                  return;
          }
          try {
              startBatch$$1();
              var notify = hasListeners$$1(this);
              var notifySpy = isSpyEnabled$$1();
              var oldObservable = this.values.get(key);
              var oldValue = oldObservable && oldObservable.get();
              oldObservable && oldObservable.set(undefined);
              // notify key and keyset listeners
              this.keysAtom.reportChanged();
              this.values.delete(key);
              if (this.pendingKeys) {
                  var entry = this.pendingKeys.get(key);
                  if (entry)
                      entry.set(false);
              }
              // delete the prop
              delete this.target[key];
              var change = notify || notifySpy
                  ? {
                      type: "remove",
                      object: this.proxy || target,
                      oldValue: oldValue,
                      name: key
                  }
                  : null;
              if (notifySpy && process.env.NODE_ENV !== "production")
                  spyReportStart$$1(__assign({}, change, { name: this.name, key: key }));
              if (notify)
                  notifyListeners$$1(this, change);
              if (notifySpy && process.env.NODE_ENV !== "production")
                  spyReportEnd$$1();
          }
          finally {
              endBatch$$1();
          }
      };
      ObservableObjectAdministration$$1.prototype.illegalAccess = function (owner, propName) {
          /**
           * This happens if a property is accessed through the prototype chain, but the property was
           * declared directly as own property on the prototype.
           *
           * E.g.:
           * class A {
           * }
           * extendObservable(A.prototype, { x: 1 })
           *
           * classB extens A {
           * }
           * console.log(new B().x)
           *
           * It is unclear whether the property should be considered 'static' or inherited.
           * Either use `console.log(A.x)`
           * or: decorate(A, { x: observable })
           *
           * When using decorate, the property will always be redeclared as own property on the actual instance
           */
          console.warn("Property '" + propName + "' of '" + owner + "' was accessed through the prototype chain. Use 'decorate' instead to declare the prop or access it statically through it's owner");
      };
      /**
       * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
       * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
       * for callback details
       */
      ObservableObjectAdministration$$1.prototype.observe = function (callback, fireImmediately) {
          process.env.NODE_ENV !== "production" &&
              invariant$$1(fireImmediately !== true, "`observe` doesn't support the fire immediately property for observable objects.");
          return registerListener$$1(this, callback);
      };
      ObservableObjectAdministration$$1.prototype.intercept = function (handler) {
          return registerInterceptor$$1(this, handler);
      };
      ObservableObjectAdministration$$1.prototype.notifyPropertyAddition = function (key, newValue) {
          var notify = hasListeners$$1(this);
          var notifySpy = isSpyEnabled$$1();
          var change = notify || notifySpy
              ? {
                  type: "add",
                  object: this.proxy || this.target,
                  name: key,
                  newValue: newValue
              }
              : null;
          if (notifySpy && process.env.NODE_ENV !== "production")
              spyReportStart$$1(__assign({}, change, { name: this.name, key: key }));
          if (notify)
              notifyListeners$$1(this, change);
          if (notifySpy && process.env.NODE_ENV !== "production")
              spyReportEnd$$1();
          if (this.pendingKeys) {
              var entry = this.pendingKeys.get(key);
              if (entry)
                  entry.set(true);
          }
          this.keysAtom.reportChanged();
      };
      ObservableObjectAdministration$$1.prototype.getKeys = function () {
          var e_1, _a;
          this.keysAtom.reportObserved();
          // return Reflect.ownKeys(this.values) as any
          var res = [];
          try {
              for (var _b = __values(this.values), _c = _b.next(); !_c.done; _c = _b.next()) {
                  var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                  if (value instanceof ObservableValue$$1)
                      res.push(key);
              }
          }
          catch (e_1_1) { e_1 = { error: e_1_1 }; }
          finally {
              try {
                  if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
              }
              finally { if (e_1) throw e_1.error; }
          }
          return res;
      };
      return ObservableObjectAdministration$$1;
  }());
  function asObservableObject$$1(target, name, defaultEnhancer) {
      if (name === void 0) { name = ""; }
      if (defaultEnhancer === void 0) { defaultEnhancer = deepEnhancer$$1; }
      if (Object.prototype.hasOwnProperty.call(target, $mobx$$1))
          return target[$mobx$$1];
      process.env.NODE_ENV !== "production" &&
          invariant$$1(Object.isExtensible(target), "Cannot make the designated object observable; it is not extensible");
      if (!isPlainObject$$1(target))
          name = (target.constructor.name || "ObservableObject") + "@" + getNextId$$1();
      if (!name)
          name = "ObservableObject@" + getNextId$$1();
      var adm = new ObservableObjectAdministration$$1(target, new Map(), name, defaultEnhancer);
      addHiddenProp$$1(target, $mobx$$1, adm);
      return adm;
  }
  var observablePropertyConfigs = Object.create(null);
  var computedPropertyConfigs = Object.create(null);
  function generateObservablePropConfig$$1(propName) {
      return (observablePropertyConfigs[propName] ||
          (observablePropertyConfigs[propName] = {
              configurable: true,
              enumerable: true,
              get: function () {
                  return this[$mobx$$1].read(propName);
              },
              set: function (v) {
                  this[$mobx$$1].write(propName, v);
              }
          }));
  }
  function getAdministrationForComputedPropOwner(owner) {
      var adm = owner[$mobx$$1];
      if (!adm) {
          // because computed props are declared on proty,
          // the current instance might not have been initialized yet
          initializeInstance$$1(owner);
          return owner[$mobx$$1];
      }
      return adm;
  }
  function generateComputedPropConfig$$1(propName) {
      return (computedPropertyConfigs[propName] ||
          (computedPropertyConfigs[propName] = {
              configurable: false,
              enumerable: false,
              get: function () {
                  return getAdministrationForComputedPropOwner(this).read(propName);
              },
              set: function (v) {
                  getAdministrationForComputedPropOwner(this).write(propName, v);
              }
          }));
  }
  var isObservableObjectAdministration = createInstanceofPredicate$$1("ObservableObjectAdministration", ObservableObjectAdministration$$1);
  function isObservableObject$$1(thing) {
      if (isObject$$1(thing)) {
          // Initializers run lazily when transpiling to babel, so make sure they are run...
          initializeInstance$$1(thing);
          return isObservableObjectAdministration(thing[$mobx$$1]);
      }
      return false;
  }

  function getAtom$$1(thing, property) {
      if (typeof thing === "object" && thing !== null) {
          if (isObservableArray$$1(thing)) {
              if (property !== undefined)
                  fail$$1(process.env.NODE_ENV !== "production" &&
                      "It is not possible to get index atoms from arrays");
              return thing[$mobx$$1].atom;
          }
          if (isObservableSet$$1(thing)) {
              return thing[$mobx$$1];
          }
          if (isObservableMap$$1(thing)) {
              var anyThing = thing;
              if (property === undefined)
                  return anyThing._keysAtom;
              var observable$$1 = anyThing._data.get(property) || anyThing._hasMap.get(property);
              if (!observable$$1)
                  fail$$1(process.env.NODE_ENV !== "production" &&
                      "the entry '" + property + "' does not exist in the observable map '" + getDebugName$$1(thing) + "'");
              return observable$$1;
          }
          // Initializers run lazily when transpiling to babel, so make sure they are run...
          initializeInstance$$1(thing);
          if (property && !thing[$mobx$$1])
              thing[property]; // See #1072
          if (isObservableObject$$1(thing)) {
              if (!property)
                  return fail$$1(process.env.NODE_ENV !== "production" && "please specify a property");
              var observable$$1 = thing[$mobx$$1].values.get(property);
              if (!observable$$1)
                  fail$$1(process.env.NODE_ENV !== "production" &&
                      "no observable property '" + property + "' found on the observable object '" + getDebugName$$1(thing) + "'");
              return observable$$1;
          }
          if (isAtom$$1(thing) || isComputedValue$$1(thing) || isReaction$$1(thing)) {
              return thing;
          }
      }
      else if (typeof thing === "function") {
          if (isReaction$$1(thing[$mobx$$1])) {
              // disposer function
              return thing[$mobx$$1];
          }
      }
      return fail$$1(process.env.NODE_ENV !== "production" && "Cannot obtain atom from " + thing);
  }
  function getAdministration$$1(thing, property) {
      if (!thing)
          fail$$1("Expecting some object");
      if (property !== undefined)
          return getAdministration$$1(getAtom$$1(thing, property));
      if (isAtom$$1(thing) || isComputedValue$$1(thing) || isReaction$$1(thing))
          return thing;
      if (isObservableMap$$1(thing) || isObservableSet$$1(thing))
          return thing;
      // Initializers run lazily when transpiling to babel, so make sure they are run...
      initializeInstance$$1(thing);
      if (thing[$mobx$$1])
          return thing[$mobx$$1];
      fail$$1(process.env.NODE_ENV !== "production" && "Cannot obtain administration from " + thing);
  }
  function getDebugName$$1(thing, property) {
      var named;
      if (property !== undefined)
          named = getAtom$$1(thing, property);
      else if (isObservableObject$$1(thing) || isObservableMap$$1(thing) || isObservableSet$$1(thing))
          named = getAdministration$$1(thing);
      else
          named = getAtom$$1(thing); // valid for arrays as well
      return named.name;
  }

  var toString = Object.prototype.toString;
  function deepEqual$$1(a, b) {
      return eq(a, b);
  }
  // Copied from https://github.com/jashkenas/underscore/blob/5c237a7c682fb68fd5378203f0bf22dce1624854/underscore.js#L1186-L1289
  // Internal recursive comparison function for `isEqual`.
  function eq(a, b, aStack, bStack) {
      // Identical objects are equal. `0 === -0`, but they aren't identical.
      // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
      if (a === b)
          return a !== 0 || 1 / a === 1 / b;
      // `null` or `undefined` only equal to itself (strict comparison).
      if (a == null || b == null)
          return false;
      // `NaN`s are equivalent, but non-reflexive.
      if (a !== a)
          return b !== b;
      // Exhaust primitive checks
      var type = typeof a;
      if (type !== "function" && type !== "object" && typeof b != "object")
          return false;
      return deepEq(a, b, aStack, bStack);
  }
  // Internal recursive comparison function for `isEqual`.
  function deepEq(a, b, aStack, bStack) {
      // Unwrap any wrapped objects.
      a = unwrap(a);
      b = unwrap(b);
      // Compare `[[Class]]` names.
      var className = toString.call(a);
      if (className !== toString.call(b))
          return false;
      switch (className) {
          // Strings, numbers, regular expressions, dates, and booleans are compared by value.
          case "[object RegExp]":
          // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
          case "[object String]":
              // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
              // equivalent to `new String("5")`.
              return "" + a === "" + b;
          case "[object Number]":
              // `NaN`s are equivalent, but non-reflexive.
              // Object(NaN) is equivalent to NaN.
              if (+a !== +a)
                  return +b !== +b;
              // An `egal` comparison is performed for other numeric values.
              return +a === 0 ? 1 / +a === 1 / b : +a === +b;
          case "[object Date]":
          case "[object Boolean]":
              // Coerce dates and booleans to numeric primitive values. Dates are compared by their
              // millisecond representations. Note that invalid dates with millisecond representations
              // of `NaN` are not equivalent.
              return +a === +b;
          case "[object Symbol]":
              return (typeof Symbol !== "undefined" && Symbol.valueOf.call(a) === Symbol.valueOf.call(b));
      }
      var areArrays = className === "[object Array]";
      if (!areArrays) {
          if (typeof a != "object" || typeof b != "object")
              return false;
          // Objects with different constructors are not equivalent, but `Object`s or `Array`s
          // from different frames are.
          var aCtor = a.constructor, bCtor = b.constructor;
          if (aCtor !== bCtor &&
              !(typeof aCtor === "function" &&
                  aCtor instanceof aCtor &&
                  typeof bCtor === "function" &&
                  bCtor instanceof bCtor) &&
              ("constructor" in a && "constructor" in b)) {
              return false;
          }
      }
      // Assume equality for cyclic structures. The algorithm for detecting cyclic
      // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
      // Initializing stack of traversed objects.
      // It's done here since we only need them for objects and arrays comparison.
      aStack = aStack || [];
      bStack = bStack || [];
      var length = aStack.length;
      while (length--) {
          // Linear search. Performance is inversely proportional to the number of
          // unique nested structures.
          if (aStack[length] === a)
              return bStack[length] === b;
      }
      // Add the first object to the stack of traversed objects.
      aStack.push(a);
      bStack.push(b);
      // Recursively compare objects and arrays.
      if (areArrays) {
          // Compare array lengths to determine if a deep comparison is necessary.
          length = a.length;
          if (length !== b.length)
              return false;
          // Deep compare the contents, ignoring non-numeric properties.
          while (length--) {
              if (!eq(a[length], b[length], aStack, bStack))
                  return false;
          }
      }
      else {
          // Deep compare objects.
          var keys$$1 = Object.keys(a);
          var key = void 0;
          length = keys$$1.length;
          // Ensure that both objects contain the same number of properties before comparing deep equality.
          if (Object.keys(b).length !== length)
              return false;
          while (length--) {
              // Deep compare each member
              key = keys$$1[length];
              if (!(has$1(b, key) && eq(a[key], b[key], aStack, bStack)))
                  return false;
          }
      }
      // Remove the first object from the stack of traversed objects.
      aStack.pop();
      bStack.pop();
      return true;
  }
  function unwrap(a) {
      if (isObservableArray$$1(a))
          return a.slice();
      if (isES6Map$$1(a) || isObservableMap$$1(a))
          return Array.from(a.entries());
      if (isES6Set$$1(a) || isObservableSet$$1(a))
          return Array.from(a.entries());
      return a;
  }
  function has$1(a, key) {
      return Object.prototype.hasOwnProperty.call(a, key);
  }

  function makeIterable(iterator) {
      iterator[Symbol.iterator] = self$1;
      return iterator;
  }
  function self$1() {
      return this;
  }

  /*
  The only reason for this file to exist is pure horror:
  Without it rollup can make the bundling fail at any point in time; when it rolls up the files in the wrong order
  it will cause undefined errors (for example because super classes or local variables not being hosted).
  With this file that will still happen,
  but at least in this file we can magically reorder the imports with trial and error until the build succeeds again.
  */

  /**
   * (c) Michel Weststrate 2015 - 2018
   * MIT Licensed
   *
   * Welcome to the mobx sources! To get an global overview of how MobX internally works,
   * this is a good place to start:
   * https://medium.com/@mweststrate/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254#.xvbh6qd74
   *
   * Source folders:
   * ===============
   *
   * - api/     Most of the public static methods exposed by the module can be found here.
   * - core/    Implementation of the MobX algorithm; atoms, derivations, reactions, dependency trees, optimizations. Cool stuff can be found here.
   * - types/   All the magic that is need to have observable objects, arrays and values is in this folder. Including the modifiers like `asFlat`.
   * - utils/   Utility stuff.
   *
   */
  if (typeof Proxy === "undefined" || typeof Symbol === "undefined") {
      throw new Error("[mobx] MobX 5+ requires Proxy and Symbol objects. If your environment doesn't support Symbol or Proxy objects, please downgrade to MobX 4. For React Native Android, consider upgrading JSCore.");
  }
  try {
      // define process.env if needed
      // if this is not a production build in the first place
      // (in which case the expression below would be substituted with 'production')
      process.env.NODE_ENV;
  }
  catch (e) {
      var g = typeof window !== "undefined" ? window : global;
      if (typeof process === "undefined")
          g.process = {};
      g.process.env = {};
  }

  (function () {
      function testCodeMinification() { }
      if (testCodeMinification.name !== "testCodeMinification" &&
          process.env.NODE_ENV !== "production" &&
          process.env.IGNORE_MOBX_MINIFY_WARNING !== "true") {
          console.warn(
          // Template literal(backtick) is used for fix issue with rollup-plugin-commonjs https://github.com/rollup/rollup-plugin-commonjs/issues/344
          "[mobx] you are running a minified build, but 'process.env.NODE_ENV' was not set to 'production' in your bundler. This results in an unnecessarily large and slow bundle");
      }
  })();
  // Devtools support
  if (typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === "object") {
      // See: https://github.com/andykog/mobx-devtools/
      __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
          spy: spy$$1,
          extras: {
              getDebugName: getDebugName$$1
          },
          $mobx: $mobx$$1
      });
  }

  // Unique ID creation requires a high quality random # generator.  In node.js
  // this is pretty straight-forward - we use the crypto API.



  var rng = function nodeRNG() {
    return crypto.randomBytes(16);
  };

  /**
   * Convert array of 16 byte values to UUID string format of the form:
   * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   */
  var byteToHex = [];
  for (var i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
  }

  function bytesToUuid(buf, offset) {
    var i = offset || 0;
    var bth = byteToHex;
    // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
    return ([bth[buf[i++]], bth[buf[i++]], 
  	bth[buf[i++]], bth[buf[i++]], '-',
  	bth[buf[i++]], bth[buf[i++]], '-',
  	bth[buf[i++]], bth[buf[i++]], '-',
  	bth[buf[i++]], bth[buf[i++]], '-',
  	bth[buf[i++]], bth[buf[i++]],
  	bth[buf[i++]], bth[buf[i++]],
  	bth[buf[i++]], bth[buf[i++]]]).join('');
  }

  var bytesToUuid_1 = bytesToUuid;

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  var _nodeId;
  var _clockseq;

  // Previous uuid creation time
  var _lastMSecs = 0;
  var _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};
    var node = options.node || _nodeId;
    var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

    // node and clockseq need to be initialized to random values if they're not
    // specified.  We do this lazily to minimize issues related to insufficient
    // system entropy.  See #189
    if (node == null || clockseq == null) {
      var seedBytes = rng();
      if (node == null) {
        // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
        node = _nodeId = [
          seedBytes[0] | 0x01,
          seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
        ];
      }
      if (clockseq == null) {
        // Per 4.2.2, randomize (14 bit) clockseq
        clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
      }
    }

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq === undefined) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    for (var n = 0; n < 6; ++n) {
      b[i + n] = node[n];
    }

    return buf ? buf : bytesToUuid_1(b);
  }

  var v1_1 = v1;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var jqueryParam = createCommonjsModule(function (module) {
  /**
   * @preserve jquery-param (c) 2015 KNOWLEDGECODE | MIT
   */
  (function (global) {

      var param = function (a) {
          var s = [];
          var add = function (k, v) {
              v = typeof v === 'function' ? v() : v;
              v = v === null ? '' : v === undefined ? '' : v;
              s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
          };
          var buildParams = function (prefix, obj) {
              var i, len, key;

              if (prefix) {
                  if (Array.isArray(obj)) {
                      for (i = 0, len = obj.length; i < len; i++) {
                          buildParams(
                              prefix + '[' + (typeof obj[i] === 'object' && obj[i] ? i : '') + ']',
                              obj[i]
                          );
                      }
                  } else if (String(obj) === '[object Object]') {
                      for (key in obj) {
                          buildParams(prefix + '[' + key + ']', obj[key]);
                      }
                  } else {
                      add(prefix, obj);
                  }
              } else if (Array.isArray(obj)) {
                  for (i = 0, len = obj.length; i < len; i++) {
                      add(obj[i].name, obj[i].value);
                  }
              } else {
                  for (key in obj) {
                      buildParams(key, obj[key]);
                  }
              }
              return s;
          };

          return buildParams('', a).join('&');
      };

      {
          module.exports = param;
      }

  }(commonjsGlobal));
  });

  /**
   * Build request url from base url, endpoint, query params, and ids.
   *
   * @method requestUrl
   * @return {String} formatted url string
   */

  function requestUrl(baseUrl, endpoint) {
    var queryParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var id = arguments.length > 3 ? arguments[3] : undefined;
    var queryParamString = '';

    if (Object.keys(queryParams).length > 0) {
      queryParamString = "?".concat(jqueryParam(queryParams));
    }

    var idForPath = '';

    if (id) {
      idForPath = "/".concat(id);
    } // Return full url


    return "".concat(baseUrl, "/").concat(endpoint).concat(idForPath).concat(queryParamString);
  }
  function dbOrNewId(properties) {
    return properties.id || "tmp-".concat(v1_1());
  }

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
    /**
     * Observable property used to store data and
     * handle changes to state
     *
     * @property data
     * @type {Object}
     * @default {}
     */

    /**
     * Initializer for Store class
     *
     * @method constructor
     */
    function Store(_options) {
      var _this = this;

      _classCallCheck(this, Store);

      _initializerDefineProperty(this, "data", _descriptor, this);

      this.add = function (type, data) {
        if (data.constructor.name === 'Array') {
          return _this.addModels(type, data);
        } else {
          return _this.addModel(type, data);
        }
      };

      this.addModel = function (type, attributes) {
        var id = dbOrNewId(attributes); // Create new model install

        var model = _this.createModel(type, id, {
          attributes: attributes
        }); // Add the model to the type records index


        _this.data[type].records[id] = model;
        return model;
      };

      this.addModels = function (type, data) {
        var records = [];
        transaction$$1(function () {
          records = data.map(function (obj) {
            return _this.addModel(type, obj);
          });
        });
        return records;
      };

      this.remove = function (type, id) {
        delete _this.data[type].records[id];
      };

      this.findOne = function (type, id) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        if (_this.shouldFetchOne(type, id, options)) {
          return _this.fetchOne(type, id, options);
        } else {
          return _this.getRecord(type, id);
        }
      };

      this.findAll = function (type) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var fromServer = options.fromServer,
            queryParams = options.queryParams; // If fromServer is true always fetch the data and return

        if (fromServer === true) return _this.fetchAll(type, queryParams); // If fromServer is false never fetch the data and return

        if (fromServer === false) return _this.getMatchingRecords(type, queryParams); // Get any matching records

        var records = _this.getMatchingRecords(type, queryParams); // If any records are present
        // console.log('findAll', type, queryParams)
        // console.log('records', records.length)


        if (records.length > 0) {
          // Return data
          return records;
        } else {
          // Otherwise fetch it from the server
          return _this.fetchAll(type, queryParams);
        }
      };

      this.init(_options);
    }
    /**
     * Adds an instance or an array of instances to the store.
     * ```
     * kpiHash = { name: "A good thing to measure" }
     * kpi = store.add('kpis', kpiHash)
     * kpi.name
     * => "A good thing to measure"
     * ```
     * @method add
     * @param {String} type
     * @param {Object} properties the properties to use
     * @return {Object} the new record
     */


    _createClass(Store, [{
      key: "reset",

      /**
       * Clears the store of a given type, or clears all if no type given
       *
       *   store.reset('todos')
       *   // removes all todos from store
       *   store.reset()
       *   // clears store
       *
       * @method reset
       */
      value: function reset(type) {
        if (type) {
          this.data[type] = {
            records: {},
            cache: {}
          };
        } else {
          this.initializeObservableDataProperty();
        }
      }
      /* Private Methods */

      /**
       * Entry point for configuring the store
       *
       * @method init
       * @param {Object} options passed to constructor
       */

    }, {
      key: "init",
      value: function init(options) {
        this.initializeNetworkConfiguration(options);
        this.initializeModelTypeIndex();
        this.initializeObservableDataProperty();
      }
      /**
       * Entry point for configuring the store
       *
       * @method initializeNetworkConfiguration
       * @param {Object} options for nextwork config
       */

    }, {
      key: "initializeNetworkConfiguration",
      value: function initializeNetworkConfiguration() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        this.baseUrl = options.baseUrl || '';
        this.defaultFetchOptions = options.defaultFetchOptions || {};
      }
      /**
       * Entry point for configuring the store
       *
       * @method initializeNetworkConfiguration
       * @param {Object} options for nextwork config
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
       * @method initializeObservableDataProperty
       */

    }, {
      key: "initializeObservableDataProperty",
      value: function initializeObservableDataProperty() {
        var _this2 = this;

        var types = this.constructor.types; // NOTE: Is there a performance cost to setting
        // each property individually?

        types.forEach(function (modelKlass) {
          _this2.data[modelKlass.type] = {
            records: {},
            cache: {}
          };
        });
      }
      /**
       * Wrapper around fetch applies user defined fetch options
       *
       * @method fetch
       * @param {String} url
       * @param {Object} options
       */

    }, {
      key: "fetch",
      value: function (_fetch) {
        function fetch(_x) {
          return _fetch.apply(this, arguments);
        }

        fetch.toString = function () {
          return _fetch.toString();
        };

        return fetch;
      }(function (url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var defaultFetchOptions = this.defaultFetchOptions;
        return fetch(url, _objectSpread({}, defaultFetchOptions, options));
      })
      /**
       * Gets type of collection from data observable
       *
       * @method getType
       * @param {String} type
       * @return {Object} observable type object structure
       */

    }, {
      key: "getType",
      value: function getType(type) {
        return this.data[type];
      }
      /**
       * Gets individual record from store
       *
       * @method getRecord
       * @param {String} type
       * @param {Number} id
       * @return {Object} record
       */

    }, {
      key: "getRecord",
      value: function getRecord(type, id) {
        var collection = this.getType(type);

        if (!collection) {
          throw new Error("Could not find a collection for type '".concat(type, "'"));
        }

        return collection.records[id];
      }
      /**
       * Gets records for type of collection from observable
       *
       * @method getRecords
       * @param {String} type
       * @return {Array} array of objects
       */

    }, {
      key: "getRecords",
      value: function getRecords(type) {
        return Object.values(this.getType(type).records);
      }
      /**
       * Gets records from store based on cached query
       *
       * @method getCachedRecords
       * @param {String} type
       * @param {Object} queryParams
       * @return {Array} array or records
       */

    }, {
      key: "getCachedRecords",
      value: function getCachedRecords(type, queryParams) {
        // Get the url the request would use
        var url = this.fetchUrl(type, queryParams); // Get the matching ids from the response

        var ids = this.getCachedIds(type, url); // Get the records matching the ids

        return this.getRecordsById(type, ids);
      }
      /**
       * Gets records from store based on cached query
       *
       * @method getCachedIds
       * @param {String} type
       * @param {String} url
       * @return {Array} array of ids
       */

    }, {
      key: "getCachedIds",
      value: function getCachedIds(type, url) {
        return this.getType(type).cache[url];
      }
      /**
       * Get multiple records by id
       *
       * @method getRecordsById
       * @param {String} type
       * @param {Array} ids
       * @return {Array} array or records
       */

    }, {
      key: "getRecordsById",
      value: function getRecordsById(type) {
        var _this3 = this;

        var ids = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        // NOTE: Is there a better way to do this?
        return ids.map(function (id) {
          return _this3.getRecord(type, id);
        }).filter(function (record) {
          return typeof record !== 'undefined';
        });
      }
      /**
       * Gets records all records or records
       * based on query params
       *
       * @method getMatchingRecords
       * @param {String} type
       * @param {Object} queryParams
       * @return {Array} array or records
       */

    }, {
      key: "getMatchingRecords",
      value: function getMatchingRecords(type, queryParams) {
        if (queryParams) {
          return this.getCachedRecords(type, queryParams);
        } else {
          return this.getRecords(type);
        }
      }
      /**
       * Helper to look up model class for type.
       *
       * @method getKlass
       * @param {String} type
       * @return {Class} model class
       */

    }, {
      key: "getKlass",
      value: function getKlass(type) {
        return this.modelTypeIndex[type];
      }
    }, {
      key: "createModelsFromData",
      value: function createModelsFromData(data) {
        var _this4 = this;

        var store = this;
        transaction$$1(function () {
          data.forEach(function (dataObject) {
            var attributes = dataObject.attributes,
                id = dataObject.id,
                relationships = dataObject.relationships,
                type = dataObject.type;

            var existingRecord = _this4.getRecord(type, id);

            if (existingRecord) {
              Object.keys(attributes).forEach(function (key) {
                existingRecord[key] = attributes[key];
                _this4.data[type].records[id] = existingRecord;
              });

              if (relationships) {
                Object.keys(relationships).forEach(function (key) {
                  existingRecord.relationships[key] = relationships[key];
                  _this4.data[type].records[id] = existingRecord;
                });
              }
            } else {
              var ModelKlass = _this4.modelTypeIndex[type];
              var record = new ModelKlass(_objectSpread({
                id: id,
                store: store,
                relationships: relationships
              }, attributes));
              _this4.data[type].records[record.id] = record;
            }
          });
        });
      }
      /**
       * Helper to create a new model
       *
       * @method createModel
       * @param {String} type
       * @param {Number} type
       * @param {Object} attributes
       * @return {Object} model instance
       */

    }, {
      key: "createModel",
      value: function createModel(type, id, data) {
        var attributes = data.attributes;
        var relationships = {};

        if (data.hasOwnProperty('relationships')) {
          relationships = data.relationships;
        }

        var store = this;
        var ModelKlass = this.getKlass(type);

        if (!ModelKlass) {
          throw new Error("Could not find a model for '".concat(type, "'"));
        }

        return new ModelKlass(_objectSpread({
          id: id,
          store: store,
          relationships: relationships
        }, attributes));
      }
      /**
       * Builds fetch url based
       *
       * @method fetchUrl
       * @param {String} type the type to find
       * @param {Object} options
       */

    }, {
      key: "fetchUrl",
      value: function fetchUrl(type, queryParams, id) {
        var baseUrl = this.baseUrl,
            modelTypeIndex = this.modelTypeIndex;
        var endpoint = modelTypeIndex[type].endpoint;
        return requestUrl(baseUrl, endpoint, queryParams, id);
      }
      /**
       * finds an instance by `id`. If available in the store, returns that instance. Otherwise, triggers a fetch.
       *
       * @method findAll
       * @param {String} type the type to find
       * @param {Object} options
       */

    }, {
      key: "fetchAll",
      value: function () {
        var _fetchAll = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(type, queryParams) {
          var _this5 = this;

          var url, response, json, records;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  url = this.fetchUrl(type, queryParams);
                  _context.next = 3;
                  return this.fetch(url);

                case 3:
                  response = _context.sent;

                  if (!(response.status === 200)) {
                    _context.next = 15;
                    break;
                  }

                  this.data[type].cache[url] = [];
                  _context.next = 8;
                  return response.json();

                case 8:
                  json = _context.sent;

                  if (json.included) {
                    this.createModelsFromData(json.included);
                  }

                  records = [];
                  transaction$$1(function () {
                    records = json.data.map(function (dataObject) {
                      var id = dataObject.id;
                      var attributes = dataObject.attributes,
                          relationships = dataObject.relationships;
                      var ModelKlass = _this5.modelTypeIndex[type];
                      var store = _this5;
                      var record = new ModelKlass(_objectSpread({
                        relationships: relationships,
                        store: store
                      }, attributes));

                      _this5.data[type].cache[url].push(id);

                      _this5.data[type].records[id] = record;
                      return record;
                    });
                  });
                  return _context.abrupt("return", records);

                case 15:
                  return _context.abrupt("return", Promise.reject(response.status));

                case 16:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function fetchAll(_x2, _x3) {
          return _fetchAll.apply(this, arguments);
        }

        return fetchAll;
      }()
      /**
       * fetches record by `id`.
       *
       * @async
       * @method fetchOne
       * @param {String} type the type to find
       * @param {String} id
       */

    }, {
      key: "fetchOne",
      value: function () {
        var _fetchOne = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2(type, id, options) {
          var queryParams, url, response, json, record;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  queryParams = options.queryParams;
                  url = this.fetchUrl(type, queryParams, id); // Trigger request

                  _context2.next = 4;
                  return this.fetch(url);

                case 4:
                  response = _context2.sent;

                  if (!(response.status === 200)) {
                    _context2.next = 17;
                    break;
                  }

                  _context2.next = 8;
                  return response.json();

                case 8:
                  json = _context2.sent;

                  if (json.included) {
                    this.createModelsFromData(json.included);
                  }

                  record = this.createModel(type, null, json.data); // Is this needed?

                  this.data[type].cache[url] = [];
                  this.data[type].cache[url].push(record.id);
                  this.data[type].records[record.id] = record;
                  return _context2.abrupt("return", record);

                case 17:
                  return _context2.abrupt("return", response.status);

                case 18:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function fetchOne(_x4, _x5, _x6) {
          return _fetchOne.apply(this, arguments);
        }

        return fetchOne;
      }()
      /**
       * Determines if an individual record should be
       * fetched or looked up in the store
       *
       * @method shouldFetchOne
       * @param {String} type the type to find
       * @param {String} id
       * @param {Object} options
       */

    }, {
      key: "shouldFetchOne",
      value: function shouldFetchOne(type, id, _ref) {
        var fromServer = _ref.fromServer;
        // If fromServer is true immediately return true
        if (fromServer === true) return true; // Check if matching record is in store
        // If fromServer is undefined and record is not found
        // return true

        return typeof fromServer === 'undefined' && !this.getRecord(type, id);
      }
    }]);

    return Store;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "data", [observable$$1], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return {};
    }
  })), _class);

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = _freeGlobal || freeSelf || Function('return this')();

  var _root = root;

  /** Built-in value references. */
  var Symbol$1 = _root.Symbol;

  var _Symbol = Symbol$1;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag$1 && symToStringTag$1 in Object(value))
      ? _getRawTag(value)
      : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

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
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject;

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
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
  function isFunction(value) {
    if (!isObject_1(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = _baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  var isFunction_1 = isFunction;

  /** Used to detect overreaching core-js shims. */
  var coreJsData = _root['__core-js_shared__'];

  var _coreJsData = coreJsData;

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  var _isMasked = isMasked;

  /** Used for built-in method references. */
  var funcProto = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  var _toSource = toSource;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype,
      objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
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
  function baseIsNative(value) {
    if (!isObject_1(value) || _isMasked(value)) {
      return false;
    }
    var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
    return pattern.test(_toSource(value));
  }

  var _baseIsNative = baseIsNative;

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  var _getValue = getValue;

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = _getValue(object, key);
    return _baseIsNative(value) ? value : undefined;
  }

  var _getNative = getNative;

  var defineProperty = (function() {
    try {
      var func = _getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }());

  var _defineProperty$1 = defineProperty;

  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function baseAssignValue(object, key, value) {
    if (key == '__proto__' && _defineProperty$1) {
      _defineProperty$1(object, key, {
        'configurable': true,
        'enumerable': true,
        'value': value,
        'writable': true
      });
    } else {
      object[key] = value;
    }
  }

  var _baseAssignValue = baseAssignValue;

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1,
          iterable = Object(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  var _createBaseFor = createBaseFor;

  /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseFor = _createBaseFor();

  var _baseFor = baseFor;

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  var _baseTimes = baseTimes;

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
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
  }

  var _baseIsArguments = baseIsArguments;

  /** Used for built-in method references. */
  var objectProto$3 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

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
  var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
    return isObjectLike_1(value) && hasOwnProperty$2.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };

  var isArguments_1 = isArguments;

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
  var isArray = Array.isArray;

  var isArray_1 = isArray;

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

  var isBuffer_1 = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? _root.Buffer : undefined;

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
  var isBuffer = nativeIsBuffer || stubFalse_1;

  module.exports = isBuffer;
  });

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

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
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;

    return !!length &&
      (type == 'number' ||
        (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length);
  }

  var _isIndex = isIndex;

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
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
  }

  var isLength_1 = isLength;

  /** `Object#toString` result references. */
  var argsTag$1 = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag$1 = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray(value) {
    return isObjectLike_1(value) &&
      isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
  }

  var _baseIsTypedArray = baseIsTypedArray;

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  var _baseUnary = baseUnary;

  var _nodeUtil = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && _freeGlobal.process;

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
  });

  /* Node.js helper references. */
  var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

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
  var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

  var isTypedArray_1 = isTypedArray;

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray_1(value),
        isArg = !isArr && isArguments_1(value),
        isBuff = !isArr && !isArg && isBuffer_1(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? _baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$3.call(value, key)) &&
          !(skipIndexes && (
             // Safari 9 has enumerable `arguments.length` in strict mode.
             key == 'length' ||
             // Node.js 0.10 has enumerable non-index properties on buffers.
             (isBuff && (key == 'offset' || key == 'parent')) ||
             // PhantomJS 2 has enumerable non-index properties on typed arrays.
             (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
             // Skip index properties.
             _isIndex(key, length)
          ))) {
        result.push(key);
      }
    }
    return result;
  }

  var _arrayLikeKeys = arrayLikeKeys;

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

    return value === proto;
  }

  var _isPrototype = isPrototype;

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  var _overArg = overArg;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeKeys = _overArg(Object.keys, Object);

  var _nativeKeys = nativeKeys;

  /** Used for built-in method references. */
  var objectProto$6 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeys(object) {
    if (!_isPrototype(object)) {
      return _nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$4.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }
    return result;
  }

  var _baseKeys = baseKeys;

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
  function isArrayLike(value) {
    return value != null && isLength_1(value.length) && !isFunction_1(value);
  }

  var isArrayLike_1 = isArrayLike;

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
  function keys(object) {
    return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
  }

  var keys_1 = keys;

  /**
   * The base implementation of `_.forOwn` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwn(object, iteratee) {
    return object && _baseFor(object, iteratee, keys_1);
  }

  var _baseForOwn = baseForOwn;

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  var _listCacheClear = listCacheClear;

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
  function eq$1(value, other) {
    return value === other || (value !== value && other !== other);
  }

  var eq_1 = eq$1;

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq_1(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  var _assocIndexOf = assocIndexOf;

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
  function listCacheDelete(key) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

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

  var _listCacheDelete = listCacheDelete;

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  var _listCacheGet = listCacheGet;

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return _assocIndexOf(this.__data__, key) > -1;
  }

  var _listCacheHas = listCacheHas;

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
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  var _listCacheSet = listCacheSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = _listCacheClear;
  ListCache.prototype['delete'] = _listCacheDelete;
  ListCache.prototype.get = _listCacheGet;
  ListCache.prototype.has = _listCacheHas;
  ListCache.prototype.set = _listCacheSet;

  var _ListCache = ListCache;

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new _ListCache;
    this.size = 0;
  }

  var _stackClear = stackClear;

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);

    this.size = data.size;
    return result;
  }

  var _stackDelete = stackDelete;

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  var _stackGet = stackGet;

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  var _stackHas = stackHas;

  /* Built-in method references that are verified to be native. */
  var Map$1 = _getNative(_root, 'Map');

  var _Map = Map$1;

  /* Built-in method references that are verified to be native. */
  var nativeCreate = _getNative(Object, 'create');

  var _nativeCreate = nativeCreate;

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
    this.size = 0;
  }

  var _hashClear = hashClear;

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
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  var _hashDelete = hashDelete;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$7 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (_nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty$5.call(data, key) ? data[key] : undefined;
  }

  var _hashGet = hashGet;

  /** Used for built-in method references. */
  var objectProto$8 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$6.call(data, key);
  }

  var _hashHas = hashHas;

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
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
    return this;
  }

  var _hashSet = hashSet;

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = _hashClear;
  Hash.prototype['delete'] = _hashDelete;
  Hash.prototype.get = _hashGet;
  Hash.prototype.has = _hashHas;
  Hash.prototype.set = _hashSet;

  var _Hash = Hash;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new _Hash,
      'map': new (_Map || _ListCache),
      'string': new _Hash
    };
  }

  var _mapCacheClear = mapCacheClear;

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  var _isKeyable = isKeyable;

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return _isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  var _getMapData = getMapData;

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = _getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  var _mapCacheDelete = mapCacheDelete;

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return _getMapData(this, key).get(key);
  }

  var _mapCacheGet = mapCacheGet;

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return _getMapData(this, key).has(key);
  }

  var _mapCacheHas = mapCacheHas;

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
  function mapCacheSet(key, value) {
    var data = _getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  var _mapCacheSet = mapCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = _mapCacheClear;
  MapCache.prototype['delete'] = _mapCacheDelete;
  MapCache.prototype.get = _mapCacheGet;
  MapCache.prototype.has = _mapCacheHas;
  MapCache.prototype.set = _mapCacheSet;

  var _MapCache = MapCache;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

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
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof _ListCache) {
      var pairs = data.__data__;
      if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new _MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }

  var _stackSet = stackSet;

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    var data = this.__data__ = new _ListCache(entries);
    this.size = data.size;
  }

  // Add methods to `Stack`.
  Stack.prototype.clear = _stackClear;
  Stack.prototype['delete'] = _stackDelete;
  Stack.prototype.get = _stackGet;
  Stack.prototype.has = _stackHas;
  Stack.prototype.set = _stackSet;

  var _Stack = Stack;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

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
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED$2);
    return this;
  }

  var _setCacheAdd = setCacheAdd;

  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */
  function setCacheHas(value) {
    return this.__data__.has(value);
  }

  var _setCacheHas = setCacheHas;

  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */
  function SetCache(values) {
    var index = -1,
        length = values == null ? 0 : values.length;

    this.__data__ = new _MapCache;
    while (++index < length) {
      this.add(values[index]);
    }
  }

  // Add methods to `SetCache`.
  SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
  SetCache.prototype.has = _setCacheHas;

  var _SetCache = SetCache;

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
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  var _arraySome = arraySome;

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  var _cacheHas = cacheHas;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

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
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
        arrLength = array.length,
        othLength = other.length;

    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index = -1,
        result = true,
        seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

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
        if (!_arraySome(other, function(othValue, othIndex) {
              if (!_cacheHas(seen, othIndex) &&
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

  var _equalArrays = equalArrays;

  /** Built-in value references. */
  var Uint8Array = _root.Uint8Array;

  var _Uint8Array = Uint8Array;

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  var _mapToArray = mapToArray;

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  var _setToArray = setToArray;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$1 = 1,
      COMPARE_UNORDERED_FLAG$1 = 2;

  /** `Object#toString` result references. */
  var boolTag$1 = '[object Boolean]',
      dateTag$1 = '[object Date]',
      errorTag$1 = '[object Error]',
      mapTag$1 = '[object Map]',
      numberTag$1 = '[object Number]',
      regexpTag$1 = '[object RegExp]',
      setTag$1 = '[object Set]',
      stringTag$1 = '[object String]',
      symbolTag = '[object Symbol]';

  var arrayBufferTag$1 = '[object ArrayBuffer]',
      dataViewTag$1 = '[object DataView]';

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = _Symbol ? _Symbol.prototype : undefined,
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
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag$1:
        if ((object.byteLength != other.byteLength) ||
            (object.byteOffset != other.byteOffset)) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;

      case arrayBufferTag$1:
        if ((object.byteLength != other.byteLength) ||
            !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
          return false;
        }
        return true;

      case boolTag$1:
      case dateTag$1:
      case numberTag$1:
        // Coerce booleans to `1` or `0` and dates to milliseconds.
        // Invalid dates are coerced to `NaN`.
        return eq_1(+object, +other);

      case errorTag$1:
        return object.name == other.name && object.message == other.message;

      case regexpTag$1:
      case stringTag$1:
        // Coerce regexes to strings and treat strings, primitives and objects,
        // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
        // for more details.
        return object == (other + '');

      case mapTag$1:
        var convert = _mapToArray;

      case setTag$1:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
        convert || (convert = _setToArray);

        if (object.size != other.size && !isPartial) {
          return false;
        }
        // Assume cyclic values are equal.
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG$1;

        // Recursively compare objects (susceptible to call stack limits).
        stack.set(object, other);
        var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack['delete'](object);
        return result;

      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }

  var _equalByTag = equalByTag;

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  var _arrayPush = arrayPush;

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
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
  }

  var _baseGetAllKeys = baseGetAllKeys;

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
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

  var _arrayFilter = arrayFilter;

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
  function stubArray() {
    return [];
  }

  var stubArray_1 = stubArray;

  /** Used for built-in method references. */
  var objectProto$9 = Object.prototype;

  /** Built-in value references. */
  var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols = Object.getOwnPropertySymbols;

  /**
   * Creates an array of the own enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return _arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable$1.call(object, symbol);
    });
  };

  var _getSymbols = getSymbols;

  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeys(object) {
    return _baseGetAllKeys(object, keys_1, _getSymbols);
  }

  var _getAllKeys = getAllKeys;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$2 = 1;

  /** Used for built-in method references. */
  var objectProto$a = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$7 = objectProto$a.hasOwnProperty;

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
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
        objProps = _getAllKeys(object),
        objLength = objProps.length,
        othProps = _getAllKeys(other),
        othLength = othProps.length;

    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty$7.call(other, key))) {
        return false;
      }
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) {
      return stacked == other;
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

  var _equalObjects = equalObjects;

  /* Built-in method references that are verified to be native. */
  var DataView = _getNative(_root, 'DataView');

  var _DataView = DataView;

  /* Built-in method references that are verified to be native. */
  var Promise$1 = _getNative(_root, 'Promise');

  var _Promise = Promise$1;

  /* Built-in method references that are verified to be native. */
  var Set$1 = _getNative(_root, 'Set');

  var _Set = Set$1;

  /* Built-in method references that are verified to be native. */
  var WeakMap = _getNative(_root, 'WeakMap');

  var _WeakMap = WeakMap;

  /** `Object#toString` result references. */
  var mapTag$2 = '[object Map]',
      objectTag$1 = '[object Object]',
      promiseTag = '[object Promise]',
      setTag$2 = '[object Set]',
      weakMapTag$1 = '[object WeakMap]';

  var dataViewTag$2 = '[object DataView]';

  /** Used to detect maps, sets, and weakmaps. */
  var dataViewCtorString = _toSource(_DataView),
      mapCtorString = _toSource(_Map),
      promiseCtorString = _toSource(_Promise),
      setCtorString = _toSource(_Set),
      weakMapCtorString = _toSource(_WeakMap);

  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  var getTag = _baseGetTag;

  // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
  if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
      (_Map && getTag(new _Map) != mapTag$2) ||
      (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
      (_Set && getTag(new _Set) != setTag$2) ||
      (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
    getTag = function(value) {
      var result = _baseGetTag(value),
          Ctor = result == objectTag$1 ? value.constructor : undefined,
          ctorString = Ctor ? _toSource(Ctor) : '';

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString: return dataViewTag$2;
          case mapCtorString: return mapTag$2;
          case promiseCtorString: return promiseTag;
          case setCtorString: return setTag$2;
          case weakMapCtorString: return weakMapTag$1;
        }
      }
      return result;
    };
  }

  var _getTag = getTag;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$3 = 1;

  /** `Object#toString` result references. */
  var argsTag$2 = '[object Arguments]',
      arrayTag$1 = '[object Array]',
      objectTag$2 = '[object Object]';

  /** Used for built-in method references. */
  var objectProto$b = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

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
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray_1(object),
        othIsArr = isArray_1(other),
        objTag = objIsArr ? arrayTag$1 : _getTag(object),
        othTag = othIsArr ? arrayTag$1 : _getTag(other);

    objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
    othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

    var objIsObj = objTag == objectTag$2,
        othIsObj = othTag == objectTag$2,
        isSameTag = objTag == othTag;

    if (isSameTag && isBuffer_1(object)) {
      if (!isBuffer_1(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new _Stack);
      return (objIsArr || isTypedArray_1(object))
        ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
        : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
      var objIsWrapped = objIsObj && hasOwnProperty$8.call(object, '__wrapped__'),
          othIsWrapped = othIsObj && hasOwnProperty$8.call(other, '__wrapped__');

      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object,
            othUnwrapped = othIsWrapped ? other.value() : other;

        stack || (stack = new _Stack);
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new _Stack);
    return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }

  var _baseIsEqualDeep = baseIsEqualDeep;

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
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
      return value !== value && other !== other;
    }
    return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }

  var _baseIsEqual = baseIsEqual;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$4 = 1,
      COMPARE_UNORDERED_FLAG$2 = 2;

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
  function baseIsMatch(object, source, matchData, customizer) {
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
        var stack = new _Stack;
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === undefined
              ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
              : result
            )) {
          return false;
        }
      }
    }
    return true;
  }

  var _baseIsMatch = baseIsMatch;

  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */
  function isStrictComparable(value) {
    return value === value && !isObject_1(value);
  }

  var _isStrictComparable = isStrictComparable;

  /**
   * Gets the property names, values, and compare flags of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the match data of `object`.
   */
  function getMatchData(object) {
    var result = keys_1(object),
        length = result.length;

    while (length--) {
      var key = result[length],
          value = object[key];

      result[length] = [key, value, _isStrictComparable(value)];
    }
    return result;
  }

  var _getMatchData = getMatchData;

  /**
   * A specialized version of `matchesProperty` for source values suitable
   * for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue &&
        (srcValue !== undefined || (key in Object(object)));
    };
  }

  var _matchesStrictComparable = matchesStrictComparable;

  /**
   * The base implementation of `_.matches` which doesn't clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatches(source) {
    var matchData = _getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || _baseIsMatch(object, source, matchData);
    };
  }

  var _baseMatches = baseMatches;

  /** `Object#toString` result references. */
  var symbolTag$1 = '[object Symbol]';

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
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$1);
  }

  var isSymbol_1 = isSymbol;

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
  function isKey(value, object) {
    if (isArray_1(value)) {
      return false;
    }
    var type = typeof value;
    if (type == 'number' || type == 'symbol' || type == 'boolean' ||
        value == null || isSymbol_1(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
      (object != null && value in Object(object));
  }

  var _isKey = isKey;

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
  function memoize(func, resolver) {
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
    memoized.cache = new (memoize.Cache || _MapCache);
    return memoized;
  }

  // Expose `MapCache`.
  memoize.Cache = _MapCache;

  var memoize_1 = memoize;

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
  function memoizeCapped(func) {
    var result = memoize_1(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });

    var cache = result.cache;
    return result;
  }

  var _memoizeCapped = memoizeCapped;

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
  var stringToPath = _memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46 /* . */) {
      result.push('');
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  });

  var _stringToPath = stringToPath;

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  var _arrayMap = arrayMap;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
      symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isArray_1(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return _arrayMap(value, baseToString) + '';
    }
    if (isSymbol_1(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  var _baseToString = baseToString;

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
    return value == null ? '' : _baseToString(value);
  }

  var toString_1 = toString$1;

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {Object} [object] The object to query keys on.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath(value, object) {
    if (isArray_1(value)) {
      return value;
    }
    return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
  }

  var _castPath = castPath;

  /** Used as references for various `Number` constants. */
  var INFINITY$1 = 1 / 0;

  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey(value) {
    if (typeof value == 'string' || isSymbol_1(value)) {
      return value;
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
  }

  var _toKey = toKey;

  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */
  function baseGet(object, path) {
    path = _castPath(path, object);

    var index = 0,
        length = path.length;

    while (object != null && index < length) {
      object = object[_toKey(path[index++])];
    }
    return (index && index == length) ? object : undefined;
  }

  var _baseGet = baseGet;

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
  function get(object, path, defaultValue) {
    var result = object == null ? undefined : _baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }

  var get_1 = get;

  /**
   * The base implementation of `_.hasIn` without support for deep paths.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {Array|string} key The key to check.
   * @returns {boolean} Returns `true` if `key` exists, else `false`.
   */
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }

  var _baseHasIn = baseHasIn;

  /**
   * Checks if `path` exists on `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @param {Function} hasFunc The function to check properties.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   */
  function hasPath(object, path, hasFunc) {
    path = _castPath(path, object);

    var index = -1,
        length = path.length,
        result = false;

    while (++index < length) {
      var key = _toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength_1(length) && _isIndex(key, length) &&
      (isArray_1(object) || isArguments_1(object));
  }

  var _hasPath = hasPath;

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
  function hasIn(object, path) {
    return object != null && _hasPath(object, path, _baseHasIn);
  }

  var hasIn_1 = hasIn;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$5 = 1,
      COMPARE_UNORDERED_FLAG$3 = 2;

  /**
   * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
   *
   * @private
   * @param {string} path The path of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatchesProperty(path, srcValue) {
    if (_isKey(path) && _isStrictComparable(srcValue)) {
      return _matchesStrictComparable(_toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get_1(object, path);
      return (objValue === undefined && objValue === srcValue)
        ? hasIn_1(object, path)
        : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
    };
  }

  var _baseMatchesProperty = baseMatchesProperty;

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
  function identity(value) {
    return value;
  }

  var identity_1 = identity;

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  var _baseProperty = baseProperty;

  /**
   * A specialized version of `baseProperty` which supports deep paths.
   *
   * @private
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyDeep(path) {
    return function(object) {
      return _baseGet(object, path);
    };
  }

  var _basePropertyDeep = basePropertyDeep;

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
  function property(path) {
    return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
  }

  var property_1 = property;

  /**
   * The base implementation of `_.iteratee`.
   *
   * @private
   * @param {*} [value=_.identity] The value to convert to an iteratee.
   * @returns {Function} Returns the iteratee.
   */
  function baseIteratee(value) {
    // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
    // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
    if (typeof value == 'function') {
      return value;
    }
    if (value == null) {
      return identity_1;
    }
    if (typeof value == 'object') {
      return isArray_1(value)
        ? _baseMatchesProperty(value[0], value[1])
        : _baseMatches(value);
    }
    return property_1(value);
  }

  var _baseIteratee = baseIteratee;

  /**
   * Creates an object with the same keys as `object` and values generated
   * by running each own enumerable string keyed property of `object` thru
   * `iteratee`. The iteratee is invoked with three arguments:
   * (value, key, object).
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Object
   * @param {Object} object The object to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Object} Returns the new mapped object.
   * @see _.mapKeys
   * @example
   *
   * var users = {
   *   'fred':    { 'user': 'fred',    'age': 40 },
   *   'pebbles': { 'user': 'pebbles', 'age': 1 }
   * };
   *
   * _.mapValues(users, function(o) { return o.age; });
   * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
   *
   * // The `_.property` iteratee shorthand.
   * _.mapValues(users, 'age');
   * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
   */
  function mapValues(object, iteratee) {
    var result = {};
    iteratee = _baseIteratee(iteratee, 3);

    _baseForOwn(object, function(value, key, object) {
      _baseAssignValue(result, key, iteratee(value, key, object));
    });
    return result;
  }

  var mapValues_1 = mapValues;

  /** Built-in value references. */
  var getPrototype = _overArg(Object.getPrototypeOf, Object);

  var _getPrototype = getPrototype;

  /** `Object#toString` result references. */
  var objectTag$3 = '[object Object]';

  /** Used for built-in method references. */
  var funcProto$2 = Function.prototype,
      objectProto$c = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$2 = funcProto$2.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$9 = objectProto$c.hasOwnProperty;

  /** Used to infer the `Object` constructor. */
  var objectCtorString = funcToString$2.call(Object);

  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */
  function isPlainObject(value) {
    if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag$3) {
      return false;
    }
    var proto = _getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty$9.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor &&
      funcToString$2.call(Ctor) == objectCtorString;
  }

  var isPlainObject_1 = isPlainObject;

  /**
   * Creates a `_.find` or `_.findLast` function.
   *
   * @private
   * @param {Function} findIndexFunc The function to find the collection index.
   * @returns {Function} Returns the new find function.
   */
  function createFind(findIndexFunc) {
    return function(collection, predicate, fromIndex) {
      var iterable = Object(collection);
      if (!isArrayLike_1(collection)) {
        var iteratee = _baseIteratee(predicate, 3);
        collection = keys_1(collection);
        predicate = function(key) { return iteratee(iterable[key], key, iterable); };
      }
      var index = findIndexFunc(collection, predicate, fromIndex);
      return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
    };
  }

  var _createFind = createFind;

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
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  var _baseFindIndex = baseFindIndex;

  /** Used as references for various `Number` constants. */
  var NAN = 0 / 0;

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g;

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
  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol_1(value)) {
      return NAN;
    }
    if (isObject_1(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject_1(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : (reIsBadHex.test(value) ? NAN : +value);
  }

  var toNumber_1 = toNumber;

  /** Used as references for various `Number` constants. */
  var INFINITY$2 = 1 / 0,
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
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber_1(value);
    if (value === INFINITY$2 || value === -INFINITY$2) {
      var sign = (value < 0 ? -1 : 1);
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }

  var toFinite_1 = toFinite;

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
  function toInteger(value) {
    var result = toFinite_1(value),
        remainder = result % 1;

    return result === result ? (remainder ? result - remainder : result) : 0;
  }

  var toInteger_1 = toInteger;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;

  /**
   * This method is like `_.find` except that it returns the index of the first
   * element `predicate` returns truthy for instead of the element itself.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the found element, else `-1`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'active': false },
   *   { 'user': 'fred',    'active': false },
   *   { 'user': 'pebbles', 'active': true }
   * ];
   *
   * _.findIndex(users, function(o) { return o.user == 'barney'; });
   * // => 0
   *
   * // The `_.matches` iteratee shorthand.
   * _.findIndex(users, { 'user': 'fred', 'active': false });
   * // => 1
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.findIndex(users, ['active', false]);
   * // => 0
   *
   * // The `_.property` iteratee shorthand.
   * _.findIndex(users, 'active');
   * // => 2
   */
  function findIndex(array, predicate, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : toInteger_1(fromIndex);
    if (index < 0) {
      index = nativeMax(length + index, 0);
    }
    return _baseFindIndex(array, _baseIteratee(predicate, 3), index);
  }

  var findIndex_1 = findIndex;

  /**
   * Iterates over elements of `collection`, returning the first element
   * `predicate` returns truthy for. The predicate is invoked with three
   * arguments: (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {*} Returns the matched element, else `undefined`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'age': 36, 'active': true },
   *   { 'user': 'fred',    'age': 40, 'active': false },
   *   { 'user': 'pebbles', 'age': 1,  'active': true }
   * ];
   *
   * _.find(users, function(o) { return o.age < 40; });
   * // => object for 'barney'
   *
   * // The `_.matches` iteratee shorthand.
   * _.find(users, { 'age': 1, 'active': true });
   * // => object for 'pebbles'
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.find(users, ['active', false]);
   * // => object for 'fred'
   *
   * // The `_.property` iteratee shorthand.
   * _.find(users, 'active');
   * // => object for 'barney'
   */
  var find = _createFind(findIndex_1);

  var find_1 = find;

  /**
   * This function is like `assignValue` except that it doesn't assign
   * `undefined` values.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignMergeValue(object, key, value) {
    if ((value !== undefined && !eq_1(object[key], value)) ||
        (value === undefined && !(key in object))) {
      _baseAssignValue(object, key, value);
    }
  }

  var _assignMergeValue = assignMergeValue;

  var _cloneBuffer = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? _root.Buffer : undefined,
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
  });

  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
    return result;
  }

  var _cloneArrayBuffer = cloneArrayBuffer;

  /**
   * Creates a clone of `typedArray`.
   *
   * @private
   * @param {Object} typedArray The typed array to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned typed array.
   */
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }

  var _cloneTypedArray = cloneTypedArray;

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function copyArray(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  var _copyArray = copyArray;

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
  var baseCreate = (function() {
    function object() {}
    return function(proto) {
      if (!isObject_1(proto)) {
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

  var _baseCreate = baseCreate;

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    return (typeof object.constructor == 'function' && !_isPrototype(object))
      ? _baseCreate(_getPrototype(object))
      : {};
  }

  var _initCloneObject = initCloneObject;

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
  function isArrayLikeObject(value) {
    return isObjectLike_1(value) && isArrayLike_1(value);
  }

  var isArrayLikeObject_1 = isArrayLikeObject;

  /**
   * Gets the value at `key`, unless `key` is "__proto__".
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function safeGet(object, key) {
    if (key == '__proto__') {
      return;
    }

    return object[key];
  }

  var _safeGet = safeGet;

  /** Used for built-in method references. */
  var objectProto$d = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$a = objectProto$d.hasOwnProperty;

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
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$a.call(object, key) && eq_1(objValue, value)) ||
        (value === undefined && !(key in object))) {
      _baseAssignValue(object, key, value);
    }
  }

  var _assignValue = assignValue;

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
  function copyObject(source, props, object, customizer) {
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
        _baseAssignValue(object, key, newValue);
      } else {
        _assignValue(object, key, newValue);
      }
    }
    return object;
  }

  var _copyObject = copyObject;

  /**
   * This function is like
   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * except that it includes inherited enumerable properties.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }

  var _nativeKeysIn = nativeKeysIn;

  /** Used for built-in method references. */
  var objectProto$e = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$b = objectProto$e.hasOwnProperty;

  /**
   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeysIn(object) {
    if (!isObject_1(object)) {
      return _nativeKeysIn(object);
    }
    var isProto = _isPrototype(object),
        result = [];

    for (var key in object) {
      if (!(key == 'constructor' && (isProto || !hasOwnProperty$b.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }

  var _baseKeysIn = baseKeysIn;

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
  function keysIn(object) {
    return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
  }

  var keysIn_1 = keysIn;

  /**
   * Converts `value` to a plain object flattening inherited enumerable string
   * keyed properties of `value` to own properties of the plain object.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Object} Returns the converted plain object.
   * @example
   *
   * function Foo() {
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.assign({ 'a': 1 }, new Foo);
   * // => { 'a': 1, 'b': 2 }
   *
   * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
   * // => { 'a': 1, 'b': 2, 'c': 3 }
   */
  function toPlainObject(value) {
    return _copyObject(value, keysIn_1(value));
  }

  var toPlainObject_1 = toPlainObject;

  /**
   * A specialized version of `baseMerge` for arrays and objects which performs
   * deep merges and tracks traversed objects enabling objects with circular
   * references to be merged.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {string} key The key of the value to merge.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} mergeFunc The function to merge values.
   * @param {Function} [customizer] The function to customize assigned values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = _safeGet(object, key),
        srcValue = _safeGet(source, key),
        stacked = stack.get(srcValue);

    if (stacked) {
      _assignMergeValue(object, key, stacked);
      return;
    }
    var newValue = customizer
      ? customizer(objValue, srcValue, (key + ''), object, source, stack)
      : undefined;

    var isCommon = newValue === undefined;

    if (isCommon) {
      var isArr = isArray_1(srcValue),
          isBuff = !isArr && isBuffer_1(srcValue),
          isTyped = !isArr && !isBuff && isTypedArray_1(srcValue);

      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray_1(objValue)) {
          newValue = objValue;
        }
        else if (isArrayLikeObject_1(objValue)) {
          newValue = _copyArray(objValue);
        }
        else if (isBuff) {
          isCommon = false;
          newValue = _cloneBuffer(srcValue, true);
        }
        else if (isTyped) {
          isCommon = false;
          newValue = _cloneTypedArray(srcValue, true);
        }
        else {
          newValue = [];
        }
      }
      else if (isPlainObject_1(srcValue) || isArguments_1(srcValue)) {
        newValue = objValue;
        if (isArguments_1(objValue)) {
          newValue = toPlainObject_1(objValue);
        }
        else if (!isObject_1(objValue) || isFunction_1(objValue)) {
          newValue = _initCloneObject(srcValue);
        }
      }
      else {
        isCommon = false;
      }
    }
    if (isCommon) {
      // Recursively merge objects and arrays (susceptible to call stack limits).
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack['delete'](srcValue);
    }
    _assignMergeValue(object, key, newValue);
  }

  var _baseMergeDeep = baseMergeDeep;

  /**
   * The base implementation of `_.merge` without support for multiple sources.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} [customizer] The function to customize merged values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    _baseFor(source, function(srcValue, key) {
      if (isObject_1(srcValue)) {
        stack || (stack = new _Stack);
        _baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
      }
      else {
        var newValue = customizer
          ? customizer(_safeGet(object, key), srcValue, (key + ''), object, source, stack)
          : undefined;

        if (newValue === undefined) {
          newValue = srcValue;
        }
        _assignMergeValue(object, key, newValue);
      }
    }, keysIn_1);
  }

  var _baseMerge = baseMerge;

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
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  var _apply = apply;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax$1 = Math.max;

  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */
  function overRest(func, start, transform) {
    start = nativeMax$1(start === undefined ? (func.length - 1) : start, 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax$1(args.length - start, 0),
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
      return _apply(func, this, otherArgs);
    };
  }

  var _overRest = overRest;

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
  function constant(value) {
    return function() {
      return value;
    };
  }

  var constant_1 = constant;

  /**
   * The base implementation of `setToString` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var baseSetToString = !_defineProperty$1 ? identity_1 : function(func, string) {
    return _defineProperty$1(func, 'toString', {
      'configurable': true,
      'enumerable': false,
      'value': constant_1(string),
      'writable': true
    });
  };

  var _baseSetToString = baseSetToString;

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
  function shortOut(func) {
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

  var _shortOut = shortOut;

  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var setToString = _shortOut(_baseSetToString);

  var _setToString = setToString;

  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */
  function baseRest(func, start) {
    return _setToString(_overRest(func, start, identity_1), func + '');
  }

  var _baseRest = baseRest;

  /**
   * Checks if the given arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
   *  else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject_1(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number'
          ? (isArrayLike_1(object) && _isIndex(index, object.length))
          : (type == 'string' && index in object)
        ) {
      return eq_1(object[index], value);
    }
    return false;
  }

  var _isIterateeCall = isIterateeCall;

  /**
   * Creates a function like `_.assign`.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */
  function createAssigner(assigner) {
    return _baseRest(function(object, sources) {
      var index = -1,
          length = sources.length,
          customizer = length > 1 ? sources[length - 1] : undefined,
          guard = length > 2 ? sources[2] : undefined;

      customizer = (assigner.length > 3 && typeof customizer == 'function')
        ? (length--, customizer)
        : undefined;

      if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? undefined : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }

  var _createAssigner = createAssigner;

  /**
   * This method is like `_.assign` except that it recursively merges own and
   * inherited enumerable string keyed properties of source objects into the
   * destination object. Source properties that resolve to `undefined` are
   * skipped if a destination value exists. Array and plain object properties
   * are merged recursively. Other objects and value types are overridden by
   * assignment. Source objects are applied from left to right. Subsequent
   * sources overwrite property assignments of previous sources.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 0.5.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var object = {
   *   'a': [{ 'b': 2 }, { 'd': 4 }]
   * };
   *
   * var other = {
   *   'a': [{ 'c': 3 }, { 'e': 5 }]
   * };
   *
   * _.merge(object, other);
   * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
   */
  var merge = _createAssigner(function(object, source, srcIndex) {
    _baseMerge(object, source, srcIndex);
  });

  var merge_1 = merge;

  /**
   * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
   * objects into destination objects that are passed thru.
   *
   * @private
   * @param {*} objValue The destination value.
   * @param {*} srcValue The source value.
   * @param {string} key The key of the property to merge.
   * @param {Object} object The parent object of `objValue`.
   * @param {Object} source The parent object of `srcValue`.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   * @returns {*} Returns the value to assign.
   */
  function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
    if (isObject_1(objValue) && isObject_1(srcValue)) {
      // Recursively merge objects and arrays (susceptible to call stack limits).
      stack.set(srcValue, objValue);
      _baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
      stack['delete'](srcValue);
    }
    return objValue;
  }

  var _customDefaultsMerge = customDefaultsMerge;

  /**
   * This method is like `_.merge` except that it accepts `customizer` which
   * is invoked to produce the merged values of the destination and source
   * properties. If `customizer` returns `undefined`, merging is handled by the
   * method instead. The `customizer` is invoked with six arguments:
   * (objValue, srcValue, key, object, source, stack).
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} sources The source objects.
   * @param {Function} customizer The function to customize assigned values.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function customizer(objValue, srcValue) {
   *   if (_.isArray(objValue)) {
   *     return objValue.concat(srcValue);
   *   }
   * }
   *
   * var object = { 'a': [1], 'b': [2] };
   * var other = { 'a': [3], 'b': [4] };
   *
   * _.mergeWith(object, other, customizer);
   * // => { 'a': [1, 3], 'b': [2, 4] }
   */
  var mergeWith = _createAssigner(function(object, source, srcIndex, customizer) {
    _baseMerge(object, source, srcIndex, customizer);
  });

  var mergeWith_1 = mergeWith;

  /**
   * This method is like `_.defaults` except that it recursively assigns
   * default properties.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 3.10.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @see _.defaults
   * @example
   *
   * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
   * // => { 'a': { 'b': 2, 'c': 3 } }
   */
  var defaultsDeep = _baseRest(function(args) {
    args.push(undefined, _customDefaultsMerge);
    return _apply(mergeWith_1, undefined, args);
  });

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  var _arrayEach = arrayEach;

  /**
   * An alternative to `_.reduce`; this method transforms `object` to a new
   * `accumulator` object which is the result of running each of its own
   * enumerable string keyed properties thru `iteratee`, with each invocation
   * potentially mutating the `accumulator` object. If `accumulator` is not
   * provided, a new object with the same `[[Prototype]]` will be used. The
   * iteratee is invoked with four arguments: (accumulator, value, key, object).
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @since 1.3.0
   * @category Object
   * @param {Object} object The object to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [accumulator] The custom accumulator value.
   * @returns {*} Returns the accumulated value.
   * @example
   *
   * _.transform([2, 3, 4], function(result, n) {
   *   result.push(n *= n);
   *   return n % 2 == 0;
   * }, []);
   * // => [4, 9]
   *
   * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
   *   (result[value] || (result[value] = [])).push(key);
   * }, {});
   * // => { '1': ['a', 'c'], '2': ['b'] }
   */
  function transform(object, iteratee, accumulator) {
    var isArr = isArray_1(object),
        isArrLike = isArr || isBuffer_1(object) || isTypedArray_1(object);

    iteratee = _baseIteratee(iteratee, 4);
    if (accumulator == null) {
      var Ctor = object && object.constructor;
      if (isArrLike) {
        accumulator = isArr ? new Ctor : [];
      }
      else if (isObject_1(object)) {
        accumulator = isFunction_1(Ctor) ? _baseCreate(_getPrototype(object)) : {};
      }
      else {
        accumulator = {};
      }
    }
    (isArrLike ? _arrayEach : _baseForOwn)(object, function(value, index, object) {
      return iteratee(accumulator, value, index, object);
    });
    return accumulator;
  }

  var transform_1 = transform;

  /**
   * The opposite of `_.mapValues`; this method creates an object with the
   * same values as `object` and keys generated by running each own enumerable
   * string keyed property of `object` thru `iteratee`. The iteratee is invoked
   * with three arguments: (value, key, object).
   *
   * @static
   * @memberOf _
   * @since 3.8.0
   * @category Object
   * @param {Object} object The object to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Object} Returns the new mapped object.
   * @see _.mapValues
   * @example
   *
   * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
   *   return key + value;
   * });
   * // => { 'a1': 1, 'b2': 2 }
   */
  function mapKeys(object, iteratee) {
    var result = {};
    iteratee = _baseIteratee(iteratee, 3);

    _baseForOwn(object, function(value, key, object) {
      _baseAssignValue(result, iteratee(value, key, object), value);
    });
    return result;
  }

  var mapKeys_1 = mapKeys;

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
  function baseSet(object, path, value, customizer) {
    if (!isObject_1(object)) {
      return object;
    }
    path = _castPath(path, object);

    var index = -1,
        length = path.length,
        lastIndex = length - 1,
        nested = object;

    while (nested != null && ++index < length) {
      var key = _toKey(path[index]),
          newValue = value;

      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : undefined;
        if (newValue === undefined) {
          newValue = isObject_1(objValue)
            ? objValue
            : (_isIndex(path[index + 1]) ? [] : {});
        }
      }
      _assignValue(nested, key, newValue);
      nested = nested[key];
    }
    return object;
  }

  var _baseSet = baseSet;

  /**
   * The base implementation of  `_.pickBy` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The source object.
   * @param {string[]} paths The property paths to pick.
   * @param {Function} predicate The function invoked per property.
   * @returns {Object} Returns the new object.
   */
  function basePickBy(object, paths, predicate) {
    var index = -1,
        length = paths.length,
        result = {};

    while (++index < length) {
      var path = paths[index],
          value = _baseGet(object, path);

      if (predicate(value, path)) {
        _baseSet(result, _castPath(path, object), value);
      }
    }
    return result;
  }

  var _basePickBy = basePickBy;

  /**
   * The base implementation of `_.pick` without support for individual
   * property identifiers.
   *
   * @private
   * @param {Object} object The source object.
   * @param {string[]} paths The property paths to pick.
   * @returns {Object} Returns the new object.
   */
  function basePick(object, paths) {
    return _basePickBy(object, paths, function(value, path) {
      return hasIn_1(object, path);
    });
  }

  var _basePick = basePick;

  /** Built-in value references. */
  var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

  /**
   * Checks if `value` is a flattenable `arguments` object or array.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
   */
  function isFlattenable(value) {
    return isArray_1(value) || isArguments_1(value) ||
      !!(spreadableSymbol && value && value[spreadableSymbol]);
  }

  var _isFlattenable = isFlattenable;

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
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1,
        length = array.length;

    predicate || (predicate = _isFlattenable);
    result || (result = []);

    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          // Recursively flatten arrays (susceptible to call stack limits).
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          _arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }

  var _baseFlatten = baseFlatten;

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
  function flatten(array) {
    var length = array == null ? 0 : array.length;
    return length ? _baseFlatten(array, 1) : [];
  }

  var flatten_1 = flatten;

  /**
   * A specialized version of `baseRest` which flattens the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @returns {Function} Returns the new function.
   */
  function flatRest(func) {
    return _setToString(_overRest(func, undefined, flatten_1), func + '');
  }

  var _flatRest = flatRest;

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
  var pick = _flatRest(function(object, paths) {
    return object == null ? {} : _basePick(object, paths);
  });

  var pick_1 = pick;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

  /**
   * Creates an array of the own and inherited enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbolsIn = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
    var result = [];
    while (object) {
      _arrayPush(result, _getSymbols(object));
      object = _getPrototype(object);
    }
    return result;
  };

  var _getSymbolsIn = getSymbolsIn;

  /**
   * Creates an array of own and inherited enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeysIn(object) {
    return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
  }

  var _getAllKeysIn = getAllKeysIn;

  /**
   * Creates an object composed of the `object` properties `predicate` returns
   * truthy for. The predicate is invoked with two arguments: (value, key).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The source object.
   * @param {Function} [predicate=_.identity] The function invoked per property.
   * @returns {Object} Returns the new object.
   * @example
   *
   * var object = { 'a': 1, 'b': '2', 'c': 3 };
   *
   * _.pickBy(object, _.isNumber);
   * // => { 'a': 1, 'c': 3 }
   */
  function pickBy(object, predicate) {
    if (object == null) {
      return {};
    }
    var props = _arrayMap(_getAllKeysIn(object), function(prop) {
      return [prop];
    });
    predicate = _baseIteratee(predicate);
    return _basePickBy(object, props, function(value, path) {
      return predicate(value, path[0]);
    });
  }

  var pickBy_1 = pickBy;

  /**
   * Creates a `baseEach` or `baseEachRight` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike_1(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length,
          index = fromRight ? length : -1,
          iterable = Object(collection);

      while ((fromRight ? index-- : ++index < length)) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }

  var _createBaseEach = createBaseEach;

  /**
   * The base implementation of `_.forEach` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   */
  var baseEach = _createBaseEach(_baseForOwn);

  var _baseEach = baseEach;

  /**
   * Casts `value` to `identity` if it's not a function.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {Function} Returns cast function.
   */
  function castFunction(value) {
    return typeof value == 'function' ? value : identity_1;
  }

  var _castFunction = castFunction;

  /**
   * Iterates over elements of `collection` and invokes `iteratee` for each element.
   * The iteratee is invoked with three arguments: (value, index|key, collection).
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * **Note:** As with other "Collections" methods, objects with a "length"
   * property are iterated like arrays. To avoid this behavior use `_.forIn`
   * or `_.forOwn` for object iteration.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @alias each
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   * @see _.forEachRight
   * @example
   *
   * _.forEach([1, 2], function(value) {
   *   console.log(value);
   * });
   * // => Logs `1` then `2`.
   *
   * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
   *   console.log(key);
   * });
   * // => Logs 'a' then 'b' (iteration order is not guaranteed).
   */
  function forEach(collection, iteratee) {
    var func = isArray_1(collection) ? _arrayEach : _baseEach;
    return func(collection, _castFunction(iteratee));
  }

  var forEach_1 = forEach;

  var each = forEach_1;

  /**
   * Checks if `value` is `undefined`.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
   * @example
   *
   * _.isUndefined(void 0);
   * // => true
   *
   * _.isUndefined(null);
   * // => false
   */

  var hasOwnProp = Object.prototype.hasOwnProperty;

  function hasProp(obj, key) {
    return hasOwnProp.call(obj, key);
  }

  var hasProp_1 = hasProp;

  var splice$1 = Array.prototype.splice;

  function remove(arr, elem) {
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === elem) {
         splice$1.call(arr, i, 1);
      }
    }
  }

  var remove_1 = remove;

  function icPart(str) {
    return str.split('').map(function(c) { return '(?:' + [c.toUpperCase(), c.toLowerCase()].join('|') + ')'; }).join('')
  }

  var icPart_1 = icPart;

  function Inflections() {
    this.plurals = [];
    this.singulars = [];
    this.uncountables = [];
    this.humans = [];
    this.acronyms = {};
    this.acronymRegex = /(?=a)b/;
  }

  Inflections.getInstance = function(locale) {
    var storage = typeof process !== 'undefined' ? process : commonjsGlobal;
    storage.__Inflector_Inflections = storage.__Inflector_Inflections || {};
    storage.__Inflector_Inflections[locale] = storage.__Inflector_Inflections[locale] || new Inflections();

    return storage.__Inflector_Inflections[locale];
  };

  Inflections.prototype.acronym = function(word) {
    this.acronyms[word.toLowerCase()] = word;

    var values = [];

    for (var key in this.acronyms) {
      if (hasProp_1(this.acronyms, key)) {
        values.push(this.acronyms[key]);
      }
    }

    this.acronymRegex = new RegExp(values.join('|'));
  };

  Inflections.prototype.plural = function(rule, replacement) {
    if (typeof rule === 'string') {
      remove_1(this.uncountables, rule);
    }

    remove_1(this.uncountables, replacement);
    this.plurals.unshift([rule, replacement]);
  };

  Inflections.prototype.singular = function(rule, replacement) {
    if (typeof rule === 'string') {
      remove_1(this.uncountables, rule);
    }

    remove_1(this.uncountables, replacement);
    this.singulars.unshift([rule, replacement]);
  };

  Inflections.prototype.irregular = function(singular, plural) {
    remove_1(this.uncountables, singular);
    remove_1(this.uncountables, plural);

    var s0 = singular[0];
    var sRest = singular.substr(1);

    var p0 = plural[0];
    var pRest = plural.substr(1);

    if (s0.toUpperCase() === p0.toUpperCase()) {
      this.plural(new RegExp('(' + s0 + ')' + sRest + '$', 'i'), '$1' + pRest);
      this.plural(new RegExp('(' + p0 + ')' + pRest + '$', 'i'), '$1' + pRest);

      this.singular(new RegExp('(' + s0 + ')' + sRest + '$', 'i'), '$1' + sRest);
      this.singular(new RegExp('(' + p0 + ')' + pRest + '$', 'i'), '$1' + sRest);
    } else {
      var sRestIC = icPart_1(sRest);
      var pRestIC = icPart_1(pRest);

      this.plural(new RegExp(s0.toUpperCase() + sRestIC + '$'), p0.toUpperCase() + pRest);
      this.plural(new RegExp(s0.toLowerCase() + sRestIC + '$'), p0.toLowerCase() + pRest);
      this.plural(new RegExp(p0.toUpperCase() + pRestIC + '$'), p0.toUpperCase() + pRest);
      this.plural(new RegExp(p0.toLowerCase() + pRestIC + '$'), p0.toLowerCase() + pRest);

      this.singular(new RegExp(s0.toUpperCase() + sRestIC + '$'), s0.toUpperCase() + sRest);
      this.singular(new RegExp(s0.toLowerCase() + sRestIC + '$'), s0.toLowerCase() + sRest);
      this.singular(new RegExp(p0.toUpperCase() + pRestIC + '$'), s0.toUpperCase() + sRest);
      this.singular(new RegExp(p0.toLowerCase() + pRestIC + '$'), s0.toLowerCase() + sRest);
    }
  };

  Inflections.prototype.uncountable = function() {
    var words = Array.prototype.slice.call(arguments, 0);
    this.uncountables = this.uncountables.concat(words);
  };

  Inflections.prototype.human = function(rule, replacement) {
    this.humans.unshift([rule, replacement]);
  };

  Inflections.prototype.clear = function(scope) {
    scope = scope || 'all';

    if (scope === 'all') {
      this.plurals = [];
      this.singulars = [];
      this.uncountables = [];
      this.humans = [];
    } else {
      this[scope] = [];
    }
  };

  var Inflections_1 = Inflections;

  var DEFAULT_APPROXIMATIONS = {
    'À': 'A',   'Á': 'A',   'Â': 'A',   'Ã': 'A',   'Ä': 'A',   'Å': 'A',   'Æ': 'AE',
    'Ç': 'C',   'È': 'E',   'É': 'E',   'Ê': 'E',   'Ë': 'E',   'Ì': 'I',   'Í': 'I',
    'Î': 'I',   'Ï': 'I',   'Ð': 'D',   'Ñ': 'N',   'Ò': 'O',   'Ó': 'O',   'Ô': 'O',
    'Õ': 'O',   'Ö': 'O',   '×': 'x',   'Ø': 'O',   'Ù': 'U',   'Ú': 'U',   'Û': 'U',
    'Ü': 'U',   'Ý': 'Y',   'Þ': 'Th',  'ß': 'ss',  'à': 'a',   'á': 'a',   'â': 'a',
    'ã': 'a',   'ä': 'a',   'å': 'a',   'æ': 'ae',  'ç': 'c',   'è': 'e',   'é': 'e',
    'ê': 'e',   'ë': 'e',   'ì': 'i',   'í': 'i',   'î': 'i',   'ï': 'i',   'ð': 'd',
    'ñ': 'n',   'ò': 'o',   'ó': 'o',   'ô': 'o',   'õ': 'o',   'ö': 'o',   'ø': 'o',
    'ù': 'u',   'ú': 'u',   'û': 'u',   'ü': 'u',   'ý': 'y',   'þ': 'th',  'ÿ': 'y',
    'Ā': 'A',   'ā': 'a',   'Ă': 'A',   'ă': 'a',   'Ą': 'A',   'ą': 'a',   'Ć': 'C',
    'ć': 'c',   'Ĉ': 'C',   'ĉ': 'c',   'Ċ': 'C',   'ċ': 'c',   'Č': 'C',   'č': 'c',
    'Ď': 'D',   'ď': 'd',   'Đ': 'D',   'đ': 'd',   'Ē': 'E',   'ē': 'e',   'Ĕ': 'E',
    'ĕ': 'e',   'Ė': 'E',   'ė': 'e',   'Ę': 'E',   'ę': 'e',   'Ě': 'E',   'ě': 'e',
    'Ĝ': 'G',   'ĝ': 'g',   'Ğ': 'G',   'ğ': 'g',   'Ġ': 'G',   'ġ': 'g',   'Ģ': 'G',
    'ģ': 'g',   'Ĥ': 'H',   'ĥ': 'h',   'Ħ': 'H',   'ħ': 'h',   'Ĩ': 'I',   'ĩ': 'i',
    'Ī': 'I',   'ī': 'i',   'Ĭ': 'I',   'ĭ': 'i',   'Į': 'I',   'į': 'i',   'İ': 'I',
    'ı': 'i',   'Ĳ': 'IJ',  'ĳ': 'ij',  'Ĵ': 'J',   'ĵ': 'j',   'Ķ': 'K',   'ķ': 'k',
    'ĸ': 'k',   'Ĺ': 'L',   'ĺ': 'l',   'Ļ': 'L',   'ļ': 'l',   'Ľ': 'L',   'ľ': 'l',
    'Ŀ': 'L',   'ŀ': 'l',   'Ł': 'L',   'ł': 'l',   'Ń': 'N',   'ń': 'n',   'Ņ': 'N',
    'ņ': 'n',   'Ň': 'N',   'ň': 'n',   'ŉ': '\'n', 'Ŋ': 'NG',  'ŋ': 'ng',
    'Ō': 'O',   'ō': 'o',   'Ŏ': 'O',   'ŏ': 'o',   'Ő': 'O',   'ő': 'o',   'Œ': 'OE',
    'œ': 'oe',  'Ŕ': 'R',   'ŕ': 'r',   'Ŗ': 'R',   'ŗ': 'r',   'Ř': 'R',   'ř': 'r',
    'Ś': 'S',   'ś': 's',   'Ŝ': 'S',   'ŝ': 's',   'Ş': 'S',   'ş': 's',   'Š': 'S',
    'š': 's',   'Ţ': 'T',   'ţ': 't',   'Ť': 'T',   'ť': 't',   'Ŧ': 'T',   'ŧ': 't',
    'Ũ': 'U',   'ũ': 'u',   'Ū': 'U',   'ū': 'u',   'Ŭ': 'U',   'ŭ': 'u',   'Ů': 'U',
    'ů': 'u',   'Ű': 'U',   'ű': 'u',   'Ų': 'U',   'ų': 'u',   'Ŵ': 'W',   'ŵ': 'w',
    'Ŷ': 'Y',   'ŷ': 'y',   'Ÿ': 'Y',   'Ź': 'Z',   'ź': 'z',   'Ż': 'Z',   'ż': 'z',
    'Ž': 'Z',   'ž': 'z'
  };

  var DEFAULT_REPLACEMENT_CHAR = '?';

  function Transliterator() {
    this.approximations = {};

    for (var c in DEFAULT_APPROXIMATIONS) {
      this.approximate(c, DEFAULT_APPROXIMATIONS[c]);
    }
  }

  Transliterator.getInstance = function(locale) {
    var storage = typeof process !== 'undefined' ? process : commonjsGlobal;
    storage.__Inflector_Transliterator = storage.__Inflector_Transliterator || {};
    storage.__Inflector_Transliterator[locale] = storage.__Inflector_Transliterator[locale] || new Transliterator();

    return storage.__Inflector_Transliterator[locale];
  };

  Transliterator.prototype.approximate = function(string, replacement) {
    this.approximations[string] = replacement;
  };

  Transliterator.prototype.transliterate = function(string, replacement) {
    var self = this;

    return string.replace(/[^\u0000-\u007f]/g, function(c) {
      return self.approximations[c] || replacement || DEFAULT_REPLACEMENT_CHAR;
    });
  };

  var Transliterator_1 = Transliterator;

  var Methods = {
    pluralize: function(word, locale) {
      locale = locale || 'en';

      return this._applyInflections(word, this.inflections(locale).plurals);
    },

    singularize: function(word, locale) {
      locale = locale || 'en';

      return this._applyInflections(word, this.inflections(locale).singulars);
    },

    camelize: function(term, uppercaseFirstLetter) {
      if (uppercaseFirstLetter === null || uppercaseFirstLetter === undefined) {
        uppercaseFirstLetter = true;
      }

      var result = '' + term, self = this;

      if (uppercaseFirstLetter) {
        result = result.replace(/^[a-z\d]*/, function(a) {
          return self.inflections().acronyms[a] || self.capitalize(a);
        });
      } else {
        result = result.replace(new RegExp('^(?:' + this.inflections().acronymRegex.source + '(?=\\b|[A-Z_])|\\w)'), function(a) {
          return a.toLowerCase();
        });
      }

      result = result.replace(/(?:_|(\/))([a-z\d]*)/gi, function(match, a, b, idx, string) {
        a || (a = '');
        return '' + a + (self.inflections().acronyms[b] || self.capitalize(b));
      });

      return result;
    },

    underscore: function(camelCasedWord) {
      var result = '' + camelCasedWord;

      result = result.replace(new RegExp('(?:([A-Za-z\\d])|^)(' + this.inflections().acronymRegex.source + ')(?=\\b|[^a-z])', 'g'), function(match, $1, $2) {
        return '' + ($1 || '') + ($1 ? '_' : '') + $2.toLowerCase();
      });

      result = result.replace(/([A-Z\d]+)([A-Z][a-z])/g, '$1_$2');
      result = result.replace(/([a-z\d])([A-Z])/g, '$1_$2');
      result = result.replace(/-/g, '_');

      return result.toLowerCase();
    },

    humanize: function(lowerCaseAndUnderscoredWord, options) {
      var result = '' + lowerCaseAndUnderscoredWord;
      var humans = this.inflections().humans;
      var human, rule, replacement;
      var self = this;

      options = options || {};

      if (options.capitalize === null || options.capitalize === undefined) {
        options.capitalize = true;
      }

      for (var i = 0, ii = humans.length; i < ii; i++) {
        human = humans[i];
        rule = human[0];
        replacement = human[1];

        if (rule.test && rule.test(result) || result.indexOf(rule) > -1) {
          result = result.replace(rule, replacement);
          break;
        }
      }

      result = result.replace(/_id$/, '');
      result = result.replace(/_/g, ' ');

      result = result.replace(/([a-z\d]*)/gi, function(match) {
        return self.inflections().acronyms[match] || match.toLowerCase();
      });

      if (options.capitalize) {
        result = result.replace(/^\w/, function(match) {
          return match.toUpperCase();
        });
      }

      return result;
    },

    capitalize: function(str) {
      var result = str === null || str === undefined ? '' : String(str);
      return result.charAt(0).toUpperCase() + result.slice(1);
    },

    titleize: function(word) {
      return this.humanize(this.underscore(word)).replace(/(^|[\s¿\/]+)([a-z])/g, function(match, boundary, letter, idx, string) {
        return match.replace(letter, letter.toUpperCase());
      });
    },

    tableize: function(className) {
      return this.pluralize(this.underscore(className));
    },

    classify: function(tableName) {
      return this.camelize(this.singularize(tableName.replace(/.*\./g, '')));
    },

    dasherize: function(underscoredWord) {
      return underscoredWord.replace(/_/g, '-');
    },

    foreignKey: function(className, separateWithUnderscore) {
      if (separateWithUnderscore === null || separateWithUnderscore === undefined) {
        separateWithUnderscore = true;
      }

      return this.underscore(className) + (separateWithUnderscore ? '_id' : 'id');
    },

    ordinal: function(number) {
      var absNumber = Math.abs(Number(number));
      var mod100 = absNumber % 100;

      if (mod100 === 11 || mod100 === 12 || mod100 === 13) {
        return 'th';
      } else {
        switch (absNumber % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      }
    },

    ordinalize: function(number) {
      return '' + number + this.ordinal(number);
    },

    transliterate: function(string, options) {
      options = options || {};

      var locale      = options.locale || 'en';
      var replacement = options.replacement || '?';

      return this.transliterations(locale).transliterate(string, replacement);
    },

    parameterize: function(string, options) {
      options = options || {};

      if (options.separator === undefined) {
        options.separator = '-';
      }

      if (options.separator === null) {
        options.separator = '';
      }

      // replace accented chars with their ascii equivalents
      var result = this.transliterate(string, options);

      result = result.replace(/[^a-z0-9\-_]+/ig, options.separator);

      if (options.separator.length) {
        var separatorRegex = new RegExp(options.separator);

        // no more than one of the separator in a row
        result = result.replace(new RegExp(separatorRegex.source + '{2,}'), options.separator);

        // remove leading/trailing separator
        result = result.replace(new RegExp('^' + separatorRegex.source + '|' + separatorRegex.source + '$', 'i'), '');
      }

      return result.toLowerCase();
    },

    _applyInflections: function(word, rules) {
      var result = '' + word, rule, regex, replacement;

      if (result.length === 0) {
        return result;
      } else {
        var match = result.toLowerCase().match(/\b\w+$/);

        if (match && this.inflections().uncountables.indexOf(match[0]) > -1) {
          return result;
        } else {
          for (var i = 0, ii = rules.length; i < ii; i++) {
            rule = rules[i];

            regex = rule[0];
            replacement = rule[1];

            if (result.match(regex)) {
              result = result.replace(regex, replacement);
              break;
            }
          }

          return result;
        }
      }
    }
  };

  var Methods_1 = Methods;

  function enDefaults(inflect) {
    inflect.plural(/$/, 's');
    inflect.plural(/s$/i, 's');
    inflect.plural(/^(ax|test)is$/i, '$1es');
    inflect.plural(/(octop|vir)us$/i, '$1i');
    inflect.plural(/(octop|vir)i$/i, '$1i');
    inflect.plural(/(alias|status)$/i, '$1es');
    inflect.plural(/(bu)s$/i, '$1ses');
    inflect.plural(/(buffal|tomat)o$/i, '$1oes');
    inflect.plural(/([ti])um$/i, '$1a');
    inflect.plural(/([ti])a$/i, '$1a');
    inflect.plural(/sis$/i, 'ses');
    inflect.plural(/(?:([^f])fe|([lr])f)$/i, '$1$2ves');
    inflect.plural(/(hive)$/i, '$1s');
    inflect.plural(/([^aeiouy]|qu)y$/i, '$1ies');
    inflect.plural(/(x|ch|ss|sh)$/i, '$1es');
    inflect.plural(/(matr|vert|ind)(?:ix|ex)$/i, '$1ices');
    inflect.plural(/^(m|l)ouse$/i, '$1ice');
    inflect.plural(/^(m|l)ice$/i, '$1ice');
    inflect.plural(/^(ox)$/i, '$1en');
    inflect.plural(/^(oxen)$/i, '$1');
    inflect.plural(/(quiz)$/i, '$1zes');

    inflect.singular(/s$/i, '');
    inflect.singular(/(ss)$/i, '$1');
    inflect.singular(/(n)ews$/i, '$1ews');
    inflect.singular(/([ti])a$/i, '$1um');
    inflect.singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, '$1sis');
    inflect.singular(/(^analy)(sis|ses)$/i, '$1sis');
    inflect.singular(/([^f])ves$/i, '$1fe');
    inflect.singular(/(hive)s$/i, '$1');
    inflect.singular(/(tive)s$/i, '$1');
    inflect.singular(/([lr])ves$/i, '$1f');
    inflect.singular(/([^aeiouy]|qu)ies$/i, '$1y');
    inflect.singular(/(s)eries$/i, '$1eries');
    inflect.singular(/(m)ovies$/i, '$1ovie');
    inflect.singular(/(x|ch|ss|sh)es$/i, '$1');
    inflect.singular(/^(m|l)ice$/i, '$1ouse');
    inflect.singular(/(bus)(es)?$/i, '$1');
    inflect.singular(/(o)es$/i, '$1');
    inflect.singular(/(shoe)s$/i, '$1');
    inflect.singular(/(cris|test)(is|es)$/i, '$1is');
    inflect.singular(/^(a)x[ie]s$/i, '$1xis');
    inflect.singular(/(octop|vir)(us|i)$/i, '$1us');
    inflect.singular(/(alias|status)(es)?$/i, '$1');
    inflect.singular(/^(ox)en/i, '$1');
    inflect.singular(/(vert|ind)ices$/i, '$1ex');
    inflect.singular(/(matr)ices$/i, '$1ix');
    inflect.singular(/(quiz)zes$/i, '$1');
    inflect.singular(/(database)s$/i, '$1');

    inflect.irregular('person', 'people');
    inflect.irregular('man', 'men');
    inflect.irregular('child', 'children');
    inflect.irregular('sex', 'sexes');
    inflect.irregular('move', 'moves');
    inflect.irregular('zombie', 'zombies');

    inflect.uncountable('equipment', 'information', 'rice', 'money', 'species', 'series', 'fish', 'sheep', 'jeans', 'police');
  }

  var defaults = {
    en: enDefaults
  };

  var toString$2 = Object.prototype.toString;

  function isFunc(obj) {
    return toString$2.call(obj) === '[object Function]';
  }

  var isFunc_1 = isFunc;

  var Inflector = Methods_1;

  Inflector.inflections = function(locale, fn) {
    if (isFunc_1(locale)) {
      fn = locale;
      locale = null;
    }

    locale = locale || 'en';

    if (fn) {
      fn(Inflections_1.getInstance(locale));
    } else {
      return Inflections_1.getInstance(locale);
    }
  };

  Inflector.transliterations = function(locale, fn) {
    if (isFunc_1(locale)) {
      fn = locale;
      locale = null;
    }

    locale = locale || 'en';

    if (fn) {
      fn(Transliterator_1.getInstance(locale));
    } else {
      return Transliterator_1.getInstance(locale);
    }
  };

  for (var locale in defaults) {
    Inflector.inflections(locale, defaults[locale]);
  }

  var Inflector_1 = Inflector;

  var inflected = Inflector_1;

  var inflector = {
    caserize: function (attribute, opts) {
      attribute = inflected.underscore(attribute);

      switch (opts.keyForAttribute) {
        case 'dash-case':
        case 'lisp-case':
        case 'spinal-case':
        case 'kebab-case':
          return inflected.dasherize(attribute);
        case 'underscore_case':
        case 'snake_case':
          return attribute;
        case 'CamelCase':
          return inflected.camelize(attribute);
        case 'camelCase':
          return inflected.camelize(attribute, false);
        default:
          return inflected.dasherize(attribute);
      }
    },
    pluralize: function (type) {
      return inflected.pluralize(type);
    }
  };

  var serializerUtils = function (collectionName, record, payload, opts) {
    function isComplexType(obj) {
      return Array.isArray(obj) || isPlainObject_1(obj);
    }

    function keyForAttribute(attribute) {
      if (isPlainObject_1(attribute)) {
        return transform_1(attribute, function (result, value, key) {
          if (isComplexType(value)) {
            result[keyForAttribute(key)] = keyForAttribute(value);
          } else {
            result[keyForAttribute(key)] = value;
          }
        });
      } else if (Array.isArray(attribute)) {
        return attribute.map(function (attr) {
          if (isComplexType(attr)) {
            return keyForAttribute(attr);
          } else {
            return attr;
          }
        });
      } else {
        if (isFunction_1(opts.keyForAttribute)) {
          return opts.keyForAttribute(attribute);
        } else {
          return inflector.caserize(attribute, opts);
        }
      }
    }

    function getId() {
      return opts.id || 'id';
    }

    function getRef(current, item, opts) {
      if (isFunction_1(opts.ref)) {
        return opts.ref(current, item);
      } else if (opts.ref === true) {
        if (Array.isArray(item)) {
          return item.map(function (val) {
            return String(val);
          });
        } else if (item) {
          return String(item);
        }
      } else if (item && item[opts.ref]){
        return String(item[opts.ref]);
      }
    }

    function getType(str, attrVal) {
      var type;
      attrVal = attrVal || {};

      if (isFunction_1(opts.typeForAttribute)) {
        type = opts.typeForAttribute(str, attrVal);
      }

      // If the pluralize option is on, typeForAttribute returned undefined or wasn't used
      if ((opts.pluralizeType === undefined || opts.pluralizeType) && type === undefined) {
        type = inflector.pluralize(str);
      }

      if (type === undefined) {
        type = str;
      }

      return type;
    }

    function getLinks(current, links, dest) {
      return mapValues_1(links, function (value) {
        if (isFunction_1(value)) {
          return value(record, current, dest);
        } else {
          return value;
        }
      });
    }

    function getMeta(current, meta) {
      if (isFunction_1(meta)) {
          return meta(record);
      } else {
        return mapValues_1(meta, function (value) {
          if (isFunction_1(value)) {
            return value(record, current);
          } else {
            return value;
          }
        });
      }
    }

    function pick(obj, attributes) {
      return mapKeys_1(pick_1(obj, attributes), function (value, key) {
        return keyForAttribute(key);
      });
    }

    function isCompoundDocumentIncluded(included, item) {
      return find_1(payload.included, { id: item.id, type: item.type });
    }

    function pushToIncluded(dest, include) {
      var included = isCompoundDocumentIncluded(dest, include);
      if (included) {
        // Merge relationships
        included.relationships = merge_1(included.relationships,
          pickBy_1(include.relationships, identity_1));

        // Merge attributes
        included.attributes = merge_1(included.attributes,
          pickBy_1(include.attributes, identity_1));
      } else {
        if (!dest.included) { dest.included = []; }
        dest.included.push(include);
      }
    }

    this.serialize = function (dest, current, attribute, opts) {
      var that = this;
      var data = null;

      if (opts && opts.ref) {
        if (!dest.relationships) { dest.relationships = {}; }

        if (Array.isArray(current[attribute])) {
          data = current[attribute].map(function (item) {
            return that.serializeRef(item, current, attribute, opts);
          });
        } else {
          data = that.serializeRef(current[attribute], current, attribute,
            opts);
        }

        dest.relationships[keyForAttribute(attribute)] = {};
        if (!opts.ignoreRelationshipData) {
          dest.relationships[keyForAttribute(attribute)].data = data;
        }

        if (opts.relationshipLinks) {
          var links = getLinks(current[attribute], opts.relationshipLinks, dest);
          if (links.related) {
            dest.relationships[keyForAttribute(attribute)].links = links;
          }
        }

        if (opts.relationshipMeta) {
          dest.relationships[keyForAttribute(attribute)].meta =
            getMeta(current[attribute], opts.relationshipMeta);
        }
      } else {
        if (Array.isArray(current[attribute])) {
          if (current[attribute].length && isPlainObject_1(current[attribute][0])) {
            data = current[attribute].map(function (item) {
              return that.serializeNested(item, current, attribute, opts);
            });
          } else {
            data = current[attribute];
          }

          dest.attributes[keyForAttribute(attribute)] = data;
        } else if (isPlainObject_1(current[attribute])) {
          data = that.serializeNested(current[attribute], current, attribute, opts);
          dest.attributes[keyForAttribute(attribute)] = data;
        } else {
          dest.attributes[keyForAttribute(attribute)] = current[attribute];
        }
      }
    };

    this.serializeRef = function (dest, current, attribute, opts) {
      var that = this;
      var id = getRef(current, dest, opts);
      var type = getType(attribute, dest);

      var relationships = [];
      var includedAttrs = [];

      if (opts.attributes) {
        if (dest) {
          opts.attributes.forEach(function (attr) {
            if (opts[attr] && !dest[attr] && opts[attr].nullIfMissing) {
              dest[attr] = null;
            }
          });
        }
        relationships = opts.attributes.filter(function (attr) {
          return opts[attr];
        });

        includedAttrs = opts.attributes.filter(function (attr) {
          return !opts[attr];
        });
      }

      var included = { type: type, id: id };
      if (includedAttrs) { included.attributes = pick(dest, includedAttrs); }

      relationships.forEach(function (relationship) {
        if (dest && (isComplexType(dest[relationship]) || dest[relationship] === null)) {
          that.serialize(included, dest, relationship, opts[relationship]);
        }
      });

      if (includedAttrs.length &&
        (opts.included === undefined || opts.included)) {
        if (opts.includedLinks) {
          included.links = getLinks(dest, opts.includedLinks);
        }

        if (typeof id !== 'undefined') { pushToIncluded(payload, included); }
      }

      return typeof id !== 'undefined' ? { type: type, id: id } : null;
    };

    this.serializeNested = function (dest, current, attribute, opts) {
      var that = this;

      var embeds = [];
      var attributes = [];

      if (opts && opts.attributes) {
        embeds = opts.attributes.filter(function (attr) {
          return opts[attr];
        });

        attributes = opts.attributes.filter(function (attr) {
          return !opts[attr];
        });
      } else {
        attributes = keys_1(dest);
      }

      var ret = {};
      if (attributes) { ret.attributes = pick(dest, attributes); }

      embeds.forEach(function (embed) {
        if (isComplexType(dest[embed])) {
          that.serialize(ret, dest, embed, opts[embed]);
        }
      });

      return ret.attributes;
    };

    this.perform = function () {
      var that = this;

      if( record === null ){
          return null;
      }

      // If option is present, transform record
      if (opts && opts.transform) {
        record = opts.transform(record);
      }

      // Top-level data.
      var data = { type: getType(collectionName, record) };
      if (record[getId()]) { data.id = String(record[getId()]); }

      // Data links.
      if (opts.dataLinks) {
        data.links = getLinks(record, opts.dataLinks);
      }

      // Data meta
      if (opts.dataMeta) {
        data.meta = getMeta(record, opts.dataMeta);
      }

      each(opts.attributes, function (attribute) {
        var splittedAttributes = attribute.split(':');

        if (opts[attribute] && !record[attribute] && opts[attribute].nullIfMissing) {
          record[attribute] = null;
        }

        if (splittedAttributes[0] in record) {
          if (!data.attributes) { data.attributes = {}; }

          var attributeMap = attribute;
          if (splittedAttributes.length > 1) {
            attribute = splittedAttributes[0];
            attributeMap = splittedAttributes[1];
          }

          that.serialize(data, record, attribute, opts[attributeMap]);
        }
      });

      return data;
    };
  };

  var serializer = function (collectionName, records, opts) {
    this.serialize = function (records) {
      var that = this;
      var payload = {};

      function getLinks(links) {
        return mapValues_1(links, function (value) {
          if (isFunction_1(value)) {
            return value(records);
          } else {
            return value;
          }
        });
      }

      function collection() {
        payload.data = [];

        records.forEach(function (record) {
          var serializerUtils$1 = new serializerUtils(that.collectionName, record,
            payload, that.opts);
          payload.data.push(serializerUtils$1.perform());
        });

        return payload;
      }

      function resource() {
        payload.data = new serializerUtils(that.collectionName, records, payload,
          that.opts).perform(records);

        return payload;
      }

      if (that.opts.topLevelLinks) {
        payload.links = getLinks(that.opts.topLevelLinks);
      }

      if (that.opts.meta) {
        payload.meta = mapValues_1(that.opts.meta, function (value) {
          if (isFunction_1(value)) {
            return value(records);
          } else {
            return value;
          }
        });
      }

      if (Array.isArray(records)) {
        return collection(records);
      } else {
        return resource(records);
      }
    };

    if (arguments.length === 3) {
      // legacy behavior
      this.collectionName = collectionName;
      this.opts = opts;
      return this.serialize(records);
    } else {
      // treat as a reusable serializer
      this.collectionName = collectionName;
      this.opts = records;
    }
  };

  /**
   * This method is like `_.assign` except that it iterates over own and
   * inherited source properties.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @alias extend
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @see _.assign
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * function Bar() {
   *   this.c = 3;
   * }
   *
   * Foo.prototype.b = 2;
   * Bar.prototype.d = 4;
   *
   * _.assignIn({ 'a': 0 }, new Foo, new Bar);
   * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
   */
  var assignIn = _createAssigner(function(object, source) {
    _copyObject(source, keysIn_1(source), object);
  });

  var assignIn_1 = assignIn;

  var extend = assignIn_1;

  /**
   * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
   * it's created. Arrays are created for missing index properties while objects
   * are created for all other missing properties. Use `_.setWith` to customize
   * `path` creation.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Object
   * @param {Object} object The object to modify.
   * @param {Array|string} path The path of the property to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.set(object, 'a[0].b.c', 4);
   * console.log(object.a[0].b.c);
   * // => 4
   *
   * _.set(object, ['x', '0', 'y', 'z'], 5);
   * console.log(object.x[0].y.z);
   * // => 5
   */
  function set(object, path, value) {
    return object == null ? object : _baseSet(object, path, value);
  }

  var set_1 = set;

  var deserializerUtils = function (jsonapi, data, opts) {
    var alreadyIncluded = {};

    function isComplexType(obj) {
      return Array.isArray(obj) || isPlainObject_1(obj);
    }

    function getValueForRelationship(relationshipData, included) {
      if (opts && relationshipData && opts[relationshipData.type]) {
        var valueForRelationshipFct = opts[relationshipData.type]
          .valueForRelationship;

        return valueForRelationshipFct(relationshipData, included);
      } else {
        return included;
      }
    }

    function findIncluded(relationshipData, relationshipName, from) {
      return new Promise(function (resolve) {
        if (!jsonapi.included || !relationshipData) { return resolve(null); }

        var included = find_1(jsonapi.included, {
          id: relationshipData.id,
          type: relationshipData.type
        });

        var path = [
          from.type,
          from.id,
          relationshipName,
          relationshipData.type,
          relationshipData.id,
        ];

        // Check if the include is already processed (prevent circular
        // references).
        if (get_1(alreadyIncluded, path, false)) {
          return resolve(null);
        } else {
          merge_1(alreadyIncluded, set_1({}, path, true));
        }

        if (included) {
          return Promise
            .all([extractAttributes(included), extractRelationships(included)])
            .then(function (results) {
              var attributes = results[0];
              var relationships = results[1];
              resolve(extend(attributes, relationships));
            });
        } else {
          return resolve(null);
        }
      });
    }

    function keyForAttribute(attribute) {
      if (isPlainObject_1(attribute)) {
        return transform_1(attribute, function (result, value, key) {
          if (isComplexType(value)) {
            result[keyForAttribute(key)] = keyForAttribute(value);
          } else {
            result[keyForAttribute(key)] = value;
          }
        });
      } else if (Array.isArray(attribute)) {
        return attribute.map(function (attr) {
          if (isComplexType(attr)) {
            return keyForAttribute(attr);
          } else {
            return attr;
          }
        });
      } else {
        if (isFunction_1(opts.keyForAttribute)) {
          return opts.keyForAttribute(attribute);
        } else {
          return inflector.caserize(attribute, opts);
        }
      }
    }

    function extractAttributes(from) {
      var dest = keyForAttribute(from.attributes || {});
      if ('id' in from) { dest[opts.id || 'id'] = from.id; }

      if (opts.typeAsAttribute) {
        if ('type' in from) { dest.type = from.type; }
      }
      if ('meta' in from) { dest.meta = keyForAttribute(from.meta || {}); }

      return dest;
    }

    function extractRelationships(from) {
      if (!from.relationships) { return; }

      var dest = {};

      return Promise
        .all(Object.keys(from.relationships).map(function (key) {
          var relationship = from.relationships[key];

          if (relationship.data === null) {
            dest[keyForAttribute(key)] = null;
          } else if (Array.isArray(relationship.data)) {
            return Promise
              .all(relationship.data.map(function (relationshipData) {
                return extractIncludes(relationshipData, key, from);
              }))
              .then(function (includes) {
                if (includes) { dest[keyForAttribute(key)] = includes; }
              });
          } else {
            return extractIncludes(relationship.data, key, from)
              .then(function (include) {
                if (include) { dest[keyForAttribute(key)] = include; }
              });
          }
        }))
        .then(function() {
          return dest;
        });
    }

    function extractIncludes(relationshipData, relationshipName, from) {
      return findIncluded(relationshipData, relationshipName, from)
        .then(function (included) {
          var valueForRelationship = getValueForRelationship(relationshipData,
            included);

          if (valueForRelationship && isFunction_1(valueForRelationship.then)) {
            return valueForRelationship.then(function (value) {
              return value;
            });
          } else {
            return valueForRelationship;
          }
        });
    }

    this.perform = function () {
      return Promise
        .all([extractAttributes(data), extractRelationships(data)])
        .then(function (results) {
          var attributes = results[0];
          var relationships = results[1];
          var record = extend(attributes, relationships);

          // Links
          if (jsonapi.links) {
            record.links = jsonapi.links;
          }


          // If option is present, transform record
          if (opts && opts.transform) {
            record = opts.transform(record);
          }

          return record;
        });
    };
  };

  var deserializer = function (opts) {
    if (!opts) { opts = {}; }

    this.deserialize = function (jsonapi, callback) {
      function collection() {
        return Promise
          .all(jsonapi.data.map(function (d) {
            return new deserializerUtils(jsonapi, d, opts).perform();
          }))
          .then(function (result) {
            if (isFunction_1(callback)) {
              callback(null, result);
            }

            return result
          });
      }

      function resource() {
        return new deserializerUtils(jsonapi, jsonapi.data, opts)
          .perform()
          .then(function (result) {
            if (isFunction_1(callback)) {
              callback(null, result);
            }

            return result
          });
      }

      if (Array.isArray(jsonapi.data)) {
        return collection();
      } else {
        return resource();
      }
    };
  };

  var errorUtils = function (errors) {
    var jsonapi = {
      errors: []
    };

    errors.forEach(function (error) {
      var opts = {};

      if (error.id) { opts.id = error.id; }
      if (error.status) { opts.status = error.status; }
      if (error.code) { opts.code = error.code; }
      if (error.title) { opts.title = error.title; }
      if (error.detail) { opts.detail = error.detail; }

      if (error.source) {
        opts.source = {};

        if (error.source.pointer) {
          opts.source.pointer =  error.source.pointer;
        }

        if (error.source.parameter) {
          opts.source.parameter =  error.source.parameter;
        }
      }

      if (error.links) {
        opts.links = { about: error.links.about };
      }

      if (error.meta) {
        opts.meta = error.meta;
      }

      jsonapi.errors.push(opts);
    });

    return jsonapi;
  };

  var error = function (opts) {
    if (!opts) { opts = []; }

    if (Array.isArray(opts)) {
      return new errorUtils(opts);
    } else {
      return new errorUtils([opts]);
    }
  };

  var jsonapiSerializer = {
    Serializer: serializer,
    Deserializer: deserializer,
    Error: error,
  };
  var jsonapiSerializer_1 = jsonapiSerializer.Serializer;

  function ObjectPromiseProxy(promise, target) {
    target.isInFlight = true;
    var result = promise.then(
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(response) {
        var json, _json$data, attributes, relationships;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(response.status === 200 || response.status === 201)) {
                  _context.next = 9;
                  break;
                }

                _context.next = 3;
                return response.json();

              case 3:
                json = _context.sent;
                // Update target model
                _json$data = json.data, attributes = _json$data.attributes, relationships = _json$data.relationships;
                transaction$$1(function () {
                  Object.keys(attributes).forEach(function (key) {
                    target[key] = attributes[key];
                  });

                  if (relationships) {
                    Object.keys(relationships).forEach(function (key) {
                      if (!relationships[key].hasOwnProperty('meta')) {
                        target.relationships[key] = relationships[key];
                      }
                    });
                  }

                  if (json.included) {
                    target.store.createModelsFromData(json.included);
                  } // Update target isInFlight


                  target.isInFlight = false;
                });
                return _context.abrupt("return", target);

              case 9:
                target.errors = {
                  status: response.status
                };
                return _context.abrupt("return", target);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }(), function (error) {
      // TODO: Handle error states correctly
      target.isInFlight = false;
      target.errors = error;
      throw error; // return target
    }); // Define proxied attributes

    var attributeNames = Object.keys(target.attributeNames);
    var tempProperties = attributeNames.reduce(function (attrs, key) {
      attrs[key] = {
        value: target[key],
        writable: false
      };
      return attrs;
    }, {});
    Object.defineProperties(result, _objectSpread({
      isInFlight: {
        value: target.isInFlight
      }
    }, tempProperties)); // Return promise

    return result;
  }

  /**
   * Utility class used to store the schema
   * of model attribute definitions
   *
   * @class Schema
   */
  var Schema =
  /*#__PURE__*/
  function () {
    function Schema() {
      _classCallCheck(this, Schema);

      this.structure = {};
    }

    _createClass(Schema, [{
      key: "addAttribute",
      value: function addAttribute(_ref) {
        var type = _ref.type,
            property = _ref.property,
            dataType = _ref.dataType,
            defaultValue = _ref.defaultValue;
        this.structure[type] = this.structure[type] || {};
        this.structure[type][property] = {
          defaultValue: defaultValue,
          dataType: dataType
        };
      }
    }]);

    return Schema;
  }();

  var schema = new Schema();

  var _class$1, _descriptor$1, _temp$1;
  /**
   * Helper method for apply the correct defaults to attributes.
   * @method defaultValueForDescriptor
   */

  function defaultValueForDescriptor(descriptor, DataType) {
    if (typeof descriptor.initializer === 'function') {
      var value = descriptor.initializer();

      if (DataType.name === 'Date') {
        return new DataType(value);
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
   *   @attribute(Date) start_time = moment()
   * }
   * ```
   * @method attribute
   */


  function attribute() {
    var dataType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (obj) {
      return obj;
    };
    return function (target, property, descriptor) {
      var type = target.constructor.type;
      var defaultValue = defaultValueForDescriptor(descriptor, dataType); // Update the schema

      schema.addAttribute({
        dataType: dataType,
        defaultValue: defaultValue,
        property: property,
        type: type
      }); // Return custom descriptor

      return {
        get: function get() {
          return defaultValue;
        },
        set: function set(value) {
          set$$1(target, property, value);
        }
      };
    };
  }
  /**
   * Handles getting polymorphic records or only a specific
   * type if specified.
   *
   * @method getRelatedRecords
   * @param {Object} record the record with the relationship
   * @param {String} property the related property to set
   * @param {String} modelType an override of the modelType
   */

  function getRelatedRecords(record, property) {
    var modelType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var relationships = record.relationships;
    var relationType = modelType || property;
    var references = relationships && relationships[relationType];
    var relatedRecords = [];

    if (references && references.data) {
      relatedRecords = references.data.map(function (ref) {
        var recordType = ref.type;
        return record.store.getRecord(recordType, ref.id);
      });
    }

    return new RelatedRecordsArray(relatedRecords, record, relationType);
  }
  /**
   * Handles getting polymorphic has_one/belong_to.
   *
   * @method getRelatedRecord
   */

  function getRelatedRecord(record, property) {
    var modelType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    // Get relationships
    var relationships = record.relationships; // Short circuit if no relationships are present

    if (!relationships) return; // Use property name unless model type is provided

    var relationType = modelType || property;
    var reference = relationships[relationType]; // Short circuit if matching reference is not found

    if (!reference || !reference.data) return;
    var _relationships$relati = relationships[relationType].data,
        id = _relationships$relati.id,
        type = _relationships$relati.type;
    var recordType = modelType || type;
    return record.store.getRecord(recordType, id);
  }
  /**
   * Handles setting polymorphic has_one/belong_to.
   * - Validates the related record to make sure it inherits from `Model` class
   * - Sets the relationship
   * - Attempts to find an inverse relationship, and if successful adds it as well
   *
   * @method setRelatedRecord
   * @param {Object} record the record with the relationship
   * @param {Object} relatedRecord the record that will be related
   * @param {String} property the related property to set
   * @param {String} modelType an override of the modelType
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
    } // hack we don't have a reference to the inverse name so we just use the record type.
    // this may cause problems with polymorphic relationships


    var inverseRelatedToMany = getRelatedRecords(referenceRecord, null, record.constructor.type);

    if (inverseRelatedToMany) {
      var inverseMethod = relatedRecord ? 'add' : 'remove';
      inverseRelatedToMany[inverseMethod](record);
    }

    return relatedRecord;
  }
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
   * @method relatedToMany
   */

  function relatedToMany(targetOrModelKlass, property, descriptor) {
    if (typeof targetOrModelKlass === 'function') {
      return function (target2, property2, descriptor2) {
        return {
          get: function get() {
            var type = targetOrModelKlass.type;
            return getRelatedRecords(this, property2, type);
          }
        };
      };
    } else {
      return {
        get: function get() {
          return getRelatedRecords(this, property);
        }
      };
    }
  }
  /**
   * Syntactic sugar of relatedToMany relationship. Basically
   * everything the same except it only returns a single record.
   *
   * @method relatedToOne
   */

  function relatedToOne(targetOrModelKlass, property, descriptor) {
    if (typeof targetOrModelKlass === 'function') {
      return function (target2, property2, descriptor2) {
        return {
          get: function get() {
            var type = targetOrModelKlass.type;
            return getRelatedRecord(this, property2, type);
          },
          set: function set(record) {
            var type = targetOrModelKlass.type;
            return setRelatedRecord(this, record, property2, type);
          }
        };
      };
    } else {
      return {
        get: function get() {
          return getRelatedRecord(this, property);
        },
        set: function set(record) {
          return setRelatedRecord(this, record, property);
        }
      };
    }
  }
  /**
   * An array that allows for updating store references and relationships
   * @class RelatedRecordsArray
   * @constructor
   * @param {Array} array the array to extend
   * @param {Object} record the record with the referenced array
   * @param {String} property the property on the record that references the array
   */

  var RelatedRecordsArray =
  /*#__PURE__*/
  function (_Array) {
    _inherits(RelatedRecordsArray, _Array);

    function RelatedRecordsArray(_array, _record, _property) {
      var _getPrototypeOf2;

      var _this2;

      _classCallCheck(this, RelatedRecordsArray);

      _this2 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RelatedRecordsArray)).call.apply(_getPrototypeOf2, [this].concat(_toConsumableArray(_array))));

      _this2.add = function (relatedRecord) {
        var _assertThisInitialize = _assertThisInitialized(_this2),
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
          relationships[property] = {
            data: []
          };
        }

        var alreadyThere = relationships[property].data.find(function (model) {
          return model.id === id && model.type === type;
        });

        if (!alreadyThere) {
          relationships[property].data.push({
            id: id,
            type: type
          });

          _this2.push(relatedRecord); // setting the inverse - hack this will only work with singularized relationships.


          setRelatedRecord(relatedRecord, record, recordType.slice(0, recordType.length - 1));
        }

        return relatedRecord;
      };

      _this2.remove = function (relatedRecord) {
        var _assertThisInitialize2 = _assertThisInitialized(_this2),
            record = _assertThisInitialize2.record,
            property = _assertThisInitialize2.property;

        var relationships = record.relationships,
            recordType = record.constructor.type;
        var id = relatedRecord.id,
            type = relatedRecord.constructor.type;

        if (relationships && relationships[property] && relatedRecord) {
          var referenceIndexToRemove = relationships[property].data.findIndex(function (model) {
            return model.id === id && model.type === type;
          });
          relationships[property].data.splice(referenceIndexToRemove, 1);

          var recordIndexToRemove = _this2.findIndex(function (model) {
            return model.id === id && model.type === type;
          });

          if (recordIndexToRemove >= 0) {
            _this2.splice(recordIndexToRemove, 1);
          }

          if (!relationships[property].data.length) {
            delete relationships[property];
          }

          if (!Object.keys(record.relationships).length) {
            delete record.relationships;
          } // hack this will only work with singularized relationships.


          setRelatedRecord(relatedRecord, null, recordType.slice(0, recordType.length - 1));
        }

        return relatedRecord;
      };

      _this2.replace = function (array) {
        var _assertThisInitialize3 = _assertThisInitialized(_this2),
            record = _assertThisInitialize3.record,
            property = _assertThisInitialize3.property;

        var relationships = record.relationships;
        transaction$$1(function () {
          relationships[property] = {
            data: []
          };
          array.forEach(function (object) {
            return _this2.add(object);
          });
        });
      };

      _this2.property = _property;
      _this2.record = _record;
      return _this2;
    }
    /**
     * Adds a record to the array, and updates references in the store, as well as inverse references
     * @method add
     * @param {Object} relatedRecord the record to add to the array
     * @return {Object} the original relatedRecord
     */


    return RelatedRecordsArray;
  }(_wrapNativeSuper(Array));
  /*
   * Defines a many-to-one relationship. Defaults to the class with camelized name of the property.
   * An optional argument specifies the data model, if different from the property name.
   * ```
   * class Note extends Model {
   *   @belongsTo todo
   *   @belongsTo(Facility) greenhouse
   * }
   * ```
   * Polymorphic relationships
   * Define `belongsTo` with the the associated models
   * Define `hasMany` as you normally would
   * ```
   * class Note extends Model {
   *   @belongsTo(Todo, ScheduledEvent) notable
   * }
   *
   * class Todo extends Model {
   *   @hasMany notes
   * }
   * ```
   * @method belongsTo
   */

  /**
   @class Model
   */


  var Model = (_class$1 = (_temp$1 =
  /*#__PURE__*/
  function () {
    /**
     * Initializer for model
     *
     * @method constructor
     */
    function Model() {
      var initialAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Model);

      _initializerDefineProperty(this, "isDirty", _descriptor$1, this);

      this.isInFlight = false;
      this.errors = {};
      this.snapshot = {};
      this.previousSnapshot = {};
      this.makeObservable(initialAttributes);
      this.setCurrentSnapShot();
      this.trackState();
    }
    /**
     * The type of the model. Defined on the class. Defaults to the underscored version of the class name
     * (eg 'calendar_events').
     *
     * @property type
     * @static
     */

    /**
     * The canonical path to the resource on the server. Defined on the class.
     * Defaults to the underscored version of the class name
     * @property endpoint
     * @static
     */

    /**
     * True if the instance has been modified from its persisted state
     * ```
     * kpi = store.find('kpis', 5)
     * kpi.name
     * => "A good thing to measure"
     * kpi.isDirty
     * => false
     * kpi.name = "Another good thing to measure"
     * kpi.isDirty
     * => true
     * await kpi.save()
     * kpi.isDirty
     * => false
     * ```
     * @property isDirty
     * @type {Boolean}
     * @default false
     */


    _createClass(Model, [{
      key: "rollback",

      /**
       * restores data to its last persisted state
       * ```
       * kpi = store.find('kpis', 5)
       * kpi.name
       * => "A good thing to measure"
       * kpi.name = "Another good thing to measure"
       * kpi.rollback()
       * kpi.name
       * => "A good thing to measure"
       * ```
       * @method rollback
       */
      value: function rollback() {
        var _this3 = this;

        this.attributeNames.forEach(function (key) {
          _this3[key] = _this3.previousSnapshot[key];
        });
        this.setCurrentSnapShot();
      }
      /**
       * creates or updates a record.
       * @method save
       * @return {Promise}
       * @param {Object} options
       */

    }, {
      key: "save",
      value: function save() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var queryParams = options.queryParams;
        var constructor = this.constructor,
            id = this.id;
        var requestId = id;
        var method = 'PATCH';

        if (String(id).match(/tmp/)) {
          method = 'POST';
          requestId = null;
        }

        var url = this.store.fetchUrl(constructor.type, queryParams, requestId);
        var body = JSON.stringify(this.jsonapi);
        var response = this.store.fetch(url, {
          method: method,
          body: body
        });
        return new ObjectPromiseProxy(response, this);
      }
      /**
       * deletes a record from the store and server
       * @method destroy
       * @return {Promise} an empty promise with any success/error status
       */

    }, {
      key: "destroy",
      value: function destroy() {
        var type = this.constructor.type,
            id = this.id,
            snapshot = this.snapshot;

        if (String(id).match(/tmp/)) {
          this.store.remove(type, id);
          return snapshot;
        }

        var url = this.store.fetchUrl(type, {}, id);
        this.isInFlight = true;
        var promise = this.store.fetch(url, {
          method: 'DELETE'
        });

        var _this = this;

        return promise.then(
        /*#__PURE__*/
        function () {
          var _ref = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(response) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _this.isInFlight = false;

                    if (!(response.status === 202 || response.status === 204)) {
                      _context.next = 6;
                      break;
                    }

                    _this.store.remove(type, id);

                    return _context.abrupt("return", _this);

                  case 6:
                    _this.errors = {
                      status: response.status
                    };
                    return _context.abrupt("return", _this);

                  case 8:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }(), function (error) {
          // TODO: Handle error states correctly
          _this.isInFlight = false;
          _this.errors = error;
          throw error;
        });
      }
      /* Private Methods */

      /**
       * Magic method that makes changes to records
       * observable
       *
       * @method makeObservable
       */

    }, {
      key: "makeObservable",
      value: function makeObservable(initialAttributes) {
        var defaultAttributes = this.defaultAttributes;
        extendObservable$$1(this, _objectSpread({}, defaultAttributes, initialAttributes));
      }
      /**
       * Sets current snapshot to current attributes
       *
       * @method setCurrentSnapShot
       */

    }, {
      key: "setCurrentSnapShot",
      value: function setCurrentSnapShot() {
        this.snapshot = this.attributes;
      }
      /**
       * Sets previous snapshot to current snapshot
       *
       * @method setPreviousSnapshot
       */

    }, {
      key: "setPreviousSnapshot",
      value: function setPreviousSnapshot() {
        this.previousSnapshot = this.snapshot;
      }
      /**
       * Uses mobx.autorun to track changes to attributes
       *
       * @method trackState
       */

    }, {
      key: "trackState",
      value: function trackState() {
        var _this4 = this;

        var firstAutorun = true;
        autorun$$1(function () {
          // `JSON.stringify` will touch all attributes
          // ensuring they are automatically observed.
          JSON.stringify(_this4.attributes);

          if (!firstAutorun) {
            _this4.setPreviousSnapshot();

            _this4.setCurrentSnapShot();

            _this4.isDirty = true;
          }

          firstAutorun = false;
        });
      }
      /**
       * current attributes of record
       *
       * @method attributes
       * @return {Object} current attributes
       */

    }, {
      key: "updateAttributes",

      /**
       * getter method to get data in api compliance format
       * TODO: Figure out how to handle unpersisted ids
       *
       * @method updateAttributes
       */
      value: function updateAttributes(attributes) {
        var _this5 = this;

        transaction$$1(function () {
          Object.keys(attributes).forEach(function (key) {
            _this5[key] = attributes[key];
          });
        });
      }
    }, {
      key: "attributes",
      get: function get() {
        var _this6 = this;

        return this.attributeNames.reduce(function (attributes, key) {
          var value = toJS$$1(_this6[key]);

          if (!value) {
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
       * @method attributeDefinitions
       * @return {Object}
       */

    }, {
      key: "attributeDefinitions",
      get: function get() {
        var type = this.constructor.type;
        return schema.structure[type];
      }
      /**
       * Getter to check if the record has errors.
       *
       * @method hasErrors
       * @return {Boolean}
       */

    }, {
      key: "hasErrors",
      get: function get() {
        return Object.keys(this.errors).length > 0;
      }
      /**
       * Getter to just get the names of a records attributes.
       *
       * @method attributeNames
       * @return {Array}
       */

    }, {
      key: "attributeNames",
      get: function get() {
        return Object.keys(this.attributeDefinitions);
      }
      /**
       * getter method to get the default attributes
       *
       * @method defaultAttributes
       * @return {Object}
       */

    }, {
      key: "defaultAttributes",
      get: function get() {
        var attributeDefinitions = this.attributeDefinitions;
        return this.attributeNames.reduce(function (defaults, key) {
          var defaultValue = attributeDefinitions[key].defaultValue;
          defaults[key] = defaultValue;
          return defaults;
        }, {});
      }
      /**
       * getter method to get data in api compliance format
       * TODO: Figure out how to handle unpersisted ids
       *
       * @method jsonapi
       * @return {Object} data in JSON::API format
       */

    }, {
      key: "jsonapi",
      get: function get() {
        var attributeNames = this.attributeNames,
            meta = this.meta,
            id = this.id,
            _this$constructor = this.constructor,
            type = _this$constructor.type,
            requestAttributeNames = _this$constructor.requestAttributeNames;
        var filterNames = attributeNames;

        if (requestAttributeNames) {
          filterNames = attributeNames.filter(function (name) {
            return requestAttributeNames.includes(name);
          });
        }

        var ModelSerializer = new jsonapiSerializer_1(type, {
          attributes: filterNames,
          keyForAttribute: 'underscore_case'
        });
        var data = this.attributes;

        if (!String(id).match(/tmp/)) {
          data.id = id;
        }

        return ModelSerializer.serialize(data);
      }
    }]);

    return Model;
  }(), _temp$1), (_descriptor$1 = _applyDecoratedDescriptor(_class$1.prototype, "isDirty", [observable$$1], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class$1);

  exports.Model = Model;
  exports.Store = Store;
  exports.attribute = attribute;
  exports.relatedToMany = relatedToMany;
  exports.relatedToOne = relatedToOne;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
