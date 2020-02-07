"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* global fetch */
var react_1 = __importDefault(require("react"));
var enzyme_1 = require("enzyme");
var mobx_react_1 = require("mobx-react");
var mobx_1 = require("mobx");
var main_1 = require("../src/main");
var ExampleApp_1 = __importDefault(require("./ExampleApp"));
var Todo = /** @class */ (function (_super) {
    __extends(Todo, _super);
    function Todo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = '';
        return _this;
    }
    Todo.type = 'todos';
    Todo.endpoint = 'todos';
    __decorate([
        main_1.attribute(String)
    ], Todo.prototype, "title", void 0);
    return Todo;
}(main_1.Model));
var AppStore = /** @class */ (function (_super) {
    __extends(AppStore, _super);
    function AppStore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppStore.types = [
        Todo
    ];
    return AppStore;
}(main_1.Store));
var store = new AppStore();
describe('Example React App', function () {
    beforeEach(function () {
        fetch.resetMocks();
        store.reset();
    });
    it('has correct default text', function () {
        expect.assertions(2);
        // fetch.mockResponse(JSON.stringify([]))
        // Mount the component and set the wrapper variable
        var wrapper = enzyme_1.mount(<mobx_react_1.Provider store={store}>
        <ExampleApp_1.default />
      </mobx_react_1.Provider>);
        expect(wrapper.text()).toMatch('Todos');
        expect(wrapper.text()).not.toMatch('Buy Milk');
    });
    it('can create a new model', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect.assertions(2);
                    fetch.mockResponse(JSON.stringify([]));
                    wrapper = enzyme_1.mount(<mobx_react_1.Provider store={store}>
        <ExampleApp_1.default />
      </mobx_react_1.Provider>);
                    expect(wrapper.text()).not.toMatch('Buy Milk');
                    return [4 /*yield*/, wrapper
                            .find('input')
                            .simulate('change', { target: { value: 'Buy Milk' } })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, wrapper
                            .find('button')
                            .simulate('click')];
                case 2:
                    _a.sent();
                    expect(wrapper.text()).toMatch('Buy Milk');
                    return [2 /*return*/];
            }
        });
    }); });
    it('can edit an existing model', function () { return __awaiter(void 0, void 0, void 0, function () {
        var todoStore, todo, wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    todoStore = new AppStore();
                    todo = todoStore.add('todos', { title: 'Pay bills', options: { trackable_id: 1 } });
                    wrapper = enzyme_1.mount(<mobx_react_1.Provider store={todoStore}>
        <ExampleApp_1.default />
      </mobx_react_1.Provider>);
                    expect(wrapper.text()).toMatch('Pay bills');
                    return [4 /*yield*/, wrapper
                            .find('input')
                            .last()
                            .simulate('change', { target: { value: 'Make payments' } })];
                case 1:
                    _a.sent();
                    expect(todo.options.trackable_id).toBe(1);
                    expect(wrapper.text()).toMatch('Make payments');
                    expect(mobx_1.isObservable(todo)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
