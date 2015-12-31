'use strict'
// ExpressJS running inside ServiceWorker

/* global self, Promise */
// Response, location, fetch
const url = require('url')
const myName = 'express-service'
console.log(myName, 'startup')

// const app = require('./demo-server')
// console.log('got demo express server')

self.addEventListener('install', function (event) {
  console.log(myName, 'installed')
})

self.addEventListener('activate', function () {
  console.log(myName, 'activated')
})

// function isIndexPageRequest (event) {
//   return event &&
//     event.request &&
//     event.request.url === location.origin + '/'
// }

self.addEventListener('fetch', function (event) {
  const parsedUrl = url.parse(event.request.url)
  console.log(myName, 'fetching index page', parsedUrl)
})
