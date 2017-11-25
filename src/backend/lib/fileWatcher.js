const Tail = require('tail').Tail

const fileWatcher = module.exports = {}

const files = {}

fileWatcher.watchFile = (id, filename, onNewLine, onError) => {
  const tail = new Tail(filename);

  tail.on('line', (data) => {
    onNewLine(data)
  })

  tail.on('error', (error) => {
    onError(error)
  })

  files[id] = tail

  return tail
}

fileWatcher.unwatchFile = (id) => {
  files[id].unwatch()
  delete files[id]
}
