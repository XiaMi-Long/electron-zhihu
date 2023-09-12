const Colors = {
  RED: 'red',
  YELLOW: 'yellow',
  GREEN: 'green'
}

function coloredLog(message, color) {
  console.log('%c' + message, 'color:' + color)
}

export { Colors, coloredLog }
