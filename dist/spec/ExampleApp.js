"use strict";
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
const react_1 = __importStar(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const todoCardPropTypes = {
    store: prop_types_1.default.object.isRequired,
    todo: prop_types_1.default.object.isRequired
};
let TodoCard = class TodoCard extends react_1.Component {
    constructor() {
        super(...arguments);
        this.onChange = ({ target }) => {
            this.todo.title = target.value;
        };
    }
    get todo() {
        return this.props.todo;
    }
    render() {
        const { onChange, todo } = this;
        return (react_1.default.createElement("li", null,
            react_1.default.createElement("label", null, todo.title),
            react_1.default.createElement("input", { value: todo.title, onChange: onChange })));
    }
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
TodoCard.wrappedComponent.propTypes = todoCardPropTypes;
function TodoList({ todos }) {
    return (react_1.default.createElement("ul", null, todos.map(todo => react_1.default.createElement(TodoCard, { key: todo.id, todo: todo }))));
}
TodoList.propTypes = {
    todos: prop_types_1.default.array.isRequired
};
const exampleAppPropTypes = {
    store: prop_types_1.default.object.isRequired
};
let ExampleApp = class ExampleApp extends react_1.Component {
    constructor() {
        super(...arguments);
        this.title = '';
        this.onChange = ({ target }) => {
            this.title = target.value;
        };
        this.onClick = () => {
            const { title, props: { store } } = this;
            store.add('todos', { title });
        };
    }
    get todos() {
        const { store } = this.props;
        return store.findAll('todos', { fromServer: false });
    }
    render() {
        const { onChange, onClick, todos } = this;
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("h1", null, "Todos"),
            react_1.default.createElement("input", { onChange: onChange }),
            react_1.default.createElement("button", { onClick: onClick }, "Submit"),
            react_1.default.createElement(TodoList, { todos: todos })));
    }
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
ExampleApp.wrappedComponent.propTypes = exampleAppPropTypes;
exports.default = ExampleApp;
//# sourceMappingURL=ExampleApp.js.map