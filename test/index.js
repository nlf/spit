var Promise = require('bluebird');
var Spit = require('../');

var lab = exports.lab = require('lab').script();
var expect = require('code').expect;
var it = lab.test;

it('can be used asynchronously', function (done) {

    var ee = new Spit();
    ee.on('test', function (data) {

        expect(data).to.equal('bacon');
    });

    ee.emit('test', 'bacon').then(function () {

        done();
    });
});

it('can ignore result', function (done) {

    var ee = new Spit();
    ee.on('test', function (data) {

        expect(data).to.equal('bacon');
        done();
    });

    ee.emit('test', 'bacon');
});

it('calls listeners in order', function (done) {

    var ee = new Spit();
    ee.on('test', function (data) {

        expect(data.count).to.equal(0);
        ++data.count;
    });

    ee.on('test', function (data) {

        expect(data.count).to.equal(1);
        ++data.count;
        return Promise.delay(20);
    });

    ee.on('test', function (data) {

        expect(data.count).to.equal(2);
        ++data.count;
    });

    var state = { count: 0 };
    ee.emit('test', state).then(function () {

        expect(state.count).to.equal(3);
        done();
    });
});

it('can listen to an event one time', function (done) {

    var ee = new Spit();
    ee.once('test', function (data) {

        expect(data.count).to.equal(0);
        ++data.count;
    });

    var state = { count: 0 };
    ee.emit('test', state).then(function () {

        expect(state.count).to.equal(1);
        ee.emit('test', state).then(function () {

            expect(state.count).to.equal(1);
            done();
        });
    });
});

it('calls emit callback immediately when no listeners exist', function (done) {

    var ee = new Spit();
    ee.emit('test').then(function () {

        done();
    });
});

it('emits newListener when adding a listener', function (done) {

    var ee = new Spit();
    ee.on('newListener', function (event, listener) {

        expect(event).to.equal('test');
        expect(listener).to.be.an.instanceof(Function);
        done();
    });

    ee.on('test', function () {});
});

it('emits newListener when adding a listener via once', function (done) {

    var ee = new Spit();
    ee.on('newListener', function (event, listener) {

        expect(event).to.equal('test');
        expect(listener).to.be.an.instanceof(Function);
        done();
    });

    ee.once('test', function () {});
});

it('rejects promises appropriately', function (done) {

    var ee = new Spit();
    ee.on('test', function () {

        return Promise.reject(new Error('failed'));
    });

    ee.on('test', function () {

        expect(true).to.equal(false);
    });

    ee.emit('test').catch(function (err) {

        expect(err).to.exist();
        expect(err.message).to.equal('failed');
        done();
    });
});

it('returns a default error if none is provided when emitting error', function (done) {

    var ee = new Spit();
    ee.emit('error').catch(function (err) {

        expect(err).to.exist();
        expect(err.message).to.equal('Uncaught, unspecified "error" event.');
        done();
    });
});

it('returns the given error when emitting error', function (done) {

    var ee = new Spit();
    ee.emit('error', new Error('failed')).catch(function (err) {

        expect(err).to.exist();
        expect(err.message).to.equal('failed');
        done();
    });
});
