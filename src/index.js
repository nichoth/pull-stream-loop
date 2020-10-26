import { render } from 'preact'
import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
var S = require('pull-stream/pull')
var scan = require('pull-scan')
var Pushable = require('pull-pushable')
S.drain = require('pull-stream/sinks/drain')

console.log('ok')

var init = { n: 0 }

function MyApp (props) {
    var [state, setState] = useState(init)
    var pushable = Pushable()

    // subscribe to pull-stream here
    useEffect(() => {
        S(
            pushable,
            scan(function (acc, [type, data]) {
                // re-render only happens if the return value is not
                // shallow-equal, so need to return a new object
                console.log('scan -- ', type, data)
                if (type === 'click') return { n: acc.n + 1 }
            }, state),
            S.drain(function (state) {
                setState(state)
            })
        )
    })

    function emit (type, data) {
        // curry
        if (data === undefined) return _data => emit(type, _data)
        pushable.push([type, data])
    }

    return html`<div>
        wooooooo n: ${state.n}
        <${Clicker} ...${props} emit=${emit} />
    </div>`
}

function Clicker (props) {
    var { emit } = props
    return html`<button onclick=${emit('click')}>click</button>`
}

render(html`<${MyApp} />`, document.getElementById('content'))
