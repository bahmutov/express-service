!(function startExpressService (root) {
  'use strict'

  const la = require('lazy-ass')
  const is = require('check-more-types')

  if (!root.navigator) {
    console.error('Missing navigator')
    return
  }

  if (!root.navigator.serviceWorker) {
    console.error('Sorry, not ServiceWorker feature, maybe enable it?')
    console.error('http://jakearchibald.com/2014/using-serviceworker-today/')
    return
  }

  function getCurrentScriptFolder () {
    var scriptEls = document.getElementsByTagName('script')
    var thisScriptEl = scriptEls[scriptEls.length - 1]
    var scriptPath = thisScriptEl.src
    return scriptPath.substr(0, scriptPath.lastIndexOf('/') + 1)
  }

  var serviceScriptUrl = getCurrentScriptFolder() + 'service.js'
  var scope = '/'

  function registeredWorker (registration) {
    la(registration, 'missing service worker registration')
    la(registration.active, 'missing active service worker')
    la(is.fn(registration.active.postMessage),
      'expected function postMessage to communicate with service worker')

    console.log('express-service working...')

    registration.active.onmessage = function messageFromServiceWorker (e) {
      console.log('received message from the service worker', e)
    }
  }

  function onError (err) {
    if (err.message.indexOf('missing active') !== -1) {
      // the service worker is installed
      window.location.reload()
    } else {
      console.error('express service error', err)
    }
  }

  root.navigator.serviceWorker.register(serviceScriptUrl, { scope: scope })
    .then(registeredWorker)
    .catch(onError)
}(window))
