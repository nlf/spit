var Spit = require('../');

var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

lab.test('can be used asynchronously', function (done) {

    var ee = new Spit();
    ee.on('test', function (data, next) {

        expect(data).to.equal('bacon');
        expect(next).to.be.an.instanceof(Function);
        next();
    });

    ee.emit('test', 'bacon', function (err) {

        expect(err).to.not.exist();
        done();
    });
});

lab.test('can omit callback', function (done) {

    var ee = new Spit();
    ee.on('test', function (data, next) {

        expect(data).to.equal('bacon');
        expect(next).to.be.an.instanceof(Function);
        next();

        done();
    });

    ee.emit('test', 'bacon');
});

lab.test('calls listeners in order', function (done) {

    var ee = new Spit();
    ee.on('test', function (data, next) {

        expect(data.count).to.equal(0);
        ++data.count;
        next();
    });

    ee.on('test', function (data, next) {

        expect(data.count).to.equal(1);
        ++data.count;
        next();
    });

    var state = { count: 0 };
    ee.emit('test', state, function (err) {

        expect(err).to.not.exist();
        expect(state.count).to.equal(2);
        done();
    });
});

lab.test('can listen to an event one time', function (done) {

    var ee = new Spit();
    ee.once('test', function (data, next) {

        expect(data.count).to.equal(0);
        ++data.count;
        next();
    });

    var state = { count: 0 };
    ee.emit('test', state, function (err) {

        expect(err).to.not.exist();
        expect(ee.emit('test', state)).to.equal(false);
        expect(state.count).to.equal(1);
        done();
    });
});

lab.test('calls emit callback immediately when no listeners exist', function (done) {

    var ee = new Spit();
    ee.emit('test', function (err) {

        expect(err).to.not.exist();
        done();
    });
});

lab.test('returns false when emitting an event and no listeners are available', function (done) {

    var ee = new Spit();
    expect(ee.emit('test')).to.equal(false);
    done();
});

lab.test('emits newListener when adding a listener', function (done) {

    var ee = new Spit();
    ee.on('newListener', function (event, listener) {

        expect(event).to.equal('test');
        expect(listener).to.be.an.instanceof(Function);
        done();
    });

    ee.on('test', function () {});
});

lab.test('emits newListener when adding a listener via once', function (done) {

    var ee = new Spit();
    ee.on('newListener', function (event, listener, next) {

        expect(event).to.equal('test');
        expect(listener).to.be.an.instanceof(Function);
        next();

        done();
    });

    ee.once('test', function () {});
});

lab.test('passes errors to callback when one is provided', function (done) {

    var ee = new Spit();
    ee.on('test', function (next) {

        next(new Error('failed'));
    });

    ee.emit('test', function (err) {

        expect(err).to.exist();
        expect(err.message).to.equal('failed');
        done();
    });
});

lab.test('throws when error is emitted and no callback is given', function (done) {

    var ee = new Spit();
    expect(function () {

        ee.emit('error', new Error('failed'));
    }).to.throw('failed');

    done();
});

lab.test('allows for loopback errors', function (done) {

    var ee = new Spit();
    ee.emit('error', function (err) {

        expect(err).to.exist();
        expect(err.message).to.equal('Uncaught, unspecified "error" event.');
        done();
    });
});

lab.test('emits error when listeners are used and no callback is provided', function (done) {

    var ee = new Spit();
    ee.on('error', function (err) {

        expect(err).to.exist();
        expect(err.message).to.equal('failed');
        done();
    });

    ee.on('test', function (next) {

        next(new Error('failed'));
    });

    ee.emit('test');
});
