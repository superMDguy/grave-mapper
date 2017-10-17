import loadGoogleMapsAPI from 'load-google-maps-api'
import { authenticate, getAncestorInfo } from './familySearch.js'
import { initializeMap } from './googleMaps.js'

import { config } from '../config.js'
import loaderCss from './loader.css'
import mainCss from './styles.css'

document.body.innerHTML = require('./map.html')
const people = []

authenticate()
getAncestorInfo()
  .then(ancestors => {
    people.push(...ancestors)
    return loadGoogleMapsAPI({ key: config.mapsAPIKey })
  })
  .then(googleMaps => initializeMap(googleMaps, people))
