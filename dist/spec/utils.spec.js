"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var QueryString_1 = __importDefault(require("../src/QueryString"));
var utils_1 = require("../src/utils");
describe('deriveIdQueryStrings', function () {
    var shortIds = [1, 2, 3];
    var longIds = Array.from({ length: 1000 }, function (_, index) { return 1000 + index; });
    var baseUrl = 'https://example.com/todos';
    it('splits ids into an expected length', function () {
        var idQueryStrings = utils_1.deriveIdQueryStrings(longIds, baseUrl);
        expect(idQueryStrings).toHaveLength(8);
        idQueryStrings.forEach(function (ids) {
            expect(baseUrl.length + QueryString_1.default.stringify({ filter: { ids: ids } }).length).toBeLessThan(utils_1.URL_MAX_LENGTH);
        });
    });
    it("doesn't split short arrays", function () {
        var idQueryStrings = utils_1.deriveIdQueryStrings(shortIds, baseUrl);
        expect(idQueryStrings).toHaveLength(1);
        expect(idQueryStrings[0].length + baseUrl.length).toBeLessThan(utils_1.URL_MAX_LENGTH);
    });
});
//# sourceMappingURL=utils.spec.js.map