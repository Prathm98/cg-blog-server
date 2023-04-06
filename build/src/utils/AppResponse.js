"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppResponse = exports.AppStatus = void 0;
exports.AppStatus = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
    UNKNOWN: "UNKNOWN",
    UNAUTHORIZED: "UNAUTHORIZED"
};
const AppResponse = (data, statusCode = 200, error = null) => JSON.stringify({
    statusCode, data, error
});
exports.AppResponse = AppResponse;
