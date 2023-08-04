/* eslint-disable @typescript-eslint/no-empty-function */
export type Levels = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

export interface LogObject {
    [key: string]: unknown
}

export interface ErrorObject extends LogObject {
    err?: Error
}

export interface Logger {
    trace(msg: string | LogObject): void
    trace(obj: LogObject, msg: string): void
    debug(msg: string | LogObject): void
    debug(obj: LogObject, msg: string): void
    info(msg: string | LogObject): void
    info(obj: LogObject, msg: string): void
    warn(msg: string): void
    warn(obj: LogObject, msg: string): void
    error(msg: string): void
    error(obj: ErrorObject, msg: string): void
    fatal(msg: string): void
    fatal(obj: ErrorObject, msg: string): void

    child(childObj: LogObject): Logger
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function noopLogger() {
    return {
        trace: () => {},
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
        fatal: () => {},
        child: () => noopLogger(),
    }
}

const levelNumber: { [level in Levels]: number } = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5,
}
export function consoleLogger(
    level: Levels = 'warn',
    context?: LogObject,
): Logger {
    // tslint:disable:no-console
    // tslint:disable:no-unused-expression
    return {
        trace: (...rest: unknown[]) => {
            levelNumber[level] <= 0 &&
                (context
                    ? console.log('TRACE', context, ...rest)
                    : console.log('TRACE', ...rest))
        },
        debug: (...rest: unknown[]) => {
            levelNumber[level] <= 1 &&
                (context
                    ? console.log('DEBUG', context, ...rest)
                    : console.log('DEBUG', ...rest))
        },
        info: (...rest: unknown[]) => {
            levelNumber[level] <= 2 &&
                (context
                    ? console.log(' INFO', context, ...rest)
                    : console.log(' INFO', ...rest))
        },
        warn: (...rest: unknown[]) => {
            levelNumber[level] <= 3 &&
                (context
                    ? console.log(' WARN', context, ...rest)
                    : console.log(' WARN', ...rest))
        },
        error: (...rest: unknown[]) => {
            levelNumber[level] <= 4 &&
                (context
                    ? console.log('ERROR', context, ...rest)
                    : console.log('ERROR', ...rest))
        },
        fatal: (...rest: unknown[]) => {
            levelNumber[level] <= 5 &&
                (context
                    ? console.log('FATAL', context, ...rest)
                    : console.log('FATAL', ...rest))
        },
        child: (childObj: LogObject) =>
            consoleLogger(
                level,
                context ? { ...context, ...childObj } : { ...childObj },
            ),
    }
}
