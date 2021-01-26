"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ObjectPromiseProxy(promise, target) {
    const result = target.store.updateRecords(promise, target);
    // Define proxied attributes
    const attributeNames = Object.keys(target.attributeNames);
    const tempProperties = attributeNames.reduce((attrs, key) => {
        attrs[key] = {
            value: target[key],
            writable: false
        };
        return attrs;
    }, {});
    Object.defineProperties(result, Object.assign({ isInFlight: { value: target.isInFlight } }, tempProperties));
    // Return promise
    return result;
}
exports.default = ObjectPromiseProxy;
//# sourceMappingURL=ObjectPromiseProxy.js.map