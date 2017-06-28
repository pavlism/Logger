//V1.0

//Logging object, this is used to log informaiton at different levels to the console window on the client side and the
//console window n the server side.

var Const = new (function () {
    this.LogLevel = new (function () {
        this.trace = 0;
        this.debug = 1;
        this.info = 2;
        this.warn = 3;
        this.error = 4;
        this.traceOnly = 5;
        this.debugOnly = 6;
        this.infoOnly = 7;
        this.warnOnly = 8;
        this.off = 9;
    })();
})();

CLL = Const.LogLevel;

//Logger used on the client side
Logger = function (fileName, level) {
    var logLevel = level;

    this.writeToFile = function (fileName, message, logLevel) {
        Meteor.call('WriteToFile', fileName, message, logLevel, function (error) {
            if (typeof error !== 'undefined') {
                console.log('%c Error: [Logger]: cannot write to log file', 'color:red');
            }
        });
    };

    this.trace = function (message) {
        if (logLevel <= CLL.trace || logLevel === CLL.traceOnly) {
            console.log('%c Trace: [' + fileName + "] " + message, 'color:grey');
            this.writeToFile(fileName, message, 'trace');
        }
    };
    this.debug = function (message) {
        if (logLevel <= CLL.debug || logLevel === CLL.debugOnly) {
            console.log('%c Debug: [' + fileName + "] " + message, 'color:blue');
            this.writeToFile(fileName, message, 'debug');
        }
    };
    this.info = function (message) {
        if (logLevel <= CLL.info || logLevel === CLL.infoOnly) {
            console.log('%c Info: [' + fileName + "] " + message, 'color:black');
            this.writeToFile(fileName, message, 'info');
        }
    };
    this.warn = function (message) {
        if (logLevel <= CLL.warn || logLevel === CLL.warnOnly) {
            console.log('%c Warn: [' + fileName + "] " + message, 'color:#EEC900');
            this.writeToFile(fileName, message, 'warn');
        }
    };
    this.error = function (message) {
        if (logLevel <= CLL.error) {
            console.log('%c Error: [' + fileName + "] " + message, 'color:red');
            this.writeToFile(fileName, message, 'error');
        }
    };
    this.trace(fileName + ' load');
};

//Logger used on the server side
LoggerServer = function (fileName, level) {
    var logLevel = level;
    this.writeToFile = function (fileName, message, logLevel) {
        Meteor.call('WriteToFile', fileName, message, logLevel, function (error) {
            if (typeof error !== 'undefined') {
                console.error('\x1b[31m%s\x1b[0m', 'Error: [Logger]: cannot write to log file');
            }
        });
    };

    this.trace = function (message) {
        if (logLevel <= CLL.trace || logLevel === CLL.traceOnly) {
            console.log('Trace: [' + fileName + "] " + message);
            this.writeToFile(fileName, message, 'trace');
        }
    };
    this.debug = function (message) {
        if (logLevel <= CLL.debug || logLevel === CLL.debugOnly) {
            console.log('\x1b[36m%s\x1b[0m', 'Debug: [' + fileName + "] " + message);
            this.writeToFile(fileName, message, 'debug');
        }
    };
    this.info = function (message) {
        if (logLevel <= CLL.info || logLevel === CLL.infoOnly) {
            console.info('\x1b[33m%s\x1b[0m', 'Info: [' + fileName + "] " + message);
            this.writeToFile(fileName, message, 'info');
        }
    };
    this.warn = function (message) {
        if (logLevel <= CLL.warn || logLevel === CLL.warnOnly) {
            console.log('\x1b[32m%s\x1b[0m', 'Warn: [' + fileName + "] " + message);
            this.writeToFile(fileName, message, 'warn');
        }
    };
    this.error = function (message) {
        if (logLevel <= CLL.error) {
            console.error('\x1b[31m%s\x1b[0m', 'Error: [' + fileName + "] " + message);
            this.writeToFile(fileName, message, 'error');
        }
    };
    this.trace(fileName + ' load');
};

if (Meteor.isServer) {
    var fs = Npm.require('fs');
    rootAppPath = fs.realpathSync('.');

    //console.log(rootAppPath);
    var meteorFolderIndex = 0;
    meteorFolderIndex = rootAppPath.indexOf('Meteor');
    if (meteorFolderIndex <= 0) {
        console.error('\x1b[31m%s\x1b[0m', 'Error: [WriteToFile]:Meteor Folder not found in rootAppPath');
        console.error('\x1b[31m%s\x1b[0m', 'Error: [WriteToFile]:rootAppPath=' + rootAppPath);
    }
    var logPath = rootAppPath.substring(0, meteorFolderIndex + 6);
    logPath = logPath + '\\Logs';
    //console.log("logPath:" + logPath);

    var meteorAppNameIndex = 0;
    meteorAppNameIndex = rootAppPath.indexOf('\\', meteorFolderIndex + 7);
    if (meteorAppNameIndex <= 0) {
        console.error('\x1b[31m%s\x1b[0m', 'Error: [WriteToFile]:App name cannot be found in rootAppPath');
        console.error('\x1b[31m%s\x1b[0m', 'Error: [WriteToFile]:rootAppPath=' + rootAppPath);
    }

    var appName = rootAppPath.substring(meteorFolderIndex + 7, meteorAppNameIndex);
    logPath = logPath + '\\' + appName;
    console.log("logPath:" + logPath);

    if (!fs.existsSync(logPath)) {
        console.log("filePath does not exist, making path");
        fs.mkdirSync(logPath);
    }

    Meteor.methods({
        WriteToFile: function (fileName, message, logLevel) {
            //get folder date
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            var newdate = day + "_" + month + "_" + year;
            var time = dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds();

            var filePath = logPath + '\\' + newdate;
            console.log("filePath:" + filePath);

            if (!fs.existsSync(filePath)) {
                console.log("filePath does not exist, making path");
                fs.mkdirSync(filePath);
            }

            fileName = fileName.replace('.js', '.txt');
            fs.appendFileSync(filePath + '\\' + fileName, time + ' [' + logLevel + "]:" + message + '\r\n', 'binary');
        },
        LogFile: function (fileName, file, logLevel) {
            console.log('LogFile');
            
            //get folder date
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            var newdate = day + "_" + month + "_" + year;
            var time = dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds();

            var filePath = logPath + '\\reports\\' + newdate;
            console.log("filePath:" + filePath);
            console.log("fileName:" + fileName);

            if (!fs.existsSync(filePath)) {
                console.log("filePath does not exist, making path");
                fs.mkdirSync(filePath);
            }

            fs.writeFile(filePath + '\\' + fileName, file, function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
        }
    });
}