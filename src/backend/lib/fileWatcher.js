const Tail = require('tail').Tail

const fileWatcher = module.exports = {}

fileWatcher.watchFile = (filename, onNewLine, onError) => {
  const tail = new Tail(filename);

  tail.on('line', (data) => {
    onNewLine(data)
  })

  tail.on('error', (error) => {
    onError(error)
  })
}
