'use strict';

const setIcon = require('./set-icon.es6');
const storage = require('./storageChrome.es6');
const statistics = require('./statistics.es6');

let currentTabUrl;
chrome.runtime.onMessage.addListener(function(msg, sender) {
    if (msg.from === 'content' && msg.subject === 'showPageAction') {
        chrome.pageAction.show(sender.tab.id);
    }

    if (msg.from === 'contentscript' && msg.subject === 'addToFavorite') {
        storage.saveFavorite(msg.data.profileId, {
            name: msg.data.name,
            avatar: msg.data.avatar,
            items: []
        });
        if (currentTabUrl) {
            // updateData(currentTabUrl);
        }
        statistics('addToFavorite');
    }

    if (msg.from === 'contentscript' && msg.subject === 'removeFromFavorite') {
        storage.unSaveFavorite(msg.data.profileId);
        statistics('removeFromFavorite');
    }

    if (msg.from === 'popup' && msg.subject === 'newInfo') {
        setIcon(sender.tab.id, msg.data);
    }
});

function fetchLatest(singleItem, url) {
    // const lastUpdate =
    //     (new Date() - new Date(singleItem.timeStamp)) / 60 < 60;
    // if (lastUpdate) {
    //     return singleItem;
    // }
    const mainUrl = url.match(/https:\/\/.+\.ru/);
    return fetch(
        `${mainUrl[0]}/user/${singleItem.key}/profile/items?shortcut=active&limit=10`
    ).then(res => res.json());
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    currentTabUrl = tab.url;
    if (
        changeInfo.status === 'loading' &&
        currentTabUrl &&
        currentTabUrl.includes('avito')
    ) {
        // updateData(currentTabUrl, true);
    }
    if (
        changeInfo.status === 'complete' &&
        currentTabUrl &&
        currentTabUrl.includes('avito')
    ) {
        // updateData(currentTabUrl);
    }
});

async function updateData(url, localUpdate = false) {
    const items = await storage.getFavorites();
    Promise.all(
        items.map(async singleItem => {
            let updatedItems = [];
            if (localUpdate) {
                updatedItems = { result: { list: singleItem.items } };
            } else {
                updatedItems = await fetchLatest(singleItem, url);
            }

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
                        const simplifiedItem = {
                            id: singleSearchItem.id,
                            url: singleSearchItem.url
                        };
                        if (!exists && doesnExitButOpen) {
                            newButSeen.push(simplifiedItem);
                        }
                        if (!exists && !doesnExitButOpen) {
                            return newArray.concat(simplifiedItem);
                        }
                        return newArray;
                    },
                    []
                );
            }

            const newObj = {
                key: singleItem.key,
                name: singleItem.name,
                avatar: singleItem.avatar,
                items: singleItem.items.concat(newButSeen),
                newItems,
                timeStamp: new Date().getTime()
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

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == 'install') {
        setTimeout(() => {
            statistics('installExtention');
        }, 3000);
    } else if (details.reason == 'update') {
        var thisVersion = chrome.runtime.getManifest().version;
        setTimeout(() => {
           statistics('updateExtention:' + thisVersion);
        }, 3000);
    }
});
