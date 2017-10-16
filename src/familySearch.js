import FamilySearch from 'fs-js-lite'
import promisify from 'es6-promisify';

const config = require('../config.js').config

let fsGet = null

export function authenticate() {
    const fs = new FamilySearch({
        environment: config.fsEnvironment,
        appKey: config.fsAppKey,
        redirectUri: `${window.location.origin}/authenticated`,
        saveAccessToken: true,
        requestInterval: 200
    });
    fsGet = promisify(fs.get, fs)

    if (window.location.pathname === '/') {
        fs.oauthRedirect()
    } else if (window.location.pathname === '/authenticated') {
        fs.oauthResponse()
        window.location.href = '/map'
    }
}

export function getAncestorInfo() {
    return fsGet('/platform/users/current')
        .then(res => fsGet(`/platform/tree/ancestry?person=${res.data.users[0].personId}&generations=8`))
        .then(res => {
            const personIds = res.data.persons.map(person => person.id)
            const idLists = [], maxSize = 450;

            while (personIds.length > 0) {
                idLists.push(personIds.splice(0, maxSize));
            }
            const getDetailsPromises = idLists.map(idList => fsGet(`/platform/tree/persons?pids=${idList.join(',')}`))
            return Promise.all(getDetailsPromises)
        })
        .then(results => {
            const persons = [].concat(...results.map(res => res.data.persons))
            const promises = []

            const simplifiedPersons = persons.map(person => {
                const burialInfo = person.facts.find(fact => fact.type.includes("Burial"))

                const simplifiedPerson = {
                    name: person.display.name,
                    id: person.id,
                    gender: person.display.gender,
                    lifespan: person.display.lifespan,
                    burialDate: burialInfo && burialInfo.date && burialInfo.date.normalized[0].value,
                }

                const burialPlaceDesc = burialInfo && burialInfo.place && burialInfo.place.description
                if (burialPlaceDesc) {
                    promises.push(
                        fsGet(`/platform/places/description/${burialInfo.place.description.slice(1)}`)
                            .then(res => {
                                const placeInfo = res.data.places[0]
                                simplifiedPerson.burialPlace = { lat: placeInfo.latitude, lng: placeInfo.longitude }
                            })
                    )
                }

                return simplifiedPerson
            })

            return Promise.all(promises)
                .then(() => simplifiedPersons)
        })
}