const fs = require('fs');
const request = require('request-promise-native');

const config = require('../../config.js').config;

const fileName = 'fetchedData.json';

function getAncestorsPersonIds() {
  const uri = `https://www.familysearch.org/tree/proxy/tree-data/portrait-pedigree/flat/${config.rootPersonId}?numGenerations=9`
  return request({
    method: 'GET',
    uri,
    headers: {
      accept: 'application/json',
      authorization: config.auth,
      cookie: config.cookie,
      dnt: 1
    },
    json: true
  }).then(res => Object.keys(res.persons))
    .catch(console.error)
}

getAncestorsPersonIds().then(personIds => {
  console.log(`Getting details for ${personIds.length} person ids`)
  let currentIndex = 0;

  const fetchedPeople = []
  getNextPerson();

  function getNextPerson() {
    if (currentIndex < 5) {
      let uri = `https://www.familysearch.org/tree/v8/proxy/tree-data/v8/person/${personIds[
        currentIndex++
      ]}/card?locale=en`;
      request({
        method: 'GET',
        uri,
        headers: {
          accept: 'application/json',
          authorization: config.auth,
          cookie: config.cookie,
          dnt: 1
        },
        json: true
      })
        .then(data => {
          console.log('Got details for', data.name);
          fetchedPeople.push(data)

          setTimeout(getNextPerson, 3500);
        })
        .catch(err => {
          console.error('Error!', err);
          process.exit(1);
        });
    } else {
      console.log(`Done! Dumping data to file ${fileName}`)
      fs.writeFileSync(fileName, JSON.stringify(fetchedPeople))
    }
  }
})
