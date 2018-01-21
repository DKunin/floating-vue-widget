'use strict';

const setIcon = require('./set-icon.es6');
const storage = require('./storageChrome.es6');

let currentUrl;

chrome.runtime.onMessage.addListener(function(msg, sender) {
    if (msg.from === 'content' && msg.subject === 'showPageAction') {
        chrome.pageAction.show(sender.tab.id);
    }

    if (msg.from === 'contentscript' && msg.subject === 'addToFavorite') {
        storage.saveFavorite(msg.data.profileId, {
            name: msg.data.name,
            items: []
        });
    }

    if (msg.from === 'contentscript' && msg.subject === 'removeFromFavorite') {
        storage.unSaveFavorite(msg.data.profileId);
    }

    if (msg.from === 'popup' && msg.subject === 'newInfo') {
        setIcon(sender.tab.id, msg.data);
    }
});

function fetchLatest(singleItem, url) {
    const lastUpdate =
        (new Date() - new Date(singleItem.timeStamp)) / 1000 / 60 < 3;

    console.log(lastUpdate, singleItem.timeStamp);
    if (true && lastUpdate) {
        return singleItem;
    }
    const mainUrl = url.match(/https:\/\/.+\.ru/);
    return fetch(
        `${mainUrl[0]}/user/${singleItem.key}/profile/items?shortcut=active&limit=100`
    ).then(res => res.json());
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log(tab.url);
    if (changeInfo.status === 'complete' && tab.url.includes('avito')) {
        currentUrl = tab.url;
        updateData(currentUrl);
    }
});

async function updateData(url) {
    const items = await storage.getFavorites();

    Promise.all(
        items.map(async singleItem => {
            const updatedItems = await fetchLatest(singleItem, url);
            let newItems = [];
            let newButSeen = [];
            if (
                updatedItems.result &&
                updatedItems.result.list.length !== singleItem.items.length
            ) {
                newItems = updatedItems.result.list.reduce(
                    (newArray, singleSearchItem) => {
                        const exists = singleItem.items.find(
                            singleExistingItem => {
                                return (
                                    singleExistingItem.id ===
                                    singleSearchItem.id
                                );
                            }
                        );

                        const doesnExitButOpen = url.includes(
                            singleSearchItem.url
                        );

                        if (!exists && doesnExitButOpen) {
                            newButSeen.push(singleSearchItem);
                        }
                        if (!exists && !doesnExitButOpen) {
                            return newArray.concat(singleSearchItem);
                        }
                        return newArray;
                    },
                    []
                );
            }

            const newObj = {
                key: singleItem.key,
                name: singleItem.name,
                items: singleItem.items.concat(newButSeen),
                newItems,
                timeStamp: new Date()
            };
            storage.saveFavorite(singleItem.key, newObj);
            return newObj;
        })
    ).then(result => {
        const newOnes =
            result.reduce(
                (newArray, singleItem) => newArray.concat(singleItem.newItems),
                []
            ).length || 0;
        chrome.storage.sync.set({ newOnes: newOnes });
    });
}
