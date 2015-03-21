var EventEmitter = require('events').EventEmitter;
var Promise = require('bluebird');
var Util = require('util');

var Spit = function () {

    EventEmitter.call(this);
};

Util.inherits(Spit, EventEmitter);

Spit.prototype.addListener = function (event, method) {

    this._events[event] = this._events[event] || [];

    if (this._events.newListener) {
        this.emit('newListener', event, typeof method.listener === 'function' ? method.listener : method);
    }

    this._events[event].push(method);

    return this;
};

Spit.prototype.on = Spit.prototype.addListener;

Spit.prototype.emit = function (event /* args */) {

    var args = Array.prototype.slice.call(arguments, 1);
    if (event === 'error') {
        var err = args[0] instanceof Error ? args[0] : new Error('Uncaught, unspecified "error" event.');
        return Promise.reject(err);
    }

    this._events[event] = this._events[event] || [];
    return Promise.all(this._events[event].map(function (hook) { return hook.apply(this, args); }, this));
};

module.exports = Spit;
