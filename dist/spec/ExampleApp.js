"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
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
        enumerable: false,
        configurable: true
    });
    TodoCard.prototype.render = function () {
        var _a = this, onChange = _a.onChange, todo = _a.todo;
        return (react_1.default.createElement("li", null,
            react_1.default.createElement("label", null, todo.title),
            react_1.default.createElement("input", { value: todo.title, onChange: onChange })));
    };
    __decorate([
        mobx_1.computed
    ], TodoCard.prototype, "todo", null);
    __decorate([
        mobx_1.action
    ], TodoCard.prototype, "onChange", void 0);
    TodoCard = __decorate([
        mobx_react_1.inject('store'),
        mobx_react_1.observer
    ], TodoCard);
    return TodoCard;
}(react_1.Component));
TodoCard.wrappedComponent.propTypes = todoCardPropTypes;
function TodoList(_a) {
    var todos = _a.todos;
    return (react_1.default.createElement("ul", null, todos.map(function (todo) { return react_1.default.createElement(TodoCard, { key: todo.id, todo: todo }); })));
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
        enumerable: false,
        configurable: true
    });
    ExampleApp.prototype.render = function () {
        var _a = this, onChange = _a.onChange, onClick = _a.onClick, todos = _a.todos;
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("h1", null, "Todos"),
            react_1.default.createElement("input", { onChange: onChange }),
            react_1.default.createElement("button", { onClick: onClick }, "Submit"),
            react_1.default.createElement(TodoList, { todos: todos })));
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
        mobx_react_1.inject('store'),
        mobx_react_1.observer
    ], ExampleApp);
    return ExampleApp;
}(react_1.Component));
ExampleApp.wrappedComponent.propTypes = exampleAppPropTypes;
exports.default = ExampleApp;
//# sourceMappingURL=ExampleApp.js.map