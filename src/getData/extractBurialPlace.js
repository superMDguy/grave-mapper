const fs = require('fs');
const request = require('request-promise-native');

const apiKey = require('../config.js').mapsAPIKey;

const data = require('./fetchedData.json');
const ids = Object.keys(data);

const withBurial = ids.filter(
  id => data[id].burial && data[id].burial.details.place
);
console.log(`${withBurial.length} ancestors have burial location information`);

const promises = withBurial.map(id => {
  const person = data[id];

  const burialPlaceName =
    person.burial.details.place.normalizedText ||
    person.burial.details.place.originalText;
  return request(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
      burialPlaceName
    )}&key=${apiKey}`,
    { json: true }
  )
    .then(res => {
      if (res.status === 'OK') {
        return {
          name: person.name,
          gender: person.gender,
          lifespan: person.fullLifespan,
          id,
          burialDate:
            person.burial.details.date &&
            person.burial.details.date.normalizedText,
          burialPlace: res.results[0].geometry.location
        };
      } else {
        console.log(
          'Trouble parsing person with burial place ',
          person.burial.details.place
        );
      }
    })
    .catch(console.error);
});
Promise.all(promises).then(details => {
  fs.writeFileSync('simplifiedPersonDetails.json', JSON.stringify(details));
  console.log('Wrote file');
});
// console.log(details.filter(detail => detail.burialPlace.match(/minnesota/i)))
