"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogLevels = void 0;
const LOG_LEVELS = {
    DEBUG: 0,
    VERBOSE: 1,
    INFO: 2,
    WARNING: 3,
    ERROR: 4,
    NONE: 5,
};
function getLogLevels(log_level) {
    const template = ['debug', 'verbose', 'log', 'warn', 'error'];
    if (typeof LOG_LEVELS[log_level] == 'undefined')
        return getLogLevels('INFO');
    const lev = LOG_LEVELS[log_level];
    return template.splice(lev, 5 - lev);
}
exports.getLogLevels = getLogLevels;
//# sourceMappingURL=loglevel.js.map