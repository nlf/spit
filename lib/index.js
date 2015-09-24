'use strict';
let EventEmitter = require('events').EventEmitter;

class Spit extends EventEmitter {
    addListener (event, method) {

        this._events[event] = this._events[event] || [];

        if (event !== 'newListener' &&
            this._events.newListener) {

            this.emit('newListener', event, typeof method.listener === 'function' ? method.listener : method);
        }

        this._events[event].push(method);

        return this;
    };

    on () {

        return this.addListener.apply(this, arguments);
    };

    emit (event, arg1, arg2, arg3) {

        let eventHandlers = this._events[event] = this._events[event] || [];

        if (event === 'error' &&
            !eventHandlers.length) {

            let err = arg1 instanceof Error ? arg1 : new Error('Uncaught, unspecified "error" event.');
            return Promise.reject(err);
        }

        let result = Promise.resolve();
        for (let i = 0, il = eventHandlers.length; i < il; ++i) {
            result = result.then(eventHandlers[i].bind(this, arg1, arg2, arg3));
        }

        return result;
    };
};

module.exports = Spit;
