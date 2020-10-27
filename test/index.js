var test = require('tape')
var Loop = require('../src')
var S = require('pull-stream')
var Abortable = require('pull-abortable')

test('loop', function (t) {
    var { source } = Loop()

    var expected = [1,2,3]
    source.add(S.values(expected))
    var abortable = Abortable()

    S(
        source,
        abortable,
        S.collect(function (err, res) {
            t.plan(expected.length + 1)
            res.forEach((n, i) => t.equal(n, expected[i]), 'should' +
                ' have .add key on source')
            t.error(err, 'should abort stream without error')
        })
    )

    abortable.abort()
})

test('emit', function (t) {
    var { source, emit } = Loop()
    var abortable = Abortable()
    t.plan(4)

    S(
        source,
        abortable,
        S.collect(function (err, res) {
            t.error(err, 'should end without error')
            // [ ['a', 'test event'], ['b', 'test2'] ]
            t.equal(res[0][1], 'test event', 'should emit an event')
            t.equal(res[0][0], 'a', 'should emit the event name')
            t.equal(res[1][1], 'test2', 'should curry the emit function')
        })
    )

    emit('a', 'test event')
    emit('b')('test2')
    abortable.abort()
})


