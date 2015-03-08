### spit

Spit is an event emitter that leverages asynchronous methods.

There are two key differences between it and the node.js core event emitter.

The `emit()` method can *only* accept up to four parameters. In order, they are the event name, two optional arguments, and lastly an optional callback. The callback will be called when all listeners for the given event have completed, it will receive an optional `err` parameter if one is raised by a listener.

The `on()` or `addListener()` method also accepts up to four parameters. The event name, two optional arguments, and a *mandatory* callback. When processing within the listener is complete, the callback must be called. An error object can be passed to this callback and it will abort further processing and return the error to the emitter, or emit an `error` event if the emitter did not provide a callback.
