"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* global fetch */
const react_1 = __importDefault(require("react"));
const enzyme_1 = require("enzyme");
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const main_1 = require("../src/main");
const ExampleApp_1 = __importDefault(require("./ExampleApp"));
class Todo extends main_1.Model {
    constructor() {
        super(...arguments);
        this.title = '';
    }
}
Todo.type = 'todos';
Todo.endpoint = 'todos';
__decorate([
    main_1.attribute(String)
], Todo.prototype, "title", void 0);
class AppStore extends main_1.Store {
}
AppStore.types = [
    Todo
];
const store = new AppStore();
describe('Example React App', () => {
    beforeEach(() => {
        // @ts-ignore
        fetch.resetMocks();
        store.reset();
    });
    it('has correct default text', () => {
        expect.assertions(2);
        // fetch.mockResponse(JSON.stringify([]))
        // Mount the component and set the wrapper variable
        const wrapper = enzyme_1.mount(react_1.default.createElement(mobx_react_1.Provider, { store: store },
            react_1.default.createElement(ExampleApp_1.default, null)));
        expect(wrapper.text()).toMatch('Todos');
        expect(wrapper.text()).not.toMatch('Buy Milk');
    });
    it('can create a new model', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        // @ts-ignore
        fetch.mockResponse(JSON.stringify([]));
        const wrapper = enzyme_1.mount(react_1.default.createElement(mobx_react_1.Provider, { store: store },
            react_1.default.createElement(ExampleApp_1.default, null)));
        expect(wrapper.text()).not.toMatch('Buy Milk');
        yield wrapper
            .find('input')
            .simulate('change', { target: { value: 'Buy Milk' } });
        yield wrapper
            .find('button')
            .simulate('click');
        expect(wrapper.text()).toMatch('Buy Milk');
    }));
    it('can edit an existing model', () => __awaiter(void 0, void 0, void 0, function* () {
        const todoStore = new AppStore();
        let todo = todoStore.add('todos', { title: 'Pay bills', options: { trackable_id: 1 } });
        const wrapper = enzyme_1.mount(react_1.default.createElement(mobx_react_1.Provider, { store: todoStore },
            react_1.default.createElement(ExampleApp_1.default, null)));
        expect(wrapper.text()).toMatch('Pay bills');
        yield wrapper
            .find('input')
            .last()
            .simulate('change', { target: { value: 'Make payments' } });
        expect(todo.options.trackable_id).toBe(1);
        expect(wrapper.text()).toMatch('Make payments');
        expect(mobx_1.isObservable(todo)).toBeTruthy();
    }));
});
//# sourceMappingURL=integration.spec.js.map