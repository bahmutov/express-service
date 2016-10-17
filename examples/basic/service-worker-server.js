const expressService = require('../..')
const app = require('./demo-server')
const cacheName = 'server-example-v1'
const cacheUrls = ['/']
expressService(app, cacheUrls, cacheName)
