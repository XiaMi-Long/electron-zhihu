const { shell } = require('electron')

const openExternal = function (event, url) {
  shell.openExternal(url)
}

export { openExternal }
