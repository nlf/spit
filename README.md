### spit

Spit is an event emitter that leverages asynchronous methods.

There are two key differences between it and the node.js core event emitter.

The `emit()` method returns a promise that will be resolved or rejected when all listeners have completed.

The `on()` or `addListener()` method accepts two parameters, an event name and a method that will receive all arguments that were emitted on that event. You may return a promise within the method if you need to do any asynchronous processing.
