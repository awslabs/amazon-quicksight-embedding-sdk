export interface LogProvider {
    log: typeof console.log;
    warn: typeof console.warn;
    error: typeof console.error;
    debug: typeof console.debug;
    info: typeof console.info;
}

/**
 * Temporary abstraction for customer provided logger
 *
 */
export class DefaultLogger implements LogProvider {
    log = console.log;

    warn = console.warn;

    error = console.error;

    debug = console.debug;

    info = console.info;
}
