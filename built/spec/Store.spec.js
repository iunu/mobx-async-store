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
Object.defineProperty(exports, "__esModule", { value: true });
/* global fetch */
var mobx_1 = require("mobx");
var main_1 = require("../src/main");
var Tag = /** @class */ (function (_super) {
    __extends(Tag, _super);
    function Tag() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = '';
        return _this;
    }
    Tag.type = 'tags';
    Tag.endpoint = 'tags';
    __decorate([
        main_1.attribute(String)
    ], Tag.prototype, "label", void 0);
    __decorate([
        main_1.relatedToOne
    ], Tag.prototype, "todo", void 0);
    return Tag;
}(main_1.Model));
var Category = /** @class */ (function (_super) {
    __extends(Category, _super);
    function Category() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = '';
        return _this;
    }
    Category.type = 'categories';
    Category.endpoint = 'categories';
    __decorate([
        main_1.attribute(String)
    ], Category.prototype, "name", void 0);
    __decorate([
        main_1.relatedToOne
    ], Category.prototype, "todo", void 0);
    return Category;
}(main_1.Model));
var Note = /** @class */ (function (_super) {
    __extends(Note, _super);
    function Note() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = '';
        return _this;
    }
    Note.type = 'notes';
    Note.endpoint = 'notes';
    __decorate([
        main_1.attribute(String)
    ], Note.prototype, "text", void 0);
    __decorate([
        main_1.relatedToOne
    ], Note.prototype, "todo", void 0);
    return Note;
}(main_1.Model));
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
    return Todo;
}(main_1.Model));
var mockBaseUrl = '/example_api';
var mockFetchOptions = {
    // credentials: 'includes',
    headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accepts': 'application/json'
    }
};
var store = new main_1.Store({
    baseUrl: mockBaseUrl,
    defaultFetchOptions: mockFetchOptions,
    types: [
        Note,
        Todo,
        Tag,
        Category
    ]
});
var mockTodoData = {
    data: {
        id: '1',
        type: 'todos',
        attributes: {
            id: 1,
            title: 'Do taxes'
        }
    }
};
var mockTodoResponse = JSON.stringify(mockTodoData);
var mockTodosResponse = JSON.stringify({
    data: [
        {
            id: '1',
            type: 'todos',
            attributes: {
                id: 1,
                title: 'Do taxes'
            }
        }
    ]
});
describe('Store', function () {
    beforeEach(function () {
        fetch.resetMocks();
        store.reset();
    });
    it('has observable data property', function () {
        expect.assertions(1);
        expect(mobx_1.isObservable(store.data)).toBe(true);
    });
    it('sets network configuration properties', function () {
        expect.assertions(2);
        expect(store.baseUrl).toEqual(mockBaseUrl);
        expect(store.defaultFetchOptions).toEqual(mockFetchOptions);
    });
    it('sets model type index', function () {
        expect.assertions(1);
        expect(store.modelTypeIndex).toEqual({
            todos: Todo,
            notes: Note,
            categories: Category,
            tags: Tag
        });
    });
    it('initializes data observable', function () {
        expect.assertions(1);
        expect(mobx_1.toJS(store.data)).toEqual({
            todos: { cache: {}, records: {} },
            notes: { cache: {}, records: {} },
            categories: { cache: {}, records: {} },
            tags: { cache: {}, records: {} }
        });
    });
    describe('add', function () {
        it('adds basic model to store', function () {
            expect.assertions(1);
            var example = store.add('todos', { title: 'Buy Milk' });
            expect(example.title).toEqual('Buy Milk');
        });
        it('adds multiple records to the store', function () {
            expect.assertions(2);
            var exampleData = [
                { title: 'Buy Milk' },
                { title: 'Do laundry' }
            ];
            var examples = store.add('todos', exampleData);
            expect(examples).toHaveLength(2);
            var foundExamples = store.findAll('todos', exampleData, { fromServer: false });
            expect(foundExamples).toHaveLength(2);
        });
    });
    describe('reset', function () {
        it('removes all records from the store', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
                return [2 /*return*/];
            });
        }); });
        it('removes records of a specific type if type arg is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
                return [2 /*return*/];
            });
        }); });
    });
    describe('findOne', function () {
        it('find model in store', function () { return __awaiter(void 0, void 0, void 0, function () {
            var addedModel, id, foundModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect.assertions(1);
                        addedModel = store.add('todos', { title: 'Buy Milk' });
                        id = addedModel.id;
                        return [4 /*yield*/, store.findOne('todos', id)];
                    case 1:
                        foundModel = _a.sent();
                        expect(foundModel.title).toEqual(addedModel.title);
                        return [2 /*return*/];
                }
            });
        }); });
        it('fetches model if it not present', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect.assertions(1);
                        fetch.mockResponse(mockTodoResponse);
                        return [4 /*yield*/, store.findOne('todos', '1')];
                    case 1:
                        todo = _a.sent();
                        expect(todo.title).toEqual('Do taxes');
                        return [2 /*return*/];
                }
            });
        }); });
        it('supports queryParams', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect.assertions(1);
                        fetch.mockResponse(mockTodoResponse);
                        return [4 /*yield*/, store.findOne('todos', '1', {
                                queryParams: {
                                    filter: {
                                        due_at: '2019-01-01'
                                    },
                                    include: 'todo.notes',
                                    user_id: '1'
                                }
                            })];
                    case 1:
                        _a.sent();
                        expect(decodeURIComponent(fetch.mock.calls[0][0]))
                            .toEqual('/example_api/todos/1?filter[due_at]=2019-01-01&include=todo.notes&user_id=1');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findAll', function () {
        describe('when "fromServer" is set to false', function () {
            describe('if records of the specified type do not exist', function () {
                it('returns an empty array', function () {
                    expect.assertions(1);
                    var todos = store.findAll('todos', {
                        fromServer: false
                    });
                    expect(todos).toHaveLength(0);
                });
            });
            describe('if records of the specified type do exist', function () {
                it('returns existing models in the store', function () {
                    expect.assertions(1);
                    store.add('todos', { title: 'Buy Milk' });
                    var todos = store.findAll('todos', {
                        fromServer: false
                    });
                    expect(todos).toHaveLength(1);
                });
            });
        });
        describe('when "fromServer" is set to true', function () {
            it('fetches data from server', function () { return __awaiter(void 0, void 0, void 0, function () {
                var todos;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect.assertions(4);
                            fetch.mockResponse(mockTodosResponse);
                            return [4 /*yield*/, store.findAll('todos', {
                                    fromServer: true
                                })];
                        case 1:
                            todos = _a.sent();
                            expect(todos).toHaveLength(1);
                            expect(todos[0].title).toEqual('Do taxes');
                            expect(fetch.mock.calls).toHaveLength(1);
                            expect(fetch.mock.calls[0][0])
                                .toEqual('/example_api/todos');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fetches data with filter params', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect.assertions(2);
                            fetch.mockResponse(mockTodosResponse);
                            return [4 /*yield*/, store.findAll('todos', {
                                    fromServer: true,
                                    queryParams: {
                                        filter: {
                                            title: 'Do taxes',
                                            overdue: true
                                        }
                                    }
                                })];
                        case 1:
                            _a.sent();
                            expect(fetch.mock.calls).toHaveLength(1);
                            expect(decodeURIComponent(fetch.mock.calls[0][0]))
                                .toEqual('/example_api/todos?filter[title]=Do taxes&filter[overdue]=true');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fetches data with include params', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect.assertions(2);
                            fetch.mockResponse(mockTodosResponse);
                            return [4 /*yield*/, store.findAll('todos', {
                                    fromServer: true,
                                    queryParams: {
                                        include: 'todo.notes,todo.comments'
                                    }
                                })];
                        case 1:
                            _a.sent();
                            expect(fetch.mock.calls).toHaveLength(1);
                            expect(decodeURIComponent(fetch.mock.calls[0][0]))
                                .toEqual('/example_api/todos?include=todo.notes,todo.comments');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fetches data with named query params', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect.assertions(2);
                            fetch.mockResponse(mockTodosResponse);
                            return [4 /*yield*/, store.findAll('todos', {
                                    fromServer: true,
                                    queryParams: {
                                        foo: 'bar'
                                    }
                                })];
                        case 1:
                            _a.sent();
                            expect(fetch.mock.calls).toHaveLength(1);
                            expect(decodeURIComponent(fetch.mock.calls[0][0]))
                                .toEqual('/example_api/todos?foo=bar');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fetches data with named array filters', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect.assertions(2);
                            fetch.mockResponse(mockTodosResponse);
                            return [4 /*yield*/, store.findAll('todos', {
                                    fromServer: true,
                                    queryParams: {
                                        filter: {
                                            ids: ['1', '2']
                                        }
                                    }
                                })];
                        case 1:
                            _a.sent();
                            expect(fetch.mock.calls).toHaveLength(1);
                            expect(decodeURIComponent(fetch.mock.calls[0][0]))
                                .toEqual('/example_api/todos?filter[ids][]=1&filter[ids][]=2');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('caches list ids by request url', function () { return __awaiter(void 0, void 0, void 0, function () {
                var cache;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect.assertions(1);
                            fetch.mockResponse(mockTodosResponse);
                            return [4 /*yield*/, store.findAll('todos', { fromServer: true })];
                        case 1:
                            _a.sent();
                            cache = mobx_1.toJS(store.data.todos.cache);
                            expect(cache['/example_api/todos']).toEqual(['1']);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when "fromServer" is not explicitly set', function () {
            describe('if records of the specified type do not exist', function () {
                it('fetches data from server', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var todos;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                expect.assertions(4);
                                fetch.mockResponse(mockTodosResponse);
                                return [4 /*yield*/, store.findAll('todos')];
                            case 1:
                                todos = _a.sent();
                                expect(todos).toHaveLength(1);
                                expect(todos[0].title).toEqual('Do taxes');
                                expect(fetch.mock.calls).toHaveLength(1);
                                expect(fetch.mock.calls[0][0])
                                    .toEqual('/example_api/todos');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('if records of the specified type do exist', function () {
                it('skips fetch and returns local data from the store', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var todos;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                expect.assertions(2);
                                store.add('todos', { title: 'Buy Milk' });
                                return [4 /*yield*/, store.findAll('todos')];
                            case 1:
                                todos = _a.sent();
                                expect(todos).toHaveLength(1);
                                expect(fetch).not.toHaveBeenCalled();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('if a query is made with identical params', function () {
                it('skips fetch and returns local data from the store', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var queryParams, todos;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                expect.assertions(4);
                                queryParams = { filter: { overdue: true } };
                                // Only need to mock response once :)
                                fetch.mockResponse(mockTodosResponse);
                                return [4 /*yield*/, store.findAll('todos', { queryParams: queryParams })];
                            case 1:
                                todos = _a.sent();
                                expect(todos).toHaveLength(1);
                                expect(fetch.mock.calls).toHaveLength(1);
                                return [4 /*yield*/, store.findAll('todos', { queryParams: queryParams })
                                    // Not fetch should be kicked off
                                ];
                            case 2:
                                // Find todos a second time
                                todos = _a.sent();
                                // Not fetch should be kicked off
                                expect(todos).toHaveLength(1);
                                expect(fetch.mock.calls).toHaveLength(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        describe('cache behavior', function () {
            var assertionText = "If you fetch a record from the server,\n        update its attributes (client-only), then look it up again via\n        the same query, and fromServer is false or undefined\n      ";
            describe(assertionText, function () {
                it('the record will be returned from cache with updated attributes preserved', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var todos, todo, cachedTodos, cachedTodo;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                expect.assertions(6);
                                fetch.mockResponse(mockTodosResponse);
                                return [4 /*yield*/, store.findAll('todos', {
                                        queryParams: {
                                            title: 'Do taxes'
                                        }
                                    })
                                    // Check the correct number of todos are found
                                ];
                            case 1:
                                todos = _a.sent();
                                // Check the correct number of todos are found
                                expect(todos).toHaveLength(1);
                                todo = todos[0];
                                // Check the record has the correct attribute
                                expect(todo.title).toEqual('Do taxes');
                                // Check that a call a request was made
                                expect(fetch.mock.calls).toHaveLength(1);
                                // Update the model in the store
                                todo.title = 'New title';
                                return [4 /*yield*/, store.findAll('todos', {
                                        queryParams: {
                                            title: 'Do taxes'
                                        }
                                    })
                                    // Once again the correct number of todos are found
                                ];
                            case 2:
                                cachedTodos = _a.sent();
                                // Once again the correct number of todos are found
                                expect(cachedTodos).toHaveLength(1);
                                // Check that a request was NOT made
                                expect(fetch.mock.calls).toHaveLength(1);
                                cachedTodo = cachedTodos[0];
                                expect(cachedTodo.title).toEqual('New title');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
    describe('createModel', function () {
        it('creates a model obj with attributes', function () {
            var todoData = {
                attributes: { title: 'hello!' }
            };
            var todo = store.createModel('todos', 1, todoData);
            expect(todo.id).toEqual(1);
            expect(todo.title).toEqual(todoData.attributes.title);
        });
        it('creates a model obj with relatedToOne property', function () {
            var category = store.add('categories', { id: 5, name: 'Cat5' });
            var todoData = {
                attributes: { title: 'hello!' },
                relationships: {
                    category: { data: { id: '5', type: 'categories' } }
                }
            };
            var todo = store.createModel('todos', 1, todoData);
            expect(todo.category.id).toEqual(category.id);
            expect(todo.category.name).toEqual(category.name);
        });
        it('creates a model with relatedToMany property', function () {
            var tag = store.add('tags', { id: 3, label: 'Tag #3' });
            var todoData = {
                attributes: { title: 'hello!' },
                relationships: {
                    tags: { data: [{ id: '3', type: 'tags' }] }
                }
            };
            var todo = store.createModel('todos', 1, todoData);
            expect(todo.id).toEqual(1);
            expect(todo.tags[0].id).toEqual(tag.id);
            expect(todo.tags[0].label).toEqual(tag.label);
        });
        it('creates a model with aliased relatedToOne property', function () {
            var note = store.add('notes', { id: 17, text: 'Example text' });
            var todoData = {
                attributes: { title: 'hello!' },
                relationships: {
                    note: { data: { id: '17', type: 'notes' } }
                }
            };
            var todo = store.createModel('todos', 1, todoData);
            expect(todo.instructions.id).toEqual(note.id);
            expect(todo.instructions.text).toEqual(note.text);
        });
        it('creates a model with aliased relatedToMany property', function () {
            var note = store.add('notes', { id: 3, text: 'hi' });
            var todoData = {
                attributes: { title: 'hello!' },
                relationships: {
                    notes: { data: [{ id: '3', type: 'notes' }] }
                }
            };
            var todo = store.createModel('todos', 1, todoData);
            expect(todo.user_notes[0].id).toEqual(note.id);
            expect(todo.user_notes[0].text).toEqual(note.text);
        });
    });
    describe('createModelsFromData', function () {
        it('creates a list of model objs from a list of data objs', function () {
            var dataObjs = [
                { id: 1, type: 'todos', attributes: { title: 'hello!' }, relationships: {} },
                { id: 2, type: 'todos', attributes: { title: 'see ya!' }, relationships: {} }
            ];
            var todos = store.createModelsFromData(dataObjs);
            expect(todos).toHaveLength(2);
            expect(todos[0].type).toEqual('todos');
            expect(todos[1].type).toEqual('todos');
            expect(todos[0].id).toEqual(dataObjs[0].id);
            expect(todos[1].id).toEqual(dataObjs[1].id);
            expect(todos[0].title).toEqual(dataObjs[0].attributes.title);
            expect(todos[1].title).toEqual(dataObjs[1].attributes.title);
        });
        it('skips objs with an unknown type', function () {
            var dataObjs = [
                { id: 1, type: 'todos', attributes: { title: 'hello!' }, relationships: {} },
                { id: 2, type: 'unknown', attributes: { title: 'see ya!' }, relationships: {} }
            ];
            var todos = store.createModelsFromData(dataObjs);
            expect(todos).toHaveLength(2);
            expect(todos[0].type).toEqual('todos');
            expect(typeof todos[1]).toBe('undefined');
        });
    });
});
