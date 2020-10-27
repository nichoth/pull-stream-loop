import { render } from 'preact'
import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
var S = require('pull-stream/pull')
var scan = require('pull-scan')
var Pushable = require('pull-pushable')
S.drain = require('pull-stream/sinks/drain')
var Many = require('pull-many')

console.log('ok')

var init = { n: 0 }

function setup (init) {
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


function MyApp (props) {
    var [state, setState] = useState(init)

    // subscribe to pull-stream here
    var { source, emit } = setup({})
    useEffect(() => {
        S(
            source,
            scan(function (acc, [type, data]) {
                // re-render only happens if the return value is not
                // shallow-equal, so need to return a new object
                console.log('scan -- ', type, data)
                if (type === 'click') return { n: acc.n + 1 }
                if (type === 'reset') return { n: 0 }
            }, state),
            S.drain(function (state) {
                setState(state)
            })
        )
    })

    return html`<div>
        wooooooo n: ${state.n}
        <br />
        <${Clicker} ...${props} emit=${emit} />
        <${Reset} ...${props} emit=${emit} />
    </div>`
}

function Clicker (props) {
    var { emit } = props
    return html`<button onclick=${emit('click')}>click</button>`
}

function Reset ({ emit }) {
    return html`<button onclick=${emit('reset')}>reset</button>`
}

render(html`<${MyApp} />`, document.getElementById('content'))
