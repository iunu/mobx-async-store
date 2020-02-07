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
var mobx_1 = require("mobx");
var moment_1 = __importDefault(require("moment"));
var main_1 = require("../src/main");
var exampleRelationalResponses_1 = require("./fixtures/exampleRelationalResponses");
// YYYY-MM-DD
var timestamp = moment_1.default();
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
        main_1.relatedToOne
    ], Note.prototype, "organization", void 0);
    return Note;
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
        main_1.relatedToMany
    ], Organization.prototype, "notes", void 0);
    return Organization;
}(main_1.Model));
var AppStore = /** @class */ (function (_super) {
    __extends(AppStore, _super);
    function AppStore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppStore.types = [
        Organization,
        Note
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
            id: 1,
            title: 'Do taxes',
            created_at: timestamp.format('YYYY-MM-DD')
        }
    }
};
var mockTodoResponse = JSON.stringify(mockTodoData);
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
                        store.add('notes', {
                            id: 1,
                            description: 'Example description'
                        });
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
        it('sets snapshot on initialization', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo;
            return __generator(this, function (_a) {
                todo = new Organization({ title: 'Buy Milk' });
                expect(todo.previousSnapshot.attributes).toEqual({
                    due_at: moment_1.default(timestamp).toDate(),
                    tags: [],
                    title: 'Buy Milk',
                    options: {}
                });
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
        it('tracks removed to relationships', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todo, note;
            return __generator(this, function (_a) {
                todo = store.add('organizations', { id: 11, title: 'Buy Milk' });
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
        it('tracks added relationship', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                    data: {
                        id: '1',
                        type: 'organizations',
                        attributes: {
                            due_at: moment_1.default(timestamp).toISOString(),
                            tags: [],
                            title: 'Buy Milk',
                            options: {}
                        }
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
                data: {
                    id: '11',
                    type: 'organizations',
                    attributes: {
                        due_at: moment_1.default(timestamp).toISOString(),
                        tags: [],
                        title: 'Buy Milk',
                        options: {}
                    },
                    relationships: {
                        notes: {
                            data: [{ id: '11', type: 'notes' }]
                        }
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
            var todo = new Organization();
            expect(todo.validate()).toBeTruthy();
            expect(Object.keys(todo.errors)).toHaveLength(0);
        });
        it('uses default validation to check for presence', function () {
            var todo = new Organization({ title: '' });
            expect(todo.validate()).toBeFalsy();
            expect(todo.errors.title[0].key).toEqual('blank');
            expect(todo.errors.title[0].message).toEqual('can\'t be blank');
        });
        it('uses custom validation', function () {
            var todo = new Organization({ tags: 'not an array' });
            expect(todo.validate()).toBeFalsy();
            expect(todo.errors.tags[0].key).toEqual('must_be_an_array');
            expect(todo.errors.tags[0].message).toEqual('must be an array');
        });
        it('uses introspective custom validation', function () {
            var todo = new Organization({ options: { foo: 'bar', baz: null } });
            todo.requiredOptions = ['foo', 'baz'];
            expect(todo.validate()).toBeFalsy();
            expect(todo.errors.options[0].key).toEqual('blank');
            expect(todo.errors.options[0].data.optionKey).toEqual('baz');
        });
    });
    describe('.rollback', function () {
        it('rollback restores data to last persisted state ', function () { return __awaiter(void 0, void 0, void 0, function () {
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
            var savedTitle, todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        savedTitle = mockTodoData.data.attributes.title;
                        todo = store.add('organizations', { title: savedTitle });
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
            var todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todo = store.add('organizations', { title: 'Buy Milk' });
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
                                    due_at: moment_1.default(timestamp).toDate().toISOString(),
                                    tags: [],
                                    title: 'Buy Milk',
                                    options: {}
                                }
                            }
                        });
                        // Check that the id is now what was provider
                        // from the server
                        expect(todo.id).toEqual(1);
                        // Check that the `created_at` attribute is populated
                        expect(todo.created_at)
                            .toEqual(timestamp.format('YYYY-MM-DD'));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('.delete', function () {
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
    });
});
