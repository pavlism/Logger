//Logging object, this is used to log informaiton at different levels to the console window on the client side and the
//console window n the server side.

Logger = class Logger {
    constructor(fileName, logLevel) {
        this.fileName = fileName;
        this.logLevel = logLevel;
        //this.trace(fileName + ' load');
    }
    writeToFile(fileName, message, logLevel) {
        return false;
        Meteor.call('WriteToFile', fileName, message, logLevel, function (error) {
            if (typeof error !== 'undefined') {
                console.log('%c Error: [Logger]: cannot write to log file', 'color:red');
            }
        });
    };

    trace(message) {
        if (this.logLevel <= Logger.level.trace || this.logLevel === Logger.level.traceOnly) {
            console.log('%c Trace: [' + this.fileName + "] " + message, 'color:grey');
            this.writeToFile(this.fileName, message, 'trace');
        }
    }
    debug(message) {
        if (this.logLevel <= Logger.level.debug || this.logLevel === Logger.level.debugOnly) {
            console.log('%c Debug: [' + this.fileName + "] " + message, 'color:blue');
            this.writeToFile(this.fileName, message, 'debug');
        }
    };
    info(message) {
        if (this.logLevel <= Logger.level.info || this.logLevel === Logger.level.infoOnly) {
            console.log('%c Info: [' + this.fileName + "] " + message, 'color:black');
            this.writeToFile(this.fileName, message, 'info');
        }
    };
    warn(message) {
        if (this.logLevel <= Logger.level.warn || this.logLevel === Logger.level.warnOnly) {
            console.log('%c Warn: [' + this.fileName + "] " + message, 'color:#EEC900');
            this.writeToFile(this.fileName, message, 'warn');
        }
    };
    error(message) {
        if (this.logLevel <= Logger.level.error) {
            console.log('%c Error: [' + this.fileName + "] " + message, 'color:red');
            this.writeToFile(this.fileName, message, 'error');
        }
    };
}


Logger.level = {
    trace:0,
    debug : 1,
    info : 2,
    warn : 3,
    error : 4,
    traceOnly : 5,
    debugOnly : 6,
    infoOnly : 7,
    warnOnly : 8,
    off : 9,
};

module.exports = Logger;