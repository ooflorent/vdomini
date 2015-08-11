function h(type, attrs, children) {
  if (children == null && Array.isArray(attrs)) {
    children = attrs
    attrs = {}
  }

  attrs = attrs || {}
  children = children || []

  if (typeof type == "string") {
    var parts = type.split(/([\.#][^.#\s]+)/)
    var classes = attrs.class || ""

    type = parts[0] || "div"

    for (var i = 1; i < parts.length; i++) {
      var [ prefix, ...value ] = parts[i]
      if (prefix == ".") {
        classes += " " + value
      } else if (prefix == "#") {
        attrs.id = value
      }
    }

    if (classes) {
      attrs.class = classes
    }
  }

  return { type, attrs, children }
}

module.exports = h
