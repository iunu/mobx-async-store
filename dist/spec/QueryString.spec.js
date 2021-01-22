"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var QueryString_1 = __importDefault(require("../src/QueryString"));
describe('QueryString', function () {
    var queryString = 'fields[articles][]=title&fields[articles][]=body&fields[people]=name';
    var params = { fields: { articles: ['title', 'body'], people: 'name' } };
    describe('stringify', function () {
        it('stringifies a deeply nested param object', function () {
            expect(decodeURI(QueryString_1.default.stringify(params))).toBe(queryString);
        });
    });
    describe('parse', function () {
        it('parses a deeply nested query string', function () {
            expect(QueryString_1.default.parse(queryString)).toEqual(params);
        });
        it('ignores leading ?', function () {
            expect(QueryString_1.default.parse("?" + queryString)).toEqual(params);
        });
    });
});
//# sourceMappingURL=QueryString.spec.js.map