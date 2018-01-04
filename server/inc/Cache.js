"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Cache = require('memjs').Client.create();
exports.default = {
    get: function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, Cache.get(key)];
                    case 1:
                        res = _a.sent();
                        if (res.value === null)
                            return [2, null];
                        return [2, JSON.parse(res.value.toString())];
                }
            });
        });
    },
    set: function (key, val) {
        return Cache.set(key, JSON.stringify(val), {});
    }
};
