var express = require('express')
var app = express()

var indexPage = [
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

var aboutPage = [
  '<!DOCTYPE html>',
  '<html lang="en">',
  '<head>',
  '<meta charset="utf-8">',
  '</head>',
  '<body>',
  '<h1>About express-service</h1>',
  '</body>',
  '</html>'
].join('\n')

function sendIndexPage (req, res) {
  res.send(indexPage)
}

function sendAboutPage (req, res) {
  res.send(aboutPage)
}

app.get('/', sendIndexPage)
app.get('/about', sendAboutPage)

module.exports = app
