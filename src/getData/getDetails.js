const fs = require('fs');
const request = require('request-promise-native');

const config = require('../../config.js').config;
const personIds = require('./familyData.json');

const fileName = 'fetchedData.json';
fs.appendFileSync(fileName, '{\n\t');

let currentIndex = 0;

getNextPerson();

function getNextPerson() {
  if (currentIndex < personIds.length) {
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
        console.info('Got details for', data.name);
        fs.appendFileSync(
          fileName,
          `"${data.id}": ${JSON.stringify(data)},\n\t`
        );

        setTimeout(getNextPerson, 3500);
      })
      .catch(err => {
        console.error('Error!', err);
        process.exit(1);
      });
  }
}
