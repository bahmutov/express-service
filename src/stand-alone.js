var app = require('./demo-server')
var http = require('http')

function fn (req, res) {
  console.log('callback req', req.url)
  app(req, res)
}

var server = http.createServer(fn)
server.listen(3000)

var host = server.address().address
var port = server.address().port
console.log('Example app listening at http://%s:%s', host, port)
