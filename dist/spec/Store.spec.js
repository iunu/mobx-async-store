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
Object.defineProperty(exports, "__esModule", { value: true });
/* global fetch Response */
const mobx_1 = require("mobx");
const main_1 = require("../src/main");
const utils_1 = require("../src/utils");
class Tag extends main_1.Model {
    constructor() {
        super(...arguments);
        this.label = '';
    }
}
Tag.type = 'tags';
Tag.endpoint = 'tags';
__decorate([
    main_1.attribute(String)
], Tag.prototype, "label", void 0);
__decorate([
    main_1.relatedToOne
], Tag.prototype, "todo", void 0);
class Category extends main_1.Model {
    constructor() {
        super(...arguments);
        this.name = '';
    }
}
Category.type = 'categories';
Category.endpoint = 'categories';
__decorate([
    main_1.attribute(String)
], Category.prototype, "name", void 0);
__decorate([
    main_1.relatedToOne
], Category.prototype, "todo", void 0);
class Note extends main_1.Model {
    constructor() {
        super(...arguments);
        this.text = '';
    }
}
Note.type = 'notes';
Note.endpoint = 'notes';
__decorate([
    main_1.attribute(String)
], Note.prototype, "text", void 0);
__decorate([
    main_1.relatedToOne
], Note.prototype, "todo", void 0);
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
__decorate([
    main_1.relatedToMany(Note)
], Todo.prototype, "user_notes", void 0);
__decorate([
    main_1.relatedToOne(Note)
], Todo.prototype, "instructions", void 0);
__decorate([
    main_1.relatedToOne
], Todo.prototype, "category", void 0);
__decorate([
    main_1.relatedToMany
], Todo.prototype, "tags", void 0);
class AppStore extends main_1.Store {
}
AppStore.types = [
    Note,
    Todo,
    Tag,
    Category
];
const mockBaseUrl = '/example_api';
const mockFetchOptions = {
    // credentials: 'includes',
    headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accepts': 'application/json'
    }
};
const store = new AppStore({
    baseUrl: mockBaseUrl,
    defaultFetchOptions: mockFetchOptions
});
const mockTodoData = {
    data: {
        id: '1',
        type: 'todos',
        attributes: {
            id: '1',
            title: 'Do taxes'
        }
    }
};
const mockTodoResponse = JSON.stringify(mockTodoData);
const mockTodosResponse = JSON.stringify({ data: [mockTodoData.data] });
const createMockIds = (numberOfIds, idPrefix = '') => {
    return [...Array(numberOfIds)].map((_, index) => {
        const startingNumber = Number(idPrefix);
        return isNaN(startingNumber) ? `${idPrefix}${index}` : String(startingNumber + index);
    });
};
const createMockTodosAttributes = (numberOfRecords, idPrefix = '', titlePrefix = 'Todo') => {
    return createMockIds(numberOfRecords, idPrefix).map(id => {
        return {
            id,
            title: `${titlePrefix} ${id}`
        };
    });
};
const createMockTodosResponse = (numberOfRecords, idPrefix = '', titlePrefix = 'Todo') => {
    const data = createMockTodosAttributes(numberOfRecords, idPrefix, titlePrefix).map(attributes => {
        return {
            id: attributes.id,
            type: 'todos',
            attributes
        };
    });
    return JSON.stringify({ data });
};
describe('Store', () => {
    beforeEach(() => {
        fetch.resetMocks();
        store.reset();
    });
    it('has observable data property', () => {
        expect.assertions(1);
        expect(mobx_1.isObservable(store.data)).toBe(true);
    });
    it('sets network configuration properties', () => {
        expect.assertions(2);
        expect(store.baseUrl).toEqual(mockBaseUrl);
        expect(store.defaultFetchOptions).toEqual(mockFetchOptions);
    });
    it('sets model type index', () => {
        expect.assertions(1);
        expect(store.modelTypeIndex).toEqual({
            todos: Todo,
            notes: Note,
            categories: Category,
            tags: Tag
        });
    });
    it('initializes data observable', () => {
        expect.assertions(1);
        expect(mobx_1.toJS(store.data)).toEqual({
            todos: { cache: {}, records: {} },
            notes: { cache: {}, records: {} },
            categories: { cache: {}, records: {} },
            tags: { cache: {}, records: {} }
        });
    });
    describe('add', () => {
        it('adds basic model to store', () => {
            expect.assertions(1);
            const example = store.add('todos', { title: 'Buy Milk' });
            expect(example.title).toEqual('Buy Milk');
        });
        it('adds multiple records to the store', () => {
            expect.assertions(2);
            const exampleData = [
                { title: 'Buy Milk' },
                { title: 'Do laundry' }
            ];
            const examples = store.add('todos', exampleData);
            expect(examples).toHaveLength(2);
            const foundExamples = store.findAll('todos', { fromServer: false });
            expect(foundExamples).toHaveLength(2);
        });
    });
    describe('build', () => {
        it('builds a model instance', () => {
            const example = store.build('todos', { title: 'Buy Milk' });
            expect(example.title).toEqual('Buy Milk');
        });
        it('does not add it to the store', () => {
            const example = store.build('todos', { title: 'Buy Milk' });
            expect(store.getRecord('todos', example.id)).toBeUndefined();
        });
        it('gives the record a temporary id', () => {
            const example = store.build('todos', { title: 'Buy Milk' });
            expect(example.id).toMatch(/^tmp-/);
        });
        it('unless an id is present in attributes', () => {
            const example = store.build('todos', { id: 'foo', title: 'Buy Milk' });
            expect(example.id).toBe('foo');
        });
    });
    describe('bulkSave', () => {
        it('raises an invariant error if we submit n records and don\'t receive data for n records', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const todo1 = store.add('todos', { title: 'Pet Dog' });
            const todo2 = store.add('todos', { title: 'Give Dog Treat' });
            fetch.mockResponse(JSON.stringify({}));
            try {
                yield store.bulkSave('todos', [todo1, todo2]);
            }
            catch (err) {
                expect(err.message).toMatch('Invariant violated');
            }
        }));
        it('constructs a payload for all records in a jsonapi bulk-extension compliant way', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo1 = store.add('todos', { title: 'Pet Dog' });
            const todo3 = store.add('todos', { title: 'Give Dog Treat' });
            const mockTodosData = {
                data: [
                    {
                        id: '1',
                        type: 'todos',
                        attributes: {
                            title: 'Pet Dog'
                        }
                    },
                    {
                        id: '2',
                        type: 'todos',
                        attributes: {
                            title: 'Give Dog Treat'
                        }
                    }
                ]
            };
            const mockTodosResponse = JSON.stringify(mockTodosData);
            fetch.mockResponse(mockTodosResponse);
            yield store.bulkSave('todos', [todo1, todo3]);
            expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
                data: [
                    {
                        type: 'todos',
                        attributes: {
                            title: 'Pet Dog'
                        }
                    },
                    {
                        type: 'todos',
                        attributes: {
                            title: 'Give Dog Treat'
                        }
                    }
                ]
            });
        }));
        it('updates the original records after they have been saved with data from the response', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo1 = store.add('todos', { title: 'Pet Dog' });
            const todo3 = store.add('todos', { title: 'Give Dog Treat' });
            const mockTodosData = {
                data: [
                    {
                        id: '1',
                        type: 'todos',
                        attributes: {
                            title: 'Pet Dog'
                        }
                    },
                    {
                        id: '2',
                        type: 'todos',
                        attributes: {
                            title: 'Give Dog Treat'
                        }
                    }
                ]
            };
            const mockTodosResponse = JSON.stringify(mockTodosData);
            fetch.mockResponse(mockTodosResponse);
            yield store.bulkSave('todos', [todo1, todo3]);
            expect(todo1.id).toEqual('1');
            expect(todo3.id).toEqual('2');
        }));
        it('adds the bulk extension format to the request header', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo1 = store.add('todos', { title: 'Pet Dog' });
            const mockTodosData = {
                data: [
                    {
                        id: '1',
                        type: 'todos',
                        attributes: {
                            title: 'Pet Dog'
                        }
                    }
                ]
            };
            const mockTodosResponse = JSON.stringify(mockTodosData);
            fetch.mockResponse(mockTodosResponse);
            yield store.bulkSave('todos', [todo1]);
            expect(fetch.mock.calls[0][1].headers['Content-Type'])
                .toEqual('application/vnd.api+json; ext="bulk"');
        }));
        it('adds the extensions to the request header', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo1 = store.add('todos', { title: 'Pet Dog' });
            const extensions = ['artemis/group', 'artemis/extendDaThings'];
            const mockTodosData = {
                data: [
                    {
                        id: '1',
                        type: 'todos',
                        attributes: {
                            title: 'Pet Dog'
                        }
                    }
                ]
            };
            const mockTodosResponse = JSON.stringify(mockTodosData);
            fetch.mockResponse(mockTodosResponse);
            yield store.bulkSave('todos', [todo1], { extensions });
            expect(fetch.mock.calls[0][1].headers['Content-Type'])
                .toEqual('application/vnd.api+json; ext="bulk,artemis/group,artemis/extendDaThings"');
        }));
        it('ignores empty extensions in the request header', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo1 = store.add('todos', { title: 'Pet Dog' });
            const extensions = [];
            const mockTodosData = {
                data: [
                    {
                        id: '1',
                        type: 'todos',
                        attributes: {
                            title: 'Pet Dog'
                        }
                    }
                ]
            };
            const mockTodosResponse = JSON.stringify(mockTodosData);
            fetch.mockResponse(mockTodosResponse);
            yield store.bulkSave('todos', [todo1], { extensions });
            expect(fetch.mock.calls[0][1].headers['Content-Type'])
                .toEqual('application/vnd.api+json; ext="bulk"');
        }));
    });
    describe('updateRecords', () => {
        function mockRequest(errors) {
            return new Promise((resolve, reject) => {
                const body = JSON.stringify({ errors });
                process.nextTick(() => resolve(new Response(body, { status: 422 })));
            });
        }
        describe('error handling', () => {
            it('ignores errors without a pointer', () => __awaiter(void 0, void 0, void 0, function* () {
                const todo = store.add('todos', { title: '' });
                const errors = [
                    {
                        detail: "Title can't be blank",
                        title: 'Invalid title'
                    }
                ];
                try {
                    yield store.updateRecords(mockRequest(errors), todo);
                }
                catch (error) {
                    expect(todo.errors).toEqual({});
                }
            }));
            it('ignores pointers not in the jsonapi spec format', () => __awaiter(void 0, void 0, void 0, function* () {
                const todo = store.add('todos', { title: '' });
                const errors = [
                    {
                        detail: "Title can't be blank",
                        source: { pointer: 'attributes:title' },
                        title: 'Invalid title'
                    }
                ];
                try {
                    yield store.updateRecords(mockRequest(errors), todo);
                }
                catch (error) {
                    expect(todo.errors).toEqual({});
                }
            }));
            it('adds server errors to the models', () => __awaiter(void 0, void 0, void 0, function* () {
                const todo = store.add('todos', { title: '' });
                const errors = [
                    {
                        detail: "Title can't be blank",
                        source: { pointer: '/data/attributes/title' },
                        title: 'Invalid title'
                    }
                ];
                try {
                    yield store.updateRecords(mockRequest(errors), todo);
                }
                catch (error) {
                    expect(todo.errors.title).toEqual(errors);
                }
            }));
            it('adds multiple server errors for the same attribute', () => __awaiter(void 0, void 0, void 0, function* () {
                const todo = store.add('todos', { title: '' });
                const errors = [
                    {
                        detail: "Title can't be blank",
                        source: { pointer: '/data/attributes/title' },
                        title: 'Invalid title'
                    },
                    {
                        detail: 'Title is taken',
                        source: { pointer: '/data/attributes/title' },
                        title: 'Invalid title'
                    }
                ];
                try {
                    yield store.updateRecords(mockRequest(errors), todo);
                }
                catch (error) {
                    expect(todo.errors.title).toEqual(errors);
                }
            }));
            // Note: There is no support for model validations for nested attributes
            it('adds server errors for nested attributes', () => __awaiter(void 0, void 0, void 0, function* () {
                const todo = store.add('todos', { title: '' });
                const errors = [
                    {
                        detail: 'Quantity must be greater than 0',
                        source: {
                            pointer: '/data/attributes/options/resources/0/quantity'
                        },
                        title: 'Invalid quantity'
                    }
                ];
                try {
                    yield store.updateRecords(mockRequest(errors), todo);
                }
                catch (error) {
                    expect(todo.errors['options.resources.0.quantity']).toEqual(errors);
                }
            }));
            it('adds server errors for multiple records', () => __awaiter(void 0, void 0, void 0, function* () {
                const todo1 = store.add('todos', {});
                const todo2 = store.add('todos', {});
                const errors = [
                    {
                        detail: "Title can't be blank",
                        source: { pointer: '/data/0/attributes/title' },
                        title: 'Invalid title'
                    },
                    {
                        detail: 'Quantity must be greater than 0',
                        source: {
                            pointer: '/data/1/attributes/quantity'
                        },
                        title: 'Invalid quantity'
                    }
                ];
                try {
                    yield store.updateRecords(mockRequest(errors), [todo1, todo2]);
                }
                catch (error) {
                    expect(todo2.errors.quantity).toEqual([errors[1]]);
                }
            }));
            it('adds server errors to the right record', () => __awaiter(void 0, void 0, void 0, function* () {
                const todo1 = store.add('todos', {});
                const todo2 = store.add('todos', {});
                const errors = [
                    {
                        detail: "Title can't be blank",
                        source: { pointer: '/data/1/attributes/title' },
                        title: 'Invalid title'
                    }
                ];
                try {
                    yield store.updateRecords(mockRequest(errors), [todo1, todo2]);
                }
                catch (error) {
                    expect(todo2.errors.title).toEqual(errors);
                }
            }));
        });
    });
    describe('reset', () => {
        it('removes all records from the store', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(4);
            store.add('todos', { title: 'Buy Milk' });
            store.add('notes', { text: 'Example text' });
            expect(store.findAll('todos', { fromServer: false }))
                .toHaveLength(1);
            expect(store.findAll('notes', { fromServer: false }))
                .toHaveLength(1);
            store.reset();
            expect(store.findAll('todos', { fromServer: false }))
                .toHaveLength(0);
            expect(store.findAll('notes', { fromServer: false }))
                .toHaveLength(0);
        }));
        it('removes records of a specific type if type arg is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(4);
            store.add('todos', { title: 'Buy Milk' });
            store.add('notes', { text: 'Example text' });
            expect(store.findAll('todos', { fromServer: false }))
                .toHaveLength(1);
            expect(store.findAll('notes', { fromServer: false }))
                .toHaveLength(1);
            store.reset('todos');
            expect(store.findAll('todos', { fromServer: false }))
                .toHaveLength(0);
            expect(store.findAll('notes', { fromServer: false }))
                .toHaveLength(1);
        }));
    });
    describe('findOne', () => {
        it('find model in store', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const addedModel = store.add('todos', { title: 'Buy Milk' });
            const { id } = addedModel;
            const foundModel = yield store.findOne('todos', id);
            expect(foundModel.title).toEqual(addedModel.title);
        }));
        it('fetches model if it not present', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            fetch.mockResponse(mockTodoResponse);
            const todo = yield store.findOne('todos', '1');
            expect(todo.title).toEqual('Do taxes');
        }));
        it('supports queryParams', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            fetch.mockResponse(mockTodoResponse);
            yield store.findOne('todos', '1', {
                queryParams: {
                    filter: {
                        due_at: '2019-01-01'
                    },
                    include: 'todo.notes',
                    user_id: '1'
                }
            });
            expect(decodeURIComponent(fetch.mock.calls[0][0]))
                .toEqual('/example_api/todos/1?filter[due_at]=2019-01-01&include=todo.notes&user_id=1');
        }));
    });
    describe('findAll', () => {
        describe('when "fromServer" is set to false', () => {
            describe('if records of the specified type do not exist', () => {
                it('returns an empty array', () => {
                    expect.assertions(1);
                    const todos = store.findAll('todos', { fromServer: false });
                    expect(todos).toHaveLength(0);
                });
            });
            describe('if records of the specified type do exist', () => {
                it('returns existing models in the store', () => {
                    expect.assertions(1);
                    store.add('todos', { title: 'Buy Milk' });
                    const todos = store.findAll('todos', {
                        fromServer: false
                    });
                    expect(todos).toHaveLength(1);
                });
            });
        });
        describe('when "fromServer" is set to true', () => {
            it('fetches data from server', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(4);
                fetch.mockResponse(mockTodosResponse);
                const todos = yield store.findAll('todos', { fromServer: true });
                expect(todos).toHaveLength(1);
                expect(todos[0].title).toEqual('Do taxes');
                expect(fetch.mock.calls).toHaveLength(1);
                expect(fetch.mock.calls[0][0])
                    .toEqual('/example_api/todos');
            }));
            it('fetches data with filter params', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(2);
                fetch.mockResponse(mockTodosResponse);
                yield store.findAll('todos', {
                    fromServer: true,
                    queryParams: {
                        filter: {
                            title: 'Do taxes',
                            overdue: true
                        }
                    }
                });
                expect(fetch.mock.calls).toHaveLength(1);
                expect(decodeURIComponent(fetch.mock.calls[0][0]))
                    .toEqual('/example_api/todos?filter[title]=Do taxes&filter[overdue]=true');
            }));
            it('fetches data with include params', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(2);
                fetch.mockResponse(mockTodosResponse);
                yield store.findAll('todos', {
                    fromServer: true,
                    queryParams: {
                        include: 'todo.notes,todo.comments'
                    }
                });
                expect(fetch.mock.calls).toHaveLength(1);
                expect(decodeURIComponent(fetch.mock.calls[0][0]))
                    .toEqual('/example_api/todos?include=todo.notes,todo.comments');
            }));
            it('fetches data with named query params', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(2);
                fetch.mockResponse(mockTodosResponse);
                yield store.findAll('todos', {
                    fromServer: true,
                    queryParams: {
                        foo: 'bar'
                    }
                });
                expect(fetch.mock.calls).toHaveLength(1);
                expect(decodeURIComponent(fetch.mock.calls[0][0]))
                    .toEqual('/example_api/todos?foo=bar');
            }));
            it('fetches data with named array filters', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(2);
                fetch.mockResponse(mockTodosResponse);
                yield store.findAll('todos', {
                    fromServer: true,
                    queryParams: {
                        filter: {
                            ids: ['1', '2']
                        }
                    }
                });
                expect(fetch.mock.calls).toHaveLength(1);
                expect(decodeURIComponent(fetch.mock.calls[0][0]))
                    .toEqual('/example_api/todos?filter[ids][]=1&filter[ids][]=2');
            }));
            it('caches list ids by request url', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(1);
                fetch.mockResponse(mockTodosResponse);
                yield store.findAll('todos', { fromServer: true });
                const cache = mobx_1.toJS(store.data.todos.cache);
                expect(cache['/example_api/todos']).toEqual(['1']);
            }));
            it('fetched data snapshots are marked as persisted', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(1);
                fetch.mockResponse(mockTodosResponse);
                // Create an existing todo
                store.add('todos', {
                    id: mockTodoData.data.id,
                    attributes: mockTodoData.data.attributes
                });
                const todos = yield store.findAll('todos', { fromServer: true });
                expect(todos[0].previousSnapshot.persisted).toBeTruthy();
            }));
        });
        describe('when "fromServer" is not explicitly set', () => {
            describe('if records of the specified type do not exist', () => {
                it('fetches data from server', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect.assertions(4);
                    fetch.mockResponse(mockTodosResponse);
                    const todos = yield store.findAll('todos');
                    expect(todos).toHaveLength(1);
                    expect(todos[0].title).toEqual('Do taxes');
                    expect(fetch.mock.calls).toHaveLength(1);
                    expect(fetch.mock.calls[0][0]).toEqual('/example_api/todos');
                }));
            });
            describe('if records of the specified type do exist', () => {
                it('skips fetch and returns local data from the store', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect.assertions(2);
                    store.add('todos', { title: 'Buy Milk' });
                    const todos = yield store.findAll('todos');
                    expect(todos).toHaveLength(1);
                    expect(fetch).not.toHaveBeenCalled();
                }));
            });
            describe('if a query is made with identical params', () => {
                it('skips fetch and returns local data from the store', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect.assertions(6);
                    // Query params for both requests
                    const queryParams = { filter: { overdue: true } };
                    // Only need to mock response once :)
                    fetch.mockResponse(mockTodosResponse);
                    // Fetch todos
                    let query = store.findAll('todos', { queryParams });
                    expect(query).toBeInstanceOf(Promise);
                    let todos = yield query;
                    expect(todos).toHaveLength(1);
                    expect(fetch.mock.calls).toHaveLength(1);
                    // Find todos a second time
                    query = store.findAll('todos', { queryParams });
                    expect(query).toBeInstanceOf(Promise);
                    todos = yield query;
                    // Not fetch should be kicked off
                    expect(todos).toHaveLength(1);
                    expect(fetch.mock.calls).toHaveLength(1);
                }));
            });
        });
        describe('cache behavior', () => {
            const assertionText = `If you fetch a record from the server,
        update its attributes (client-only), then look it up again via
        the same query, and fromServer is false or undefined
      `;
            describe(assertionText, () => {
                it('the record will be returned from cache with updated attributes preserved', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect.assertions(6);
                    fetch.mockResponse(mockTodosResponse);
                    // First fetch the record from the server
                    const todos = yield store.findAll('todos', {
                        queryParams: {
                            title: 'Do taxes'
                        }
                    });
                    // Check the correct number of todos are found
                    expect(todos).toHaveLength(1);
                    const todo = todos[0];
                    // Check the record has the correct attribute
                    expect(todo.title).toEqual('Do taxes');
                    // Check that a call a request was made
                    expect(fetch.mock.calls).toHaveLength(1);
                    // Update the model in the store
                    todo.title = 'New title';
                    // Trigger a "findAll" with the identical
                    // query params
                    const cachedTodos = yield store.findAll('todos', {
                        queryParams: {
                            title: 'Do taxes'
                        }
                    });
                    // Once again the correct number of todos are found
                    expect(cachedTodos).toHaveLength(1);
                    // Check that a request was NOT made
                    expect(fetch.mock.calls).toHaveLength(1);
                    // Check the record still has the value
                    // set in the store
                    const cachedTodo = cachedTodos[0];
                    expect(cachedTodo.title).toEqual('New title');
                }));
            });
        });
    });
    describe('findMany', () => {
        describe('"fromServer" is set to false', () => {
            describe('records of the specified type do not exist', () => {
                it('returns an empty array', () => {
                    const todos = store.findMany('todos', ['1001', '5000'], { fromServer: false });
                    expect(todos).toHaveLength(0);
                });
            });
            describe('records of the specified type do exist', () => {
                it('returns existing only models in the store', () => {
                    store.add('todos', createMockTodosAttributes(5, '1000'));
                    const todos = store.findMany('todos', ['1001', '5000'], {
                        fromServer: false
                    });
                    expect(todos).toHaveLength(1);
                });
            });
        });
        describe('when "fromServer" is set to true', () => {
            it('fetches data from server', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(4);
                fetch.mockResponse(createMockTodosResponse(5, '1000'));
                const ids = createMockIds(5, '1000');
                const todos = yield store.findMany('todos', ids, { fromServer: true });
                expect(todos).toHaveLength(5);
                expect(todos[0].title).toEqual('Todo 1000');
                expect(fetch.mock.calls).toHaveLength(1);
                expect(fetch.mock.calls[0][0])
                    .toEqual('/example_api/todos?filter%5Bids%5D=1000%2C1001%2C1002%2C1003%2C1004');
            }));
            it('uses multiple fetches for data from server', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(7);
                fetch.mockResponseOnce(createMockTodosResponse(100, '1000'));
                fetch.mockResponseOnce(createMockTodosResponse(100, '1100'));
                fetch.mockResponseOnce(createMockTodosResponse(100, '1200'));
                const ids = createMockIds(300, '1000');
                const todos = yield store.findMany('todos', ids, { fromServer: true });
                expect(todos).toHaveLength(300);
                expect(store.findAll('todos', { fromServer: false })).toHaveLength(300);
                expect(fetch.mock.calls).toHaveLength(3);
                const [firstCall] = fetch.mock.calls[0];
                expect(decodeURIComponent(firstCall)).toMatch(/1139$/);
                fetch.mock.calls.forEach(call => {
                    expect(call[0].length).toBeLessThan(utils_1.URL_MAX_LENGTH);
                });
            }));
            it('fetches data with other params', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(8);
                const ids = createMockIds(300, '1000');
                fetch.mockResponse(mockTodosResponse);
                yield store.findMany('todos', ids, {
                    fromServer: true,
                    queryParams: {
                        filter: {
                            title: 'Do taxes',
                            overdue: true
                        }
                    }
                });
                expect(fetch.mock.calls).toHaveLength(3);
                fetch.mock.calls.forEach(call => {
                    const [path] = call;
                    expect(decodeURIComponent(path)).toMatch('/example_api/todos?filter[title]=Do taxes&filter[overdue]=true');
                    expect(call.length).toBeLessThan(utils_1.URL_MAX_LENGTH);
                });
                const [firstPath] = fetch.mock.calls[0];
                expect(decodeURIComponent(firstPath)).toMatch(/1132$/);
            }));
            it('fetches data with named array filters', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(8);
                fetch.mockResponse(mockTodosResponse);
                const ids = createMockIds(300, '1000');
                yield store.findMany('todos', ids, {
                    fromServer: true,
                    queryParams: {
                        filter: {
                            category: 'important'
                        }
                    }
                });
                expect(fetch.mock.calls).toHaveLength(3);
                fetch.mock.calls.forEach(call => {
                    const [path] = call;
                    expect(decodeURIComponent(path)).toMatch('filter[category]=important');
                    expect(call.length).toBeLessThan(utils_1.URL_MAX_LENGTH);
                });
                const [firstPath] = fetch.mock.calls[0];
                expect(decodeURIComponent(firstPath)).toMatch(/1135$/);
            }));
            it('caches list ids by request url', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(1);
                fetch.mockResponse(mockTodosResponse);
                yield store.findMany('todos', ['1'], { fromServer: true });
                const cache = mobx_1.toJS(store.data.todos.cache);
                expect(cache['/example_api/todos?filter%5Bids%5D=1']).toEqual(['1']);
            }));
        });
        describe('when "fromServer" is not explicitly set', () => {
            describe('no records of the specified type exist', () => {
                it('uses multiple fetches to request all records from server', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect.assertions(7);
                    fetch.mockResponseOnce(createMockTodosResponse(100, '1000'));
                    fetch.mockResponseOnce(createMockTodosResponse(100, '1100'));
                    fetch.mockResponseOnce(createMockTodosResponse(100, '1200'));
                    const ids = createMockIds(300, '1000');
                    const todos = yield store.findMany('todos', ids);
                    expect(todos).toHaveLength(300);
                    expect(store.findAll('todos', { fromServer: false })).toHaveLength(300);
                    expect(fetch.mock.calls).toHaveLength(3);
                    const [firstCall] = fetch.mock.calls[0];
                    expect(decodeURIComponent(firstCall)).toMatch(/1139$/);
                    fetch.mock.calls.forEach(call => {
                        expect(call[0].length).toBeLessThan(utils_1.URL_MAX_LENGTH);
                    });
                }));
            });
            describe('some records of the specified type exist', () => {
                it('uses multiple fetches to request some records from server', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect.assertions(7);
                    fetch.mockResponseOnce(createMockTodosResponse(100, '1000'));
                    fetch.mockResponseOnce(createMockTodosResponse(75, '1100'));
                    store.add('todos', createMockTodosAttributes(150, '1175'));
                    const ids = createMockIds(300, '1000');
                    const todos = yield store.findMany('todos', ids);
                    expect(todos).toHaveLength(300);
                    expect(store.findAll('todos', { fromServer: false })).toHaveLength(325);
                    expect(fetch.mock.calls).toHaveLength(2);
                    expect(fetch.mock.calls.some(call => call[0].match(/1174/))).toBeTruthy();
                    expect(fetch.mock.calls.some(call => call[0].match(/1175/))).toBeFalsy();
                    fetch.mock.calls.forEach(call => {
                        expect(call[0].length).toBeLessThan(utils_1.URL_MAX_LENGTH);
                    });
                }));
            });
            describe('all records of the specified type exist', () => {
                it('uses the cache instead of requesting from the server', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect.assertions(3);
                    store.add('todos', createMockTodosAttributes(400, '1000'));
                    const ids = createMockIds(300, '1000');
                    const todos = yield store.findMany('todos', ids);
                    expect(todos).toHaveLength(300);
                    expect(store.findAll('todos', { fromServer: false })).toHaveLength(400);
                    expect(fetch.mock.calls).toHaveLength(0);
                }));
            });
        });
    });
    describe('createModel', () => {
        it('creates a model obj with attributes', () => {
            const todoData = {
                attributes: { title: 'hello!' }
            };
            const todo = store.createModel('todos', 1, todoData);
            expect(todo.id).toEqual(1);
            expect(todo.title).toEqual(todoData.attributes.title);
        });
        it('creates a model obj with relatedToOne property', () => {
            const category = store.add('categories', { id: 5, name: 'Cat5' });
            const todoData = {
                attributes: { title: 'hello!' },
                relationships: {
                    category: { data: { id: category.id, type: 'categories' } }
                }
            };
            const todo = store.createModel('todos', 1, todoData);
            expect(todo.id).toEqual(1);
            expect(todo.category.id).toEqual(category.id);
            expect(todo.category.name).toEqual(category.name);
        });
        it('creates a model with relatedToMany property', () => {
            const tag = store.add('tags', { id: 3, label: 'Tag #3' });
            const todoData = {
                attributes: { title: 'hello!' },
                relationships: {
                    tags: { data: [{ id: tag.id, type: 'tags' }] }
                }
            };
            const todo = store.createModel('todos', 1, todoData);
            expect(todo.id).toEqual(1);
            expect(todo.tags[0].id).toEqual(tag.id);
            expect(todo.tags[0].label).toEqual(tag.label);
        });
        it('creates a model with aliased relatedToOne property', () => {
            const note = store.add('notes', { id: 17, text: 'Example text' });
            const todoData = {
                attributes: { title: 'hello!' },
                relationships: {
                    note: { data: { id: note.id, type: 'notes' } }
                }
            };
            const todo = store.createModel('todos', 1, todoData);
            expect(todo.instructions.id).toEqual(note.id);
            expect(todo.instructions.text).toEqual(note.text);
        });
        it('creates a model with aliased relatedToMany property', () => {
            const note = store.add('notes', { id: 3, text: 'hi' });
            const todoData = {
                attributes: { title: 'hello!' },
                relationships: {
                    notes: { data: [{ id: note.id, type: 'notes' }] }
                }
            };
            const todo = store.createModel('todos', 1, todoData);
            expect(todo.user_notes[0].id).toEqual(note.id);
            expect(todo.user_notes[0].text).toEqual(note.text);
        });
    });
    describe('createOrUpdateModel', () => {
        let record;
        beforeEach(() => {
            store.add('notes', { id: 3, text: 'hi' });
            record = store.createOrUpdateModel({
                id: 3,
                type: 'notes',
                attributes: {
                    text: 'yo'
                }
            });
        });
        it('sets previous snapshot', () => {
            expect(record.previousSnapshot.attributes.text).toEqual('yo');
        });
        it('sets previous snapshot as persisted', () => {
            expect(record.previousSnapshot.persisted).toBeTruthy();
        });
    });
    describe('createModelsFromData', () => {
        it('creates a list of model objs from a list of data objs', () => {
            const dataObjs = [
                { id: 1, type: 'todos', attributes: { title: 'hello!' }, relationships: {} },
                { id: 2, type: 'todos', attributes: { title: 'see ya!' }, relationships: {} }
            ];
            const todos = store.createModelsFromData(dataObjs);
            expect(todos).toHaveLength(2);
            expect(todos[0].type).toEqual('todos');
            expect(todos[1].type).toEqual('todos');
            expect(todos[0].id).toEqual(dataObjs[0].id);
            expect(todos[1].id).toEqual(dataObjs[1].id);
            expect(todos[0].title).toEqual(dataObjs[0].attributes.title);
            expect(todos[1].title).toEqual(dataObjs[1].attributes.title);
        });
        it('skips objs with an unknown type', () => {
            const dataObjs = [
                { id: 1, type: 'todos', attributes: { title: 'hello!' }, relationships: {} },
                { id: 2, type: 'unknown', attributes: { title: 'see ya!' }, relationships: {} }
            ];
            const todos = store.createModelsFromData(dataObjs);
            expect(todos).toHaveLength(2);
            expect(todos[0].type).toEqual('todos');
            expect(typeof todos[1]).toBe('undefined');
        });
    });
    describe('findAndFetchAll', () => {
        let requestOptions;
        let lazyLoadOptions;
        let mockAfterFetch = jest.fn();
        let mockBeforeFetch = jest.fn();
        let mockTodosResponse2;
        let mockAfterError = jest.fn();
        beforeEach(() => {
            jest.resetAllMocks();
            requestOptions = {
                queryParams: {
                    filter: {
                        title: 'Do taxes'
                    }
                }
            };
            lazyLoadOptions = Object.assign(Object.assign({}, requestOptions), { afterRefetch: mockAfterFetch, beforeRefetch: mockBeforeFetch, afterError: mockAfterError });
            mockTodosResponse2 = JSON.stringify({
                data: [
                    mockTodoData.data,
                    Object.assign(Object.assign({}, mockTodoData.data), { id: 2, title: 'Test' })
                ]
            });
        });
        it('triggers a fetch if no cached data is found', (done) => __awaiter(void 0, void 0, void 0, function* () {
            fetch.mockResponse(mockTodosResponse);
            lazyLoadOptions.afterRefetch = jest.fn((result) => {
                expect(result).toHaveLength(1);
                done();
            });
            yield store.findAll('todos', requestOptions);
            const result = store.findAndFetchAll('todos', lazyLoadOptions);
            expect(result).toHaveLength(0);
            expect(fetch).toHaveBeenCalled();
        }));
        it('calls beforeRefetch callback with prefetch result', () => __awaiter(void 0, void 0, void 0, function* () {
            fetch.mockResponse(mockTodosResponse);
            yield store.findAll('todos', requestOptions);
            const result = store.findAndFetchAll('todos', lazyLoadOptions);
            expect(result).toHaveLength(1);
            expect(mockBeforeFetch).toHaveBeenCalledWith(result);
        }));
        it('calls afterRefetch callback with refetch result', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const mockTodosResponse2 = JSON.stringify({
                data: [
                    mockTodoData.data,
                    Object.assign(Object.assign({}, mockTodoData.data), { id: 2, title: 'Test' })
                ]
            });
            fetch.mockResponses([mockTodosResponse, { status: 200 }], [mockTodosResponse2, { status: 200 }]);
            // Trigger another request
            yield store.findAll('todos', requestOptions);
            lazyLoadOptions.afterRefetch = jest.fn((result) => {
                // The refetch result is different then the cached result, because
                // mockTodosResponse2 has 2 records
                expect(result).toHaveLength(2);
                done();
            });
            store.findAndFetchAll('todos', lazyLoadOptions);
        }));
        it('returns cached data before refetching', (done) => __awaiter(void 0, void 0, void 0, function* () {
            fetch.mockResponses([mockTodosResponse, { status: 200 }], [mockTodosResponse2, { status: 200 }]);
            yield store.findAll('todos', requestOptions);
            lazyLoadOptions.afterRefetch = jest.fn((result) => {
                // The refetch result is different then the cached result, because
                // mockTodosResponse2 has 2 records
                expect(result).toHaveLength(2);
                done();
            });
            const result = store.findAndFetchAll('todos', lazyLoadOptions);
            // mockTodosResponse has only one record
            expect(result).toHaveLength(1);
            // fetch was called twice: once from the findAll and once from findAndFetchAll
            // refetching
            expect(fetch.mock.calls).toHaveLength(2);
        }));
        it('calls afterError if bad request', (done) => {
            fetch.mockResponses([mockTodosResponse, { status: 400 }]);
            lazyLoadOptions.afterError = jest.fn((error) => {
                // NOTE: We should have better errors than this.
                expect(error).toEqual(400);
                done();
            });
            store.findAndFetchAll('todos', lazyLoadOptions);
        });
    });
});
//# sourceMappingURL=Store.spec.js.map