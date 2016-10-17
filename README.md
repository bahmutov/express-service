# express-service
> ExpressJS server running inside ServiceWorker

[![NPM][express-service-icon] ][express-service-url]

[![Build status][express-service-ci-image] ][express-service-ci-url]
[![semantic-release][semantic-image] ][semantic-url]

Read [Run Express server in your browser][post] blog post.

[post]: https://glebbahmutov.com/blog/run-express-server-in-your-browser/

As a proof of concept I have been able to intercept fetch requests from the
page and serve them using an ExpressJS running inside a ServiceWorker.

See live [demo](https://express-service.herokuapp.com/) (use Chrome or Opera)
where a complete [TodoMVC Express app](https://github.com/bahmutov/todomvc-express) is running
a ServiceWorker. [Demo source](https://github.com/bahmutov/todomvc-express-and-service-worker).

## The ExpressJS server

The ExpressJS server can be found in [src/demo-server.js](src/demo-server.js), it has 2 pages

```js
var express = require('express')
var app = express()
function sendIndexPage (req, res) {
  res.send(indexPage) // simple HTML5 text
}
function sendAboutPage (req, res) {
  res.send(aboutPage) // simple HTML text
}
app.get('/', sendIndexPage)
app.get('/about', sendAboutPage)
module.exports = app
```

You can try running the server in stand alone server using [src/stand-alone.js](src/stand-alone.js)
It is very simple and uses the Express as a callback to Node http server

```js
var app = require('./demo-server')
var http = require('http')
var server = http.createServer(app)
server.listen(3000)
```

## Use

See [src/]

```js
const expressService = require('express-service')
const app = require('./express-server')
expressService(app)
```

You can also cache specific static resources by providing their urls to add
offline ability to your web application

```js
const cacheName = 'my-server-v1'
const cacheUrls = ['/', 'app.css', 'static/foo/script.js']
expressService(app, cacheUrls, cacheName)
```

"Real world" example can be found in
[bahmutov/todomvc-express-and-service-worker](https://github.com/bahmutov/todomvc-express-and-service-worker/blob/master/index.js)

## The ExpressJS wrapper inside ServiceWorker

We intercept each request and then create mock
[Node ClientRequet](https://nodejs.org/api/http.html#http_class_http_clientrequest)
and [Node Response](https://nodejs.org/api/http.html#http_class_http_serverresponse),
fake enough to fool the Express. When the Express is done rendering chunk, we return
a [Promise](https://fetch.spec.whatwg.org/#responses) object back to the page.

```js
var url = require('url') // standard Node module
self.addEventListener('fetch', function (event) {
  const parsedUrl = url.parse(event.request.url)
  console.log(myName, 'fetching page', parsedUrl.path)
  if (/* requesting things Express should not know about */) {
    return fetch(event.request)
  }
  event.respondWith(new Promise(function (resolve) {
    var req = { /* fake request */ }
    var res = { /* fake response */ }
    function endWithFinish (chunk, encoding) {
      const responseOptions = {
        status: res.statusCode || 200,
        headers: {
          'Content-Length': res.get('Content-Length'),
          'Content-Type': res.get('Content-Type')
        }
      }
      // return rendered page back to the browser
      resolve(new Response(chunk, responseOptions))
    }
    res.end = endWithFinish
    app(req, res)
  }))
})
```

This experiment is still pretty raw, but it has 3 main advantages right now

* The server can be tested and used just like normal stand alone Express server
* The pages arrive back to the browser from ServiceWorker fully rendered,
  creating better experience.
* Except for the initial page that can be very simple (just register and activate
  the ServiceWorker), the rest of the pages does not need to run the application JavaScript code!

## Related

* [serviceworkers-ware](https://www.npmjs.com/package/serviceworkers-ware) - Express-like
  middleware stacks for processing inside a ServiceWorker, but not the real ExpressJS
* [bottle-service](https://github.com/bahmutov/bottle-service) - ServiceWorker interceptor
  that you can use to cache updated HTML to make sure the page arrives "pre-rendered" on
  next load for instant start up.

## Building and testing example

```sh
npm run build
npm run dev-start
open localhost:3007
```

### Small print

Author: Gleb Bahmutov &copy; 2015

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/express-service/issues) on Github

## MIT License

Copyright (c) 2015 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[express-service-icon]: https://nodei.co/npm/express-service.png?downloads=true
[express-service-url]: https://npmjs.org/package/express-service
[express-service-ci-image]: https://travis-ci.org/bahmutov/express-service.png?branch=master
[express-service-ci-url]: https://travis-ci.org/bahmutov/express-service
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
