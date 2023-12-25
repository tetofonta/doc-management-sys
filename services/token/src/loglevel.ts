import { LogLevel } from '@nestjs/common';

const LOG_LEVELS: { [k: string]: number } = {
    DEBUG: 0,
    VERBOSE: 1,
    INFO: 2,
    WARNING: 3,
    ERROR: 4,
    NONE: 5,
};

export function getLogLevels(log_level: string): LogLevel[] {
    const template: LogLevel[] = ['debug', 'verbose', 'log', 'warn', 'error'] as LogLevel[];
    if (typeof LOG_LEVELS[log_level] == 'undefined') return getLogLevels('INFO');

    const lev = LOG_LEVELS[log_level];
    return template.splice(lev, 5 - lev);
}
