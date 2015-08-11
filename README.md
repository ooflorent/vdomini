# vdomini

## Goals

* Be as lightweight as possible
* Be as fast as necessary for responsive user interfaces

## Non-Goals

* Win any benchmarks
* Support older browsers
* Provide a widget or component model

## Usage

```js
var vdomini = require("vdomini")
var h = require("vdomini/lib/h")
var loop = require("vdomini/lib/loop")

var el = loop({ time: 0 }, render, vdomini)

function render(state, setState) {
  return h("button", { onclick: () => setState({ time: Date.now() }) }, state.bar)
}

document.body.appendChild(el)
```

Custom node creators

```js
function render() {
  return ["ul.menu",
    ["li.menu-item", "foo"],
    ["li.menu-item", "bar"],
    ["li.menu-item", "baz"]]
}

function jsonml(node) {
  var type = typeof node
  if (node == null) return
  if (type == "string" || type == "number") return String(node)
  var [ selector, ...children ] = node
  var attrs = typeof children[0] == "object" ? children.shift() : {}
  return h(selector, attrs, children.map(jsonml))
}

loop({}, render, {
  create: (node) => vdomini.create(jsonml(node)),
  update: (prev, next, el) => vdomini.update(prev, jsonml(next), el),
})
```
