var express = require('express')
var app = express()

var simplePage = [
  '<!DOCTYPE html>',
  '<html lang="en">',
  '<head>',
  '<meta charset="utf-8">',
  '</head>',
  '<body>',
  '<h1>Hello World</h1>',
  '</body>',
  '</html>'
].join('\n')

app.get('/', function (req, res) {
  res.send(simplePage)
})

module.exports = app
