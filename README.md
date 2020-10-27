# pull stream loop

A rendering loop made with [pull streams](https://pull-stream.github.io/)

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
var scan = require('pull-scan')
S.drain = require('pull-stream/sinks/drain')
var setup = require('@nichoth/pull-stream-loop')

var init = { n: 0 }

function MyApp (props) {
    var [state, setState] = useState(init)

    // subscribe to pull-stream here
    var { source, emit } = setup()
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



