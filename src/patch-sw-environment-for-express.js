// patch and mock the environment
if (typeof global.XMLHttpRequest === 'undefined') {
  global.XMLHttpRequest = require('./XMLHttpRequest-mock')
}
var http = require('http')
if (!http.IncomingMessage) {
  http.IncomingMessage = {}
}
if (!http.ServerResponse) {
  http.ServerResponseProto = {
    _headers: {},
    setHeader: function setHeader (name, value) {
      console.log('set header %s to %s', name, value)
      this._headers[name] = value
    },
    getHeader: function getHeader (name) {
      return this._headers[name]
    },
    get: function get (name) {
      return this._headers[name]
    }
  }
  http.ServerResponse = Object.create({}, http.ServerResponseProto)
}
