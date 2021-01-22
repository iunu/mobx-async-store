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
var exampleRelationalResponses_1 = require("./fixtures/exampleRelationalResponses");
var timestamp = new Date(Date.now());
var Note = /** @class */ (function (_super) {
    __extends(Note, _super);
    function Note() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Note.type = 'notes';
    Note.endpoint = 'notes';
    __decorate([
        main_1.attribute(String)
    ], Note.prototype, "description", void 0);
    __decorate([
        main_1.validates,
        main_1.relatedToOne
    ], Note.prototype, "organization", void 0);
    __decorate([
        main_1.relatedToOne
    ], Note.prototype, "todo", void 0);
    return Note;
}(main_1.Model));
var Relationshipless = /** @class */ (function (_super) {
    __extends(Relationshipless, _super);
    function Relationshipless() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Relationshipless.type = 'relationshipless';
    Relationshipless.endpoint = 'relationshipless';
    __decorate([
        main_1.attribute(String)
    ], Relationshipless.prototype, "name", void 0);
    return Relationshipless;
}(main_1.Model));
function validatesArray(property) {
    return {
        isValid: Array.isArray(property),
        errors: [{
                key: 'must_be_an_array',
                message: 'must be an array'
            }]
    };
}
function validatesArrayPresence(property) {
    return {
        isValid: Array.isArray(property) && property.length > 0,
        errors: [{
                key: 'empty',
                message: 'must have at least one record'
            }]
    };
}
function validatesOptions(property, target) {
    var errors = [];
    if (target.requiredOptions) {
        target.requiredOptions.forEach(function (optionKey) {
            if (!property[optionKey]) {
                errors.push({
                    key: 'blank',
                    message: 'can\t be blank',
                    data: { optionKey: optionKey }
                });
            }
        });
    }
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    User.type = 'users';
    User.endpoint = 'users';
    __decorate([
        main_1.attribute(String)
    ], User.prototype, "name", void 0);
    return User;
}(main_1.Model));
var Organization = /** @class */ (function (_super) {
    __extends(Organization, _super);
    function Organization() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = 'NEW TODO';
        _this.due_at = timestamp;
        _this.options = {};
        return _this;
    }
    Organization.type = 'organizations';
    Organization.endpoint = 'organizations';
    __decorate([
        main_1.validates,
        main_1.attribute(String)
    ], Organization.prototype, "title", void 0);
    __decorate([
        main_1.attribute(Date)
    ], Organization.prototype, "due_at", void 0);
    __decorate([
        main_1.validates(validatesArray),
        main_1.attribute(Array)
    ], Organization.prototype, "tags", void 0);
    __decorate([
        main_1.validates(validatesOptions),
        main_1.attribute(Object)
    ], Organization.prototype, "options", void 0);
    __decorate([
        main_1.relatedToMany(Note)
    ], Organization.prototype, "meeting_notes", void 0);
    __decorate([
        main_1.validates(validatesArrayPresence),
        main_1.relatedToMany
    ], Organization.prototype, "notes", void 0);
    __decorate([
        main_1.relatedToMany
    ], Organization.prototype, "awesome_notes", void 0);
    __decorate([
        main_1.relatedToOne
    ], Organization.prototype, "user", void 0);
    return Organization;
}(main_1.Model));
var Todo = /** @class */ (function (_super) {
    __extends(Todo, _super);
    function Todo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = 'NEW TODO';
        _this.due_at = timestamp;
        _this.options = {};
        return _this;
    }
    Todo.type = 'todos';
    Todo.endpoint = 'todos';
    __decorate([
        main_1.validates,
        main_1.attribute(String)
    ], Todo.prototype, "title", void 0);
    __decorate([
        main_1.attribute(Date)
    ], Todo.prototype, "due_at", void 0);
    __decorate([
        main_1.validates(validatesArray),
        main_1.attribute(Array)
    ], Todo.prototype, "tags", void 0);
    __decorate([
        main_1.validates(validatesOptions),
        main_1.attribute(Object)
    ], Todo.prototype, "options", void 0);
    __decorate([
        main_1.relatedToMany(Note)
    ], Todo.prototype, "meeting_notes", void 0);
    __decorate([
        main_1.validates(validatesArrayPresence),
        main_1.relatedToMany
    ], Todo.prototype, "notes", void 0);
    __decorate([
        main_1.relatedToMany
    ], Todo.prototype, "awesome_notes", void 0);
    __decorate([
        main_1.relatedToOne
    ], Todo.prototype, "user", void 0);
    return Todo;
}(main_1.Model));
var AppStore = /** @class */ (function (_super) {
    __extends(AppStore, _super);
    function AppStore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppStore.types = [
        Organization,
        Note,
        User,
        Todo,
        Relationshipless
    ];
    return AppStore;
}(main_1.Store));
var mockBaseUrl = '/example_api';
var mockFetchOptions = {
    headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accepts': 'application/json'
    }
};
var store = new AppStore({
    baseUrl: mockBaseUrl,
    defaultFetchOptions: mockFetchOptions
});
var mockTodoData = {
    data: {
        id: '1',
        type: 'organizations',
        attributes: {
            title: 'Do taxes',
            // YYYY-MM-DD
            created_at: timestamp.toISOString().split('T')[0]
        }
    }
};
var mockTodoResponse = JSON.stringify(mockTodoData);
var mockNoteDataWithErrors = {
    errors: {
        description: ["can't be blank"]
    }
};
var mockNoteWithErrorResponse = JSON.stringify(mockNoteDataWithErrors);
describe('Model', function () {
    beforeEach(function () {
        fetch.resetMocks();
        store.reset();
    });
    describe('initialization', function () {
        it('attributes default to specified type', function () {
            var todo = new Organization();
            expect(todo.tags).toBeInstanceOf(Array);
            var note = new Note();
            expect(note.description).toEqual('');
        });
        it('attributes can have default values', function () {
            var todo = new Organization();
            expect(todo.title).toEqual('NEW TODO');
            todo.title = 'test';
            expect(todo.title).toEqual('test');
        });
        it('attributes are observable', function (done) {
            var todo = new Organization({ title: 'one' });
            expect(mobx_1.isObservable(todo)).toBe(true);
            var runs = 0;
            var expected = ['one', 'two', 'three'];
            mobx_1.autorun(function () {
                expect(todo.title).toBe(expected[runs]);
                runs++;
                if (runs === 3) {
                    done();
                }
            });
            todo.title = 'two';
            todo.title = 'three';
        });
        it('attributes are overridable in constructor', function () {
            var todo = new Organization({ title: 'Buy Milk' });
            expect(todo.title).toEqual('Buy Milk');
        });
        it('attributes can be set', function () {
            var todo = new Organization();
            todo.title = 'Do laundry';
            expect(todo.title).toEqual('Do laundry');
            todo.tags.push('chore');
            expect(todo.tags).toHaveLength(1);
            expect(todo.tags[0]).toEqual('chore');
        });
        it('attributes are observable', function (done) {
            var todo = new Organization({});
            var runs = 0;
            var expected = [undefined, 'one', 'two'];
            mobx_1.autorun(function () {
                expect(todo.options.test).toEqual(expected[runs]);
                runs++;
                if (runs === 2) {
                    done();
                }
            });
            todo.options.test = 'one';
            todo.options.test = 'two';
        });
        it('attributes are observable', function () {
            var todo = store.add('organizations', { id: 1, title: 'Buy Milk', options: { test: 'one' } });
            expect(todo.options.test).toEqual('one');
        });
        it('relatedToOne relationship can be set', function () {
            var note = store.add('notes', {
                id: 1,
                description: 'Example description'
            });
            var todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
            note.organization = todo;
            expect(note.organization).toEqual(todo);
        });
        it('relatedToOne relationship can be unset', function () {
            var note = store.add('notes', {
                id: 1,
                description: 'Example description'
            });
            var todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
            note.organization = todo;
            expect(note.organization).toEqual(todo);
            note.organization = null;
            expect(note.organization).toBeFalsy();
        });
        it('relatedToOne relationship adds to inverse', function () {
            var note = store.add('notes', {
                id: 1,
                description: 'Example description'
            });
            var todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
            note.organization = todo;
            expect(todo.notes).toContain(note);
        });
        it('relatedToOne relationship removes from inverse', function () {
            var note = store.add('notes', {
                id: 1,
                description: 'Example description'
            });
            var todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
            note.organization = todo;
            expect(todo.notes).toContain(note);
            note.organization = null;
            expect(note.organization).toBeFalsy();
        });
        it('builds relatedToMany relationship with existing models', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        store.add('notes', { id: 1, description: 'Example description' });
                        fetch.mockResponse(exampleRelationalResponses_1.exampleRelatedToManyResponse);
                        return [4 /*yield*/, store.findOne('organizations', 1)];
                    case 1:
                        todo = _a.sent();
                        expect(todo.title).toEqual('Do laundry');
                        expect(todo.notes).toHaveLength(1);
                        expect(todo.notes[0].description).toEqual('Example description');
                        return [2 /*return*/];
                }
            });
        }); });
        it('builds relatedToMany relationship with included data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetch.mockResponse(exampleRelationalResponses_1.exampleRelatedToManyIncludedResponse);
                        return [4 /*yield*/, store.findOne('organizations', 1)];
                    case 1:
                        todo = _a.sent();
                        expect(todo.title).toEqual('Do laundry');
                        expect(todo.notes).toHaveLength(1);
                        expect(todo.notes[0].description).toEqual('Use fabric softener');
                        return [2 /*return*/];
                }
            });
        }); });
        it('builds relatedToMany relationship without included data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var organization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetch.mockResponse(exampleRelationalResponses_1.exampleRelatedToOneUnmatchedTypeResponse);
                        return [4 /*yield*/, store.findOne('organizations', 1)];
                    case 1:
                        organization = _a.sent();
                        expect(organization.name).toEqual('Do laundry');
                        expect(organization.awesome_notes).toHaveLength(0);
                        expect(organization.awesome_notes).toBeInstanceOf(Array);
                        expect(organization.meeting_notes).toHaveLength(0);
                        expect(organization.meeting_notes).toBeInstanceOf(Array);
                        return [2 /*return*/];
                }
            });
        }); });
        it('builds aliased relatedToMany relationship', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetch.mockResponse(exampleRelationalResponses_1.exampleRelatedToManyIncludedResponse);
                        return [4 /*yield*/, store.findOne('organizations', 1)];
                    case 1:
                        todo = _a.sent();
                        expect(todo.title).toEqual('Do laundry');
                        expect(todo.meeting_notes).toHaveLength(1);
                        expect(todo.meeting_notes[0].description).toEqual('Use fabric softener');
                        return [2 /*return*/];
                }
            });
        }); });
        it('ignores unexpected types in relationship data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetch.mockResponse(exampleRelationalResponses_1.exampleRelatedToManyWithNoiseResponse);
                        return [4 /*yield*/, store.findOne('organizations', 1)];
                    case 1:
                        todo = _a.sent();
                        expect(todo.title).toEqual('Do laundry');
                        expect(todo.notes).toHaveLength(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('ignores unexpected types in included data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetch.mockResponse(exampleRelationalResponses_1.exampleRelatedToManyIncludedWithNoiseResponse);
                        return [4 /*yield*/, store.findOne('organizations', 1)];
                    case 1:
                        todo = _a.sent();
                        expect(todo.title).toEqual('Do laundry');
                        expect(todo.notes).toHaveLength(1);
                        expect(todo.notes[0].description).toEqual('Use fabric softener');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('isNew', function () {
        it('is true if id contains "tmp"', function () {
            var todo = new Organization({ title: 'Buy Milk' });
            expect(todo.isNew).toBe(true);
        });
        it('is false if id does not contain "tmp"', function () {
            var todo = new Organization({ id: 7, title: 'Buy Milk' });
            expect(todo.isNew).toBe(false);
        });
        it('is false when added to store with an id', function () {
            var note = store.add('notes', { id: 10, description: 'heyo' });
            expect(note.isNew).toBe(false);
        });
        it('is true when added to store without an id', function () {
            var note = store.add('notes', { description: 'heyo' });
            expect(note.isNew).toBe(true);
        });
        it('is true when added to store with an id which includes "tmp"', function () {
            var note = store.add('notes', { id: 'tmp-0', description: 'heyo' });
            expect(note.isNew).toBe(true);
        });
    });
    it('relatedToMany models can be added', function () {
        var note = store.add('notes', {
            id: 10,
            description: 'Example description'
        });
        var todo = store.add('organizations', { id: 10, title: 'Buy Milk' });
        var notes = todo.notes;
        notes.add(note);
        expect(notes).toContain(note);
        expect(todo.notes).toContain(note);
    });
    it('relatedToMany doesn\'t blow up on empty iteration', function () {
        var todo = store.add('organizations', { id: 10, title: 'Buy Milk' });
        expect(todo.notes).toHaveLength(0);
        expect(todo.notes.map(function (note) { return note; })).toHaveLength(0);
    });
    it('relatedToMany doesn\'t blow up after adding to empty array', function () {
        var todo = store.add('organizations', { id: 10, title: 'Buy Milk' });
        expect(todo.notes).toHaveLength(0);
        expect(todo.notes.map(function (note) { return note; })).toHaveLength(0);
        var note = store.add('notes', {
            id: 10,
            description: 'Example description'
        });
        todo.notes.add(note);
        expect(todo.notes.map(function (note) { return note; })).toHaveLength(1);
    });
    it('relatedToMany models can be removed', function () {
        var note1 = store.add('notes', {
            description: 'Example description'
        });
        var note2 = store.add('notes', {
            description: 'Another note'
        });
        var todo = store.add('organizations', { id: 10, title: 'Buy Milk' });
        var notes = todo.notes;
        notes.add(note1);
        notes.add(note2);
        notes.remove(note1);
        expect(notes).not.toContain(note1);
        expect(notes).toContain(note2);
    });
    it('relatedToMany models remove reference to record', function () {
        var note1 = store.add('notes', {
            description: 'Example description'
        });
        var note2 = store.add('notes', {
            description: 'Another note'
        });
        var todo = store.add('organizations', { title: 'Buy Milk' });
        todo.notes.add(note1);
        todo.notes.add(note2);
        todo.notes.remove(note1);
        expect(todo.notes).not.toContain(note1);
        expect(todo.notes).toContain(note2);
    });
    it('relatedToMany models adds inverse relationships', function () {
        var note = store.add('notes', {
            id: 10,
            description: 'Example description'
        });
        var todo = store.add('organizations', { id: 10, title: 'Buy Milk' });
        todo.notes.add(note);
        expect(todo.notes).toContain(note);
        expect(note.organization).toEqual(todo);
    });
    it('relatedToMany models remove inverse relationships', function () {
        var note = store.add('notes', {
            id: 10,
            description: 'Example description'
        });
        var todo = store.add('organizations', { id: 10, title: 'Buy Milk' });
        todo.notes.add(note);
        expect(note.organization).toEqual(todo);
        todo.notes.remove(note);
        expect(note.organization).toBeFalsy();
    });
    it('relationship arrays provide regular arrays for derived objects', function () {
        var note = store.add('notes', {
            id: 10,
            description: 'Example description'
        });
        var todo = store.add('organizations', { id: 10, title: 'Buy Milk' });
        todo.notes.add(note);
        expect(todo.notes.constructor.name).toEqual('RelatedRecordsArray');
        expect(todo.notes.map(function (x) { return x.id; }).constructor.name).toEqual('Array');
        expect(todo.notes.map(function (x) { return x.id; })).toEqual([10]);
    });
    describe('.snapshot', function () {
        it('a snapshot of the current attributes and relationship', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ title: 'Buy Milk' });
                expect(todo.snapshot.attributes).toEqual({
                    due_at: timestamp,
                    tags: [],
                    title: 'Buy Milk',
                    options: {}
                });
                return [2 /*return*/];
            });
        }); });
        it('doesn\'t exclude falsey values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ title: '' });
                expect(todo.snapshot.attributes).toEqual({
                    due_at: timestamp,
                    tags: [],
                    title: '',
                    options: {}
                });
                return [2 /*return*/];
            });
        }); });
    });
    describe('.previousSnapshot', function () {
        it('return the previous snapshot', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ title: 'Buy Milk' });
                todo.title = 'something different';
                expect(todo.previousSnapshot.attributes).toEqual({
                    due_at: timestamp,
                    tags: [],
                    title: 'Buy Milk',
                    options: {}
                });
                return [2 /*return*/];
            });
        }); });
    });
    describe('.hasUnpersistedChanges', function () {
        it('is true on initialization', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ title: 'Buy Milk' });
                expect(todo.hasUnpersistedChanges).toBe(true);
                return [2 /*return*/];
            });
        }); });
        it('is false on initialization if an id is present', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ id: 10, title: 'Buy Milk' });
                expect(todo.hasUnpersistedChanges).toBe(false);
                return [2 /*return*/];
            });
        }); });
        it('is true on initialization if the id is a tmp id', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ id: 'tmp-123', title: 'Buy Milk' });
                expect(todo.hasUnpersistedChanges).toBe(true);
                return [2 /*return*/];
            });
        }); });
        it('is true after attribute mutation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ title: 'Buy Milk' });
                todo._takeSnapshot({ persisted: true });
                expect(todo.hasUnpersistedChanges).toBe(false);
                todo.title = 'Buy something else';
                expect(todo.hasUnpersistedChanges).toBe(true);
                return [2 /*return*/];
            });
        }); });
        it('is false after nested attribute mutation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ title: 'Buy Milk', options: { color: 'red' } });
                todo._takeSnapshot({ persisted: true });
                expect(todo.hasUnpersistedChanges).toBe(false);
                todo.options.color = 'blue';
                expect(todo.hasUnpersistedChanges).toBe(true);
                return [2 /*return*/];
            });
        }); });
    });
    describe('.dirtyAttributes', function () {
        it('returns a list of paths for attributes that have been mutated since the last snapshot', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ title: 'Buy Milk' });
                expect(todo.dirtyAttributes).toHaveLength(0);
                todo.title = 'Buy Cheese';
                expect(todo.dirtyAttributes).toHaveLength(1);
                expect(todo.dirtyAttributes[0]).toEqual('title');
                return [2 /*return*/];
            });
        }); });
        it('works on nested attributes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ title: 'Buy Milk', options: { variety: '2%' } });
                expect(todo.dirtyAttributes).toHaveLength(0);
                todo.options.variety = 'Skim';
                expect(todo.dirtyAttributes).toHaveLength(1);
                expect(todo.dirtyAttributes[0]).toEqual('options.variety');
                return [2 /*return*/];
            });
        }); });
        it('tracks sibling changes on nested attributes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ title: 'Buy Milk', options: { size: 'Quart', variety: '2%' } });
                expect(todo.dirtyAttributes).toHaveLength(0);
                todo.options.variety = 'Skim';
                expect(todo.dirtyAttributes).toHaveLength(1);
                expect(todo.dirtyAttributes[0]).toEqual('options.variety');
                todo.options.size = 'Gallon';
                expect(todo.dirtyAttributes).toHaveLength(2);
                expect(todo.dirtyAttributes.includes('options.variety')).toBe(true);
                expect(todo.dirtyAttributes.includes('options.size')).toBe(true);
                todo.options.variety = '2%';
                expect(todo.dirtyAttributes).toHaveLength(1);
                expect(todo.dirtyAttributes[0]).toEqual('options.size');
                return [2 /*return*/];
            });
        }); });
        it('tracks removed toMany relationships', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo, note;
            return __generator(this, function (_a) {
                todo = store.add('todos', { id: 11, title: 'Buy Milk' });
                note = store.add('notes', {
                    id: 11,
                    description: 'Example description'
                });
                todo.notes.add(note);
                todo.setPreviousSnapshot();
                expect(todo.dirtyAttributes).toEqual([]);
                todo.notes.remove(note);
                expect(todo.dirtyAttributes).toEqual(['relationships.notes']);
                return [2 /*return*/];
            });
        }); });
        it('tracks removed toOne relationships', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo, note;
            return __generator(this, function (_a) {
                todo = store.add('todos', { id: 11, title: 'Buy Milk' });
                note = store.add('notes', {
                    id: 11,
                    description: 'Example description'
                });
                note.todo = todo;
                note.setPreviousSnapshot();
                expect(note.dirtyAttributes).toEqual([]);
                note.todo = null;
                expect(note.dirtyAttributes).toEqual(['relationships.todo']);
                return [2 /*return*/];
            });
        }); });
        it('tracks added toMany relationship', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo, note;
            return __generator(this, function (_a) {
                todo = store.add('todos', { id: 11, title: 'Buy Milk' });
                note = store.add('notes', {
                    id: 11,
                    description: 'Example description'
                });
                expect(todo.dirtyAttributes).toEqual([]);
                todo.notes.add(note);
                expect(todo.dirtyAttributes).toEqual(['relationships.notes']);
                return [2 /*return*/];
            });
        }); });
        it('tracks added toOne relationship', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo, note;
            return __generator(this, function (_a) {
                todo = store.add('todos', { id: 11, title: 'Buy Milk' });
                note = store.add('notes', {
                    id: 11,
                    description: 'Example description'
                });
                expect(note.dirtyAttributes).toEqual([]);
                note.todo = todo;
                expect(note.dirtyAttributes).toEqual(['relationships.todo']);
                return [2 /*return*/];
            });
        }); });
        it('tracks updated toOne relationship', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo1, todo2, note;
            return __generator(this, function (_a) {
                todo1 = store.add('todos', { id: 11, title: 'Buy Milk' });
                todo2 = store.add('todos', { id: 12, title: 'Buy Milk' });
                note = store.add('notes', {
                    id: 11,
                    description: 'Example description'
                });
                note.todo = todo1;
                note._dirtyRelationships.clear();
                expect(note.dirtyAttributes).toEqual([]);
                note.todo = todo2;
                expect(note.dirtyAttributes).toEqual(['relationships.todo']);
                return [2 /*return*/];
            });
        }); });
        it('does NOT revert to empty after adding and then removing a relationship', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo, note;
            return __generator(this, function (_a) {
                todo = store.add('organizations', { id: 11, title: 'Buy Milk' });
                note = store.add('notes', {
                    id: 11,
                    description: 'Example description'
                });
                expect(todo.dirtyAttributes).toEqual([]);
                todo.notes.add(note);
                expect(todo.dirtyAttributes).toEqual(['relationships.notes']);
                todo.notes.remove(note);
                expect(todo.dirtyAttributes).toEqual(['relationships.notes']);
                return [2 /*return*/];
            });
        }); });
        it('does NOT track changes to the related objects themselves', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo, note;
            return __generator(this, function (_a) {
                todo = store.add('organizations', { id: 11, title: 'Buy Milk' });
                note = store.add('notes', {
                    id: 11,
                    description: 'Example description'
                });
                todo.notes.add(note);
                todo.setPreviousSnapshot();
                note.description = 'something different';
                expect(todo.dirtyAttributes).toEqual([]);
                return [2 /*return*/];
            });
        }); });
    });
    describe('.jsonapi', function () {
        it('returns data in valid jsonapi structure with coerced values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
                expect(todo.jsonapi()).toEqual({
                    id: '1',
                    type: 'organizations',
                    attributes: {
                        due_at: timestamp.toISOString(),
                        tags: [],
                        title: 'Buy Milk',
                        options: {}
                    }
                });
                return [2 /*return*/];
            });
        }); });
        it('relatedToMany models can be added', function () {
            var note = store.add('notes', {
                id: 11,
                description: 'Example description'
            });
            var todo = store.add('organizations', { id: 11, title: 'Buy Milk' });
            todo.notes.add(note);
            expect(todo.jsonapi({ relationships: ['notes'] })).toEqual({
                id: '11',
                type: 'organizations',
                attributes: {
                    due_at: timestamp.toISOString(),
                    tags: [],
                    title: 'Buy Milk',
                    options: {}
                },
                relationships: {
                    notes: {
                        data: [{ id: '11', type: 'notes' }]
                    }
                }
            });
        });
    });
    describe('.isDirty', function () {
        it('is initially false', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ title: 'Buy Milk' });
                expect(todo.isDirty).toBe(false);
                return [2 /*return*/];
            });
        }); });
        it('is set to true if record changes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ title: 'Buy Milk' });
                todo.title = 'Do the laundry';
                expect(todo.isDirty).toBe(true);
                return [2 /*return*/];
            });
        }); });
        it('is set back to false if changed back to original value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ title: 'Buy Milk' });
                todo.title = 'Do the laundry';
                expect(todo.isDirty).toBe(true);
                todo.title = 'Buy Milk';
                expect(todo.isDirty).toBe(false);
                return [2 /*return*/];
            });
        }); });
        it('is set to true if a relationship is added', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo, note;
            return __generator(this, function (_a) {
                todo = store.add('organizations', { id: 11, title: 'Buy Milk' });
                note = store.add('notes', {
                    id: 11,
                    description: 'Example description'
                });
                expect(todo.isDirty).toBe(false);
                todo.notes.add(note);
                expect(todo.isDirty).toBe(true);
                return [2 /*return*/];
            });
        }); });
    });
    describe('.validate', function () {
        it('validates correct data formats', function () {
            var note = store.add('notes', {
                id: 10,
                description: 'Example description'
            });
            var todo = store.add('organizations', { title: 'Good title' });
            todo.notes.add(note);
            expect(todo.validate()).toBeTruthy();
            expect(Object.keys(todo.errors)).toHaveLength(0);
        });
        it('uses default validation to check for presence of attribute', function () {
            var todo = store.add('organizations', { title: '' });
            expect(todo.validate()).toBeFalsy();
            expect(todo.errors.title[0].key).toEqual('blank');
            expect(todo.errors.title[0].message).toEqual('can\'t be blank');
        });
        it('uses default validation to check for presence of relationship', function () {
            var note = store.add('notes', { description: 'Example description' });
            expect(note.validate()).toBeFalsy();
            expect(note.errors.organization[0].key).toEqual('blank');
            expect(note.errors.organization[0].message).toEqual('can\'t be blank');
        });
        it('validates for a non-empty many relationship', function () {
            var todo = store.add('organizations', {});
            expect(todo.validate()).toBeFalsy();
            expect(todo.errors.notes[0].key).toEqual('empty');
            expect(todo.errors.notes[0].message).toEqual('must have at least one record');
        });
        it('uses custom validation', function () {
            var todo = store.add('organizations', { tags: 'not an array' });
            expect(todo.validate()).toBeFalsy();
            expect(todo.errors.tags[0].key).toEqual('must_be_an_array');
            expect(todo.errors.tags[0].message).toEqual('must be an array');
        });
        it('uses introspective custom validation', function () {
            var todo = store.add('organizations', { options: { foo: 'bar', baz: null } });
            todo.requiredOptions = ['foo', 'baz'];
            expect(todo.validate()).toBeFalsy();
            expect(todo.errors.options[0].key).toEqual('blank');
            expect(todo.errors.options[0].data.optionKey).toEqual('baz');
        });
        it('allows for undefined relationshipDefinitions', function () {
            var todo = store.add('relationshipless', { name: 'lonely model' });
            expect(todo.validate()).toBeTruthy();
        });
    });
    describe('.rollback', function () {
        it('rollback restores data to last snapshot state ', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ title: 'Buy Milk' });
                expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk');
                todo.title = 'Do Laundry';
                expect(todo.title).toEqual('Do Laundry');
                todo.rollback();
                expect(todo.title).toEqual('Buy Milk');
                expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk');
                return [2 /*return*/];
            });
        }); });
        it('rollbacks to state after save', function () { return __awaiter(void 0, void 0, void 0, function () {
            var note, savedTitle, todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        note = store.add('notes', {
                            id: 10,
                            description: 'Example description'
                        });
                        savedTitle = mockTodoData.data.attributes.title;
                        todo = store.add('organizations', { title: savedTitle });
                        todo.notes.add(note);
                        // Mock the API response
                        fetch.mockResponse(mockTodoResponse);
                        // Trigger the save function and subsequent request
                        return [4 /*yield*/, todo.save()];
                    case 1:
                        // Trigger the save function and subsequent request
                        _a.sent();
                        expect(todo.title).toEqual(savedTitle);
                        todo.title = 'Unsaved title';
                        expect(todo.title).toEqual('Unsaved title');
                        todo.rollback();
                        expect(todo.title).toEqual(savedTitle);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('.rollbackToPersisted', function () {
        it('rollback restores data to last persisted state ', function () {
            var todo = new Organization({ title: 'Buy Milk', id: 10 });
            expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk');
            todo.title = 'Do Laundry';
            expect(todo.title).toEqual('Do Laundry');
            todo._takeSnapshot();
            todo.title = 'Do something else';
            expect(todo.title).toEqual('Do something else');
            todo.rollbackToPersisted();
            expect(todo.title).toEqual('Buy Milk');
        });
        it('will restore the original (unpersisted) state if model was never persisted', function () {
            var todo = new Organization({ title: 'Buy Milk' });
            expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk');
            todo.title = 'Do Laundry';
            todo._takeSnapshot();
            todo.title = 'Do something else';
            todo.rollbackToPersisted();
            expect(todo.title).toEqual('Buy Milk');
        });
        it('it removes unpersisted snapshots from the stack', function () {
            var todo = new Organization({ title: 'Buy Milk', id: 10 });
            expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk');
            expect(todo._snapshots.length).toEqual(1);
            todo.title = 'Do Laundry';
            todo._takeSnapshot();
            expect(todo._snapshots.length).toEqual(2);
            todo.rollbackToPersisted();
            expect(todo._snapshots.length).toEqual(1);
        });
    });
    describe('.clone', function () {
        var original;
        var clone;
        beforeEach(function () {
            var note = store.add('notes', {
                id: 11,
                description: 'Example description'
            });
            original = store.add('organizations', {
                id: 11,
                title: 'Buy Milk',
                options: { color: 'green' }
            });
            original.notes.add(note);
            clone = original.clone();
        });
        it('deeply copies the model instance ', function () {
            expect(clone.id).toEqual(original.id);
            expect(clone.title).toEqual(original.title);
            expect(clone.options.color).toEqual(original.options.color);
        });
        it('does not mutate the original object when mutating the clone', function () {
            clone.title = 'Buy Cheese';
            expect(clone.title).not.toEqual(original.title);
            clone.options.color = 'blue';
            expect(clone.options.color).not.toEqual(original.options.color);
        });
        it('cloned objects still refer to original relationships', function () {
            expect(original.notes[0].id).toEqual(clone.notes[0].id);
        });
        it('relationship targets are not cloned, they are referenced', function () {
            original.notes[0].description = 'Update!';
            expect(original.notes[0].description).toEqual(clone.notes[0].description);
        });
        it('relationships themselves are cloned, not referenced', function () {
            original.notes.replace([]);
            expect(original.notes.length).toEqual(0);
            expect(clone.notes.length).toEqual(1);
        });
    });
    describe('.isEqual', function () {
        var original;
        beforeEach(function () {
            var note = store.add('notes', {
                id: 11,
                description: 'Example description'
            });
            original = store.add('organizations', {
                id: 11,
                title: 'Buy Milk',
                options: { color: 'green' }
            });
            original.notes.add(note);
        });
        it('is true for a clone and the original', function () {
            var clone = original.clone();
            expect(original.isEqual(clone)).toBe(true);
        });
        it('is false after attr differences', function () {
            var clone = original.clone();
            original.title = 'Buy Cheese';
            expect(original.isEqual(clone)).toBe(false);
        });
        it('is false after deep attr changes', function () {
            var clone = original.clone();
            original.options.color = 'blue';
            expect(original.isEqual(clone)).toBe(false);
        });
        it('is false after a change in relationships', function () {
            var clone = original.clone();
            clone.notes.replace([]);
            expect(original.isEqual(clone)).toBe(false);
        });
    });
    describe('.isSame', function () {
        var original;
        beforeEach(function () {
            var note = store.add('notes', {
                id: 11,
                description: 'Example description'
            });
            original = store.add('organizations', {
                id: 11,
                title: 'Buy Milk',
                options: { color: 'green' }
            });
            original.notes.add(note);
        });
        it('is false when the other obj is null', function () {
            expect(original.isSame(null)).toBe(false);
        });
        it('is false for two different objects', function () {
            expect(original.isSame(original.notes[0])).toBe(false);
        });
        it('is false for objects with the same type but different ids', function () {
            var clone = original.clone();
            clone.id = 777;
            expect(original.isSame(clone)).toBe(false);
        });
        it('is true for a clone', function () {
            var clone = original.clone();
            expect(original.isSame(clone)).toBe(true);
        });
        it('ignores differences in attrs', function () {
            var clone = original.clone();
            expect(original.isSame(clone)).toBe(true);
        });
        it('ignores differences in relationships', function () {
            var clone = original.clone();
            clone.notes.replace([]);
            expect(original.isSame(clone)).toBe(true);
        });
    });
    describe('.save', function () {
        xit('handles in flight behavior', function (done) {
            // expect.assertions(3)
            // Mock slow server response
            fetch.mockResponseOnce(function () {
                return new Promise(function (resolve) {
                    return setTimeout(function () { return resolve({
                        body: mockTodoResponse
                    }); }, 1000);
                });
            });
            var todo = store.add('organizations', { title: 'Buy Milk' });
            expect(todo.isInFlight).toBe(false);
            todo.save();
            // Assert isInFlight is true
            expect(todo.isInFlight).toBe(true);
            // Assert title hasn't changed yet
            expect(todo.title).toEqual('Buy Milk');
            setTimeout(function () {
                expect(todo.isInFlight).toBe(false);
                expect(todo.title).toEqual('Do taxes');
                done();
            }, 1001);
        });
        it('makes request and updates model in store', function () { return __awaiter(void 0, void 0, void 0, function () {
            var note, todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        note = store.add('notes', {
                            id: 10,
                            description: 'Example description'
                        });
                        todo = store.add('organizations', { title: 'Buy Milk' });
                        todo.notes.add(note);
                        // Check the model doesn't have attributes
                        // only provided by an API request
                        expect(todo).not.toHaveProperty('created_at');
                        // Check that the model has a tmp id
                        expect(todo.id).toMatch('tmp');
                        // Check the the tmp id has the correct length
                        expect(todo.id).toHaveLength(40);
                        // Mock the API response
                        fetch.mockResponse(mockTodoResponse);
                        // Trigger the save function and subsequent request
                        return [4 /*yield*/, todo.save()
                            // Assert the request was made with the correct
                            // url and fetch options
                        ];
                    case 1:
                        // Trigger the save function and subsequent request
                        _a.sent();
                        // Assert the request was made with the correct
                        // url and fetch options
                        expect(fetch.mock.calls).toHaveLength(1);
                        expect(fetch.mock.calls[0][0]).toEqual('/example_api/organizations');
                        expect(fetch.mock.calls[0][1].method).toEqual('POST');
                        expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
                            data: {
                                type: 'organizations',
                                attributes: {
                                    due_at: timestamp.toISOString(),
                                    tags: [],
                                    title: 'Buy Milk',
                                    options: {}
                                }
                            }
                        });
                        // Check that the id is now what was provider
                        // from the server
                        expect(todo.id).toEqual('1');
                        // Check that the `created_at` attribute is populated
                        // YYYY-MM-DD
                        expect(todo.created_at)
                            .toEqual(timestamp.toISOString().split('T')[0]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('sets hasUnpersistedChanges = false when save succeeds', function () { return __awaiter(void 0, void 0, void 0, function () {
            var note, todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        note = store.add('notes', {
                            id: 10,
                            description: 'Example description'
                        });
                        todo = store.add('organizations', { title: 'Buy Milk' });
                        todo.notes.add(note);
                        fetch.mockResponse(mockTodoResponse);
                        expect(todo.hasUnpersistedChanges).toBe(true);
                        return [4 /*yield*/, todo.save()];
                    case 1:
                        _a.sent();
                        expect(todo.hasUnpersistedChanges).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not set hasUnpersistedChanges after save fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            var note, errors_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        note = store.add('notes', {
                            description: ''
                        });
                        expect(note.hasUnpersistedChanges).toBe(true);
                        // Mock the API response
                        fetch.mockResponse(mockNoteWithErrorResponse, { status: 422 });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, note.save()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        errors_1 = _a.sent();
                        expect(note.hasUnpersistedChanges).toBe(true);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it('allows undefined relationships', function () { return __awaiter(void 0, void 0, void 0, function () {
            var note, todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        note = store.add('notes', {
                            id: 10,
                            description: ''
                        });
                        todo = store.add('organizations', { title: 'Good title' });
                        todo.notes.add(note);
                        fetch.mockResponse(mockTodoResponse);
                        expect(todo.hasUnpersistedChanges).toBe(true);
                        return [4 /*yield*/, todo.save({ relationships: ['user'] })];
                    case 1:
                        _a.sent();
                        expect(todo.hasUnpersistedChanges).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('.destroy', function () {
        it('makes request and removes model from the store store', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetch.mockResponses([JSON.stringify({}), { status: 204 }]);
                        todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
                        expect(store.findAll('organizations', { fromServer: false }))
                            .toHaveLength(1);
                        return [4 /*yield*/, todo.destroy()];
                    case 1:
                        _a.sent();
                        expect(fetch.mock.calls).toHaveLength(1);
                        expect(fetch.mock.calls[0][0]).toEqual('/example_api/organizations/1');
                        expect(fetch.mock.calls[0][1].method).toEqual('DELETE');
                        expect(store.findAll('organizations', { fromServer: false }))
                            .toHaveLength(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('calls dispose', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetch.mockResponses([JSON.stringify({}), { status: 204 }]);
                        todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
                        todo.dispose = jest.fn();
                        return [4 /*yield*/, todo.destroy()];
                    case 1:
                        _a.sent();
                        expect(todo.dispose.mock.calls).toHaveLength(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('.dispose', function () {
        it('sets _disposed = true', function () {
            var todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
            expect(todo._disposed).toBe(false);
            todo.dispose();
            expect(todo._disposed).toBe(true);
        });
        it('no longer tracks dirty changes', function () {
            var todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
            expect(todo.isDirty).toBe(false);
            todo.dispose();
            todo.title = 'I Changed';
            // dirty status is unchanged because the object has been disposed
            expect(todo.isDirty).toBe(false);
        });
    });
});
//# sourceMappingURL=Model.spec.js.map