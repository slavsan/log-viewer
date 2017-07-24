const uuidv4 = require('uuid/V4')

const utils = module.exports = {}

utils.compare = (a, b) => {
  if (a.sortOrder < b.sortOrder) return -1
  if (a.sortOrder > b.sortOrder) return 1
  return 0
}

utils.parseLine = (parsers, line, file) => {
  const parsedLine = {
    uuid: uuidv4(),
    color: '#ababab',
    text: line,
    raw: line
  }

  let alreadyDone = false

  parsers.every(p => {
    if (p.type === 'BLOCK') {
      // Are we just entering a block
      if (line.indexOf(p.rule.beginMarker) === 0) {
        parsedLine.text = p.title
        parsedLine.type = p.type
        parsedLine.color = p.color
        parsedLine.open = true
        parsedLine.expanded = true
        parsedLine.lines = []
        parsedLine.lines.push(line)
        return false
      }

      const lastParsedLine = file.parsed.lines[file.parsed.lines.length - 1]

      // Are we just ending a block
      if (parsedLine.raw.indexOf(p.rule.endMarker) === 0) {
        if (lastParsedLine && lastParsedLine.open) { // is this our already opened block?
          lastParsedLine.open = false
          lastParsedLine.lines.push(line)
          alreadyDone = true
          return false
        }
      }

      // Are we in the middle of an open block
      // is this our already opened block?
      if (lastParsedLine && lastParsedLine.open) {
        lastParsedLine.lines.push(line)
        alreadyDone = true
        return false
      }
    }

    if (p.type === 'STARTS_WITH') {
      if (parsedLine.raw.indexOf(p.rule.startsWith) === 0) {
        parsedLine.type = p.type
        parsedLine.color = p.color
        return false
      }
    }

    return true
  })

  if (alreadyDone) {
    return
  }

  file.parsed.lines.push(parsedLine)
}
