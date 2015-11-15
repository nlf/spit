'use strict';

const Spit = require('../');

const lab = exports.lab = require('lab').script();
const expect = require('code').expect;
const it = lab.test;

it('can be used asynchronously', (done) => {

    const ee = new Spit();
    ee.on('test', (data) => {

        expect(data).to.equal('bacon');
    });

    ee.emit('test', 'bacon').then(() => {

        done();
    });
});

it('can ignore result', (done) => {

    const ee = new Spit();
    ee.on('test', (data) => {

        expect(data).to.equal('bacon');
        done();
    });

    ee.emit('test', 'bacon');
});

it('calls listeners in order', (done) => {

    const ee = new Spit();

    ee.on('test', (data) => {

        expect(data.count).to.equal(0);
        ++data.count;
    });

    ee.on('test', (data) => {

        expect(data.count).to.equal(1);
        ++data.count;
        return new Promise((resolve) => {

            setTimeout(() => {

                return resolve();
            }, 20);
        });
    });

    ee.on('test', (data) => {

        const end = process.hrtime(start);
        const ms = end[1] / 1000000;
        expect(ms).to.be.above(20);
        expect(data.count).to.equal(2);
        ++data.count;
    });

    const state = { count: 0 };
    const start = process.hrtime();
    ee.emit('test', state).then(() => {

        expect(state.count).to.equal(3);
        done();
    });
});

it('can listen to an event one time', (done) => {

    const ee = new Spit();
    ee.once('test', (data) => {

        expect(data.count).to.equal(0);
        ++data.count;
    });

    const state = { count: 0 };
    ee.emit('test', state).then(() => {

        expect(state.count).to.equal(1);
        ee.emit('test', state).then(() => {

            expect(state.count).to.equal(1);
            done();
        });
    });
});

it('calls emit callback immediately when no listeners exist', (done) => {

    const ee = new Spit();
    ee.emit('test').then(() => {

        done();
    });
});

it('emits newListener when adding a listener', (done) => {

    const ee = new Spit();
    ee.on('newListener', (event, listener) => {

        expect(event).to.equal('test');
        expect(listener).to.be.an.instanceof(Function);
        done();
    });

    ee.on('test', () => {});
});

it('emits newListener when adding a listener via once', (done) => {

    const ee = new Spit();
    ee.on('newListener', (event, listener) => {

        expect(event).to.equal('test');
        expect(listener).to.be.an.instanceof(Function);
        done();
    });

    ee.once('test', () => {});
});

it('rejects promises appropriately', (done) => {

    const ee = new Spit();
    ee.on('test', () => {

        return Promise.reject(new Error('failed'));
    });

    ee.on('test', () => {

        expect(true).to.equal(false);
    });

    ee.emit('test').catch((err) => {

        expect(err).to.exist();
        expect(err.message).to.equal('failed');
        done();
    });
});

it('returns a default error if none is provided when emitting error', (done) => {

    const ee = new Spit();
    ee.emit('error').catch((err) => {

        expect(err).to.exist();
        expect(err.message).to.equal('Uncaught, unspecified "error" event.');
        done();
    });
});

it('returns the given error when emitting error', (done) => {

    const ee = new Spit();
    ee.emit('error', new Error('failed')).catch((err) => {

        expect(err).to.exist();
        expect(err.message).to.equal('failed');
        done();
    });
});
