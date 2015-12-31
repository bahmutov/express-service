# express-service
> ExpressJS server running inside ServiceWorker

As a proof of concept I have been able to intercept fetch requests from the
page and serve them using an ExpressJS running inside a ServiceWorker.

There was a little bit of hacking inside the bundle [dist/service.js](dist/service.js)
that was created using Browserify. 

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
