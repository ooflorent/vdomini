const TYPE_EMPTY = 0
const TYPE_TEXT = 1
const TYPE_ELEMENT = 2
const TYPE_THUNK = 3

const NAMESPACE_ELEMENTS = {
  svg: "http://www.w3.org/2000/svg",
  math: "http://www.w3.org/1998/Math/MathML",
}

function getType(node) {
  if (node == null) return TYPE_EMPTY
  if (typeof node != "object") return TYPE_TEXT
  if (typeof node.type == "string") return TYPE_ELEMENT
  return TYPE_THUNK
}

function append(el, node) {
  el.appendChild(create(node, el.namespaceURI))
}

function replace(el, node) {
  var parent = el.parentNode
  parent.replaceChild(create(node, parent.namespaceURI), el)
}

function remove(el) {
  el.parentNode.removeChild(el)
}

function setAttribute(el, name, value) {
  if (name == "style") {
    for (var k in value) {
      el[name][k] = value[k]
    }
  } else {
    el.setAttribute(name, value)
  }
}

function removeAttribute(el, name, value) {
  el.removeAttribute(name)
}

function create(node, currentNamespace) {
  var nodeType = getType(node)

  if (nodeType == TYPE_EMPTY) {
    return document.createElement("noscript")
  }

  if (nodeType == TYPE_TEXT) {
    return document.createTextNode(node)
  }

  var { type, attrs, children } = node

  if (nodeType == TYPE_THUNK) {
    return create(type(attrs), currentNamespace)
  }

  var ns = attrs.xmlns || NAMESPACE_ELEMENTS[type] || currentNamespace
  var el = ns
    ? document.createElementNS(ns, type)
    : document.createElement(type)

  for (var k in attrs) {
    setAttribute(el, k, attrs[k])
  }

  for (var i = 0; i < children.length; i++) {
    append(el, children[i])
  }

  return el
}

function update(prev, next, el) {
  var prevType = getType(prev)
  var nextType = getType(next)

  if (nextType != prevType) return replace(el, next)
  if (nextType == TYPE_ELEMENT) {
    if (prev.type != next.type) return replace(el, next)
    updateAttributes(prev.attrs, next.attrs, el)
    updateChildren(prev.children, next.children, el.childNodes)
  } else if (nextType == TYPE_TEXT) {
    if (prev != next) el.data = next
  }

  return el
}

function updateAttributes(prev, next, el) {
  for (var k in prev) {
    if (!(k in next)) {
      removeAttribute(el, k, prev[k])
    }
  }

  for (var k in next) {
    if (prev[k] != next[k]) {
      setAttribute(el, k, next[k])
    }
  }
}

function updateChildren(prev, next, el) {
  var childNodes = el.childNodes
  var n = prev.length

  while (n > next.length) {
    remove(childNodes[--n])
  }

  for (var i = 0; i < n; i++) {
    update(prev[i], next[i], childNodes[i])
  }

  while (n < next.length) {
    append(el, next[n++])
  }
}

exports.create = create
exports.update = update
