var Pushable = require('pull-pushable')
var Many = require('pull-many')

function setup () {
    var pushable = Pushable()
    var many = Many([pushable])

    function emit (type, data) {
        // curry
        if (data === undefined) return _data => emit(type, _data)
        pushable.push([type, data])
    }

    return {
        source: many,
        emit
    }
}

module.exports = setup
