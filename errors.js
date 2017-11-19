export function DrawError(message) {
  this.message = message
  var error = new Error(this.message)
  this.stack = error.stack
}

DrawError.prototype = new Error()
DrawError.prototype.name = DrawError.name
DrawError.prototype.constructor = DrawError
