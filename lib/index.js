var EventEmitter = require('events').EventEmitter;
var Util = require('util');

var Spit = function () {

    EventEmitter.call(this);
};

Util.inherits(Spit, EventEmitter);

Spit.prototype.addListener = function (event, method) {

    this._events[event] = this._events[event] || [];

    if (event !== 'newListener' &&
        this._events.newListener) {

        this.emit('newListener', event, typeof method.listener === 'function' ? method.listener : method);
    }

    this._events[event].push(method);

    return this;
};

Spit.prototype.on = Spit.prototype.addListener;

Spit.prototype.emit = function (event /* args */) {

    this._events[event] = this._events[event] || [];

    var args = [];
    for (var a = 1, al = arguments.length; a < al; ++a) {
        args.push(arguments[a]);
    }

    if (event === 'error') {
        var err = args[0] instanceof Error ? args[0] : new Error('Uncaught, unspecified "error" event.');
        return Promise.reject(err);
    }

    var processItem = function (item, context) {

        return function () {

            return item.apply(context, args);
        };
    };

    var result = Promise.resolve();
    for (var i = 0, il = this._events[event].length; i < il; ++i) {
        result = result.then(processItem(this._events[event][i], this));
    }

    return result;
};

module.exports = Spit;
