var EventEmitter = require('events').EventEmitter;
var Items = require('items');
var Util = require('util');

var EventMaster = function () {

    EventEmitter.call(this);
};

Util.inherits(EventMaster, EventEmitter);

EventMaster.prototype.addListener = function (event, method) {

    this._events[event] = this._events[event] || [];

    if (this._events.newListener) {
        this.emit('newListener', event, typeof method.listener === 'function' ? method.listener : method, function () { });
    }

    this._events[event].push(method);

    return this;
};

EventMaster.prototype.on = EventMaster.prototype.addListener;

EventMaster.prototype.emit = function (event /* arg1, arg2, cb */) {

    var args = Array.prototype.slice.call(arguments, 1);
    var cb;

    if (typeof args[args.length - 1] === 'function') {
        cb = args.pop();
    }

    if (event === 'error' &&
        !this._events.error) {

        var err = args[0] instanceof Error ? args[0] : new Error('Uncaught, unspecified "error" event.');

        if (cb) {
            return cb(err);
        }

        throw err;
    }

    if (!this._events[event] ||
        !this._events[event].length) {

        if (cb) {
            cb();
        }

        return false;
    }

    var self = this;
    Items.serial(this._events[event], function (item, next) {

        item.apply(self, args.concat(next));
    }, function (err) {

        if (cb) {
            cb(err);
        }
        else if (err) {
            self.emit('error', err);
        }
    });

    return true;
};

module.exports = EventMaster;
