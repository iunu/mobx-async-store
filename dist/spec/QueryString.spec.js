"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QueryString_1 = __importDefault(require("../src/QueryString"));
describe('QueryString', () => {
    const queryString = 'fields[articles][]=title&fields[articles][]=body&fields[people]=name';
    const params = { fields: { articles: ['title', 'body'], people: 'name' } };
    describe('stringify', () => {
        it('stringifies a deeply nested param object', () => {
            expect(decodeURI(QueryString_1.default.stringify(params))).toBe(queryString);
        });
    });
    describe('parse', () => {
        it('parses a deeply nested query string', () => {
            expect(QueryString_1.default.parse(queryString)).toEqual(params);
        });
        it('ignores leading ?', () => {
            expect(QueryString_1.default.parse(`?${queryString}`)).toEqual(params);
        });
    });
});
//# sourceMappingURL=QueryString.spec.js.map