module.exports = [{
  output: {
    path: './dist',
    filename: 'client.js'
  },
  entry: {
    client: './src/express-client'
  }
}, {
  output: {
    path: './dist',
    filename: 'service.js'
  },
  entry: {
    client: './src/express-service'
  }
}]
