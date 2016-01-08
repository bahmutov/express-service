// patch and mock the environment

// XMLHttpRequest is used to figure out the environment features
if (typeof global.XMLHttpRequest === 'undefined') {
  global.XMLHttpRequest = require('./XMLHttpRequest-mock')
}

// high resolution timestamps
/* global performance */
process.hrtime = performance.now.bind(performance)

process.stdout = {
  write: function fakeWrite (str) {
    console.log(str)
  }
}

// http structures used inside Express
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

// setImmediate is missing in the ServiceWorker
if (typeof setImmediate === 'undefined') {
  global.setImmediate = function setImmediate (cb, param) {
    setTimeout(cb.bind(null, param), 0)
  }
}

// missing file system sync calls
const fs = require('fs')
if (typeof fs.existsSync === 'undefined') {
  // mocking text file system :)
  const __files = {}
  fs.existsSync = function existsSync (path) {
    return typeof __files[path] !== 'undefined'
  }
  fs.writeFileSync = function writeFileSync (path, text) {
    // assuming utf8
    __files[path] = text
  }
  fs.readFileSync = function readFileSync (path) {
    return __files[path]
  }
}
