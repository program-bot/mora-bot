"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("util");
var base64 = require("base-64");
exports.base64 = base64;
function error(msg) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    console.error('\x1b[31m' + util.format.apply(util, [msg].concat(args)) + '\x1b[0m');
}
exports.error = error;
