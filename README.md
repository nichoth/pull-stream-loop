# pull stream loop
Helpers to create a rendering loop with [pull streams](https://pull-stream.github.io/)

## install
```
npm install @nichoth/pull-stream-loop
```

## example
```js
import { render } from 'preact'
import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
var S = require('pull-stream/pull')
S.values = require('pull-stream/sources/values')
var scan = require('pull-scan')
S.drain = require('pull-stream/sinks/drain')
var setup = require('@nichoth/pull-stream-loop')

var init = { n: 0 }

var { source, emit } = setup()

// can add new source streams like this
// a stream of click events
source.add(S.values([ ['click', 'ok'] ]))

function MyApp (props) {
    var [state, setState] = useState(init)

    // subscribe to pull-stream here
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
```

