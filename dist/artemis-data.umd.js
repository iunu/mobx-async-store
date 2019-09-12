(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.artemisData = {}));
}(this, function (exports) { 'use strict';

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
  /**
   * Decorator for class properties: @computed get value() { return expr; }.
   * For legacy purposes also invokable as ES5 observable created: `computed(() => expr)`;
   */
  var computed$$1 = function computed$$1(arg1, arg2, arg3) {
      if (typeof arg2 === "string") {
          // @computed
          return computedDecorator$$1.apply(null, arguments);
      }
      if (arg1 !== null && typeof arg1 === "object" && arguments.length === 1) {
          // @computed({ options })
          return computedDecorator$$1.apply(null, arguments);
      }
      // computed(expr, options?)
      if (process.env.NODE_ENV !== "production") {
          invariant$$1(typeof arg1 === "function", "First argument to `computed` should be an expression.");
          invariant$$1(arguments.length < 3, "Computed takes one or two arguments if used as function");
      }
      var opts = typeof arg2 === "object" ? arg2 : {};
      opts.get = arg1;
      opts.set = typeof arg2 === "function" ? arg2 : opts.set;
      opts.name = opts.name || arg1.name || ""; /* for generated name */
      return new ComputedValue$$1(opts);
  };
  computed$$1.struct = computedStructDecorator;

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

  function dontReassignFields() {
      fail$$1(process.env.NODE_ENV !== "production" && "@action fields are not reassignable");
  }
  function namedActionDecorator$$1(name) {
      return function (target, prop, descriptor) {
          if (descriptor) {
              if (process.env.NODE_ENV !== "production" && descriptor.get !== undefined) {
                  return fail$$1("@action cannot be used with getters");
              }
              // babel / typescript
              // @action method() { }
              if (descriptor.value) {
                  // typescript
                  return {
                      value: createAction$$1(name, descriptor.value),
                      enumerable: false,
                      configurable: true,
                      writable: true // for typescript, this must be writable, otherwise it cannot inherit :/ (see inheritable actions test)
                  };
              }
              // babel only: @action method = () => {}
              var initializer_1 = descriptor.initializer;
              return {
                  enumerable: false,
                  configurable: true,
                  writable: true,
                  initializer: function () {
                      // N.B: we can't immediately invoke initializer; this would be wrong
                      return createAction$$1(name, initializer_1.call(this));
                  }
              };
          }
          // bound instance methods
          return actionFieldDecorator$$1(name).apply(this, arguments);
      };
  }
  function actionFieldDecorator$$1(name) {
      // Simple property that writes on first invocation to the current instance
      return function (target, prop, descriptor) {
          Object.defineProperty(target, prop, {
              configurable: true,
              enumerable: false,
              get: function () {
                  return undefined;
              },
              set: function (value) {
                  addHiddenProp$$1(this, prop, action$$1(name, value));
              }
          });
      };
  }
  function boundActionDecorator$$1(target, propertyName, descriptor, applyToInstance) {
      if (applyToInstance === true) {
          defineBoundAction$$1(target, propertyName, descriptor.value);
          return null;
      }
      if (descriptor) {
          // if (descriptor.value)
          // Typescript / Babel: @action.bound method() { }
          // also: babel @action.bound method = () => {}
          return {
              configurable: true,
              enumerable: false,
              get: function () {
                  defineBoundAction$$1(this, propertyName, descriptor.value || descriptor.initializer.call(this));
                  return this[propertyName];
              },
              set: dontReassignFields
          };
      }
      // field decorator Typescript @action.bound method = () => {}
      return {
          enumerable: false,
          configurable: true,
          set: function (v) {
              defineBoundAction$$1(this, propertyName, v);
          },
          get: function () {
              return undefined;
          }
      };
  }

  var action$$1 = function action$$1(arg1, arg2, arg3, arg4) {
      // action(fn() {})
      if (arguments.length === 1 && typeof arg1 === "function")
          return createAction$$1(arg1.name || "<unnamed action>", arg1);
      // action("name", fn() {})
      if (arguments.length === 2 && typeof arg2 === "function")
          return createAction$$1(arg1, arg2);
      // @action("name") fn() {}
      if (arguments.length === 1 && typeof arg1 === "string")
          return namedActionDecorator$$1(arg1);
      // @action fn() {}
      if (arg4 === true) {
          // apply to instance immediately
          addHiddenProp$$1(arg1, arg2, createAction$$1(arg1.name || arg2, arg3.value, this));
      }
      else {
          return namedActionDecorator$$1(arg2).apply(null, arguments);
      }
  };
  action$$1.bound = boundActionDecorator$$1;
  function isAction$$1(thing) {
      return typeof thing === "function" && thing.isMobxAction === true;
  }
  function defineBoundAction$$1(target, propertyName, fn) {
      addHiddenProp$$1(target, propertyName, createAction$$1(propertyName, fn.bind(target)));
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
  function reaction$$1(expression, effect, opts) {
      if (opts === void 0) { opts = EMPTY_OBJECT$$1; }
      if (process.env.NODE_ENV !== "production") {
          invariant$$1(typeof expression === "function", "First argument to reaction should be a function");
          invariant$$1(typeof opts === "object", "Third argument of reactions should be an object");
      }
      var name = opts.name || "Reaction@" + getNextId$$1();
      var effectAction = action$$1(name, opts.onError ? wrapErrorHandler(opts.onError, effect) : effect);
      var runSync = !opts.scheduler && !opts.delay;
      var scheduler = createSchedulerFromOptions(opts);
      var firstTime = true;
      var isScheduled = false;
      var value;
      var equals = opts.compareStructural
          ? comparer$$1.structural
          : opts.equals || comparer$$1.default;
      var r = new Reaction$$1(name, function () {
          if (firstTime || runSync) {
              reactionRunner();
          }
          else if (!isScheduled) {
              isScheduled = true;
              scheduler(reactionRunner);
          }
      }, opts.onError);
      function reactionRunner() {
          isScheduled = false; // Q: move into reaction runner?
          if (r.isDisposed)
              return;
          var changed = false;
          r.track(function () {
              var nextValue = expression(r);
              changed = firstTime || !equals(value, nextValue);
              value = nextValue;
          });
          if (firstTime && opts.fireImmediately)
              effectAction(value, r);
          if (!firstTime && changed === true)
              effectAction(value, r);
          if (firstTime)
              firstTime = false;
      }
      r.schedule();
      return r.getDisposer();
  }
  function wrapErrorHandler(errorHandler, baseFn) {
      return function () {
          try {
              return baseFn.apply(this, arguments);
          }
          catch (e) {
              errorHandler.call(this, e);
          }
      };
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

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var rngBrowser = createCommonjsModule(function (module) {
  // Unique ID creation requires a high quality random # generator.  In the
  // browser this is a little complicated due to unknown quality of Math.random()
  // and inconsistent support for the `crypto` API.  We do the best we can via
  // feature-detection

  // getRandomValues needs to be invoked in a context where "this" is a Crypto
  // implementation. Also, find the complete implementation of crypto on IE11.
  var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                        (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

  if (getRandomValues) {
    // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
    var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

    module.exports = function whatwgRNG() {
      getRandomValues(rnds8);
      return rnds8;
    };
  } else {
    // Math.random()-based (RNG)
    //
    // If all else fails, use Math.random().  It's fast, but is of unspecified
    // quality.
    var rnds = new Array(16);

    module.exports = function mathRNG() {
      for (var i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
        rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
      }

      return rnds;
    };
  }
  });

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
      var seedBytes = rngBrowser();
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
  function newId() {
    return "tmp-".concat(v1_1());
  }
  function dbOrNewId(properties) {
    return properties.id || newId();
  }
  /**
   * Reducer function for filtering out duplicate records
   * by a key provided. Returns a function that has a accumulator and
   * current record per Array.reduce.
   *
   * @method uniqueByReducer
   * @param {Array} key
   * @return {Function}
   */

  function uniqueByReducer(key) {
    return function (accumulator, current) {
      return accumulator.some(function (item) {
        return item[key] === current[key];
      }) ? accumulator : [].concat(_toConsumableArray(accumulator), [current]);
    };
  }
  /**
   * Returns objects unique by key provided
   *
   * @method uniqueBy
   * @param {Array} array
   * @param {String} key
   * @return {Array}
   */

  function uniqueBy(array, key) {
    return array.reduce(uniqueByReducer(key), []);
  }

  var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;
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

      _initializerDefineProperty(this, "addModel", _descriptor2, this);

      _initializerDefineProperty(this, "newModel", _descriptor3, this);

      this.addModels = function (type, data) {
        var records = [];
        transaction$$1(function () {
          records = data.map(function (obj) {
            return _this.addModel(type, obj);
          });
        });
        return records;
      };

      _initializerDefineProperty(this, "remove", _descriptor4, this);

      this.findOne = function (type, id) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var fromServer = options.fromServer,
            queryParams = options.queryParams;

        if (fromServer === true) {
          // If fromServer is true always fetch the data and return
          return _this.fetchOne(type, id, queryParams);
        } else if (fromServer === false) {
          // If fromServer is false never fetch the data and return
          return _this.getRecord(type, id, queryParams);
        } else {
          return _this.findOrFetchOne(type, id, queryParams);
        }
      };

      this.findOrFetchOne = function (type, id, queryParams) {
        // Get the matching record
        var record = _this.getMatchingRecord(type, id, queryParams); // If the cached record is present


        if (record && record.id) {
          // Return data
          return record;
        } else {
          // Otherwise fetch it from the server
          return _this.fetchOne(type, id, queryParams);
        }
      };

      this.findAll = function (type) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var fromServer = options.fromServer,
            queryParams = options.queryParams;

        if (fromServer === true) {
          // If fromServer is true always fetch the data and return
          return _this.fetchAll(type, queryParams);
        } else if (fromServer === false) {
          // If fromServer is false never fetch the data and return
          return _this.getMatchingRecords(type, queryParams);
        } else {
          return _this.findOrFetchAll(type, queryParams);
        }
      };

      this.findOrFetchAll = function (type, queryParams) {
        // Get any matching records
        var records = _this.getMatchingRecords(type, queryParams); // If any records are present


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
       * Get single all record
       * based on query params
       *
       * @method getMatchingRecord
       * @param {String} type
       * @param id
       * @param {Object} queryParams
       * @return {Array} array or records
       */

    }, {
      key: "getMatchingRecord",
      value: function getMatchingRecord(type, id, queryParams) {
        if (queryParams) {
          return this.getCachedRecord(type, id, queryParams);
        } else {
          return this.getRecord(type, id);
        }
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
        if (!this.getType(type)) {
          throw new Error("Could not find a collection for type '".concat(type, "'"));
        }

        var record = this.getType(type).records[id];
        if (!record || record === 'undefined') return;
        return record;
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
        var records = Object.values(this.getType(type).records).filter(function (value) {
          return value && value !== 'undefined';
        }); // NOTE: Handles a scenario where the store keeps around a reference
        // to a newly persisted record by its temp uuid. This is required
        // because we can't simply remove the temp uuid reference because other
        // related models may be still using the temp uuid in their relationships
        // data object. However, when we are listing out records we want them
        // to be unique by the persisted id (which is updated after a Model.save)

        return uniqueBy(records, 'id');
      }
      /**
       * Gets single from store based on cached query
       *
       * @method getCachedRecord
       * @param {String} type
       * @param id
       * @param {Object} queryParams
       * @return {Array} array or records
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
       * @method getCachedRecords
       * @param {String} type
       * @param {Object} queryParams
       * @return {Array} array or records
       */

    }, {
      key: "getCachedRecords",
      value: function getCachedRecords(type, queryParams, id) {
        // Get the url the request would use
        var url = this.fetchUrl(type, queryParams, id); // Get the matching ids from the response

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
       * Gets records from store based on cached query
       *
       * @method getCachedIds
       * @param {String} type
       * @param {String} url
       * @return {Array} array of ids
       */

    }, {
      key: "getCachedId",
      value: function getCachedId(type, id) {
        return this.getType(type).cache[id];
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
          return record;
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
      /**
       * Creates or updates a model
       *
       * @method createOrUpdateModel
       * @param {Object} dataObject
       */

    }, {
      key: "createOrUpdateModel",
      value: function createOrUpdateModel(dataObject) {
        var _this4 = this;

        var _dataObject$attribute = dataObject.attributes,
            attributes = _dataObject$attribute === void 0 ? {} : _dataObject$attribute,
            id = dataObject.id,
            _dataObject$relations = dataObject.relationships,
            relationships = _dataObject$relations === void 0 ? {} : _dataObject$relations,
            type = dataObject.type;
        var record = this.getRecord(type, id);

        if (record) {
          // Update existing object attributes
          Object.keys(attributes).forEach(function (key) {
            set$$1(record, key, attributes[key]);
            set$$1(_this4.data[type].records, id, record);
          }); // If relationships are present, update relationships

          if (relationships) {
            Object.keys(relationships).forEach(function (key) {
              // Don't try to create relationship if meta included false
              if (!relationships[key].meta) {
                // defensive against existingRecord.relationships being undefined
                set$$1(record, 'relationships', _objectSpread({}, record.relationships, _defineProperty({}, key, relationships[key])));
                set$$1(_this4.data[type].records, id, record);
              }
            });
          }
        } else {
          record = this.createModel(type, id, {
            attributes: attributes,
            relationships: relationships
          });
          this.data[type].records[record.id] = record;
        }

        return record;
      }
      /**
       * Create multiple models from an array of data
       *
       * @method createModelsFromData
       * @param {Array} data
       */

    }, {
      key: "createModelsFromData",
      value: function createModelsFromData(data) {
        var _this5 = this;

        var records = [];
        transaction$$1(function () {
          records = data.forEach(function (dataObject) {
            return _this5.createOrUpdateModel(dataObject);
          });
        });
        return records;
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
        var _toJS = toJS$$1(data),
            _toJS$attributes = _toJS.attributes,
            attributes = _toJS$attributes === void 0 ? {} : _toJS$attributes,
            _toJS$relationships = _toJS.relationships,
            relationships = _toJS$relationships === void 0 ? {} : _toJS$relationships;

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
       * @method fetchAll
       * @param {String} type the type to find
       * @param {Object} options
       */

    }, {
      key: "fetchAll",
      value: function () {
        var _fetchAll = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(type, queryParams) {
          var _this6 = this;

          var store, url, response, json, records;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  store = this;
                  url = this.fetchUrl(type, queryParams);
                  _context.next = 4;
                  return this.fetch(url, {
                    method: 'GET'
                  });

                case 4:
                  response = _context.sent;

                  if (!(response.status === 200)) {
                    _context.next = 16;
                    break;
                  }

                  this.data[type].cache[url] = [];
                  _context.next = 9;
                  return response.json();

                case 9:
                  json = _context.sent;

                  if (json.included) {
                    this.createModelsFromData(json.included);
                  }

                  records = [];
                  transaction$$1(function () {
                    records = json.data.map(function (dataObject) {
                      var id = dataObject.id,
                          _dataObject$attribute2 = dataObject.attributes,
                          attributes = _dataObject$attribute2 === void 0 ? {} : _dataObject$attribute2,
                          _dataObject$relations2 = dataObject.relationships,
                          relationships = _dataObject$relations2 === void 0 ? {} : _dataObject$relations2;
                      var ModelKlass = _this6.modelTypeIndex[type];
                      var record = new ModelKlass(_objectSpread({
                        store: store,
                        relationships: relationships
                      }, attributes));

                      _this6.data[type].cache[url].push(id);

                      _this6.data[type].records[id] = record;
                      return record;
                    });
                  });
                  return _context.abrupt("return", records);

                case 16:
                  return _context.abrupt("return", Promise.reject(response.status));

                case 17:
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
        regeneratorRuntime.mark(function _callee2(type, id, queryParams) {
          var url, response, json, data, included, record;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  url = this.fetchUrl(type, queryParams, id); // Trigger request

                  _context2.next = 3;
                  return this.fetch(url, {
                    method: 'GET'
                  });

                case 3:
                  response = _context2.sent;

                  if (!(response.status === 200)) {
                    _context2.next = 17;
                    break;
                  }

                  _context2.next = 7;
                  return response.json();

                case 7:
                  json = _context2.sent;
                  data = json.data, included = json.included;

                  if (included) {
                    this.createModelsFromData(included);
                  }

                  record = this.createModel(type, data.id, data); // Is this needed?

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
    }]);

    return Store;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "data", [observable$$1], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return {};
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "addModel", [action$$1], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      var _this7 = this;

      return function (type, attributes) {
        var id = dbOrNewId(attributes); // Create new model install

        var model = _this7.createModel(type, id, {
          attributes: attributes
        }); // Add the model to the type records index


        _this7.data[type].records[id] = model;
        return model;
      };
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "newModel", [action$$1], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      var _this8 = this;

      return function (type, attributes) {
        return _this8.createModel(type, newId(), {
          attributes: attributes
        });
      };
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "remove", [action$$1], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      var _this9 = this;

      return function (type, id) {
        var records = _this9.getRecords(type);

        _this9.data[type].records = records.reduce(function (hash, record) {
          if (String(record.id) !== String(id)) {
            hash[record.id] = record;
          }

          return hash;
        }, {});
      };
    }
  })), _class);

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

  var moment = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
      module.exports = factory();
  }(commonjsGlobal, (function () {
      var hookCallback;

      function hooks () {
          return hookCallback.apply(null, arguments);
      }

      // This is done to register the method called with moment()
      // without creating circular dependencies.
      function setHookCallback (callback) {
          hookCallback = callback;
      }

      function isArray(input) {
          return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
      }

      function isObject(input) {
          // IE8 will treat undefined and null as object if it wasn't for
          // input != null
          return input != null && Object.prototype.toString.call(input) === '[object Object]';
      }

      function isObjectEmpty(obj) {
          if (Object.getOwnPropertyNames) {
              return (Object.getOwnPropertyNames(obj).length === 0);
          } else {
              var k;
              for (k in obj) {
                  if (obj.hasOwnProperty(k)) {
                      return false;
                  }
              }
              return true;
          }
      }

      function isUndefined(input) {
          return input === void 0;
      }

      function isNumber(input) {
          return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
      }

      function isDate(input) {
          return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
      }

      function map(arr, fn) {
          var res = [], i;
          for (i = 0; i < arr.length; ++i) {
              res.push(fn(arr[i], i));
          }
          return res;
      }

      function hasOwnProp(a, b) {
          return Object.prototype.hasOwnProperty.call(a, b);
      }

      function extend(a, b) {
          for (var i in b) {
              if (hasOwnProp(b, i)) {
                  a[i] = b[i];
              }
          }

          if (hasOwnProp(b, 'toString')) {
              a.toString = b.toString;
          }

          if (hasOwnProp(b, 'valueOf')) {
              a.valueOf = b.valueOf;
          }

          return a;
      }

      function createUTC (input, format, locale, strict) {
          return createLocalOrUTC(input, format, locale, strict, true).utc();
      }

      function defaultParsingFlags() {
          // We need to deep clone this object.
          return {
              empty           : false,
              unusedTokens    : [],
              unusedInput     : [],
              overflow        : -2,
              charsLeftOver   : 0,
              nullInput       : false,
              invalidMonth    : null,
              invalidFormat   : false,
              userInvalidated : false,
              iso             : false,
              parsedDateParts : [],
              meridiem        : null,
              rfc2822         : false,
              weekdayMismatch : false
          };
      }

      function getParsingFlags(m) {
          if (m._pf == null) {
              m._pf = defaultParsingFlags();
          }
          return m._pf;
      }

      var some;
      if (Array.prototype.some) {
          some = Array.prototype.some;
      } else {
          some = function (fun) {
              var t = Object(this);
              var len = t.length >>> 0;

              for (var i = 0; i < len; i++) {
                  if (i in t && fun.call(this, t[i], i, t)) {
                      return true;
                  }
              }

              return false;
          };
      }

      function isValid(m) {
          if (m._isValid == null) {
              var flags = getParsingFlags(m);
              var parsedParts = some.call(flags.parsedDateParts, function (i) {
                  return i != null;
              });
              var isNowValid = !isNaN(m._d.getTime()) &&
                  flags.overflow < 0 &&
                  !flags.empty &&
                  !flags.invalidMonth &&
                  !flags.invalidWeekday &&
                  !flags.weekdayMismatch &&
                  !flags.nullInput &&
                  !flags.invalidFormat &&
                  !flags.userInvalidated &&
                  (!flags.meridiem || (flags.meridiem && parsedParts));

              if (m._strict) {
                  isNowValid = isNowValid &&
                      flags.charsLeftOver === 0 &&
                      flags.unusedTokens.length === 0 &&
                      flags.bigHour === undefined;
              }

              if (Object.isFrozen == null || !Object.isFrozen(m)) {
                  m._isValid = isNowValid;
              }
              else {
                  return isNowValid;
              }
          }
          return m._isValid;
      }

      function createInvalid (flags) {
          var m = createUTC(NaN);
          if (flags != null) {
              extend(getParsingFlags(m), flags);
          }
          else {
              getParsingFlags(m).userInvalidated = true;
          }

          return m;
      }

      // Plugins that add properties should also add the key here (null value),
      // so we can properly clone ourselves.
      var momentProperties = hooks.momentProperties = [];

      function copyConfig(to, from) {
          var i, prop, val;

          if (!isUndefined(from._isAMomentObject)) {
              to._isAMomentObject = from._isAMomentObject;
          }
          if (!isUndefined(from._i)) {
              to._i = from._i;
          }
          if (!isUndefined(from._f)) {
              to._f = from._f;
          }
          if (!isUndefined(from._l)) {
              to._l = from._l;
          }
          if (!isUndefined(from._strict)) {
              to._strict = from._strict;
          }
          if (!isUndefined(from._tzm)) {
              to._tzm = from._tzm;
          }
          if (!isUndefined(from._isUTC)) {
              to._isUTC = from._isUTC;
          }
          if (!isUndefined(from._offset)) {
              to._offset = from._offset;
          }
          if (!isUndefined(from._pf)) {
              to._pf = getParsingFlags(from);
          }
          if (!isUndefined(from._locale)) {
              to._locale = from._locale;
          }

          if (momentProperties.length > 0) {
              for (i = 0; i < momentProperties.length; i++) {
                  prop = momentProperties[i];
                  val = from[prop];
                  if (!isUndefined(val)) {
                      to[prop] = val;
                  }
              }
          }

          return to;
      }

      var updateInProgress = false;

      // Moment prototype object
      function Moment(config) {
          copyConfig(this, config);
          this._d = new Date(config._d != null ? config._d.getTime() : NaN);
          if (!this.isValid()) {
              this._d = new Date(NaN);
          }
          // Prevent infinite loop in case updateOffset creates new moment
          // objects.
          if (updateInProgress === false) {
              updateInProgress = true;
              hooks.updateOffset(this);
              updateInProgress = false;
          }
      }

      function isMoment (obj) {
          return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
      }

      function absFloor (number) {
          if (number < 0) {
              // -0 -> 0
              return Math.ceil(number) || 0;
          } else {
              return Math.floor(number);
          }
      }

      function toInt(argumentForCoercion) {
          var coercedNumber = +argumentForCoercion,
              value = 0;

          if (coercedNumber !== 0 && isFinite(coercedNumber)) {
              value = absFloor(coercedNumber);
          }

          return value;
      }

      // compare two arrays, return the number of differences
      function compareArrays(array1, array2, dontConvert) {
          var len = Math.min(array1.length, array2.length),
              lengthDiff = Math.abs(array1.length - array2.length),
              diffs = 0,
              i;
          for (i = 0; i < len; i++) {
              if ((dontConvert && array1[i] !== array2[i]) ||
                  (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                  diffs++;
              }
          }
          return diffs + lengthDiff;
      }

      function warn(msg) {
          if (hooks.suppressDeprecationWarnings === false &&
                  (typeof console !==  'undefined') && console.warn) {
              console.warn('Deprecation warning: ' + msg);
          }
      }

      function deprecate(msg, fn) {
          var firstTime = true;

          return extend(function () {
              if (hooks.deprecationHandler != null) {
                  hooks.deprecationHandler(null, msg);
              }
              if (firstTime) {
                  var args = [];
                  var arg;
                  for (var i = 0; i < arguments.length; i++) {
                      arg = '';
                      if (typeof arguments[i] === 'object') {
                          arg += '\n[' + i + '] ';
                          for (var key in arguments[0]) {
                              arg += key + ': ' + arguments[0][key] + ', ';
                          }
                          arg = arg.slice(0, -2); // Remove trailing comma and space
                      } else {
                          arg = arguments[i];
                      }
                      args.push(arg);
                  }
                  warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                  firstTime = false;
              }
              return fn.apply(this, arguments);
          }, fn);
      }

      var deprecations = {};

      function deprecateSimple(name, msg) {
          if (hooks.deprecationHandler != null) {
              hooks.deprecationHandler(name, msg);
          }
          if (!deprecations[name]) {
              warn(msg);
              deprecations[name] = true;
          }
      }

      hooks.suppressDeprecationWarnings = false;
      hooks.deprecationHandler = null;

      function isFunction(input) {
          return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
      }

      function set (config) {
          var prop, i;
          for (i in config) {
              prop = config[i];
              if (isFunction(prop)) {
                  this[i] = prop;
              } else {
                  this['_' + i] = prop;
              }
          }
          this._config = config;
          // Lenient ordinal parsing accepts just a number in addition to
          // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
          // TODO: Remove "ordinalParse" fallback in next major release.
          this._dayOfMonthOrdinalParseLenient = new RegExp(
              (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                  '|' + (/\d{1,2}/).source);
      }

      function mergeConfigs(parentConfig, childConfig) {
          var res = extend({}, parentConfig), prop;
          for (prop in childConfig) {
              if (hasOwnProp(childConfig, prop)) {
                  if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                      res[prop] = {};
                      extend(res[prop], parentConfig[prop]);
                      extend(res[prop], childConfig[prop]);
                  } else if (childConfig[prop] != null) {
                      res[prop] = childConfig[prop];
                  } else {
                      delete res[prop];
                  }
              }
          }
          for (prop in parentConfig) {
              if (hasOwnProp(parentConfig, prop) &&
                      !hasOwnProp(childConfig, prop) &&
                      isObject(parentConfig[prop])) {
                  // make sure changes to properties don't modify parent config
                  res[prop] = extend({}, res[prop]);
              }
          }
          return res;
      }

      function Locale(config) {
          if (config != null) {
              this.set(config);
          }
      }

      var keys;

      if (Object.keys) {
          keys = Object.keys;
      } else {
          keys = function (obj) {
              var i, res = [];
              for (i in obj) {
                  if (hasOwnProp(obj, i)) {
                      res.push(i);
                  }
              }
              return res;
          };
      }

      var defaultCalendar = {
          sameDay : '[Today at] LT',
          nextDay : '[Tomorrow at] LT',
          nextWeek : 'dddd [at] LT',
          lastDay : '[Yesterday at] LT',
          lastWeek : '[Last] dddd [at] LT',
          sameElse : 'L'
      };

      function calendar (key, mom, now) {
          var output = this._calendar[key] || this._calendar['sameElse'];
          return isFunction(output) ? output.call(mom, now) : output;
      }

      var defaultLongDateFormat = {
          LTS  : 'h:mm:ss A',
          LT   : 'h:mm A',
          L    : 'MM/DD/YYYY',
          LL   : 'MMMM D, YYYY',
          LLL  : 'MMMM D, YYYY h:mm A',
          LLLL : 'dddd, MMMM D, YYYY h:mm A'
      };

      function longDateFormat (key) {
          var format = this._longDateFormat[key],
              formatUpper = this._longDateFormat[key.toUpperCase()];

          if (format || !formatUpper) {
              return format;
          }

          this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
              return val.slice(1);
          });

          return this._longDateFormat[key];
      }

      var defaultInvalidDate = 'Invalid date';

      function invalidDate () {
          return this._invalidDate;
      }

      var defaultOrdinal = '%d';
      var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

      function ordinal (number) {
          return this._ordinal.replace('%d', number);
      }

      var defaultRelativeTime = {
          future : 'in %s',
          past   : '%s ago',
          s  : 'a few seconds',
          ss : '%d seconds',
          m  : 'a minute',
          mm : '%d minutes',
          h  : 'an hour',
          hh : '%d hours',
          d  : 'a day',
          dd : '%d days',
          M  : 'a month',
          MM : '%d months',
          y  : 'a year',
          yy : '%d years'
      };

      function relativeTime (number, withoutSuffix, string, isFuture) {
          var output = this._relativeTime[string];
          return (isFunction(output)) ?
              output(number, withoutSuffix, string, isFuture) :
              output.replace(/%d/i, number);
      }

      function pastFuture (diff, output) {
          var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
          return isFunction(format) ? format(output) : format.replace(/%s/i, output);
      }

      var aliases = {};

      function addUnitAlias (unit, shorthand) {
          var lowerCase = unit.toLowerCase();
          aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
      }

      function normalizeUnits(units) {
          return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
      }

      function normalizeObjectUnits(inputObject) {
          var normalizedInput = {},
              normalizedProp,
              prop;

          for (prop in inputObject) {
              if (hasOwnProp(inputObject, prop)) {
                  normalizedProp = normalizeUnits(prop);
                  if (normalizedProp) {
                      normalizedInput[normalizedProp] = inputObject[prop];
                  }
              }
          }

          return normalizedInput;
      }

      var priorities = {};

      function addUnitPriority(unit, priority) {
          priorities[unit] = priority;
      }

      function getPrioritizedUnits(unitsObj) {
          var units = [];
          for (var u in unitsObj) {
              units.push({unit: u, priority: priorities[u]});
          }
          units.sort(function (a, b) {
              return a.priority - b.priority;
          });
          return units;
      }

      function zeroFill(number, targetLength, forceSign) {
          var absNumber = '' + Math.abs(number),
              zerosToFill = targetLength - absNumber.length,
              sign = number >= 0;
          return (sign ? (forceSign ? '+' : '') : '-') +
              Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
      }

      var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

      var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

      var formatFunctions = {};

      var formatTokenFunctions = {};

      // token:    'M'
      // padded:   ['MM', 2]
      // ordinal:  'Mo'
      // callback: function () { this.month() + 1 }
      function addFormatToken (token, padded, ordinal, callback) {
          var func = callback;
          if (typeof callback === 'string') {
              func = function () {
                  return this[callback]();
              };
          }
          if (token) {
              formatTokenFunctions[token] = func;
          }
          if (padded) {
              formatTokenFunctions[padded[0]] = function () {
                  return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
              };
          }
          if (ordinal) {
              formatTokenFunctions[ordinal] = function () {
                  return this.localeData().ordinal(func.apply(this, arguments), token);
              };
          }
      }

      function removeFormattingTokens(input) {
          if (input.match(/\[[\s\S]/)) {
              return input.replace(/^\[|\]$/g, '');
          }
          return input.replace(/\\/g, '');
      }

      function makeFormatFunction(format) {
          var array = format.match(formattingTokens), i, length;

          for (i = 0, length = array.length; i < length; i++) {
              if (formatTokenFunctions[array[i]]) {
                  array[i] = formatTokenFunctions[array[i]];
              } else {
                  array[i] = removeFormattingTokens(array[i]);
              }
          }

          return function (mom) {
              var output = '', i;
              for (i = 0; i < length; i++) {
                  output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
              }
              return output;
          };
      }

      // format date using native date object
      function formatMoment(m, format) {
          if (!m.isValid()) {
              return m.localeData().invalidDate();
          }

          format = expandFormat(format, m.localeData());
          formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

          return formatFunctions[format](m);
      }

      function expandFormat(format, locale) {
          var i = 5;

          function replaceLongDateFormatTokens(input) {
              return locale.longDateFormat(input) || input;
          }

          localFormattingTokens.lastIndex = 0;
          while (i >= 0 && localFormattingTokens.test(format)) {
              format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
              localFormattingTokens.lastIndex = 0;
              i -= 1;
          }

          return format;
      }

      var match1         = /\d/;            //       0 - 9
      var match2         = /\d\d/;          //      00 - 99
      var match3         = /\d{3}/;         //     000 - 999
      var match4         = /\d{4}/;         //    0000 - 9999
      var match6         = /[+-]?\d{6}/;    // -999999 - 999999
      var match1to2      = /\d\d?/;         //       0 - 99
      var match3to4      = /\d\d\d\d?/;     //     999 - 9999
      var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
      var match1to3      = /\d{1,3}/;       //       0 - 999
      var match1to4      = /\d{1,4}/;       //       0 - 9999
      var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

      var matchUnsigned  = /\d+/;           //       0 - inf
      var matchSigned    = /[+-]?\d+/;      //    -inf - inf

      var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
      var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

      var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

      // any word (or two) characters or numbers including two/three word month in arabic.
      // includes scottish gaelic two word and hyphenated months
      var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

      var regexes = {};

      function addRegexToken (token, regex, strictRegex) {
          regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
              return (isStrict && strictRegex) ? strictRegex : regex;
          };
      }

      function getParseRegexForToken (token, config) {
          if (!hasOwnProp(regexes, token)) {
              return new RegExp(unescapeFormat(token));
          }

          return regexes[token](config._strict, config._locale);
      }

      // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
      function unescapeFormat(s) {
          return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
              return p1 || p2 || p3 || p4;
          }));
      }

      function regexEscape(s) {
          return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      }

      var tokens = {};

      function addParseToken (token, callback) {
          var i, func = callback;
          if (typeof token === 'string') {
              token = [token];
          }
          if (isNumber(callback)) {
              func = function (input, array) {
                  array[callback] = toInt(input);
              };
          }
          for (i = 0; i < token.length; i++) {
              tokens[token[i]] = func;
          }
      }

      function addWeekParseToken (token, callback) {
          addParseToken(token, function (input, array, config, token) {
              config._w = config._w || {};
              callback(input, config._w, config, token);
          });
      }

      function addTimeToArrayFromToken(token, input, config) {
          if (input != null && hasOwnProp(tokens, token)) {
              tokens[token](input, config._a, config, token);
          }
      }

      var YEAR = 0;
      var MONTH = 1;
      var DATE = 2;
      var HOUR = 3;
      var MINUTE = 4;
      var SECOND = 5;
      var MILLISECOND = 6;
      var WEEK = 7;
      var WEEKDAY = 8;

      // FORMATTING

      addFormatToken('Y', 0, 0, function () {
          var y = this.year();
          return y <= 9999 ? '' + y : '+' + y;
      });

      addFormatToken(0, ['YY', 2], 0, function () {
          return this.year() % 100;
      });

      addFormatToken(0, ['YYYY',   4],       0, 'year');
      addFormatToken(0, ['YYYYY',  5],       0, 'year');
      addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

      // ALIASES

      addUnitAlias('year', 'y');

      // PRIORITIES

      addUnitPriority('year', 1);

      // PARSING

      addRegexToken('Y',      matchSigned);
      addRegexToken('YY',     match1to2, match2);
      addRegexToken('YYYY',   match1to4, match4);
      addRegexToken('YYYYY',  match1to6, match6);
      addRegexToken('YYYYYY', match1to6, match6);

      addParseToken(['YYYYY', 'YYYYYY'], YEAR);
      addParseToken('YYYY', function (input, array) {
          array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
      });
      addParseToken('YY', function (input, array) {
          array[YEAR] = hooks.parseTwoDigitYear(input);
      });
      addParseToken('Y', function (input, array) {
          array[YEAR] = parseInt(input, 10);
      });

      // HELPERS

      function daysInYear(year) {
          return isLeapYear(year) ? 366 : 365;
      }

      function isLeapYear(year) {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      }

      // HOOKS

      hooks.parseTwoDigitYear = function (input) {
          return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
      };

      // MOMENTS

      var getSetYear = makeGetSet('FullYear', true);

      function getIsLeapYear () {
          return isLeapYear(this.year());
      }

      function makeGetSet (unit, keepTime) {
          return function (value) {
              if (value != null) {
                  set$1(this, unit, value);
                  hooks.updateOffset(this, keepTime);
                  return this;
              } else {
                  return get(this, unit);
              }
          };
      }

      function get (mom, unit) {
          return mom.isValid() ?
              mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
      }

      function set$1 (mom, unit, value) {
          if (mom.isValid() && !isNaN(value)) {
              if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
                  mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
              }
              else {
                  mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
              }
          }
      }

      // MOMENTS

      function stringGet (units) {
          units = normalizeUnits(units);
          if (isFunction(this[units])) {
              return this[units]();
          }
          return this;
      }


      function stringSet (units, value) {
          if (typeof units === 'object') {
              units = normalizeObjectUnits(units);
              var prioritized = getPrioritizedUnits(units);
              for (var i = 0; i < prioritized.length; i++) {
                  this[prioritized[i].unit](units[prioritized[i].unit]);
              }
          } else {
              units = normalizeUnits(units);
              if (isFunction(this[units])) {
                  return this[units](value);
              }
          }
          return this;
      }

      function mod(n, x) {
          return ((n % x) + x) % x;
      }

      var indexOf;

      if (Array.prototype.indexOf) {
          indexOf = Array.prototype.indexOf;
      } else {
          indexOf = function (o) {
              // I know
              var i;
              for (i = 0; i < this.length; ++i) {
                  if (this[i] === o) {
                      return i;
                  }
              }
              return -1;
          };
      }

      function daysInMonth(year, month) {
          if (isNaN(year) || isNaN(month)) {
              return NaN;
          }
          var modMonth = mod(month, 12);
          year += (month - modMonth) / 12;
          return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
      }

      // FORMATTING

      addFormatToken('M', ['MM', 2], 'Mo', function () {
          return this.month() + 1;
      });

      addFormatToken('MMM', 0, 0, function (format) {
          return this.localeData().monthsShort(this, format);
      });

      addFormatToken('MMMM', 0, 0, function (format) {
          return this.localeData().months(this, format);
      });

      // ALIASES

      addUnitAlias('month', 'M');

      // PRIORITY

      addUnitPriority('month', 8);

      // PARSING

      addRegexToken('M',    match1to2);
      addRegexToken('MM',   match1to2, match2);
      addRegexToken('MMM',  function (isStrict, locale) {
          return locale.monthsShortRegex(isStrict);
      });
      addRegexToken('MMMM', function (isStrict, locale) {
          return locale.monthsRegex(isStrict);
      });

      addParseToken(['M', 'MM'], function (input, array) {
          array[MONTH] = toInt(input) - 1;
      });

      addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
          var month = config._locale.monthsParse(input, token, config._strict);
          // if we didn't find a month name, mark the date as invalid.
          if (month != null) {
              array[MONTH] = month;
          } else {
              getParsingFlags(config).invalidMonth = input;
          }
      });

      // LOCALES

      var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
      var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
      function localeMonths (m, format) {
          if (!m) {
              return isArray(this._months) ? this._months :
                  this._months['standalone'];
          }
          return isArray(this._months) ? this._months[m.month()] :
              this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
      }

      var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
      function localeMonthsShort (m, format) {
          if (!m) {
              return isArray(this._monthsShort) ? this._monthsShort :
                  this._monthsShort['standalone'];
          }
          return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
              this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
      }

      function handleStrictParse(monthName, format, strict) {
          var i, ii, mom, llc = monthName.toLocaleLowerCase();
          if (!this._monthsParse) {
              // this is not used
              this._monthsParse = [];
              this._longMonthsParse = [];
              this._shortMonthsParse = [];
              for (i = 0; i < 12; ++i) {
                  mom = createUTC([2000, i]);
                  this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                  this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
              }
          }

          if (strict) {
              if (format === 'MMM') {
                  ii = indexOf.call(this._shortMonthsParse, llc);
                  return ii !== -1 ? ii : null;
              } else {
                  ii = indexOf.call(this._longMonthsParse, llc);
                  return ii !== -1 ? ii : null;
              }
          } else {
              if (format === 'MMM') {
                  ii = indexOf.call(this._shortMonthsParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._longMonthsParse, llc);
                  return ii !== -1 ? ii : null;
              } else {
                  ii = indexOf.call(this._longMonthsParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._shortMonthsParse, llc);
                  return ii !== -1 ? ii : null;
              }
          }
      }

      function localeMonthsParse (monthName, format, strict) {
          var i, mom, regex;

          if (this._monthsParseExact) {
              return handleStrictParse.call(this, monthName, format, strict);
          }

          if (!this._monthsParse) {
              this._monthsParse = [];
              this._longMonthsParse = [];
              this._shortMonthsParse = [];
          }

          // TODO: add sorting
          // Sorting makes sure if one month (or abbr) is a prefix of another
          // see sorting in computeMonthsParse
          for (i = 0; i < 12; i++) {
              // make the regex if we don't have it already
              mom = createUTC([2000, i]);
              if (strict && !this._longMonthsParse[i]) {
                  this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                  this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
              }
              if (!strict && !this._monthsParse[i]) {
                  regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                  this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
              }
              // test the regex
              if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                  return i;
              } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                  return i;
              } else if (!strict && this._monthsParse[i].test(monthName)) {
                  return i;
              }
          }
      }

      // MOMENTS

      function setMonth (mom, value) {
          var dayOfMonth;

          if (!mom.isValid()) {
              // No op
              return mom;
          }

          if (typeof value === 'string') {
              if (/^\d+$/.test(value)) {
                  value = toInt(value);
              } else {
                  value = mom.localeData().monthsParse(value);
                  // TODO: Another silent failure?
                  if (!isNumber(value)) {
                      return mom;
                  }
              }
          }

          dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
          mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
          return mom;
      }

      function getSetMonth (value) {
          if (value != null) {
              setMonth(this, value);
              hooks.updateOffset(this, true);
              return this;
          } else {
              return get(this, 'Month');
          }
      }

      function getDaysInMonth () {
          return daysInMonth(this.year(), this.month());
      }

      var defaultMonthsShortRegex = matchWord;
      function monthsShortRegex (isStrict) {
          if (this._monthsParseExact) {
              if (!hasOwnProp(this, '_monthsRegex')) {
                  computeMonthsParse.call(this);
              }
              if (isStrict) {
                  return this._monthsShortStrictRegex;
              } else {
                  return this._monthsShortRegex;
              }
          } else {
              if (!hasOwnProp(this, '_monthsShortRegex')) {
                  this._monthsShortRegex = defaultMonthsShortRegex;
              }
              return this._monthsShortStrictRegex && isStrict ?
                  this._monthsShortStrictRegex : this._monthsShortRegex;
          }
      }

      var defaultMonthsRegex = matchWord;
      function monthsRegex (isStrict) {
          if (this._monthsParseExact) {
              if (!hasOwnProp(this, '_monthsRegex')) {
                  computeMonthsParse.call(this);
              }
              if (isStrict) {
                  return this._monthsStrictRegex;
              } else {
                  return this._monthsRegex;
              }
          } else {
              if (!hasOwnProp(this, '_monthsRegex')) {
                  this._monthsRegex = defaultMonthsRegex;
              }
              return this._monthsStrictRegex && isStrict ?
                  this._monthsStrictRegex : this._monthsRegex;
          }
      }

      function computeMonthsParse () {
          function cmpLenRev(a, b) {
              return b.length - a.length;
          }

          var shortPieces = [], longPieces = [], mixedPieces = [],
              i, mom;
          for (i = 0; i < 12; i++) {
              // make the regex if we don't have it already
              mom = createUTC([2000, i]);
              shortPieces.push(this.monthsShort(mom, ''));
              longPieces.push(this.months(mom, ''));
              mixedPieces.push(this.months(mom, ''));
              mixedPieces.push(this.monthsShort(mom, ''));
          }
          // Sorting makes sure if one month (or abbr) is a prefix of another it
          // will match the longer piece.
          shortPieces.sort(cmpLenRev);
          longPieces.sort(cmpLenRev);
          mixedPieces.sort(cmpLenRev);
          for (i = 0; i < 12; i++) {
              shortPieces[i] = regexEscape(shortPieces[i]);
              longPieces[i] = regexEscape(longPieces[i]);
          }
          for (i = 0; i < 24; i++) {
              mixedPieces[i] = regexEscape(mixedPieces[i]);
          }

          this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
          this._monthsShortRegex = this._monthsRegex;
          this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
          this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
      }

      function createDate (y, m, d, h, M, s, ms) {
          // can't just apply() to create a date:
          // https://stackoverflow.com/q/181348
          var date;
          // the date constructor remaps years 0-99 to 1900-1999
          if (y < 100 && y >= 0) {
              // preserve leap years using a full 400 year cycle, then reset
              date = new Date(y + 400, m, d, h, M, s, ms);
              if (isFinite(date.getFullYear())) {
                  date.setFullYear(y);
              }
          } else {
              date = new Date(y, m, d, h, M, s, ms);
          }

          return date;
      }

      function createUTCDate (y) {
          var date;
          // the Date.UTC function remaps years 0-99 to 1900-1999
          if (y < 100 && y >= 0) {
              var args = Array.prototype.slice.call(arguments);
              // preserve leap years using a full 400 year cycle, then reset
              args[0] = y + 400;
              date = new Date(Date.UTC.apply(null, args));
              if (isFinite(date.getUTCFullYear())) {
                  date.setUTCFullYear(y);
              }
          } else {
              date = new Date(Date.UTC.apply(null, arguments));
          }

          return date;
      }

      // start-of-first-week - start-of-year
      function firstWeekOffset(year, dow, doy) {
          var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
              fwd = 7 + dow - doy,
              // first-week day local weekday -- which local weekday is fwd
              fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

          return -fwdlw + fwd - 1;
      }

      // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
      function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
          var localWeekday = (7 + weekday - dow) % 7,
              weekOffset = firstWeekOffset(year, dow, doy),
              dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
              resYear, resDayOfYear;

          if (dayOfYear <= 0) {
              resYear = year - 1;
              resDayOfYear = daysInYear(resYear) + dayOfYear;
          } else if (dayOfYear > daysInYear(year)) {
              resYear = year + 1;
              resDayOfYear = dayOfYear - daysInYear(year);
          } else {
              resYear = year;
              resDayOfYear = dayOfYear;
          }

          return {
              year: resYear,
              dayOfYear: resDayOfYear
          };
      }

      function weekOfYear(mom, dow, doy) {
          var weekOffset = firstWeekOffset(mom.year(), dow, doy),
              week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
              resWeek, resYear;

          if (week < 1) {
              resYear = mom.year() - 1;
              resWeek = week + weeksInYear(resYear, dow, doy);
          } else if (week > weeksInYear(mom.year(), dow, doy)) {
              resWeek = week - weeksInYear(mom.year(), dow, doy);
              resYear = mom.year() + 1;
          } else {
              resYear = mom.year();
              resWeek = week;
          }

          return {
              week: resWeek,
              year: resYear
          };
      }

      function weeksInYear(year, dow, doy) {
          var weekOffset = firstWeekOffset(year, dow, doy),
              weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
          return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
      }

      // FORMATTING

      addFormatToken('w', ['ww', 2], 'wo', 'week');
      addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

      // ALIASES

      addUnitAlias('week', 'w');
      addUnitAlias('isoWeek', 'W');

      // PRIORITIES

      addUnitPriority('week', 5);
      addUnitPriority('isoWeek', 5);

      // PARSING

      addRegexToken('w',  match1to2);
      addRegexToken('ww', match1to2, match2);
      addRegexToken('W',  match1to2);
      addRegexToken('WW', match1to2, match2);

      addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
          week[token.substr(0, 1)] = toInt(input);
      });

      // HELPERS

      // LOCALES

      function localeWeek (mom) {
          return weekOfYear(mom, this._week.dow, this._week.doy).week;
      }

      var defaultLocaleWeek = {
          dow : 0, // Sunday is the first day of the week.
          doy : 6  // The week that contains Jan 6th is the first week of the year.
      };

      function localeFirstDayOfWeek () {
          return this._week.dow;
      }

      function localeFirstDayOfYear () {
          return this._week.doy;
      }

      // MOMENTS

      function getSetWeek (input) {
          var week = this.localeData().week(this);
          return input == null ? week : this.add((input - week) * 7, 'd');
      }

      function getSetISOWeek (input) {
          var week = weekOfYear(this, 1, 4).week;
          return input == null ? week : this.add((input - week) * 7, 'd');
      }

      // FORMATTING

      addFormatToken('d', 0, 'do', 'day');

      addFormatToken('dd', 0, 0, function (format) {
          return this.localeData().weekdaysMin(this, format);
      });

      addFormatToken('ddd', 0, 0, function (format) {
          return this.localeData().weekdaysShort(this, format);
      });

      addFormatToken('dddd', 0, 0, function (format) {
          return this.localeData().weekdays(this, format);
      });

      addFormatToken('e', 0, 0, 'weekday');
      addFormatToken('E', 0, 0, 'isoWeekday');

      // ALIASES

      addUnitAlias('day', 'd');
      addUnitAlias('weekday', 'e');
      addUnitAlias('isoWeekday', 'E');

      // PRIORITY
      addUnitPriority('day', 11);
      addUnitPriority('weekday', 11);
      addUnitPriority('isoWeekday', 11);

      // PARSING

      addRegexToken('d',    match1to2);
      addRegexToken('e',    match1to2);
      addRegexToken('E',    match1to2);
      addRegexToken('dd',   function (isStrict, locale) {
          return locale.weekdaysMinRegex(isStrict);
      });
      addRegexToken('ddd',   function (isStrict, locale) {
          return locale.weekdaysShortRegex(isStrict);
      });
      addRegexToken('dddd',   function (isStrict, locale) {
          return locale.weekdaysRegex(isStrict);
      });

      addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
          var weekday = config._locale.weekdaysParse(input, token, config._strict);
          // if we didn't get a weekday name, mark the date as invalid
          if (weekday != null) {
              week.d = weekday;
          } else {
              getParsingFlags(config).invalidWeekday = input;
          }
      });

      addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
          week[token] = toInt(input);
      });

      // HELPERS

      function parseWeekday(input, locale) {
          if (typeof input !== 'string') {
              return input;
          }

          if (!isNaN(input)) {
              return parseInt(input, 10);
          }

          input = locale.weekdaysParse(input);
          if (typeof input === 'number') {
              return input;
          }

          return null;
      }

      function parseIsoWeekday(input, locale) {
          if (typeof input === 'string') {
              return locale.weekdaysParse(input) % 7 || 7;
          }
          return isNaN(input) ? null : input;
      }

      // LOCALES
      function shiftWeekdays (ws, n) {
          return ws.slice(n, 7).concat(ws.slice(0, n));
      }

      var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
      function localeWeekdays (m, format) {
          var weekdays = isArray(this._weekdays) ? this._weekdays :
              this._weekdays[(m && m !== true && this._weekdays.isFormat.test(format)) ? 'format' : 'standalone'];
          return (m === true) ? shiftWeekdays(weekdays, this._week.dow)
              : (m) ? weekdays[m.day()] : weekdays;
      }

      var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
      function localeWeekdaysShort (m) {
          return (m === true) ? shiftWeekdays(this._weekdaysShort, this._week.dow)
              : (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
      }

      var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
      function localeWeekdaysMin (m) {
          return (m === true) ? shiftWeekdays(this._weekdaysMin, this._week.dow)
              : (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
      }

      function handleStrictParse$1(weekdayName, format, strict) {
          var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
          if (!this._weekdaysParse) {
              this._weekdaysParse = [];
              this._shortWeekdaysParse = [];
              this._minWeekdaysParse = [];

              for (i = 0; i < 7; ++i) {
                  mom = createUTC([2000, 1]).day(i);
                  this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                  this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                  this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
              }
          }

          if (strict) {
              if (format === 'dddd') {
                  ii = indexOf.call(this._weekdaysParse, llc);
                  return ii !== -1 ? ii : null;
              } else if (format === 'ddd') {
                  ii = indexOf.call(this._shortWeekdaysParse, llc);
                  return ii !== -1 ? ii : null;
              } else {
                  ii = indexOf.call(this._minWeekdaysParse, llc);
                  return ii !== -1 ? ii : null;
              }
          } else {
              if (format === 'dddd') {
                  ii = indexOf.call(this._weekdaysParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._shortWeekdaysParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._minWeekdaysParse, llc);
                  return ii !== -1 ? ii : null;
              } else if (format === 'ddd') {
                  ii = indexOf.call(this._shortWeekdaysParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._weekdaysParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._minWeekdaysParse, llc);
                  return ii !== -1 ? ii : null;
              } else {
                  ii = indexOf.call(this._minWeekdaysParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._weekdaysParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._shortWeekdaysParse, llc);
                  return ii !== -1 ? ii : null;
              }
          }
      }

      function localeWeekdaysParse (weekdayName, format, strict) {
          var i, mom, regex;

          if (this._weekdaysParseExact) {
              return handleStrictParse$1.call(this, weekdayName, format, strict);
          }

          if (!this._weekdaysParse) {
              this._weekdaysParse = [];
              this._minWeekdaysParse = [];
              this._shortWeekdaysParse = [];
              this._fullWeekdaysParse = [];
          }

          for (i = 0; i < 7; i++) {
              // make the regex if we don't have it already

              mom = createUTC([2000, 1]).day(i);
              if (strict && !this._fullWeekdaysParse[i]) {
                  this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
                  this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
                  this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
              }
              if (!this._weekdaysParse[i]) {
                  regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                  this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
              }
              // test the regex
              if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                  return i;
              } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                  return i;
              } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                  return i;
              } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                  return i;
              }
          }
      }

      // MOMENTS

      function getSetDayOfWeek (input) {
          if (!this.isValid()) {
              return input != null ? this : NaN;
          }
          var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
          if (input != null) {
              input = parseWeekday(input, this.localeData());
              return this.add(input - day, 'd');
          } else {
              return day;
          }
      }

      function getSetLocaleDayOfWeek (input) {
          if (!this.isValid()) {
              return input != null ? this : NaN;
          }
          var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
          return input == null ? weekday : this.add(input - weekday, 'd');
      }

      function getSetISODayOfWeek (input) {
          if (!this.isValid()) {
              return input != null ? this : NaN;
          }

          // behaves the same as moment#day except
          // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
          // as a setter, sunday should belong to the previous week.

          if (input != null) {
              var weekday = parseIsoWeekday(input, this.localeData());
              return this.day(this.day() % 7 ? weekday : weekday - 7);
          } else {
              return this.day() || 7;
          }
      }

      var defaultWeekdaysRegex = matchWord;
      function weekdaysRegex (isStrict) {
          if (this._weekdaysParseExact) {
              if (!hasOwnProp(this, '_weekdaysRegex')) {
                  computeWeekdaysParse.call(this);
              }
              if (isStrict) {
                  return this._weekdaysStrictRegex;
              } else {
                  return this._weekdaysRegex;
              }
          } else {
              if (!hasOwnProp(this, '_weekdaysRegex')) {
                  this._weekdaysRegex = defaultWeekdaysRegex;
              }
              return this._weekdaysStrictRegex && isStrict ?
                  this._weekdaysStrictRegex : this._weekdaysRegex;
          }
      }

      var defaultWeekdaysShortRegex = matchWord;
      function weekdaysShortRegex (isStrict) {
          if (this._weekdaysParseExact) {
              if (!hasOwnProp(this, '_weekdaysRegex')) {
                  computeWeekdaysParse.call(this);
              }
              if (isStrict) {
                  return this._weekdaysShortStrictRegex;
              } else {
                  return this._weekdaysShortRegex;
              }
          } else {
              if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                  this._weekdaysShortRegex = defaultWeekdaysShortRegex;
              }
              return this._weekdaysShortStrictRegex && isStrict ?
                  this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
          }
      }

      var defaultWeekdaysMinRegex = matchWord;
      function weekdaysMinRegex (isStrict) {
          if (this._weekdaysParseExact) {
              if (!hasOwnProp(this, '_weekdaysRegex')) {
                  computeWeekdaysParse.call(this);
              }
              if (isStrict) {
                  return this._weekdaysMinStrictRegex;
              } else {
                  return this._weekdaysMinRegex;
              }
          } else {
              if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                  this._weekdaysMinRegex = defaultWeekdaysMinRegex;
              }
              return this._weekdaysMinStrictRegex && isStrict ?
                  this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
          }
      }


      function computeWeekdaysParse () {
          function cmpLenRev(a, b) {
              return b.length - a.length;
          }

          var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
              i, mom, minp, shortp, longp;
          for (i = 0; i < 7; i++) {
              // make the regex if we don't have it already
              mom = createUTC([2000, 1]).day(i);
              minp = this.weekdaysMin(mom, '');
              shortp = this.weekdaysShort(mom, '');
              longp = this.weekdays(mom, '');
              minPieces.push(minp);
              shortPieces.push(shortp);
              longPieces.push(longp);
              mixedPieces.push(minp);
              mixedPieces.push(shortp);
              mixedPieces.push(longp);
          }
          // Sorting makes sure if one weekday (or abbr) is a prefix of another it
          // will match the longer piece.
          minPieces.sort(cmpLenRev);
          shortPieces.sort(cmpLenRev);
          longPieces.sort(cmpLenRev);
          mixedPieces.sort(cmpLenRev);
          for (i = 0; i < 7; i++) {
              shortPieces[i] = regexEscape(shortPieces[i]);
              longPieces[i] = regexEscape(longPieces[i]);
              mixedPieces[i] = regexEscape(mixedPieces[i]);
          }

          this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
          this._weekdaysShortRegex = this._weekdaysRegex;
          this._weekdaysMinRegex = this._weekdaysRegex;

          this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
          this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
          this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
      }

      // FORMATTING

      function hFormat() {
          return this.hours() % 12 || 12;
      }

      function kFormat() {
          return this.hours() || 24;
      }

      addFormatToken('H', ['HH', 2], 0, 'hour');
      addFormatToken('h', ['hh', 2], 0, hFormat);
      addFormatToken('k', ['kk', 2], 0, kFormat);

      addFormatToken('hmm', 0, 0, function () {
          return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
      });

      addFormatToken('hmmss', 0, 0, function () {
          return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
              zeroFill(this.seconds(), 2);
      });

      addFormatToken('Hmm', 0, 0, function () {
          return '' + this.hours() + zeroFill(this.minutes(), 2);
      });

      addFormatToken('Hmmss', 0, 0, function () {
          return '' + this.hours() + zeroFill(this.minutes(), 2) +
              zeroFill(this.seconds(), 2);
      });

      function meridiem (token, lowercase) {
          addFormatToken(token, 0, 0, function () {
              return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
          });
      }

      meridiem('a', true);
      meridiem('A', false);

      // ALIASES

      addUnitAlias('hour', 'h');

      // PRIORITY
      addUnitPriority('hour', 13);

      // PARSING

      function matchMeridiem (isStrict, locale) {
          return locale._meridiemParse;
      }

      addRegexToken('a',  matchMeridiem);
      addRegexToken('A',  matchMeridiem);
      addRegexToken('H',  match1to2);
      addRegexToken('h',  match1to2);
      addRegexToken('k',  match1to2);
      addRegexToken('HH', match1to2, match2);
      addRegexToken('hh', match1to2, match2);
      addRegexToken('kk', match1to2, match2);

      addRegexToken('hmm', match3to4);
      addRegexToken('hmmss', match5to6);
      addRegexToken('Hmm', match3to4);
      addRegexToken('Hmmss', match5to6);

      addParseToken(['H', 'HH'], HOUR);
      addParseToken(['k', 'kk'], function (input, array, config) {
          var kInput = toInt(input);
          array[HOUR] = kInput === 24 ? 0 : kInput;
      });
      addParseToken(['a', 'A'], function (input, array, config) {
          config._isPm = config._locale.isPM(input);
          config._meridiem = input;
      });
      addParseToken(['h', 'hh'], function (input, array, config) {
          array[HOUR] = toInt(input);
          getParsingFlags(config).bigHour = true;
      });
      addParseToken('hmm', function (input, array, config) {
          var pos = input.length - 2;
          array[HOUR] = toInt(input.substr(0, pos));
          array[MINUTE] = toInt(input.substr(pos));
          getParsingFlags(config).bigHour = true;
      });
      addParseToken('hmmss', function (input, array, config) {
          var pos1 = input.length - 4;
          var pos2 = input.length - 2;
          array[HOUR] = toInt(input.substr(0, pos1));
          array[MINUTE] = toInt(input.substr(pos1, 2));
          array[SECOND] = toInt(input.substr(pos2));
          getParsingFlags(config).bigHour = true;
      });
      addParseToken('Hmm', function (input, array, config) {
          var pos = input.length - 2;
          array[HOUR] = toInt(input.substr(0, pos));
          array[MINUTE] = toInt(input.substr(pos));
      });
      addParseToken('Hmmss', function (input, array, config) {
          var pos1 = input.length - 4;
          var pos2 = input.length - 2;
          array[HOUR] = toInt(input.substr(0, pos1));
          array[MINUTE] = toInt(input.substr(pos1, 2));
          array[SECOND] = toInt(input.substr(pos2));
      });

      // LOCALES

      function localeIsPM (input) {
          // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
          // Using charAt should be more compatible.
          return ((input + '').toLowerCase().charAt(0) === 'p');
      }

      var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
      function localeMeridiem (hours, minutes, isLower) {
          if (hours > 11) {
              return isLower ? 'pm' : 'PM';
          } else {
              return isLower ? 'am' : 'AM';
          }
      }


      // MOMENTS

      // Setting the hour should keep the time, because the user explicitly
      // specified which hour they want. So trying to maintain the same hour (in
      // a new timezone) makes sense. Adding/subtracting hours does not follow
      // this rule.
      var getSetHour = makeGetSet('Hours', true);

      var baseConfig = {
          calendar: defaultCalendar,
          longDateFormat: defaultLongDateFormat,
          invalidDate: defaultInvalidDate,
          ordinal: defaultOrdinal,
          dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
          relativeTime: defaultRelativeTime,

          months: defaultLocaleMonths,
          monthsShort: defaultLocaleMonthsShort,

          week: defaultLocaleWeek,

          weekdays: defaultLocaleWeekdays,
          weekdaysMin: defaultLocaleWeekdaysMin,
          weekdaysShort: defaultLocaleWeekdaysShort,

          meridiemParse: defaultLocaleMeridiemParse
      };

      // internal storage for locale config files
      var locales = {};
      var localeFamilies = {};
      var globalLocale;

      function normalizeLocale(key) {
          return key ? key.toLowerCase().replace('_', '-') : key;
      }

      // pick the locale from the array
      // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
      // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
      function chooseLocale(names) {
          var i = 0, j, next, locale, split;

          while (i < names.length) {
              split = normalizeLocale(names[i]).split('-');
              j = split.length;
              next = normalizeLocale(names[i + 1]);
              next = next ? next.split('-') : null;
              while (j > 0) {
                  locale = loadLocale(split.slice(0, j).join('-'));
                  if (locale) {
                      return locale;
                  }
                  if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                      //the next array item is better than a shallower substring of this one
                      break;
                  }
                  j--;
              }
              i++;
          }
          return globalLocale;
      }

      function loadLocale(name) {
          var oldLocale = null;
          // TODO: Find a better way to register and load all the locales in Node
          if (!locales[name] && ('object' !== 'undefined') &&
                  module && module.exports) {
              try {
                  oldLocale = globalLocale._abbr;
                  var aliasedRequire = require;
                  aliasedRequire('./locale/' + name);
                  getSetGlobalLocale(oldLocale);
              } catch (e) {}
          }
          return locales[name];
      }

      // This function will load locale and then set the global locale.  If
      // no arguments are passed in, it will simply return the current global
      // locale key.
      function getSetGlobalLocale (key, values) {
          var data;
          if (key) {
              if (isUndefined(values)) {
                  data = getLocale(key);
              }
              else {
                  data = defineLocale(key, values);
              }

              if (data) {
                  // moment.duration._locale = moment._locale = data;
                  globalLocale = data;
              }
              else {
                  if ((typeof console !==  'undefined') && console.warn) {
                      //warn user if arguments are passed but the locale could not be set
                      console.warn('Locale ' + key +  ' not found. Did you forget to load it?');
                  }
              }
          }

          return globalLocale._abbr;
      }

      function defineLocale (name, config) {
          if (config !== null) {
              var locale, parentConfig = baseConfig;
              config.abbr = name;
              if (locales[name] != null) {
                  deprecateSimple('defineLocaleOverride',
                          'use moment.updateLocale(localeName, config) to change ' +
                          'an existing locale. moment.defineLocale(localeName, ' +
                          'config) should only be used for creating a new locale ' +
                          'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                  parentConfig = locales[name]._config;
              } else if (config.parentLocale != null) {
                  if (locales[config.parentLocale] != null) {
                      parentConfig = locales[config.parentLocale]._config;
                  } else {
                      locale = loadLocale(config.parentLocale);
                      if (locale != null) {
                          parentConfig = locale._config;
                      } else {
                          if (!localeFamilies[config.parentLocale]) {
                              localeFamilies[config.parentLocale] = [];
                          }
                          localeFamilies[config.parentLocale].push({
                              name: name,
                              config: config
                          });
                          return null;
                      }
                  }
              }
              locales[name] = new Locale(mergeConfigs(parentConfig, config));

              if (localeFamilies[name]) {
                  localeFamilies[name].forEach(function (x) {
                      defineLocale(x.name, x.config);
                  });
              }

              // backwards compat for now: also set the locale
              // make sure we set the locale AFTER all child locales have been
              // created, so we won't end up with the child locale set.
              getSetGlobalLocale(name);


              return locales[name];
          } else {
              // useful for testing
              delete locales[name];
              return null;
          }
      }

      function updateLocale(name, config) {
          if (config != null) {
              var locale, tmpLocale, parentConfig = baseConfig;
              // MERGE
              tmpLocale = loadLocale(name);
              if (tmpLocale != null) {
                  parentConfig = tmpLocale._config;
              }
              config = mergeConfigs(parentConfig, config);
              locale = new Locale(config);
              locale.parentLocale = locales[name];
              locales[name] = locale;

              // backwards compat for now: also set the locale
              getSetGlobalLocale(name);
          } else {
              // pass null for config to unupdate, useful for tests
              if (locales[name] != null) {
                  if (locales[name].parentLocale != null) {
                      locales[name] = locales[name].parentLocale;
                  } else if (locales[name] != null) {
                      delete locales[name];
                  }
              }
          }
          return locales[name];
      }

      // returns locale data
      function getLocale (key) {
          var locale;

          if (key && key._locale && key._locale._abbr) {
              key = key._locale._abbr;
          }

          if (!key) {
              return globalLocale;
          }

          if (!isArray(key)) {
              //short-circuit everything else
              locale = loadLocale(key);
              if (locale) {
                  return locale;
              }
              key = [key];
          }

          return chooseLocale(key);
      }

      function listLocales() {
          return keys(locales);
      }

      function checkOverflow (m) {
          var overflow;
          var a = m._a;

          if (a && getParsingFlags(m).overflow === -2) {
              overflow =
                  a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                  a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                  a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                  a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                  a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                  a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                  -1;

              if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                  overflow = DATE;
              }
              if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                  overflow = WEEK;
              }
              if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                  overflow = WEEKDAY;
              }

              getParsingFlags(m).overflow = overflow;
          }

          return m;
      }

      // Pick the first defined of two or three arguments.
      function defaults(a, b, c) {
          if (a != null) {
              return a;
          }
          if (b != null) {
              return b;
          }
          return c;
      }

      function currentDateArray(config) {
          // hooks is actually the exported moment object
          var nowValue = new Date(hooks.now());
          if (config._useUTC) {
              return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
          }
          return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
      }

      // convert an array to a date.
      // the array should mirror the parameters below
      // note: all values past the year are optional and will default to the lowest possible value.
      // [year, month, day , hour, minute, second, millisecond]
      function configFromArray (config) {
          var i, date, input = [], currentDate, expectedWeekday, yearToUse;

          if (config._d) {
              return;
          }

          currentDate = currentDateArray(config);

          //compute day of the year from weeks and weekdays
          if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
              dayOfYearFromWeekInfo(config);
          }

          //if the day of the year is set, figure out what it is
          if (config._dayOfYear != null) {
              yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

              if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                  getParsingFlags(config)._overflowDayOfYear = true;
              }

              date = createUTCDate(yearToUse, 0, config._dayOfYear);
              config._a[MONTH] = date.getUTCMonth();
              config._a[DATE] = date.getUTCDate();
          }

          // Default to current date.
          // * if no year, month, day of month are given, default to today
          // * if day of month is given, default month and year
          // * if month is given, default only year
          // * if year is given, don't default anything
          for (i = 0; i < 3 && config._a[i] == null; ++i) {
              config._a[i] = input[i] = currentDate[i];
          }

          // Zero out whatever was not defaulted, including time
          for (; i < 7; i++) {
              config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
          }

          // Check for 24:00:00.000
          if (config._a[HOUR] === 24 &&
                  config._a[MINUTE] === 0 &&
                  config._a[SECOND] === 0 &&
                  config._a[MILLISECOND] === 0) {
              config._nextDay = true;
              config._a[HOUR] = 0;
          }

          config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
          expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

          // Apply timezone offset from input. The actual utcOffset can be changed
          // with parseZone.
          if (config._tzm != null) {
              config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
          }

          if (config._nextDay) {
              config._a[HOUR] = 24;
          }

          // check for mismatching day of week
          if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
              getParsingFlags(config).weekdayMismatch = true;
          }
      }

      function dayOfYearFromWeekInfo(config) {
          var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

          w = config._w;
          if (w.GG != null || w.W != null || w.E != null) {
              dow = 1;
              doy = 4;

              // TODO: We need to take the current isoWeekYear, but that depends on
              // how we interpret now (local, utc, fixed offset). So create
              // a now version of current config (take local/utc/offset flags, and
              // create now).
              weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
              week = defaults(w.W, 1);
              weekday = defaults(w.E, 1);
              if (weekday < 1 || weekday > 7) {
                  weekdayOverflow = true;
              }
          } else {
              dow = config._locale._week.dow;
              doy = config._locale._week.doy;

              var curWeek = weekOfYear(createLocal(), dow, doy);

              weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

              // Default to current week.
              week = defaults(w.w, curWeek.week);

              if (w.d != null) {
                  // weekday -- low day numbers are considered next week
                  weekday = w.d;
                  if (weekday < 0 || weekday > 6) {
                      weekdayOverflow = true;
                  }
              } else if (w.e != null) {
                  // local weekday -- counting starts from beginning of week
                  weekday = w.e + dow;
                  if (w.e < 0 || w.e > 6) {
                      weekdayOverflow = true;
                  }
              } else {
                  // default to beginning of week
                  weekday = dow;
              }
          }
          if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
              getParsingFlags(config)._overflowWeeks = true;
          } else if (weekdayOverflow != null) {
              getParsingFlags(config)._overflowWeekday = true;
          } else {
              temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
              config._a[YEAR] = temp.year;
              config._dayOfYear = temp.dayOfYear;
          }
      }

      // iso 8601 regex
      // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
      var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
      var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

      var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

      var isoDates = [
          ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
          ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
          ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
          ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
          ['YYYY-DDD', /\d{4}-\d{3}/],
          ['YYYY-MM', /\d{4}-\d\d/, false],
          ['YYYYYYMMDD', /[+-]\d{10}/],
          ['YYYYMMDD', /\d{8}/],
          // YYYYMM is NOT allowed by the standard
          ['GGGG[W]WWE', /\d{4}W\d{3}/],
          ['GGGG[W]WW', /\d{4}W\d{2}/, false],
          ['YYYYDDD', /\d{7}/]
      ];

      // iso time formats and regexes
      var isoTimes = [
          ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
          ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
          ['HH:mm:ss', /\d\d:\d\d:\d\d/],
          ['HH:mm', /\d\d:\d\d/],
          ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
          ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
          ['HHmmss', /\d\d\d\d\d\d/],
          ['HHmm', /\d\d\d\d/],
          ['HH', /\d\d/]
      ];

      var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

      // date from iso format
      function configFromISO(config) {
          var i, l,
              string = config._i,
              match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
              allowTime, dateFormat, timeFormat, tzFormat;

          if (match) {
              getParsingFlags(config).iso = true;

              for (i = 0, l = isoDates.length; i < l; i++) {
                  if (isoDates[i][1].exec(match[1])) {
                      dateFormat = isoDates[i][0];
                      allowTime = isoDates[i][2] !== false;
                      break;
                  }
              }
              if (dateFormat == null) {
                  config._isValid = false;
                  return;
              }
              if (match[3]) {
                  for (i = 0, l = isoTimes.length; i < l; i++) {
                      if (isoTimes[i][1].exec(match[3])) {
                          // match[2] should be 'T' or space
                          timeFormat = (match[2] || ' ') + isoTimes[i][0];
                          break;
                      }
                  }
                  if (timeFormat == null) {
                      config._isValid = false;
                      return;
                  }
              }
              if (!allowTime && timeFormat != null) {
                  config._isValid = false;
                  return;
              }
              if (match[4]) {
                  if (tzRegex.exec(match[4])) {
                      tzFormat = 'Z';
                  } else {
                      config._isValid = false;
                      return;
                  }
              }
              config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
              configFromStringAndFormat(config);
          } else {
              config._isValid = false;
          }
      }

      // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
      var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

      function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
          var result = [
              untruncateYear(yearStr),
              defaultLocaleMonthsShort.indexOf(monthStr),
              parseInt(dayStr, 10),
              parseInt(hourStr, 10),
              parseInt(minuteStr, 10)
          ];

          if (secondStr) {
              result.push(parseInt(secondStr, 10));
          }

          return result;
      }

      function untruncateYear(yearStr) {
          var year = parseInt(yearStr, 10);
          if (year <= 49) {
              return 2000 + year;
          } else if (year <= 999) {
              return 1900 + year;
          }
          return year;
      }

      function preprocessRFC2822(s) {
          // Remove comments and folding whitespace and replace multiple-spaces with a single space
          return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      }

      function checkWeekday(weekdayStr, parsedInput, config) {
          if (weekdayStr) {
              // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
              var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                  weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
              if (weekdayProvided !== weekdayActual) {
                  getParsingFlags(config).weekdayMismatch = true;
                  config._isValid = false;
                  return false;
              }
          }
          return true;
      }

      var obsOffsets = {
          UT: 0,
          GMT: 0,
          EDT: -4 * 60,
          EST: -5 * 60,
          CDT: -5 * 60,
          CST: -6 * 60,
          MDT: -6 * 60,
          MST: -7 * 60,
          PDT: -7 * 60,
          PST: -8 * 60
      };

      function calculateOffset(obsOffset, militaryOffset, numOffset) {
          if (obsOffset) {
              return obsOffsets[obsOffset];
          } else if (militaryOffset) {
              // the only allowed military tz is Z
              return 0;
          } else {
              var hm = parseInt(numOffset, 10);
              var m = hm % 100, h = (hm - m) / 100;
              return h * 60 + m;
          }
      }

      // date and time from ref 2822 format
      function configFromRFC2822(config) {
          var match = rfc2822.exec(preprocessRFC2822(config._i));
          if (match) {
              var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
              if (!checkWeekday(match[1], parsedArray, config)) {
                  return;
              }

              config._a = parsedArray;
              config._tzm = calculateOffset(match[8], match[9], match[10]);

              config._d = createUTCDate.apply(null, config._a);
              config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

              getParsingFlags(config).rfc2822 = true;
          } else {
              config._isValid = false;
          }
      }

      // date from iso format or fallback
      function configFromString(config) {
          var matched = aspNetJsonRegex.exec(config._i);

          if (matched !== null) {
              config._d = new Date(+matched[1]);
              return;
          }

          configFromISO(config);
          if (config._isValid === false) {
              delete config._isValid;
          } else {
              return;
          }

          configFromRFC2822(config);
          if (config._isValid === false) {
              delete config._isValid;
          } else {
              return;
          }

          // Final attempt, use Input Fallback
          hooks.createFromInputFallback(config);
      }

      hooks.createFromInputFallback = deprecate(
          'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
          'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
          'discouraged and will be removed in an upcoming major release. Please refer to ' +
          'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
          function (config) {
              config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
          }
      );

      // constant that refers to the ISO standard
      hooks.ISO_8601 = function () {};

      // constant that refers to the RFC 2822 form
      hooks.RFC_2822 = function () {};

      // date from string and format string
      function configFromStringAndFormat(config) {
          // TODO: Move this to another part of the creation flow to prevent circular deps
          if (config._f === hooks.ISO_8601) {
              configFromISO(config);
              return;
          }
          if (config._f === hooks.RFC_2822) {
              configFromRFC2822(config);
              return;
          }
          config._a = [];
          getParsingFlags(config).empty = true;

          // This array is used to make a Date, either with `new Date` or `Date.UTC`
          var string = '' + config._i,
              i, parsedInput, tokens, token, skipped,
              stringLength = string.length,
              totalParsedInputLength = 0;

          tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

          for (i = 0; i < tokens.length; i++) {
              token = tokens[i];
              parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
              // console.log('token', token, 'parsedInput', parsedInput,
              //         'regex', getParseRegexForToken(token, config));
              if (parsedInput) {
                  skipped = string.substr(0, string.indexOf(parsedInput));
                  if (skipped.length > 0) {
                      getParsingFlags(config).unusedInput.push(skipped);
                  }
                  string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                  totalParsedInputLength += parsedInput.length;
              }
              // don't parse if it's not a known token
              if (formatTokenFunctions[token]) {
                  if (parsedInput) {
                      getParsingFlags(config).empty = false;
                  }
                  else {
                      getParsingFlags(config).unusedTokens.push(token);
                  }
                  addTimeToArrayFromToken(token, parsedInput, config);
              }
              else if (config._strict && !parsedInput) {
                  getParsingFlags(config).unusedTokens.push(token);
              }
          }

          // add remaining unparsed input length to the string
          getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
          if (string.length > 0) {
              getParsingFlags(config).unusedInput.push(string);
          }

          // clear _12h flag if hour is <= 12
          if (config._a[HOUR] <= 12 &&
              getParsingFlags(config).bigHour === true &&
              config._a[HOUR] > 0) {
              getParsingFlags(config).bigHour = undefined;
          }

          getParsingFlags(config).parsedDateParts = config._a.slice(0);
          getParsingFlags(config).meridiem = config._meridiem;
          // handle meridiem
          config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

          configFromArray(config);
          checkOverflow(config);
      }


      function meridiemFixWrap (locale, hour, meridiem) {
          var isPm;

          if (meridiem == null) {
              // nothing to do
              return hour;
          }
          if (locale.meridiemHour != null) {
              return locale.meridiemHour(hour, meridiem);
          } else if (locale.isPM != null) {
              // Fallback
              isPm = locale.isPM(meridiem);
              if (isPm && hour < 12) {
                  hour += 12;
              }
              if (!isPm && hour === 12) {
                  hour = 0;
              }
              return hour;
          } else {
              // this is not supposed to happen
              return hour;
          }
      }

      // date from string and array of format strings
      function configFromStringAndArray(config) {
          var tempConfig,
              bestMoment,

              scoreToBeat,
              i,
              currentScore;

          if (config._f.length === 0) {
              getParsingFlags(config).invalidFormat = true;
              config._d = new Date(NaN);
              return;
          }

          for (i = 0; i < config._f.length; i++) {
              currentScore = 0;
              tempConfig = copyConfig({}, config);
              if (config._useUTC != null) {
                  tempConfig._useUTC = config._useUTC;
              }
              tempConfig._f = config._f[i];
              configFromStringAndFormat(tempConfig);

              if (!isValid(tempConfig)) {
                  continue;
              }

              // if there is any input that was not parsed add a penalty for that format
              currentScore += getParsingFlags(tempConfig).charsLeftOver;

              //or tokens
              currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

              getParsingFlags(tempConfig).score = currentScore;

              if (scoreToBeat == null || currentScore < scoreToBeat) {
                  scoreToBeat = currentScore;
                  bestMoment = tempConfig;
              }
          }

          extend(config, bestMoment || tempConfig);
      }

      function configFromObject(config) {
          if (config._d) {
              return;
          }

          var i = normalizeObjectUnits(config._i);
          config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
              return obj && parseInt(obj, 10);
          });

          configFromArray(config);
      }

      function createFromConfig (config) {
          var res = new Moment(checkOverflow(prepareConfig(config)));
          if (res._nextDay) {
              // Adding is smart enough around DST
              res.add(1, 'd');
              res._nextDay = undefined;
          }

          return res;
      }

      function prepareConfig (config) {
          var input = config._i,
              format = config._f;

          config._locale = config._locale || getLocale(config._l);

          if (input === null || (format === undefined && input === '')) {
              return createInvalid({nullInput: true});
          }

          if (typeof input === 'string') {
              config._i = input = config._locale.preparse(input);
          }

          if (isMoment(input)) {
              return new Moment(checkOverflow(input));
          } else if (isDate(input)) {
              config._d = input;
          } else if (isArray(format)) {
              configFromStringAndArray(config);
          } else if (format) {
              configFromStringAndFormat(config);
          }  else {
              configFromInput(config);
          }

          if (!isValid(config)) {
              config._d = null;
          }

          return config;
      }

      function configFromInput(config) {
          var input = config._i;
          if (isUndefined(input)) {
              config._d = new Date(hooks.now());
          } else if (isDate(input)) {
              config._d = new Date(input.valueOf());
          } else if (typeof input === 'string') {
              configFromString(config);
          } else if (isArray(input)) {
              config._a = map(input.slice(0), function (obj) {
                  return parseInt(obj, 10);
              });
              configFromArray(config);
          } else if (isObject(input)) {
              configFromObject(config);
          } else if (isNumber(input)) {
              // from milliseconds
              config._d = new Date(input);
          } else {
              hooks.createFromInputFallback(config);
          }
      }

      function createLocalOrUTC (input, format, locale, strict, isUTC) {
          var c = {};

          if (locale === true || locale === false) {
              strict = locale;
              locale = undefined;
          }

          if ((isObject(input) && isObjectEmpty(input)) ||
                  (isArray(input) && input.length === 0)) {
              input = undefined;
          }
          // object construction must be done this way.
          // https://github.com/moment/moment/issues/1423
          c._isAMomentObject = true;
          c._useUTC = c._isUTC = isUTC;
          c._l = locale;
          c._i = input;
          c._f = format;
          c._strict = strict;

          return createFromConfig(c);
      }

      function createLocal (input, format, locale, strict) {
          return createLocalOrUTC(input, format, locale, strict, false);
      }

      var prototypeMin = deprecate(
          'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
          function () {
              var other = createLocal.apply(null, arguments);
              if (this.isValid() && other.isValid()) {
                  return other < this ? this : other;
              } else {
                  return createInvalid();
              }
          }
      );

      var prototypeMax = deprecate(
          'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
          function () {
              var other = createLocal.apply(null, arguments);
              if (this.isValid() && other.isValid()) {
                  return other > this ? this : other;
              } else {
                  return createInvalid();
              }
          }
      );

      // Pick a moment m from moments so that m[fn](other) is true for all
      // other. This relies on the function fn to be transitive.
      //
      // moments should either be an array of moment objects or an array, whose
      // first element is an array of moment objects.
      function pickBy(fn, moments) {
          var res, i;
          if (moments.length === 1 && isArray(moments[0])) {
              moments = moments[0];
          }
          if (!moments.length) {
              return createLocal();
          }
          res = moments[0];
          for (i = 1; i < moments.length; ++i) {
              if (!moments[i].isValid() || moments[i][fn](res)) {
                  res = moments[i];
              }
          }
          return res;
      }

      // TODO: Use [].sort instead?
      function min () {
          var args = [].slice.call(arguments, 0);

          return pickBy('isBefore', args);
      }

      function max () {
          var args = [].slice.call(arguments, 0);

          return pickBy('isAfter', args);
      }

      var now = function () {
          return Date.now ? Date.now() : +(new Date());
      };

      var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

      function isDurationValid(m) {
          for (var key in m) {
              if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                  return false;
              }
          }

          var unitHasDecimal = false;
          for (var i = 0; i < ordering.length; ++i) {
              if (m[ordering[i]]) {
                  if (unitHasDecimal) {
                      return false; // only allow non-integers for smallest unit
                  }
                  if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                      unitHasDecimal = true;
                  }
              }
          }

          return true;
      }

      function isValid$1() {
          return this._isValid;
      }

      function createInvalid$1() {
          return createDuration(NaN);
      }

      function Duration (duration) {
          var normalizedInput = normalizeObjectUnits(duration),
              years = normalizedInput.year || 0,
              quarters = normalizedInput.quarter || 0,
              months = normalizedInput.month || 0,
              weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
              days = normalizedInput.day || 0,
              hours = normalizedInput.hour || 0,
              minutes = normalizedInput.minute || 0,
              seconds = normalizedInput.second || 0,
              milliseconds = normalizedInput.millisecond || 0;

          this._isValid = isDurationValid(normalizedInput);

          // representation for dateAddRemove
          this._milliseconds = +milliseconds +
              seconds * 1e3 + // 1000
              minutes * 6e4 + // 1000 * 60
              hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
          // Because of dateAddRemove treats 24 hours as different from a
          // day when working around DST, we need to store them separately
          this._days = +days +
              weeks * 7;
          // It is impossible to translate months into days without knowing
          // which months you are are talking about, so we have to store
          // it separately.
          this._months = +months +
              quarters * 3 +
              years * 12;

          this._data = {};

          this._locale = getLocale();

          this._bubble();
      }

      function isDuration (obj) {
          return obj instanceof Duration;
      }

      function absRound (number) {
          if (number < 0) {
              return Math.round(-1 * number) * -1;
          } else {
              return Math.round(number);
          }
      }

      // FORMATTING

      function offset (token, separator) {
          addFormatToken(token, 0, 0, function () {
              var offset = this.utcOffset();
              var sign = '+';
              if (offset < 0) {
                  offset = -offset;
                  sign = '-';
              }
              return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
          });
      }

      offset('Z', ':');
      offset('ZZ', '');

      // PARSING

      addRegexToken('Z',  matchShortOffset);
      addRegexToken('ZZ', matchShortOffset);
      addParseToken(['Z', 'ZZ'], function (input, array, config) {
          config._useUTC = true;
          config._tzm = offsetFromString(matchShortOffset, input);
      });

      // HELPERS

      // timezone chunker
      // '+10:00' > ['10',  '00']
      // '-1530'  > ['-15', '30']
      var chunkOffset = /([\+\-]|\d\d)/gi;

      function offsetFromString(matcher, string) {
          var matches = (string || '').match(matcher);

          if (matches === null) {
              return null;
          }

          var chunk   = matches[matches.length - 1] || [];
          var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
          var minutes = +(parts[1] * 60) + toInt(parts[2]);

          return minutes === 0 ?
            0 :
            parts[0] === '+' ? minutes : -minutes;
      }

      // Return a moment from input, that is local/utc/zone equivalent to model.
      function cloneWithOffset(input, model) {
          var res, diff;
          if (model._isUTC) {
              res = model.clone();
              diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
              // Use low-level api, because this fn is low-level api.
              res._d.setTime(res._d.valueOf() + diff);
              hooks.updateOffset(res, false);
              return res;
          } else {
              return createLocal(input).local();
          }
      }

      function getDateOffset (m) {
          // On Firefox.24 Date#getTimezoneOffset returns a floating point.
          // https://github.com/moment/moment/pull/1871
          return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
      }

      // HOOKS

      // This function will be called whenever a moment is mutated.
      // It is intended to keep the offset in sync with the timezone.
      hooks.updateOffset = function () {};

      // MOMENTS

      // keepLocalTime = true means only change the timezone, without
      // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
      // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
      // +0200, so we adjust the time as needed, to be valid.
      //
      // Keeping the time actually adds/subtracts (one hour)
      // from the actual represented time. That is why we call updateOffset
      // a second time. In case it wants us to change the offset again
      // _changeInProgress == true case, then we have to adjust, because
      // there is no such time in the given timezone.
      function getSetOffset (input, keepLocalTime, keepMinutes) {
          var offset = this._offset || 0,
              localAdjust;
          if (!this.isValid()) {
              return input != null ? this : NaN;
          }
          if (input != null) {
              if (typeof input === 'string') {
                  input = offsetFromString(matchShortOffset, input);
                  if (input === null) {
                      return this;
                  }
              } else if (Math.abs(input) < 16 && !keepMinutes) {
                  input = input * 60;
              }
              if (!this._isUTC && keepLocalTime) {
                  localAdjust = getDateOffset(this);
              }
              this._offset = input;
              this._isUTC = true;
              if (localAdjust != null) {
                  this.add(localAdjust, 'm');
              }
              if (offset !== input) {
                  if (!keepLocalTime || this._changeInProgress) {
                      addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                  } else if (!this._changeInProgress) {
                      this._changeInProgress = true;
                      hooks.updateOffset(this, true);
                      this._changeInProgress = null;
                  }
              }
              return this;
          } else {
              return this._isUTC ? offset : getDateOffset(this);
          }
      }

      function getSetZone (input, keepLocalTime) {
          if (input != null) {
              if (typeof input !== 'string') {
                  input = -input;
              }

              this.utcOffset(input, keepLocalTime);

              return this;
          } else {
              return -this.utcOffset();
          }
      }

      function setOffsetToUTC (keepLocalTime) {
          return this.utcOffset(0, keepLocalTime);
      }

      function setOffsetToLocal (keepLocalTime) {
          if (this._isUTC) {
              this.utcOffset(0, keepLocalTime);
              this._isUTC = false;

              if (keepLocalTime) {
                  this.subtract(getDateOffset(this), 'm');
              }
          }
          return this;
      }

      function setOffsetToParsedOffset () {
          if (this._tzm != null) {
              this.utcOffset(this._tzm, false, true);
          } else if (typeof this._i === 'string') {
              var tZone = offsetFromString(matchOffset, this._i);
              if (tZone != null) {
                  this.utcOffset(tZone);
              }
              else {
                  this.utcOffset(0, true);
              }
          }
          return this;
      }

      function hasAlignedHourOffset (input) {
          if (!this.isValid()) {
              return false;
          }
          input = input ? createLocal(input).utcOffset() : 0;

          return (this.utcOffset() - input) % 60 === 0;
      }

      function isDaylightSavingTime () {
          return (
              this.utcOffset() > this.clone().month(0).utcOffset() ||
              this.utcOffset() > this.clone().month(5).utcOffset()
          );
      }

      function isDaylightSavingTimeShifted () {
          if (!isUndefined(this._isDSTShifted)) {
              return this._isDSTShifted;
          }

          var c = {};

          copyConfig(c, this);
          c = prepareConfig(c);

          if (c._a) {
              var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
              this._isDSTShifted = this.isValid() &&
                  compareArrays(c._a, other.toArray()) > 0;
          } else {
              this._isDSTShifted = false;
          }

          return this._isDSTShifted;
      }

      function isLocal () {
          return this.isValid() ? !this._isUTC : false;
      }

      function isUtcOffset () {
          return this.isValid() ? this._isUTC : false;
      }

      function isUtc () {
          return this.isValid() ? this._isUTC && this._offset === 0 : false;
      }

      // ASP.NET json date format regex
      var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

      // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
      // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
      // and further modified to allow for strings containing both week and day
      var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

      function createDuration (input, key) {
          var duration = input,
              // matching against regexp is expensive, do it on demand
              match = null,
              sign,
              ret,
              diffRes;

          if (isDuration(input)) {
              duration = {
                  ms : input._milliseconds,
                  d  : input._days,
                  M  : input._months
              };
          } else if (isNumber(input)) {
              duration = {};
              if (key) {
                  duration[key] = input;
              } else {
                  duration.milliseconds = input;
              }
          } else if (!!(match = aspNetRegex.exec(input))) {
              sign = (match[1] === '-') ? -1 : 1;
              duration = {
                  y  : 0,
                  d  : toInt(match[DATE])                         * sign,
                  h  : toInt(match[HOUR])                         * sign,
                  m  : toInt(match[MINUTE])                       * sign,
                  s  : toInt(match[SECOND])                       * sign,
                  ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
              };
          } else if (!!(match = isoRegex.exec(input))) {
              sign = (match[1] === '-') ? -1 : 1;
              duration = {
                  y : parseIso(match[2], sign),
                  M : parseIso(match[3], sign),
                  w : parseIso(match[4], sign),
                  d : parseIso(match[5], sign),
                  h : parseIso(match[6], sign),
                  m : parseIso(match[7], sign),
                  s : parseIso(match[8], sign)
              };
          } else if (duration == null) {// checks for null or undefined
              duration = {};
          } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
              diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

              duration = {};
              duration.ms = diffRes.milliseconds;
              duration.M = diffRes.months;
          }

          ret = new Duration(duration);

          if (isDuration(input) && hasOwnProp(input, '_locale')) {
              ret._locale = input._locale;
          }

          return ret;
      }

      createDuration.fn = Duration.prototype;
      createDuration.invalid = createInvalid$1;

      function parseIso (inp, sign) {
          // We'd normally use ~~inp for this, but unfortunately it also
          // converts floats to ints.
          // inp may be undefined, so careful calling replace on it.
          var res = inp && parseFloat(inp.replace(',', '.'));
          // apply sign while we're at it
          return (isNaN(res) ? 0 : res) * sign;
      }

      function positiveMomentsDifference(base, other) {
          var res = {};

          res.months = other.month() - base.month() +
              (other.year() - base.year()) * 12;
          if (base.clone().add(res.months, 'M').isAfter(other)) {
              --res.months;
          }

          res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

          return res;
      }

      function momentsDifference(base, other) {
          var res;
          if (!(base.isValid() && other.isValid())) {
              return {milliseconds: 0, months: 0};
          }

          other = cloneWithOffset(other, base);
          if (base.isBefore(other)) {
              res = positiveMomentsDifference(base, other);
          } else {
              res = positiveMomentsDifference(other, base);
              res.milliseconds = -res.milliseconds;
              res.months = -res.months;
          }

          return res;
      }

      // TODO: remove 'name' arg after deprecation is removed
      function createAdder(direction, name) {
          return function (val, period) {
              var dur, tmp;
              //invert the arguments, but complain about it
              if (period !== null && !isNaN(+period)) {
                  deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                  'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                  tmp = val; val = period; period = tmp;
              }

              val = typeof val === 'string' ? +val : val;
              dur = createDuration(val, period);
              addSubtract(this, dur, direction);
              return this;
          };
      }

      function addSubtract (mom, duration, isAdding, updateOffset) {
          var milliseconds = duration._milliseconds,
              days = absRound(duration._days),
              months = absRound(duration._months);

          if (!mom.isValid()) {
              // No op
              return;
          }

          updateOffset = updateOffset == null ? true : updateOffset;

          if (months) {
              setMonth(mom, get(mom, 'Month') + months * isAdding);
          }
          if (days) {
              set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
          }
          if (milliseconds) {
              mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
          }
          if (updateOffset) {
              hooks.updateOffset(mom, days || months);
          }
      }

      var add      = createAdder(1, 'add');
      var subtract = createAdder(-1, 'subtract');

      function getCalendarFormat(myMoment, now) {
          var diff = myMoment.diff(now, 'days', true);
          return diff < -6 ? 'sameElse' :
                  diff < -1 ? 'lastWeek' :
                  diff < 0 ? 'lastDay' :
                  diff < 1 ? 'sameDay' :
                  diff < 2 ? 'nextDay' :
                  diff < 7 ? 'nextWeek' : 'sameElse';
      }

      function calendar$1 (time, formats) {
          // We want to compare the start of today, vs this.
          // Getting start-of-today depends on whether we're local/utc/offset or not.
          var now = time || createLocal(),
              sod = cloneWithOffset(now, this).startOf('day'),
              format = hooks.calendarFormat(this, sod) || 'sameElse';

          var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

          return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
      }

      function clone () {
          return new Moment(this);
      }

      function isAfter (input, units) {
          var localInput = isMoment(input) ? input : createLocal(input);
          if (!(this.isValid() && localInput.isValid())) {
              return false;
          }
          units = normalizeUnits(units) || 'millisecond';
          if (units === 'millisecond') {
              return this.valueOf() > localInput.valueOf();
          } else {
              return localInput.valueOf() < this.clone().startOf(units).valueOf();
          }
      }

      function isBefore (input, units) {
          var localInput = isMoment(input) ? input : createLocal(input);
          if (!(this.isValid() && localInput.isValid())) {
              return false;
          }
          units = normalizeUnits(units) || 'millisecond';
          if (units === 'millisecond') {
              return this.valueOf() < localInput.valueOf();
          } else {
              return this.clone().endOf(units).valueOf() < localInput.valueOf();
          }
      }

      function isBetween (from, to, units, inclusivity) {
          var localFrom = isMoment(from) ? from : createLocal(from),
              localTo = isMoment(to) ? to : createLocal(to);
          if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
              return false;
          }
          inclusivity = inclusivity || '()';
          return (inclusivity[0] === '(' ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) &&
              (inclusivity[1] === ')' ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
      }

      function isSame (input, units) {
          var localInput = isMoment(input) ? input : createLocal(input),
              inputMs;
          if (!(this.isValid() && localInput.isValid())) {
              return false;
          }
          units = normalizeUnits(units) || 'millisecond';
          if (units === 'millisecond') {
              return this.valueOf() === localInput.valueOf();
          } else {
              inputMs = localInput.valueOf();
              return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
          }
      }

      function isSameOrAfter (input, units) {
          return this.isSame(input, units) || this.isAfter(input, units);
      }

      function isSameOrBefore (input, units) {
          return this.isSame(input, units) || this.isBefore(input, units);
      }

      function diff (input, units, asFloat) {
          var that,
              zoneDelta,
              output;

          if (!this.isValid()) {
              return NaN;
          }

          that = cloneWithOffset(input, this);

          if (!that.isValid()) {
              return NaN;
          }

          zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

          units = normalizeUnits(units);

          switch (units) {
              case 'year': output = monthDiff(this, that) / 12; break;
              case 'month': output = monthDiff(this, that); break;
              case 'quarter': output = monthDiff(this, that) / 3; break;
              case 'second': output = (this - that) / 1e3; break; // 1000
              case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
              case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
              case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
              case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
              default: output = this - that;
          }

          return asFloat ? output : absFloor(output);
      }

      function monthDiff (a, b) {
          // difference in months
          var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
              // b is in (anchor - 1 month, anchor + 1 month)
              anchor = a.clone().add(wholeMonthDiff, 'months'),
              anchor2, adjust;

          if (b - anchor < 0) {
              anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
              // linear across the month
              adjust = (b - anchor) / (anchor - anchor2);
          } else {
              anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
              // linear across the month
              adjust = (b - anchor) / (anchor2 - anchor);
          }

          //check for negative zero, return zero if negative zero
          return -(wholeMonthDiff + adjust) || 0;
      }

      hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
      hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

      function toString () {
          return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
      }

      function toISOString(keepOffset) {
          if (!this.isValid()) {
              return null;
          }
          var utc = keepOffset !== true;
          var m = utc ? this.clone().utc() : this;
          if (m.year() < 0 || m.year() > 9999) {
              return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
          }
          if (isFunction(Date.prototype.toISOString)) {
              // native implementation is ~50x faster, use it when we can
              if (utc) {
                  return this.toDate().toISOString();
              } else {
                  return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
              }
          }
          return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
      }

      /**
       * Return a human readable representation of a moment that can
       * also be evaluated to get a new moment which is the same
       *
       * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
       */
      function inspect () {
          if (!this.isValid()) {
              return 'moment.invalid(/* ' + this._i + ' */)';
          }
          var func = 'moment';
          var zone = '';
          if (!this.isLocal()) {
              func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
              zone = 'Z';
          }
          var prefix = '[' + func + '("]';
          var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
          var datetime = '-MM-DD[T]HH:mm:ss.SSS';
          var suffix = zone + '[")]';

          return this.format(prefix + year + datetime + suffix);
      }

      function format (inputString) {
          if (!inputString) {
              inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
          }
          var output = formatMoment(this, inputString);
          return this.localeData().postformat(output);
      }

      function from (time, withoutSuffix) {
          if (this.isValid() &&
                  ((isMoment(time) && time.isValid()) ||
                   createLocal(time).isValid())) {
              return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
          } else {
              return this.localeData().invalidDate();
          }
      }

      function fromNow (withoutSuffix) {
          return this.from(createLocal(), withoutSuffix);
      }

      function to (time, withoutSuffix) {
          if (this.isValid() &&
                  ((isMoment(time) && time.isValid()) ||
                   createLocal(time).isValid())) {
              return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
          } else {
              return this.localeData().invalidDate();
          }
      }

      function toNow (withoutSuffix) {
          return this.to(createLocal(), withoutSuffix);
      }

      // If passed a locale key, it will set the locale for this
      // instance.  Otherwise, it will return the locale configuration
      // variables for this instance.
      function locale (key) {
          var newLocaleData;

          if (key === undefined) {
              return this._locale._abbr;
          } else {
              newLocaleData = getLocale(key);
              if (newLocaleData != null) {
                  this._locale = newLocaleData;
              }
              return this;
          }
      }

      var lang = deprecate(
          'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
          function (key) {
              if (key === undefined) {
                  return this.localeData();
              } else {
                  return this.locale(key);
              }
          }
      );

      function localeData () {
          return this._locale;
      }

      var MS_PER_SECOND = 1000;
      var MS_PER_MINUTE = 60 * MS_PER_SECOND;
      var MS_PER_HOUR = 60 * MS_PER_MINUTE;
      var MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

      // actual modulo - handles negative numbers (for dates before 1970):
      function mod$1(dividend, divisor) {
          return (dividend % divisor + divisor) % divisor;
      }

      function localStartOfDate(y, m, d) {
          // the date constructor remaps years 0-99 to 1900-1999
          if (y < 100 && y >= 0) {
              // preserve leap years using a full 400 year cycle, then reset
              return new Date(y + 400, m, d) - MS_PER_400_YEARS;
          } else {
              return new Date(y, m, d).valueOf();
          }
      }

      function utcStartOfDate(y, m, d) {
          // Date.UTC remaps years 0-99 to 1900-1999
          if (y < 100 && y >= 0) {
              // preserve leap years using a full 400 year cycle, then reset
              return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
          } else {
              return Date.UTC(y, m, d);
          }
      }

      function startOf (units) {
          var time;
          units = normalizeUnits(units);
          if (units === undefined || units === 'millisecond' || !this.isValid()) {
              return this;
          }

          var startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

          switch (units) {
              case 'year':
                  time = startOfDate(this.year(), 0, 1);
                  break;
              case 'quarter':
                  time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
                  break;
              case 'month':
                  time = startOfDate(this.year(), this.month(), 1);
                  break;
              case 'week':
                  time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
                  break;
              case 'isoWeek':
                  time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                  break;
              case 'day':
              case 'date':
                  time = startOfDate(this.year(), this.month(), this.date());
                  break;
              case 'hour':
                  time = this._d.valueOf();
                  time -= mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
                  break;
              case 'minute':
                  time = this._d.valueOf();
                  time -= mod$1(time, MS_PER_MINUTE);
                  break;
              case 'second':
                  time = this._d.valueOf();
                  time -= mod$1(time, MS_PER_SECOND);
                  break;
          }

          this._d.setTime(time);
          hooks.updateOffset(this, true);
          return this;
      }

      function endOf (units) {
          var time;
          units = normalizeUnits(units);
          if (units === undefined || units === 'millisecond' || !this.isValid()) {
              return this;
          }

          var startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

          switch (units) {
              case 'year':
                  time = startOfDate(this.year() + 1, 0, 1) - 1;
                  break;
              case 'quarter':
                  time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
                  break;
              case 'month':
                  time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                  break;
              case 'week':
                  time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                  break;
              case 'isoWeek':
                  time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                  break;
              case 'day':
              case 'date':
                  time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                  break;
              case 'hour':
                  time = this._d.valueOf();
                  time += MS_PER_HOUR - mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) - 1;
                  break;
              case 'minute':
                  time = this._d.valueOf();
                  time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                  break;
              case 'second':
                  time = this._d.valueOf();
                  time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                  break;
          }

          this._d.setTime(time);
          hooks.updateOffset(this, true);
          return this;
      }

      function valueOf () {
          return this._d.valueOf() - ((this._offset || 0) * 60000);
      }

      function unix () {
          return Math.floor(this.valueOf() / 1000);
      }

      function toDate () {
          return new Date(this.valueOf());
      }

      function toArray () {
          var m = this;
          return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
      }

      function toObject () {
          var m = this;
          return {
              years: m.year(),
              months: m.month(),
              date: m.date(),
              hours: m.hours(),
              minutes: m.minutes(),
              seconds: m.seconds(),
              milliseconds: m.milliseconds()
          };
      }

      function toJSON () {
          // new Date(NaN).toJSON() === null
          return this.isValid() ? this.toISOString() : null;
      }

      function isValid$2 () {
          return isValid(this);
      }

      function parsingFlags () {
          return extend({}, getParsingFlags(this));
      }

      function invalidAt () {
          return getParsingFlags(this).overflow;
      }

      function creationData() {
          return {
              input: this._i,
              format: this._f,
              locale: this._locale,
              isUTC: this._isUTC,
              strict: this._strict
          };
      }

      // FORMATTING

      addFormatToken(0, ['gg', 2], 0, function () {
          return this.weekYear() % 100;
      });

      addFormatToken(0, ['GG', 2], 0, function () {
          return this.isoWeekYear() % 100;
      });

      function addWeekYearFormatToken (token, getter) {
          addFormatToken(0, [token, token.length], 0, getter);
      }

      addWeekYearFormatToken('gggg',     'weekYear');
      addWeekYearFormatToken('ggggg',    'weekYear');
      addWeekYearFormatToken('GGGG',  'isoWeekYear');
      addWeekYearFormatToken('GGGGG', 'isoWeekYear');

      // ALIASES

      addUnitAlias('weekYear', 'gg');
      addUnitAlias('isoWeekYear', 'GG');

      // PRIORITY

      addUnitPriority('weekYear', 1);
      addUnitPriority('isoWeekYear', 1);


      // PARSING

      addRegexToken('G',      matchSigned);
      addRegexToken('g',      matchSigned);
      addRegexToken('GG',     match1to2, match2);
      addRegexToken('gg',     match1to2, match2);
      addRegexToken('GGGG',   match1to4, match4);
      addRegexToken('gggg',   match1to4, match4);
      addRegexToken('GGGGG',  match1to6, match6);
      addRegexToken('ggggg',  match1to6, match6);

      addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
          week[token.substr(0, 2)] = toInt(input);
      });

      addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
          week[token] = hooks.parseTwoDigitYear(input);
      });

      // MOMENTS

      function getSetWeekYear (input) {
          return getSetWeekYearHelper.call(this,
                  input,
                  this.week(),
                  this.weekday(),
                  this.localeData()._week.dow,
                  this.localeData()._week.doy);
      }

      function getSetISOWeekYear (input) {
          return getSetWeekYearHelper.call(this,
                  input, this.isoWeek(), this.isoWeekday(), 1, 4);
      }

      function getISOWeeksInYear () {
          return weeksInYear(this.year(), 1, 4);
      }

      function getWeeksInYear () {
          var weekInfo = this.localeData()._week;
          return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
      }

      function getSetWeekYearHelper(input, week, weekday, dow, doy) {
          var weeksTarget;
          if (input == null) {
              return weekOfYear(this, dow, doy).year;
          } else {
              weeksTarget = weeksInYear(input, dow, doy);
              if (week > weeksTarget) {
                  week = weeksTarget;
              }
              return setWeekAll.call(this, input, week, weekday, dow, doy);
          }
      }

      function setWeekAll(weekYear, week, weekday, dow, doy) {
          var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
              date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

          this.year(date.getUTCFullYear());
          this.month(date.getUTCMonth());
          this.date(date.getUTCDate());
          return this;
      }

      // FORMATTING

      addFormatToken('Q', 0, 'Qo', 'quarter');

      // ALIASES

      addUnitAlias('quarter', 'Q');

      // PRIORITY

      addUnitPriority('quarter', 7);

      // PARSING

      addRegexToken('Q', match1);
      addParseToken('Q', function (input, array) {
          array[MONTH] = (toInt(input) - 1) * 3;
      });

      // MOMENTS

      function getSetQuarter (input) {
          return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
      }

      // FORMATTING

      addFormatToken('D', ['DD', 2], 'Do', 'date');

      // ALIASES

      addUnitAlias('date', 'D');

      // PRIORITY
      addUnitPriority('date', 9);

      // PARSING

      addRegexToken('D',  match1to2);
      addRegexToken('DD', match1to2, match2);
      addRegexToken('Do', function (isStrict, locale) {
          // TODO: Remove "ordinalParse" fallback in next major release.
          return isStrict ?
            (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
            locale._dayOfMonthOrdinalParseLenient;
      });

      addParseToken(['D', 'DD'], DATE);
      addParseToken('Do', function (input, array) {
          array[DATE] = toInt(input.match(match1to2)[0]);
      });

      // MOMENTS

      var getSetDayOfMonth = makeGetSet('Date', true);

      // FORMATTING

      addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

      // ALIASES

      addUnitAlias('dayOfYear', 'DDD');

      // PRIORITY
      addUnitPriority('dayOfYear', 4);

      // PARSING

      addRegexToken('DDD',  match1to3);
      addRegexToken('DDDD', match3);
      addParseToken(['DDD', 'DDDD'], function (input, array, config) {
          config._dayOfYear = toInt(input);
      });

      // HELPERS

      // MOMENTS

      function getSetDayOfYear (input) {
          var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
          return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
      }

      // FORMATTING

      addFormatToken('m', ['mm', 2], 0, 'minute');

      // ALIASES

      addUnitAlias('minute', 'm');

      // PRIORITY

      addUnitPriority('minute', 14);

      // PARSING

      addRegexToken('m',  match1to2);
      addRegexToken('mm', match1to2, match2);
      addParseToken(['m', 'mm'], MINUTE);

      // MOMENTS

      var getSetMinute = makeGetSet('Minutes', false);

      // FORMATTING

      addFormatToken('s', ['ss', 2], 0, 'second');

      // ALIASES

      addUnitAlias('second', 's');

      // PRIORITY

      addUnitPriority('second', 15);

      // PARSING

      addRegexToken('s',  match1to2);
      addRegexToken('ss', match1to2, match2);
      addParseToken(['s', 'ss'], SECOND);

      // MOMENTS

      var getSetSecond = makeGetSet('Seconds', false);

      // FORMATTING

      addFormatToken('S', 0, 0, function () {
          return ~~(this.millisecond() / 100);
      });

      addFormatToken(0, ['SS', 2], 0, function () {
          return ~~(this.millisecond() / 10);
      });

      addFormatToken(0, ['SSS', 3], 0, 'millisecond');
      addFormatToken(0, ['SSSS', 4], 0, function () {
          return this.millisecond() * 10;
      });
      addFormatToken(0, ['SSSSS', 5], 0, function () {
          return this.millisecond() * 100;
      });
      addFormatToken(0, ['SSSSSS', 6], 0, function () {
          return this.millisecond() * 1000;
      });
      addFormatToken(0, ['SSSSSSS', 7], 0, function () {
          return this.millisecond() * 10000;
      });
      addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
          return this.millisecond() * 100000;
      });
      addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
          return this.millisecond() * 1000000;
      });


      // ALIASES

      addUnitAlias('millisecond', 'ms');

      // PRIORITY

      addUnitPriority('millisecond', 16);

      // PARSING

      addRegexToken('S',    match1to3, match1);
      addRegexToken('SS',   match1to3, match2);
      addRegexToken('SSS',  match1to3, match3);

      var token;
      for (token = 'SSSS'; token.length <= 9; token += 'S') {
          addRegexToken(token, matchUnsigned);
      }

      function parseMs(input, array) {
          array[MILLISECOND] = toInt(('0.' + input) * 1000);
      }

      for (token = 'S'; token.length <= 9; token += 'S') {
          addParseToken(token, parseMs);
      }
      // MOMENTS

      var getSetMillisecond = makeGetSet('Milliseconds', false);

      // FORMATTING

      addFormatToken('z',  0, 0, 'zoneAbbr');
      addFormatToken('zz', 0, 0, 'zoneName');

      // MOMENTS

      function getZoneAbbr () {
          return this._isUTC ? 'UTC' : '';
      }

      function getZoneName () {
          return this._isUTC ? 'Coordinated Universal Time' : '';
      }

      var proto = Moment.prototype;

      proto.add               = add;
      proto.calendar          = calendar$1;
      proto.clone             = clone;
      proto.diff              = diff;
      proto.endOf             = endOf;
      proto.format            = format;
      proto.from              = from;
      proto.fromNow           = fromNow;
      proto.to                = to;
      proto.toNow             = toNow;
      proto.get               = stringGet;
      proto.invalidAt         = invalidAt;
      proto.isAfter           = isAfter;
      proto.isBefore          = isBefore;
      proto.isBetween         = isBetween;
      proto.isSame            = isSame;
      proto.isSameOrAfter     = isSameOrAfter;
      proto.isSameOrBefore    = isSameOrBefore;
      proto.isValid           = isValid$2;
      proto.lang              = lang;
      proto.locale            = locale;
      proto.localeData        = localeData;
      proto.max               = prototypeMax;
      proto.min               = prototypeMin;
      proto.parsingFlags      = parsingFlags;
      proto.set               = stringSet;
      proto.startOf           = startOf;
      proto.subtract          = subtract;
      proto.toArray           = toArray;
      proto.toObject          = toObject;
      proto.toDate            = toDate;
      proto.toISOString       = toISOString;
      proto.inspect           = inspect;
      proto.toJSON            = toJSON;
      proto.toString          = toString;
      proto.unix              = unix;
      proto.valueOf           = valueOf;
      proto.creationData      = creationData;
      proto.year       = getSetYear;
      proto.isLeapYear = getIsLeapYear;
      proto.weekYear    = getSetWeekYear;
      proto.isoWeekYear = getSetISOWeekYear;
      proto.quarter = proto.quarters = getSetQuarter;
      proto.month       = getSetMonth;
      proto.daysInMonth = getDaysInMonth;
      proto.week           = proto.weeks        = getSetWeek;
      proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
      proto.weeksInYear    = getWeeksInYear;
      proto.isoWeeksInYear = getISOWeeksInYear;
      proto.date       = getSetDayOfMonth;
      proto.day        = proto.days             = getSetDayOfWeek;
      proto.weekday    = getSetLocaleDayOfWeek;
      proto.isoWeekday = getSetISODayOfWeek;
      proto.dayOfYear  = getSetDayOfYear;
      proto.hour = proto.hours = getSetHour;
      proto.minute = proto.minutes = getSetMinute;
      proto.second = proto.seconds = getSetSecond;
      proto.millisecond = proto.milliseconds = getSetMillisecond;
      proto.utcOffset            = getSetOffset;
      proto.utc                  = setOffsetToUTC;
      proto.local                = setOffsetToLocal;
      proto.parseZone            = setOffsetToParsedOffset;
      proto.hasAlignedHourOffset = hasAlignedHourOffset;
      proto.isDST                = isDaylightSavingTime;
      proto.isLocal              = isLocal;
      proto.isUtcOffset          = isUtcOffset;
      proto.isUtc                = isUtc;
      proto.isUTC                = isUtc;
      proto.zoneAbbr = getZoneAbbr;
      proto.zoneName = getZoneName;
      proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
      proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
      proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
      proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
      proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

      function createUnix (input) {
          return createLocal(input * 1000);
      }

      function createInZone () {
          return createLocal.apply(null, arguments).parseZone();
      }

      function preParsePostFormat (string) {
          return string;
      }

      var proto$1 = Locale.prototype;

      proto$1.calendar        = calendar;
      proto$1.longDateFormat  = longDateFormat;
      proto$1.invalidDate     = invalidDate;
      proto$1.ordinal         = ordinal;
      proto$1.preparse        = preParsePostFormat;
      proto$1.postformat      = preParsePostFormat;
      proto$1.relativeTime    = relativeTime;
      proto$1.pastFuture      = pastFuture;
      proto$1.set             = set;

      proto$1.months            =        localeMonths;
      proto$1.monthsShort       =        localeMonthsShort;
      proto$1.monthsParse       =        localeMonthsParse;
      proto$1.monthsRegex       = monthsRegex;
      proto$1.monthsShortRegex  = monthsShortRegex;
      proto$1.week = localeWeek;
      proto$1.firstDayOfYear = localeFirstDayOfYear;
      proto$1.firstDayOfWeek = localeFirstDayOfWeek;

      proto$1.weekdays       =        localeWeekdays;
      proto$1.weekdaysMin    =        localeWeekdaysMin;
      proto$1.weekdaysShort  =        localeWeekdaysShort;
      proto$1.weekdaysParse  =        localeWeekdaysParse;

      proto$1.weekdaysRegex       =        weekdaysRegex;
      proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
      proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

      proto$1.isPM = localeIsPM;
      proto$1.meridiem = localeMeridiem;

      function get$1 (format, index, field, setter) {
          var locale = getLocale();
          var utc = createUTC().set(setter, index);
          return locale[field](utc, format);
      }

      function listMonthsImpl (format, index, field) {
          if (isNumber(format)) {
              index = format;
              format = undefined;
          }

          format = format || '';

          if (index != null) {
              return get$1(format, index, field, 'month');
          }

          var i;
          var out = [];
          for (i = 0; i < 12; i++) {
              out[i] = get$1(format, i, field, 'month');
          }
          return out;
      }

      // ()
      // (5)
      // (fmt, 5)
      // (fmt)
      // (true)
      // (true, 5)
      // (true, fmt, 5)
      // (true, fmt)
      function listWeekdaysImpl (localeSorted, format, index, field) {
          if (typeof localeSorted === 'boolean') {
              if (isNumber(format)) {
                  index = format;
                  format = undefined;
              }

              format = format || '';
          } else {
              format = localeSorted;
              index = format;
              localeSorted = false;

              if (isNumber(format)) {
                  index = format;
                  format = undefined;
              }

              format = format || '';
          }

          var locale = getLocale(),
              shift = localeSorted ? locale._week.dow : 0;

          if (index != null) {
              return get$1(format, (index + shift) % 7, field, 'day');
          }

          var i;
          var out = [];
          for (i = 0; i < 7; i++) {
              out[i] = get$1(format, (i + shift) % 7, field, 'day');
          }
          return out;
      }

      function listMonths (format, index) {
          return listMonthsImpl(format, index, 'months');
      }

      function listMonthsShort (format, index) {
          return listMonthsImpl(format, index, 'monthsShort');
      }

      function listWeekdays (localeSorted, format, index) {
          return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
      }

      function listWeekdaysShort (localeSorted, format, index) {
          return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
      }

      function listWeekdaysMin (localeSorted, format, index) {
          return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
      }

      getSetGlobalLocale('en', {
          dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
          ordinal : function (number) {
              var b = number % 10,
                  output = (toInt(number % 100 / 10) === 1) ? 'th' :
                  (b === 1) ? 'st' :
                  (b === 2) ? 'nd' :
                  (b === 3) ? 'rd' : 'th';
              return number + output;
          }
      });

      // Side effect imports

      hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
      hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

      var mathAbs = Math.abs;

      function abs () {
          var data           = this._data;

          this._milliseconds = mathAbs(this._milliseconds);
          this._days         = mathAbs(this._days);
          this._months       = mathAbs(this._months);

          data.milliseconds  = mathAbs(data.milliseconds);
          data.seconds       = mathAbs(data.seconds);
          data.minutes       = mathAbs(data.minutes);
          data.hours         = mathAbs(data.hours);
          data.months        = mathAbs(data.months);
          data.years         = mathAbs(data.years);

          return this;
      }

      function addSubtract$1 (duration, input, value, direction) {
          var other = createDuration(input, value);

          duration._milliseconds += direction * other._milliseconds;
          duration._days         += direction * other._days;
          duration._months       += direction * other._months;

          return duration._bubble();
      }

      // supports only 2.0-style add(1, 's') or add(duration)
      function add$1 (input, value) {
          return addSubtract$1(this, input, value, 1);
      }

      // supports only 2.0-style subtract(1, 's') or subtract(duration)
      function subtract$1 (input, value) {
          return addSubtract$1(this, input, value, -1);
      }

      function absCeil (number) {
          if (number < 0) {
              return Math.floor(number);
          } else {
              return Math.ceil(number);
          }
      }

      function bubble () {
          var milliseconds = this._milliseconds;
          var days         = this._days;
          var months       = this._months;
          var data         = this._data;
          var seconds, minutes, hours, years, monthsFromDays;

          // if we have a mix of positive and negative values, bubble down first
          // check: https://github.com/moment/moment/issues/2166
          if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                  (milliseconds <= 0 && days <= 0 && months <= 0))) {
              milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
              days = 0;
              months = 0;
          }

          // The following code bubbles up values, see the tests for
          // examples of what that means.
          data.milliseconds = milliseconds % 1000;

          seconds           = absFloor(milliseconds / 1000);
          data.seconds      = seconds % 60;

          minutes           = absFloor(seconds / 60);
          data.minutes      = minutes % 60;

          hours             = absFloor(minutes / 60);
          data.hours        = hours % 24;

          days += absFloor(hours / 24);

          // convert days to months
          monthsFromDays = absFloor(daysToMonths(days));
          months += monthsFromDays;
          days -= absCeil(monthsToDays(monthsFromDays));

          // 12 months -> 1 year
          years = absFloor(months / 12);
          months %= 12;

          data.days   = days;
          data.months = months;
          data.years  = years;

          return this;
      }

      function daysToMonths (days) {
          // 400 years have 146097 days (taking into account leap year rules)
          // 400 years have 12 months === 4800
          return days * 4800 / 146097;
      }

      function monthsToDays (months) {
          // the reverse of daysToMonths
          return months * 146097 / 4800;
      }

      function as (units) {
          if (!this.isValid()) {
              return NaN;
          }
          var days;
          var months;
          var milliseconds = this._milliseconds;

          units = normalizeUnits(units);

          if (units === 'month' || units === 'quarter' || units === 'year') {
              days = this._days + milliseconds / 864e5;
              months = this._months + daysToMonths(days);
              switch (units) {
                  case 'month':   return months;
                  case 'quarter': return months / 3;
                  case 'year':    return months / 12;
              }
          } else {
              // handle milliseconds separately because of floating point math errors (issue #1867)
              days = this._days + Math.round(monthsToDays(this._months));
              switch (units) {
                  case 'week'   : return days / 7     + milliseconds / 6048e5;
                  case 'day'    : return days         + milliseconds / 864e5;
                  case 'hour'   : return days * 24    + milliseconds / 36e5;
                  case 'minute' : return days * 1440  + milliseconds / 6e4;
                  case 'second' : return days * 86400 + milliseconds / 1000;
                  // Math.floor prevents floating point math errors here
                  case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                  default: throw new Error('Unknown unit ' + units);
              }
          }
      }

      // TODO: Use this.as('ms')?
      function valueOf$1 () {
          if (!this.isValid()) {
              return NaN;
          }
          return (
              this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6
          );
      }

      function makeAs (alias) {
          return function () {
              return this.as(alias);
          };
      }

      var asMilliseconds = makeAs('ms');
      var asSeconds      = makeAs('s');
      var asMinutes      = makeAs('m');
      var asHours        = makeAs('h');
      var asDays         = makeAs('d');
      var asWeeks        = makeAs('w');
      var asMonths       = makeAs('M');
      var asQuarters     = makeAs('Q');
      var asYears        = makeAs('y');

      function clone$1 () {
          return createDuration(this);
      }

      function get$2 (units) {
          units = normalizeUnits(units);
          return this.isValid() ? this[units + 's']() : NaN;
      }

      function makeGetter(name) {
          return function () {
              return this.isValid() ? this._data[name] : NaN;
          };
      }

      var milliseconds = makeGetter('milliseconds');
      var seconds      = makeGetter('seconds');
      var minutes      = makeGetter('minutes');
      var hours        = makeGetter('hours');
      var days         = makeGetter('days');
      var months       = makeGetter('months');
      var years        = makeGetter('years');

      function weeks () {
          return absFloor(this.days() / 7);
      }

      var round = Math.round;
      var thresholds = {
          ss: 44,         // a few seconds to seconds
          s : 45,         // seconds to minute
          m : 45,         // minutes to hour
          h : 22,         // hours to day
          d : 26,         // days to month
          M : 11          // months to year
      };

      // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
      function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
          return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
      }

      function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
          var duration = createDuration(posNegDuration).abs();
          var seconds  = round(duration.as('s'));
          var minutes  = round(duration.as('m'));
          var hours    = round(duration.as('h'));
          var days     = round(duration.as('d'));
          var months   = round(duration.as('M'));
          var years    = round(duration.as('y'));

          var a = seconds <= thresholds.ss && ['s', seconds]  ||
                  seconds < thresholds.s   && ['ss', seconds] ||
                  minutes <= 1             && ['m']           ||
                  minutes < thresholds.m   && ['mm', minutes] ||
                  hours   <= 1             && ['h']           ||
                  hours   < thresholds.h   && ['hh', hours]   ||
                  days    <= 1             && ['d']           ||
                  days    < thresholds.d   && ['dd', days]    ||
                  months  <= 1             && ['M']           ||
                  months  < thresholds.M   && ['MM', months]  ||
                  years   <= 1             && ['y']           || ['yy', years];

          a[2] = withoutSuffix;
          a[3] = +posNegDuration > 0;
          a[4] = locale;
          return substituteTimeAgo.apply(null, a);
      }

      // This function allows you to set the rounding function for relative time strings
      function getSetRelativeTimeRounding (roundingFunction) {
          if (roundingFunction === undefined) {
              return round;
          }
          if (typeof(roundingFunction) === 'function') {
              round = roundingFunction;
              return true;
          }
          return false;
      }

      // This function allows you to set a threshold for relative time strings
      function getSetRelativeTimeThreshold (threshold, limit) {
          if (thresholds[threshold] === undefined) {
              return false;
          }
          if (limit === undefined) {
              return thresholds[threshold];
          }
          thresholds[threshold] = limit;
          if (threshold === 's') {
              thresholds.ss = limit - 1;
          }
          return true;
      }

      function humanize (withSuffix) {
          if (!this.isValid()) {
              return this.localeData().invalidDate();
          }

          var locale = this.localeData();
          var output = relativeTime$1(this, !withSuffix, locale);

          if (withSuffix) {
              output = locale.pastFuture(+this, output);
          }

          return locale.postformat(output);
      }

      var abs$1 = Math.abs;

      function sign(x) {
          return ((x > 0) - (x < 0)) || +x;
      }

      function toISOString$1() {
          // for ISO strings we do not use the normal bubbling rules:
          //  * milliseconds bubble up until they become hours
          //  * days do not bubble at all
          //  * months bubble up until they become years
          // This is because there is no context-free conversion between hours and days
          // (think of clock changes)
          // and also not between days and months (28-31 days per month)
          if (!this.isValid()) {
              return this.localeData().invalidDate();
          }

          var seconds = abs$1(this._milliseconds) / 1000;
          var days         = abs$1(this._days);
          var months       = abs$1(this._months);
          var minutes, hours, years;

          // 3600 seconds -> 60 minutes -> 1 hour
          minutes           = absFloor(seconds / 60);
          hours             = absFloor(minutes / 60);
          seconds %= 60;
          minutes %= 60;

          // 12 months -> 1 year
          years  = absFloor(months / 12);
          months %= 12;


          // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
          var Y = years;
          var M = months;
          var D = days;
          var h = hours;
          var m = minutes;
          var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
          var total = this.asSeconds();

          if (!total) {
              // this is the same as C#'s (Noda) and python (isodate)...
              // but not other JS (goog.date)
              return 'P0D';
          }

          var totalSign = total < 0 ? '-' : '';
          var ymSign = sign(this._months) !== sign(total) ? '-' : '';
          var daysSign = sign(this._days) !== sign(total) ? '-' : '';
          var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

          return totalSign + 'P' +
              (Y ? ymSign + Y + 'Y' : '') +
              (M ? ymSign + M + 'M' : '') +
              (D ? daysSign + D + 'D' : '') +
              ((h || m || s) ? 'T' : '') +
              (h ? hmsSign + h + 'H' : '') +
              (m ? hmsSign + m + 'M' : '') +
              (s ? hmsSign + s + 'S' : '');
      }

      var proto$2 = Duration.prototype;

      proto$2.isValid        = isValid$1;
      proto$2.abs            = abs;
      proto$2.add            = add$1;
      proto$2.subtract       = subtract$1;
      proto$2.as             = as;
      proto$2.asMilliseconds = asMilliseconds;
      proto$2.asSeconds      = asSeconds;
      proto$2.asMinutes      = asMinutes;
      proto$2.asHours        = asHours;
      proto$2.asDays         = asDays;
      proto$2.asWeeks        = asWeeks;
      proto$2.asMonths       = asMonths;
      proto$2.asQuarters     = asQuarters;
      proto$2.asYears        = asYears;
      proto$2.valueOf        = valueOf$1;
      proto$2._bubble        = bubble;
      proto$2.clone          = clone$1;
      proto$2.get            = get$2;
      proto$2.milliseconds   = milliseconds;
      proto$2.seconds        = seconds;
      proto$2.minutes        = minutes;
      proto$2.hours          = hours;
      proto$2.days           = days;
      proto$2.weeks          = weeks;
      proto$2.months         = months;
      proto$2.years          = years;
      proto$2.humanize       = humanize;
      proto$2.toISOString    = toISOString$1;
      proto$2.toString       = toISOString$1;
      proto$2.toJSON         = toISOString$1;
      proto$2.locale         = locale;
      proto$2.localeData     = localeData;

      proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
      proto$2.lang = lang;

      // Side effect imports

      // FORMATTING

      addFormatToken('X', 0, 0, 'unix');
      addFormatToken('x', 0, 0, 'valueOf');

      // PARSING

      addRegexToken('x', matchSigned);
      addRegexToken('X', matchTimestamp);
      addParseToken('X', function (input, array, config) {
          config._d = new Date(parseFloat(input, 10) * 1000);
      });
      addParseToken('x', function (input, array, config) {
          config._d = new Date(toInt(input));
      });

      // Side effect imports


      hooks.version = '2.24.0';

      setHookCallback(createLocal);

      hooks.fn                    = proto;
      hooks.min                   = min;
      hooks.max                   = max;
      hooks.now                   = now;
      hooks.utc                   = createUTC;
      hooks.unix                  = createUnix;
      hooks.months                = listMonths;
      hooks.isDate                = isDate;
      hooks.locale                = getSetGlobalLocale;
      hooks.invalid               = createInvalid;
      hooks.duration              = createDuration;
      hooks.isMoment              = isMoment;
      hooks.weekdays              = listWeekdays;
      hooks.parseZone             = createInZone;
      hooks.localeData            = getLocale;
      hooks.isDuration            = isDuration;
      hooks.monthsShort           = listMonthsShort;
      hooks.weekdaysMin           = listWeekdaysMin;
      hooks.defineLocale          = defineLocale;
      hooks.updateLocale          = updateLocale;
      hooks.locales               = listLocales;
      hooks.weekdaysShort         = listWeekdaysShort;
      hooks.normalizeUnits        = normalizeUnits;
      hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
      hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
      hooks.calendarFormat        = getCalendarFormat;
      hooks.prototype             = proto;

      // currently HTML5 input type only supports 24-hour formats
      hooks.HTML5_FMT = {
          DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',             // <input type="datetime-local" />
          DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',  // <input type="datetime-local" step="1" />
          DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',   // <input type="datetime-local" step="0.001" />
          DATE: 'YYYY-MM-DD',                             // <input type="date" />
          TIME: 'HH:mm',                                  // <input type="time" />
          TIME_SECONDS: 'HH:mm:ss',                       // <input type="time" step="1" />
          TIME_MS: 'HH:mm:ss.SSS',                        // <input type="time" step="0.001" />
          WEEK: 'GGGG-[W]WW',                             // <input type="week" />
          MONTH: 'YYYY-MM'                                // <input type="month" />
      };

      return hooks;

  })));
  });

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
  var Uint8Array$1 = _root.Uint8Array;

  var _Uint8Array = Uint8Array$1;

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
      this.relations = {};
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
    }, {
      key: "addRelationship",
      value: function addRelationship(_ref2) {
        var type = _ref2.type,
            property = _ref2.property,
            dataType = _ref2.dataType;
        this.relations[type] = this.relations[type] || {};
        this.relations[type][property] = {
          dataType: dataType
        };
      }
    }, {
      key: "addValidation",
      value: function addValidation(_ref3) {
        var type = _ref3.type,
            property = _ref3.property,
            validator = _ref3.validator;
        this.structure[type][property].validator = validator;
      }
    }]);

    return Schema;
  }();

  var schema = new Schema();

  var _class$1, _descriptor$1, _descriptor2$1, _temp$1;

  function isPresent(value) {
    return value !== null && value !== undefined && value !== '';
  }
  /**
   * returns `true` as long as the `value` is not `null`, `undefined`, or `''`
   * @method validatePresence
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
   * Helper method for apply the correct defaults to attributes.
   * @method defaultValueForDescriptor
   */


  function defaultValueForDescriptor(descriptor, DataType) {
    if (typeof descriptor.initializer === 'function') {
      var value = descriptor.initializer();

      if (DataType.name === 'Date') {
        return moment(value).toDate();
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
   * @method validates
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
        schema.addRelationship({
          type: target2.constructor.type,
          property: property2,
          dataType: Array
        });
        return {
          get: function get() {
            var type = targetOrModelKlass.type;
            return getRelatedRecords(this, property2, type);
          }
        };
      };
    } else {
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
        schema.addRelationship({
          type: target2.constructor.type,
          property: property2,
          dataType: Object
        });
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

          if (recordIndexToRemove > 0) _this2.splice(recordIndexToRemove, 1);

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

      _initializerDefineProperty(this, "_isDirty", _descriptor$1, this);

      this.isInFlight = false;

      _initializerDefineProperty(this, "errors", _descriptor2$1, this);

      this.previousSnapshot = {};

      this._makeObservable(initialAttributes);

      this.setPreviousSnapshot();

      this._trackState();
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
     * kpi = store.add('kpis', { name: 'A good thing to measure' })
     * kpi.isDirty
     * => true
     * kpi.name
     * => "A good thing to measure"
     * await kpi.save()
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

        transaction$$1(function () {
          _this3.attributeNames.forEach(function (key) {
            _this3[key] = _this3.previousSnapshot[key];
          });

          _this3.errors = {};
        });
        this.setPreviousSnapshot();
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
        this.errors = {};

        if (!options.skip_validations && !this.validate()) {
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
        var body = JSON.stringify(this.jsonapi({
          relationships: relationships,
          attributes: attributes
        }));
        var response = this.store.fetch(url, {
          method: method,
          body: body
        });
        return new ObjectPromiseProxy(response, this);
      }
      /**
       * Checks all validations, adding errors where necessary and returning `false` if any are not valid
       * @method validate
       * @return {Boolean}
       */

    }, {
      key: "validate",
      value: function validate() {
        var _this4 = this;

        var attributeNames = this.attributeNames,
            attributeDefinitions = this.attributeDefinitions;
        var validationChecks = attributeNames.map(function (property) {
          var validator = attributeDefinitions[property].validator;
          if (!validator) return true;
          var validationResult = validator(_this4[property], _this4);

          if (!validationResult.isValid) {
            _this4.errors[property] = validationResult.errors;
          }

          return validationResult.isValid;
        });
        return validationChecks.every(function (value) {
          return value;
        });
      }
      /**
       * deletes a record from the store and server
       * @method destroy
       * @return {Promise} an empty promise with any success/error status
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

        return promise.then(
        /*#__PURE__*/
        function () {
          var _ref = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(response) {
            var json;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _this.isInFlight = false;

                    if (!(response.status === 202 || response.status === 204)) {
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
                      Object.keys(json.data.attributes).forEach(function (key) {
                        set$$1(_this, key, json.data.attributes[key]);
                      });
                    }

                    _context.next = 13;
                    break;

                  case 10:
                    _context.prev = 10;
                    _context.t0 = _context["catch"](3);
                    console.log(_context.t0); // It is text, do you text handling here

                  case 13:
                    // NOTE: If deleting a record changes other related model
                    // You can return then in the delete response
                    if (json && json.included) {
                      _this.store.createModelsFromData(json.included);
                    }

                    return _context.abrupt("return", _this);

                  case 17:
                    _this.errors = {
                      status: response.status
                    };
                    return _context.abrupt("return", _this);

                  case 19:
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
          _this.errors = error;
          throw error;
        });
      }
      /* Private Methods */

      /**
       * Magic method that makes changes to records
       * observable
       *
       * @method _makeObservable
       */

    }, {
      key: "_makeObservable",
      value: function _makeObservable(initialAttributes) {
        var defaultAttributes = this.defaultAttributes;
        extendObservable$$1(this, _objectSpread({}, defaultAttributes, initialAttributes));
      }
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
       * @method snapshot
       * @return {Object} current attributes
       */

    }, {
      key: "setPreviousSnapshot",

      /**
       * Sets previous snapshot to current snapshot
       *
       * @method setPreviousSnapshot
       */
      value: function setPreviousSnapshot() {
        this.previousSnapshot = this.snapshot;
      }
      /**
       * Uses mobx.autorun to track changes to attributes
       *
       * @method _trackState
       */

    }, {
      key: "_trackState",
      value: function _trackState() {
        var _this5 = this;

        reaction$$1(function () {
          return JSON.stringify(_this5.attributes);
        }, function (objectString) {
          // console.log(objectString)
          _this5.isDirty = true;
        });
        reaction$$1(function () {
          return JSON.stringify(_this5.relationships);
        }, function (relString) {
          // console.log(relString)
          _this5.isDirty = true;
        });
      }
      /**
       * shortcut to get the static
       *
       * @method type
       * @return {String} current attributes
      */

    }, {
      key: "errorForKey",

      /**
       * Getter to check if the record has errors.
       *
       * @method hasErrors
       * @return {Boolean}
       */
      value: function errorForKey(key) {
        return this.errors[key];
      }
      /**
       * Getter to just get the names of a records attributes.
       *
       * @method attributeNames
       * @return {Array}
       */

    }, {
      key: "jsonapi",

      /**
       * getter method to get data in api compliance format
       * TODO: Figure out how to handle unpersisted ids
       *
       * @method jsonapi
       * @return {Object} data in JSON::API format
       */
      value: function jsonapi() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var attributeDefinitions = this.attributeDefinitions,
            attributeNames = this.attributeNames,
            attributes = this.attributes,
            id = this.id,
            relationships = this.relationships,
            type = this.type;
        var attributeNamesSubset = options.attributes,
            relationshipNamesSubset = options.relationships;

        if (attributeNamesSubset) {
          attributeNames = attributeNames.filter(function (name) {
            return attributeNamesSubset.includes(name);
          });
        }

        var attributeData = attributeNames.reduce(function (attrs, key) {
          var value = attributes[key];

          if (value) {
            var DataType = attributeDefinitions[key].dataType;
            var attr;

            if (DataType.name === 'Array' || DataType.name === 'Object') {
              attr = toJS$$1(value);
            } else if (DataType.name === 'Date') {
              attr = moment(value).toISOString();
            } else {
              attr = DataType(value);
            }

            attrs[key] = attr;
          } else {
            attrs[key] = value;
          }

          return attrs;
        }, {});
        var relationshipNames = Object.keys(relationships);

        if (relationshipNamesSubset) {
          relationshipNames = relationshipNames.filter(function (name) {
            return relationshipNamesSubset.includes(name);
          });
        }

        var relationshipData = relationshipNames.reduce(function (rels, key) {
          rels[key] = toJS$$1(relationships[key].data);
          stringifyIds(rels[key]);
          return rels;
        }, {});
        var relationshipSerializerConfigs = relationshipNames.reduce(function (relConfig, key) {
          relConfig[key] = {
            ref: 'id',
            included: false
          };
          return relConfig;
        }, {});
        var ModelSerializer = new jsonapiSerializer_1(type, _objectSpread({
          attributes: [].concat(_toConsumableArray(attributeNames), _toConsumableArray(relationshipNames)),
          keyForAttribute: 'underscore_case'
        }, relationshipSerializerConfigs));

        if (String(id).match(/tmp/)) {
          id = null;
        }

        return ModelSerializer.serialize(_objectSpread({
          id: id,
          type: type
        }, attributeData, relationshipData));
      }
    }, {
      key: "updateAttributes",
      value: function updateAttributes(attributes) {
        var _this6 = this;

        transaction$$1(function () {
          Object.keys(attributes).forEach(function (key) {
            _this6[key] = attributes[key];
          });
        });
      }
    }, {
      key: "isDirty",
      get: function get() {
        var isNew = this.isNew,
            _isDirty = this._isDirty;
        return _isDirty || isNew;
      },
      set: function set(value) {
        this._isDirty = value;
      }
      /**
       * Private method. True if the model has been programatically changed,
       * as opposed to just being new.
       * @property _isDirty
       * @type {Boolean}
       * @default false
       * @private
       */

    }, {
      key: "isNew",

      /**
       * True if the model has not been sent to the store
       * @property isNew
       * @type {Boolean}
       */
      get: function get() {
        var id = this.id;
        return !!String(id).match(/tmp/);
      }
      /**
       * True if the instance is coming from / going to the server
       * ```
       * kpi = store.find('kpis', 5)
       * // fetch started
       * kpi.isInFlight
       * => true
       * // fetch finished
       * kpi.isInFlight
       * => false
       * ```
       * @property isInFlight
       * @type {Boolean}
       * @default false
       */

    }, {
      key: "snapshot",
      get: function get() {
        return this.attributes;
      }
    }, {
      key: "type",
      get: function get() {
        return this.constructor.type;
      }
      /**
       * current attributes of record
       *
       * @method attributes
       * @return {Object} current attributes
       */

    }, {
      key: "attributes",
      get: function get() {
        var _this7 = this;

        return this.attributeNames.reduce(function (attributes, key) {
          var value = toJS$$1(_this7[key]);

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
       * Getter find the relationship definitions for the model type.
       *
       * @method relationshipDefinitions
       * @return {Object}
       */

    }, {
      key: "relationshipDefinitions",
      get: function get() {
        var type = this.constructor.type;
        return schema.relations[type];
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
        }, {
          relationships: {}
        });
      }
    }]);

    return Model;
  }(), _temp$1), (_applyDecoratedDescriptor(_class$1.prototype, "isDirty", [computed$$1], Object.getOwnPropertyDescriptor(_class$1.prototype, "isDirty"), _class$1.prototype), _descriptor$1 = _applyDecoratedDescriptor(_class$1.prototype, "_isDirty", [observable$$1], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class$1.prototype, "isNew", [computed$$1], Object.getOwnPropertyDescriptor(_class$1.prototype, "isNew"), _class$1.prototype), _descriptor2$1 = _applyDecoratedDescriptor(_class$1.prototype, "errors", [observable$$1], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return {};
    }
  })), _class$1);

  exports.Model = Model;
  exports.Store = Store;
  exports.attribute = attribute;
  exports.relatedToMany = relatedToMany;
  exports.relatedToOne = relatedToOne;
  exports.validates = validates;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
