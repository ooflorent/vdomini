function loop(state, view, opts) {
  var { create, update } = opts
  var el = create(null)

  function render(prevState, prevNode, view) {
    var nextNode = view(prevState, function(nextState) {
      render(nextState, nextNode, view)
    })

    el = update(prevNode, nextNode, el)
  }

  render(state, null, view)
  return el
}

module.exports = loop
