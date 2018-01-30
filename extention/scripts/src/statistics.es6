'use strict';

const Fingerprint2 = require('fingerprintjs2');
let fingerPrintHash;
new Fingerprint2().get(result => {
    fingerPrintHash = result;
});

function sendStatisticsEvent(eventName) {
    fetch(
        'https://maker.ifttt.com/trigger/fav_log/with/key/HKrStoNtyo4ZkJGmOw9p1',
        {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                value1: eventName,
                value2: fingerPrintHash,
                value3: new Date().getTime()
            })
        }
    )
        .then(res => res.text())
        .then(console.log);
}

module.exports = sendStatisticsEvent;
