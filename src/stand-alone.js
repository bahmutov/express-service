var app = require('./demo-server')
var http = require('http')

function fn (req, res) {
  console.log('callback req', req.url)

  const end = res.end

  function endWithFinish (chunk, encoding) {
    console.log('ending response for request', req.url)
    console.log('output "%s ..."', chunk.toString().substr(0, 10))
    console.log('%d %s %d', res.statusCode || 200,
      res.get('Content-Type'),
      res.get('Content-Length'))
    end.apply(res, arguments)
  }

  res.end = endWithFinish
  app(req, res)
}

var server = http.createServer(fn)
server.listen(3000)

var host = server.address().address
var port = server.address().port
console.log('Example app listening at http://%s:%s', host, port)
