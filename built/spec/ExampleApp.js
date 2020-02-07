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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var mobx_1 = require("mobx");
var mobx_react_1 = require("mobx-react");
var todoCardPropTypes = {
    store: prop_types_1.default.object.isRequired,
    todo: prop_types_1.default.object.isRequired
};
var TodoCard = /** @class */ (function (_super) {
    __extends(TodoCard, _super);
    function TodoCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onChange = function (_a) {
            var target = _a.target;
            _this.todo.title = target.value;
        };
        return _this;
    }
    Object.defineProperty(TodoCard.prototype, "todo", {
        get: function () {
            return this.props.todo;
        },
        enumerable: true,
        configurable: true
    });
    TodoCard.prototype.render = function () {
        var _a = this, onChange = _a.onChange, todo = _a.todo;
        return (<li>
        <label>{todo.title}</label>
        <input value={todo.title} onChange={onChange}/>
      </li>);
    };
    __decorate([
        mobx_1.computed
    ], TodoCard.prototype, "todo", null);
    __decorate([
        mobx_1.action
    ], TodoCard.prototype, "onChange", void 0);
    TodoCard = __decorate([
        mobx_react_1.inject('store'), mobx_react_1.observer
    ], TodoCard);
    return TodoCard;
}(react_1.Component));
TodoCard.wrappedComponent.propTypes = todoCardPropTypes;
function TodoList(_a) {
    var todos = _a.todos;
    return (<ul>
      {todos.map(function (todo) { return <TodoCard key={todo.id} todo={todo}/>; })}
    </ul>);
}
TodoList.propTypes = {
    todos: prop_types_1.default.array.isRequired
};
var exampleAppPropTypes = {
    store: prop_types_1.default.object.isRequired
};
var ExampleApp = /** @class */ (function (_super) {
    __extends(ExampleApp, _super);
    function ExampleApp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = '';
        _this.onChange = function (_a) {
            var target = _a.target;
            _this.title = target.value;
        };
        _this.onClick = function () {
            var _a = _this, title = _a.title, store = _a.props.store;
            store.add('todos', { title: title });
        };
        return _this;
    }
    Object.defineProperty(ExampleApp.prototype, "todos", {
        get: function () {
            var store = this.props.store;
            return store.findAll('todos', { fromServer: false });
        },
        enumerable: true,
        configurable: true
    });
    ExampleApp.prototype.render = function () {
        var _a = this, onChange = _a.onChange, onClick = _a.onClick, todos = _a.todos;
        return (<div>
        <h1>Todos</h1>
        <input onChange={onChange}/>
        <button onClick={onClick}>Submit</button>
        <TodoList todos={todos}/>
      </div>);
    };
    __decorate([
        mobx_1.observable
    ], ExampleApp.prototype, "title", void 0);
    __decorate([
        mobx_1.action
    ], ExampleApp.prototype, "onChange", void 0);
    __decorate([
        mobx_1.action
    ], ExampleApp.prototype, "onClick", void 0);
    __decorate([
        mobx_1.computed
    ], ExampleApp.prototype, "todos", null);
    ExampleApp = __decorate([
        mobx_react_1.inject('store'), mobx_react_1.observer
    ], ExampleApp);
    return ExampleApp;
}(react_1.Component));
ExampleApp.wrappedComponent.propTypes = exampleAppPropTypes;
exports.default = ExampleApp;
