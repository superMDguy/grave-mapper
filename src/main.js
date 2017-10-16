import loadGoogleMapsAPI from 'load-google-maps-api'
import { authenticate, getAncestorInfo } from './familySearch.js'

document.body.innerHTML = `<div id="map" style="width: 100vw; height: 100vh"></div>`
const people = []
const apiKey = require('../config.js').mapsAPIKey;


authenticate()
getAncestorInfo()
  .then(ancestors => {
    people.push(...ancestors)
    return loadGoogleMapsAPI({ key: apiKey })
  })
  .then(googleMaps => {
    const map = new googleMaps.Map(document.getElementById('map'), {
      zoom: 3,
      center: { lat: 0, lng: 0 }
    });

    people.filter(p => p).forEach(person => {
      const marker = new googleMaps.Marker({
        position: person.burialPlace,
        map: map
      });

      const personInfo = `<h1>${person.name}</h1>
                            <h2><em>${person.lifespan}</em></h2>
                            <div>
                                <a href="https://www.familysearch.org/tree/person/${person.id}/details">
                                  Family Search Link
                                 </a>
                            </div>`;
      const infowindow = new googleMaps.InfoWindow({ content: personInfo });
      marker.addListener('click', () => infowindow.open(map, marker));
    });
  });
