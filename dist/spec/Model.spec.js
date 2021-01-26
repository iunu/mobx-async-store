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
/* global fetch */
const mobx_1 = require("mobx");
const main_1 = require("../src/main");
const exampleRelationalResponses_1 = require("./fixtures/exampleRelationalResponses");
const timestamp = new Date(Date.now());
class Note extends main_1.Model {
}
Note.type = 'notes';
Note.endpoint = 'notes';
__decorate([
    main_1.attribute()
], Note.prototype, "description", void 0);
__decorate([
    main_1.validates,
    main_1.relatedToOne
], Note.prototype, "organization", void 0);
__decorate([
    main_1.relatedToOne
], Note.prototype, "todo", void 0);
class Relationshipless extends main_1.Model {
}
Relationshipless.type = 'relationshipless';
Relationshipless.endpoint = 'relationshipless';
__decorate([
    main_1.attribute()
], Relationshipless.prototype, "name", void 0);
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
    const errors = [];
    if (target.requiredOptions) {
        target.requiredOptions.forEach((optionKey) => {
            if (!property[optionKey]) {
                errors.push({
                    key: 'blank',
                    message: 'can\t be blank',
                    data: { optionKey }
                });
            }
        });
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
class User extends main_1.Model {
}
User.type = 'users';
User.endpoint = 'users';
__decorate([
    main_1.attribute(String)
], User.prototype, "name", void 0);
class Organization extends main_1.Model {
    constructor() {
        super(...arguments);
        this.title = 'NEW TODO';
        this.due_at = timestamp;
        this.options = {};
    }
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
    main_1.attribute()
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
    main_1.relatedToOne(User)
], Organization.prototype, "user", void 0);
class Todo extends main_1.Model {
    constructor() {
        super(...arguments);
        this.title = 'NEW TODO';
        this.due_at = timestamp;
        this.tags = [];
        this.options = {};
        this.meeting_notes = [];
        this.notes = [];
        this.awesome_notes = [];
    }
}
Todo.type = 'todos';
Todo.endpoint = 'todos';
__decorate([
    main_1.validates,
    main_1.attribute()
], Todo.prototype, "title", void 0);
__decorate([
    main_1.attribute()
], Todo.prototype, "due_at", void 0);
__decorate([
    main_1.validates(validatesArray),
    main_1.attribute()
], Todo.prototype, "tags", void 0);
__decorate([
    main_1.validates(validatesOptions),
    main_1.attribute()
], Todo.prototype, "options", void 0);
__decorate([
    main_1.relatedToMany(Note)
], Todo.prototype, "meeting_notes", void 0);
__decorate([
    main_1.validates(validatesArrayPresence),
    main_1.relatedToMany(Note)
], Todo.prototype, "notes", void 0);
__decorate([
    main_1.relatedToMany(Todo)
], Todo.prototype, "awesome_notes", void 0);
__decorate([
    main_1.relatedToOne
], Todo.prototype, "user", void 0);
class AppStore extends main_1.Store {
}
AppStore.types = [
    Organization,
    Note,
    User,
    Todo,
    Relationshipless
];
const mockBaseUrl = '/example_api';
const mockFetchOptions = {
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
        type: 'organizations',
        attributes: {
            title: 'Do taxes',
            // YYYY-MM-DD
            created_at: timestamp.toISOString().split('T')[0]
        }
    }
};
const mockTodoResponse = JSON.stringify(mockTodoData);
const mockNoteDataWithErrors = {
    errors: {
        description: ["can't be blank"]
    }
};
const mockNoteWithErrorResponse = JSON.stringify(mockNoteDataWithErrors);
describe('Model', () => {
    beforeEach(() => {
        // @ts-ignore
        fetch.resetMocks();
        store.reset();
    });
    describe('initialization', () => {
        it('attributes default to specified type', () => {
            const todo = new Organization();
            // expect(todo.tags).toBeInstanceOf(Array)
            const note = new Note();
            expect(note.description).toEqual(null);
        });
        it('attributes can have default values', () => {
            const todo = new Organization();
            expect(todo.title).toEqual('NEW TODO');
            todo.title = 'test';
            expect(todo.title).toEqual('test');
        });
        it('attributes are observable 3', (done) => {
            const todo = new Organization({ title: 'one' });
            expect(mobx_1.isObservable(todo)).toBe(true);
            let runs = 0;
            const expected = ['one', 'two', 'three'];
            mobx_1.autorun(() => {
                expect(todo.title).toBe(expected[runs]);
                runs++;
                if (runs === 3) {
                    done();
                }
            });
            todo.title = 'two';
            todo.title = 'three';
        });
        it('attributes are overridable in constructor', () => {
            const todo = new Organization({ title: 'Buy Milk' });
            expect(todo.title).toEqual('Buy Milk');
        });
        it('attributes can be set', () => {
            const todo = new Organization();
            todo.title = 'Do laundry';
            expect(todo.title).toEqual('Do laundry');
            todo.tags.push('chore');
            expect(todo.tags).toHaveLength(1);
            expect(todo.tags[0]).toEqual('chore');
        });
        it('attributes are observable 1', (done) => {
            const todo = new Organization({});
            let runs = 0;
            const expected = [undefined, 'one', 'two'];
            mobx_1.autorun(() => {
                expect(todo.options.test).toEqual(expected[runs]);
                runs++;
                if (runs === 2) {
                    done();
                }
            });
            todo.options.test = 'one';
            todo.options.test = 'two';
        });
        it('attributes are observable 2', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = yield store.add('organizations', { id: 1, title: 'Buy Milk', options: { test: 'one' } });
            expect(todo.options.test).toEqual('one');
        }));
        it('relatedToOne relationship can be set', () => {
            const note = store.add('notes', {
                id: 1,
                description: 'Example description'
            });
            const todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
            note.organization = todo;
            expect(note.organization).toEqual(todo);
        });
        it('relatedToOne relationship can be unset', () => {
            const note = store.add('notes', {
                id: 1,
                description: 'Example description'
            });
            const todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
            note.organization = todo;
            expect(note.organization).toEqual(todo);
            note.organization = null;
            expect(note.organization).toBeFalsy();
        });
        it('relatedToOne relationship adds to inverse', () => {
            const note = store.add('notes', {
                id: 1,
                description: 'Example description'
            });
            let todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
            note.organization = todo;
            expect(todo.notes).toContain(note);
        });
        it('relatedToOne relationship removes from inverse', () => {
            const note = store.add('notes', {
                id: 1,
                description: 'Example description'
            });
            const todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
            note.organization = todo;
            expect(todo.notes).toContain(note);
            note.organization = null;
            expect(note.organization).toBeFalsy();
        });
        it('builds relatedToMany relationship with existing models', () => __awaiter(void 0, void 0, void 0, function* () {
            store.add('notes', { id: 1, description: 'Example description' });
            // @ts-ignore
            fetch.mockResponse(exampleRelationalResponses_1.exampleRelatedToManyResponse);
            const todo = yield store.findOne('organizations', 1);
            expect(todo.title).toEqual('Do laundry');
            expect(todo.notes).toHaveLength(1);
            expect(todo.notes[0].description).toEqual('Example description');
        }));
        it('builds relatedToMany relationship with included data', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            fetch.mockResponse(exampleRelationalResponses_1.exampleRelatedToManyIncludedResponse);
            const todo = yield store.findOne('organizations', 1);
            expect(todo.title).toEqual('Do laundry');
            expect(todo.notes).toHaveLength(1);
            expect(todo.notes[0].description).toEqual('Use fabric softener');
        }));
        it('builds relatedToMany relationship without included data', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            fetch.mockResponse(exampleRelationalResponses_1.exampleRelatedToOneUnmatchedTypeResponse);
            const organization = yield store.findOne('organizations', 1);
            expect(organization.name).toEqual('Do laundry');
            expect(organization.awesome_notes).toHaveLength(0);
            expect(organization.awesome_notes).toBeInstanceOf(Array);
            expect(organization.meeting_notes).toHaveLength(0);
            expect(organization.meeting_notes).toBeInstanceOf(Array);
        }));
        it('builds aliased relatedToMany relationship', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            fetch.mockResponse(exampleRelationalResponses_1.exampleRelatedToManyIncludedResponse);
            const todo = yield store.findOne('organizations', 1);
            expect(todo.title).toEqual('Do laundry');
            expect(todo.meeting_notes).toHaveLength(1);
            expect(todo.meeting_notes[0].description).toEqual('Use fabric softener');
        }));
        it('ignores unexpected types in relationship data', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            fetch.mockResponse(exampleRelationalResponses_1.exampleRelatedToManyWithNoiseResponse);
            const todo = yield store.findOne('organizations', 1);
            expect(todo.title).toEqual('Do laundry');
            expect(todo.notes).toHaveLength(1);
        }));
        it('ignores unexpected types in included data', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            fetch.mockResponse(exampleRelationalResponses_1.exampleRelatedToManyIncludedWithNoiseResponse);
            const todo = yield store.findOne('organizations', 1);
            expect(todo.title).toEqual('Do laundry');
            expect(todo.notes).toHaveLength(1);
            expect(todo.notes[0].description).toEqual('Use fabric softener');
        }));
    });
    describe('isNew', () => {
        it('is true if id contains "tmp"', () => {
            const todo = new Organization({ title: 'Buy Milk' });
            expect(todo.isNew).toBe(true);
        });
        it('is false if id does not contain "tmp"', () => {
            const todo = new Organization({ id: 7, title: 'Buy Milk' });
            expect(todo.isNew).toBe(false);
        });
        it('is false when added to store with an id', () => {
            const note = store.add('notes', { id: 10, description: 'heyo' });
            expect(note.isNew).toBe(false);
        });
        it('is true when added to store without an id', () => {
            const note = store.add('notes', { description: 'heyo' });
            expect(note.isNew).toBe(true);
        });
        it('is true when added to store with an id which includes "tmp"', () => {
            const note = store.add('notes', { id: 'tmp-0', description: 'heyo' });
            expect(note.isNew).toBe(true);
        });
    });
    it('relatedToMany models can be added', () => {
        const note = store.add('notes', {
            id: 10,
            description: 'Example description'
        });
        const todo = store.add('organizations', { id: 10, title: 'Buy Milk' });
        const { notes } = todo;
        notes.add(note);
        expect(notes).toContain(note);
        expect(todo.notes).toContain(note);
    });
    it('relatedToMany doesn\'t blow up on empty iteration', () => {
        const todo = store.add('organizations', { id: 10, title: 'Buy Milk' });
        expect(todo.notes).toHaveLength(0);
        expect(todo.notes.map((note) => note)).toHaveLength(0);
    });
    it('relatedToMany doesn\'t blow up after adding to empty array', () => {
        const todo = store.add('organizations', { id: 10, title: 'Buy Milk' });
        expect(todo.notes).toHaveLength(0);
        expect(todo.notes.map((note) => note)).toHaveLength(0);
        const note = store.add('notes', {
            id: 10,
            description: 'Example description'
        });
        todo.notes.add(note);
        expect(todo.notes.map((note) => note)).toHaveLength(1);
    });
    it('relatedToMany models can be removed', () => {
        const note1 = store.add('notes', {
            description: 'Example description'
        });
        const note2 = store.add('notes', {
            description: 'Another note'
        });
        const todo = store.add('organizations', { id: 10, title: 'Buy Milk' });
        const notes = todo.notes;
        notes.add(note1);
        notes.add(note2);
        notes.remove(note1);
        expect(notes).not.toContain(note1);
        expect(notes).toContain(note2);
    });
    it('relatedToMany models remove reference to record', () => {
        const note1 = store.add('notes', {
            description: 'Example description'
        });
        const note2 = store.add('notes', {
            description: 'Another note'
        });
        const todo = store.add('organizations', { title: 'Buy Milk' });
        todo.notes.add(note1);
        todo.notes.add(note2);
        todo.notes.remove(note1);
        expect(todo.notes).not.toContain(note1);
        expect(todo.notes).toContain(note2);
    });
    it('relatedToMany models adds inverse relationships', () => {
        const note = store.add('notes', {
            id: 10,
            description: 'Example description'
        });
        const todo = store.add('organizations', { id: 10, title: 'Buy Milk' });
        todo.notes.add(note);
        expect(todo.notes).toContain(note);
        expect(note.organization).toEqual(todo);
    });
    it('relatedToMany models remove inverse relationships', () => {
        const note = store.add('notes', {
            id: 10,
            description: 'Example description'
        });
        const todo = store.add('organizations', { id: 10, title: 'Buy Milk' });
        todo.notes.add(note);
        expect(note.organization).toEqual(todo);
        todo.notes.remove(note);
        expect(note.organization).toBeFalsy();
    });
    it('relationship arrays provide regular arrays for derived objects', () => {
        const note = store.add('notes', {
            id: 10,
            description: 'Example description'
        });
        const todo = store.add('organizations', { id: 10, title: 'Buy Milk' });
        todo.notes.add(note);
        // expect(todo.notes.constructor.name).toEqual('RelatedRecordsArray')
        expect(todo.notes.map((x) => x.id).constructor.name).toEqual('Array');
        expect(todo.notes.map((x) => x.id)).toEqual([10]);
    });
    describe('.snapshot', () => {
        it('a snapshot of the current attributes and relationship', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ title: 'Buy Milk' });
            expect(todo.snapshot.attributes).toEqual({
                due_at: timestamp,
                tags: [],
                title: 'Buy Milk',
                options: {}
            });
        }));
        it('doesn\'t exclude falsey values', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ title: '' });
            expect(todo.snapshot.attributes).toEqual({
                due_at: timestamp,
                tags: [],
                title: '',
                options: {}
            });
        }));
    });
    describe('.previousSnapshot', () => {
        it('return the previous snapshot', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ title: 'Buy Milk' });
            todo.title = 'something different';
            expect(todo.previousSnapshot.attributes).toEqual({
                due_at: timestamp,
                tags: [],
                title: 'Buy Milk',
                options: {}
            });
        }));
    });
    describe('.hasUnpersistedChanges', () => {
        it('is true on initialization', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ title: 'Buy Milk' });
            expect(todo.hasUnpersistedChanges).toBe(true);
        }));
        it('is false on initialization if an id is present', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ id: 10, title: 'Buy Milk' });
            expect(todo.hasUnpersistedChanges).toBe(false);
        }));
        it('is true on initialization if the id is a tmp id', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ id: 'tmp-123', title: 'Buy Milk' });
            expect(todo.hasUnpersistedChanges).toBe(true);
        }));
        it('is true after attribute mutation', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ title: 'Buy Milk' });
            todo._takeSnapshot({ persisted: true });
            expect(todo.hasUnpersistedChanges).toBe(false);
            todo.title = 'Buy something else';
            expect(todo.hasUnpersistedChanges).toBe(true);
        }));
        it('is false after nested attribute mutation', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ title: 'Buy Milk', options: { color: 'red' } });
            todo._takeSnapshot({ persisted: true });
            expect(todo.hasUnpersistedChanges).toBe(false);
            todo.options.color = 'blue';
            expect(todo.hasUnpersistedChanges).toBe(true);
        }));
    });
    describe('.dirtyAttributes', () => {
        it('returns a list of paths for attributes that have been mutated since the last snapshot', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ title: 'Buy Milk' });
            expect(todo.dirtyAttributes).toHaveLength(0);
            todo.title = 'Buy Cheese';
            expect(todo.dirtyAttributes).toHaveLength(1);
            expect(todo.dirtyAttributes[0]).toEqual('title');
        }));
        it('works on nested attributes', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ title: 'Buy Milk', options: { variety: '2%' } });
            expect(todo.dirtyAttributes).toHaveLength(0);
            todo.options.variety = 'Skim';
            expect(todo.dirtyAttributes).toHaveLength(1);
            expect(todo.dirtyAttributes[0]).toEqual('options.variety');
        }));
        it('tracks sibling changes on nested attributes', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ title: 'Buy Milk', options: { size: 'Quart', variety: '2%' } });
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
        }));
        it('tracks removed toMany relationships', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = store.add('todos', { id: 11, title: 'Buy Milk' });
            const note = store.add('notes', {
                id: 11,
                description: 'Example description'
            });
            todo.notes.add(note);
            todo.setPreviousSnapshot();
            expect(todo.dirtyAttributes).toEqual([]);
            todo.notes.remove(note);
            expect(todo.dirtyAttributes).toEqual(['relationships.notes']);
        }));
        it('tracks removed toOne relationships', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = store.add('todos', { id: 11, title: 'Buy Milk' });
            const note = store.add('notes', {
                id: 11,
                description: 'Example description'
            });
            note.todo = todo;
            note.setPreviousSnapshot();
            expect(note.dirtyAttributes).toEqual([]);
            note.todo = null;
            expect(note.dirtyAttributes).toEqual(['relationships.todo']);
        }));
        it('tracks added toMany relationship', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = store.add('todos', { id: 11, title: 'Buy Milk' });
            const note = store.add('notes', {
                id: 11,
                description: 'Example description'
            });
            expect(todo.dirtyAttributes).toEqual([]);
            todo.notes.add(note);
            expect(todo.dirtyAttributes).toEqual(['relationships.notes']);
        }));
        it('tracks added toOne relationship', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = store.add('todos', { id: 11, title: 'Buy Milk' });
            const note = store.add('notes', {
                id: 11,
                description: 'Example description'
            });
            expect(note.dirtyAttributes).toEqual([]);
            note.todo = todo;
            expect(note.dirtyAttributes).toEqual(['relationships.todo']);
        }));
        it('tracks updated toOne relationship', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo1 = store.add('todos', { id: 11, title: 'Buy Milk' });
            const todo2 = store.add('todos', { id: 12, title: 'Buy Milk' });
            const note = store.add('notes', {
                id: 11,
                description: 'Example description'
            });
            note.todo = todo1;
            note._dirtyRelationships.clear();
            expect(note.dirtyAttributes).toEqual([]);
            note.todo = todo2;
            expect(note.dirtyAttributes).toEqual(['relationships.todo']);
        }));
        it('does NOT revert to empty after adding and then removing a relationship', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = store.add('organizations', { id: 11, title: 'Buy Milk' });
            const note = store.add('notes', {
                id: 11,
                description: 'Example description'
            });
            expect(todo.dirtyAttributes).toEqual([]);
            todo.notes.add(note);
            expect(todo.dirtyAttributes).toEqual(['relationships.notes']);
            todo.notes.remove(note);
            expect(todo.dirtyAttributes).toEqual(['relationships.notes']);
        }));
        it('does NOT track changes to the related objects themselves', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = store.add('organizations', { id: 11, title: 'Buy Milk' });
            const note = store.add('notes', {
                id: 11,
                description: 'Example description'
            });
            todo.notes.add(note);
            todo.setPreviousSnapshot();
            note.description = 'something different';
            expect(todo.dirtyAttributes).toEqual([]);
        }));
    });
    describe('.jsonapi', () => {
        it('returns data in valid jsonapi structure with coerced values', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
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
        }));
        it('relatedToMany models can be added', () => {
            const note = store.add('notes', {
                id: 11,
                description: 'Example description'
            });
            const todo = store.add('organizations', { id: 11, title: 'Buy Milk' });
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
    describe('.isDirty', () => {
        it('is initially false', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ title: 'Buy Milk' });
            expect(todo.isDirty).toBe(false);
        }));
        it('is set to true if record changes', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ title: 'Buy Milk' });
            todo.title = 'Do the laundry';
            expect(todo.isDirty).toBe(true);
        }));
        it('is set back to false if changed back to original value', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ title: 'Buy Milk' });
            todo.title = 'Do the laundry';
            expect(todo.isDirty).toBe(true);
            todo.title = 'Buy Milk';
            expect(todo.isDirty).toBe(false);
        }));
        it('is set to true if a relationship is added', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = store.add('organizations', { id: 11, title: 'Buy Milk' });
            const note = store.add('notes', {
                id: 11,
                description: 'Example description'
            });
            expect(todo.isDirty).toBe(false);
            todo.notes.add(note);
            expect(todo.isDirty).toBe(true);
        }));
    });
    describe('.validate', () => {
        it('validates correct data formats', () => {
            const note = store.add('notes', {
                id: 10,
                description: 'Example description'
            });
            const todo = store.add('organizations', { title: 'Good title' });
            todo.notes.add(note);
            expect(todo.validate()).toBeTruthy();
            expect(Object.keys(todo.errors)).toHaveLength(0);
        });
        it('uses default validation to check for presence of attribute', () => {
            const todo = store.add('organizations', { title: '' });
            expect(todo.validate()).toBeFalsy();
            expect(todo.errors.title[0].key).toEqual('blank');
            expect(todo.errors.title[0].message).toEqual('can\'t be blank');
        });
        it('uses default validation to check for presence of relationship', () => {
            const note = store.add('notes', { description: 'Example description' });
            expect(note.validate()).toBeFalsy();
            expect(note.errors.organization[0].key).toEqual('blank');
            expect(note.errors.organization[0].message).toEqual('can\'t be blank');
        });
        it('validates for a non-empty many relationship', () => {
            const todo = store.add('organizations', {});
            expect(todo.validate()).toBeFalsy();
            expect(todo.errors.notes[0].key).toEqual('empty');
            expect(todo.errors.notes[0].message).toEqual('must have at least one record');
        });
        it('uses custom validation', () => {
            const todo = store.add('organizations', { tags: 'not an array' });
            expect(todo.validate()).toBeFalsy();
            expect(todo.errors.tags[0].key).toEqual('must_be_an_array');
            expect(todo.errors.tags[0].message).toEqual('must be an array');
        });
        it('uses introspective custom validation', () => {
            const todo = store.add('organizations', { options: { foo: 'bar', baz: null } });
            todo.requiredOptions = ['foo', 'baz'];
            expect(todo.validate()).toBeFalsy();
            expect(todo.errors.options[0].key).toEqual('blank');
            expect(todo.errors.options[0].data.optionKey).toEqual('baz');
        });
        it('allows for undefined relationshipDefinitions', () => {
            const todo = store.add('relationshipless', { name: 'lonely model' });
            expect(todo.validate()).toBeTruthy();
        });
    });
    describe('.rollback', () => {
        it('rollback restores data to last snapshot state ', () => __awaiter(void 0, void 0, void 0, function* () {
            const todo = new Organization({ title: 'Buy Milk' });
            expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk');
            todo.title = 'Do Laundry';
            expect(todo.title).toEqual('Do Laundry');
            todo.rollback();
            expect(todo.title).toEqual('Buy Milk');
            expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk');
        }));
        it('rollbacks to state after save', () => __awaiter(void 0, void 0, void 0, function* () {
            // Add record to store
            const note = store.add('notes', {
                id: 10,
                description: 'Example description'
            });
            const savedTitle = mockTodoData.data.attributes.title;
            const todo = store.add('organizations', { title: savedTitle });
            todo.notes.add(note);
            // Mock the API response
            // @ts-ignore
            fetch.mockResponse(mockTodoResponse);
            // Trigger the save function and subsequent request
            yield todo.save();
            expect(todo.title).toEqual(savedTitle);
            todo.title = 'Unsaved title';
            expect(todo.title).toEqual('Unsaved title');
            todo.rollback();
            expect(todo.title).toEqual(savedTitle);
        }));
    });
    describe('.rollbackToPersisted', () => {
        it('rollback restores data to last persisted state ', () => {
            const todo = new Organization({ title: 'Buy Milk', id: 10 });
            expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk');
            todo.title = 'Do Laundry';
            expect(todo.title).toEqual('Do Laundry');
            todo._takeSnapshot();
            todo.title = 'Do something else';
            expect(todo.title).toEqual('Do something else');
            todo.rollbackToPersisted();
            expect(todo.title).toEqual('Buy Milk');
        });
        it('will restore the original (unpersisted) state if model was never persisted', () => {
            const todo = new Organization({ title: 'Buy Milk' });
            expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk');
            todo.title = 'Do Laundry';
            todo._takeSnapshot();
            todo.title = 'Do something else';
            todo.rollbackToPersisted();
            expect(todo.title).toEqual('Buy Milk');
        });
        it('it removes unpersisted snapshots from the stack', () => {
            const todo = new Organization({ title: 'Buy Milk', id: 10 });
            expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk');
            expect(todo._snapshots.length).toEqual(1);
            todo.title = 'Do Laundry';
            todo._takeSnapshot();
            expect(todo._snapshots.length).toEqual(2);
            todo.rollbackToPersisted();
            expect(todo._snapshots.length).toEqual(1);
        });
    });
    describe('.clone', () => {
        let original;
        let clone;
        beforeEach(() => {
            const note = store.add('notes', {
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
        it('deeply copies the model instance ', () => {
            expect(clone.id).toEqual(original.id);
            expect(clone.title).toEqual(original.title);
            expect(clone.options.color).toEqual(original.options.color);
        });
        it('does not mutate the original object when mutating the clone', () => {
            clone.title = 'Buy Cheese';
            expect(clone.title).not.toEqual(original.title);
            clone.options.color = 'blue';
            expect(clone.options.color).not.toEqual(original.options.color);
        });
        it('cloned objects still refer to original relationships', () => {
            expect(original.notes[0].id).toEqual(clone.notes[0].id);
        });
        it('relationship targets are not cloned, they are referenced', () => {
            original.notes[0].description = 'Update!';
            expect(original.notes[0].description).toEqual(clone.notes[0].description);
        });
        it('relationships themselves are cloned, not referenced', () => {
            original.notes.replace([]);
            expect(original.notes.length).toEqual(0);
            expect(clone.notes.length).toEqual(1);
        });
    });
    describe('.isEqual', () => {
        let original;
        beforeEach(() => {
            const note = store.add('notes', {
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
        it('is true for a clone and the original', () => {
            const clone = original.clone();
            expect(original.isEqual(clone)).toBe(true);
        });
        it('is false after attr differences', () => {
            const clone = original.clone();
            original.title = 'Buy Cheese';
            expect(original.isEqual(clone)).toBe(false);
        });
        it('is false after deep attr changes', () => {
            const clone = original.clone();
            original.options.color = 'blue';
            expect(original.isEqual(clone)).toBe(false);
        });
        it('is false after a change in relationships', () => {
            const clone = original.clone();
            clone.notes.replace([]);
            expect(original.isEqual(clone)).toBe(false);
        });
    });
    describe('.isSame', () => {
        let original;
        beforeEach(() => {
            const note = store.add('notes', {
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
        it('is false when the other obj is null', () => {
            expect(original.isSame(null)).toBe(false);
        });
        it('is false for two different objects', () => {
            expect(original.isSame(original.notes[0])).toBe(false);
        });
        it('is false for objects with the same type but different ids', () => {
            const clone = original.clone();
            clone.id = 777;
            expect(original.isSame(clone)).toBe(false);
        });
        it('is true for a clone', () => {
            const clone = original.clone();
            expect(original.isSame(clone)).toBe(true);
        });
        it('ignores differences in attrs', () => {
            const clone = original.clone();
            expect(original.isSame(clone)).toBe(true);
        });
        it('ignores differences in relationships', () => {
            const clone = original.clone();
            clone.notes.replace([]);
            expect(original.isSame(clone)).toBe(true);
        });
    });
    describe('.save', () => {
        xit('handles in flight behavior', (done) => {
            // expect.assertions(3)
            // Mock slow server response
            // @ts-ignore
            fetch.mockResponseOnce(() => {
                return new Promise(resolve => {
                    return setTimeout(() => resolve({
                        body: mockTodoResponse
                    }), 1000);
                });
            });
            const todo = store.add('organizations', { title: 'Buy Milk' });
            expect(todo.isInFlight).toBe(false);
            todo.save();
            // Assert isInFlight is true
            expect(todo.isInFlight).toBe(true);
            // Assert title hasn't changed yet
            expect(todo.title).toEqual('Buy Milk');
            setTimeout(() => {
                expect(todo.isInFlight).toBe(false);
                expect(todo.title).toEqual('Do taxes');
                done();
            }, 1001);
        });
        it('makes request and updates model in store', () => __awaiter(void 0, void 0, void 0, function* () {
            const note = store.add('notes', {
                id: 10,
                description: 'Example description'
            });
            // expect.assertions(9)
            // Add record to store
            const todo = store.add('organizations', { title: 'Buy Milk' });
            todo.notes.add(note);
            // Check the model doesn't have attributes
            // only provided by an API request
            expect(todo).not.toHaveProperty('created_at');
            // Check that the model has a tmp id
            expect(todo.id).toMatch('tmp');
            // Check the the tmp id has the correct length
            expect(todo.id).toHaveLength(40);
            // Mock the API response
            // @ts-ignore
            fetch.mockResponse(mockTodoResponse);
            // Trigger the save function and subsequent request
            yield todo.save();
            // Assert the request was made with the correct
            // url and fetchMock options
            // @ts-ignore
            expect(fetch.mock.calls).toHaveLength(1);
            // @ts-ignore
            expect(fetch.mock.calls[0][0]).toEqual('/example_api/organizations');
            // @ts-ignore
            expect(fetch.mock.calls[0][1].method).toEqual('POST');
            // @ts-ignore
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
        }));
        it('sets hasUnpersistedChanges = false when save succeeds', () => __awaiter(void 0, void 0, void 0, function* () {
            const note = store.add('notes', {
                id: 10,
                description: 'Example description'
            });
            const todo = store.add('organizations', { title: 'Buy Milk' });
            todo.notes.add(note);
            // @ts-ignore
            fetch.mockResponse(mockTodoResponse);
            expect(todo.hasUnpersistedChanges).toBe(true);
            yield todo.save();
            expect(todo.hasUnpersistedChanges).toBe(false);
        }));
        it('does not set hasUnpersistedChanges after save fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const note = store.add('notes', {
                description: ''
            });
            expect(note.hasUnpersistedChanges).toBe(true);
            // Mock the API response
            // @ts-ignore
            fetch.mockResponse(mockNoteWithErrorResponse, { status: 422 });
            // Trigger the save function and subsequent request
            try {
                yield note.save();
            }
            catch (errors) {
                expect(note.hasUnpersistedChanges).toBe(true);
            }
        }));
        it('allows undefined relationships', () => __awaiter(void 0, void 0, void 0, function* () {
            const note = store.add('notes', {
                id: 10,
                description: ''
            });
            const todo = store.add('organizations', { title: 'Good title' });
            todo.notes.add(note);
            // @ts-ignore
            fetch.mockResponse(mockTodoResponse);
            expect(todo.hasUnpersistedChanges).toBe(true);
            yield todo.save({ relationships: ['user'] });
            expect(todo.hasUnpersistedChanges).toBe(false);
        }));
    });
    describe('.destroy', () => {
        it('makes request and removes model from the store store', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            fetch.mockResponses([JSON.stringify({}), { status: 204 }]);
            const todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
            expect(store.findAll('organizations', { fromServer: false }))
                .toHaveLength(1);
            yield todo.destroy();
            // @ts-ignore
            expect(fetch.mock.calls).toHaveLength(1);
            // @ts-ignore
            expect(fetch.mock.calls[0][0]).toEqual('/example_api/organizations/1');
            // @ts-ignore
            expect(fetch.mock.calls[0][1].method).toEqual('DELETE');
            expect(store.findAll('organizations', { fromServer: false }))
                .toHaveLength(0);
        }));
        it('calls dispose', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            fetch.mockResponses([JSON.stringify({}), { status: 204 }]);
            const todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
            todo.dispose = jest.fn();
            yield todo.destroy();
            expect(todo.dispose.mock.calls).toHaveLength(1);
        }));
    });
    describe('.dispose', () => {
        it('sets _disposed = true', () => {
            const todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
            expect(todo._disposed).toBe(false);
            todo.dispose();
            expect(todo._disposed).toBe(true);
        });
        it('no longer tracks dirty changes', () => {
            const todo = store.add('organizations', { id: 1, title: 'Buy Milk' });
            expect(todo.isDirty).toBe(false);
            todo.dispose();
            todo.title = 'I Changed';
            // dirty status is unchanged because the object has been disposed
            expect(todo.isDirty).toBe(false);
        });
    });
});
//# sourceMappingURL=Model.spec.js.map