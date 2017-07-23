const parsersSortOrder = {
  BLOCK: 1,
  STARTS_WITH: 2
}

module.exports = [
  {
    sortOrder: parsersSortOrder.STARTS_WITH,
    title: 'Starts with "line 1"',
    type: 'STARTS_WITH',
    color: 'deepskyblue',
    rule: {
      startsWith: 'line 1'
    }
  },
  {
    sortOrder: parsersSortOrder.BLOCK,
    title: 'Foobar',
    type: 'BLOCK',
    color: 'purple',
    rule: {
      beginMarker: '== BEGIN foobar',
      endMarker: '== END foobar'
    }
  },
  {
    sortOrder: parsersSortOrder.STARTS_WITH,
    title: 'Starts with "line 2"',
    type: 'STARTS_WITH',
    color: 'red',
    rule: {
      startsWith: 'line 2'
    }
  }
]
