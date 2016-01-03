'use strict'

// ServiceWorker script
// functions as an adaptor between the Express
// and the ServiceWorker environment

// server - Express application, as in
// var express = require('express')
// var app = express()
// think of this as equivalent to http.createServer(app)
function expressService (app) {
  require('./patch-sw-environment-for-express')

  /* global self, Promise, Response, fetch */
  const url = require('url')
  const myName = 'express-service'
  console.log(myName, 'startup')

  self.addEventListener('install', function (event) {
    console.log(myName, 'installed')
  })

  self.addEventListener('activate', function () {
    console.log(myName, 'activated')
  })

  function isJsRequest (path) {
    return /\.js$/.test(path)
  }

  function isCssRequest (path) {
    return /\.css$/.test(path)
  }

  self.addEventListener('fetch', function (event) {
    const parsedUrl = url.parse(event.request.url)
    console.log(myName, 'fetching page', parsedUrl.path)

    if (isJsRequest(parsedUrl.path) || isCssRequest(parsedUrl.path)) {
      return fetch(event.request)
    }

    event.respondWith(new Promise(function (resolve) {
      // let Express handle the request, but get the result
      console.log(myName, 'handle request', JSON.stringify(parsedUrl, null, 2))

      var req = {
        url: parsedUrl.href,
        method: 'GET'
      }
      console.log(req)
      var res = {
        _headers: {},
        setHeader: function setHeader (name, value) {
          // console.log('set header %s to %s', name, value)
          this._headers[name] = value
        },
        getHeader: function getHeader (name) {
          return this._headers[name]
        },
        get: function get (name) {
          return this._headers[name]
        }
      }

      function endWithFinish (chunk, encoding) {
        console.log('ending response for request', req.url)
        console.log('output "%s ..."', chunk.toString().substr(0, 10))
        console.log('%d %s %d', res.statusCode || 200,
          res.get('Content-Type'),
          res.get('Content-Length'))
        // end.apply(res, arguments)
        const responseOptions = {
          status: res.statusCode || 200,
          headers: {
            'Content-Length': res.get('Content-Length'),
            'Content-Type': res.get('Content-Type')
          }
        }
        resolve(new Response(chunk, responseOptions))
      }

      res.end = endWithFinish
      app(req, res)
    }))
  })
}

module.exports = expressService
