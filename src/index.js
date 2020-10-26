import { render } from 'preact'
import { html } from 'htm/preact'
var S = require('pull-streeam/pull')

render(html`<a href="/">Hello!</a>`, document.getElementById('content'))

console.log('ok')
