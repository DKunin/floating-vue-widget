'use strict';

let storageBook = new Map();

chrome.storage.sync.get(null, function(items) {
    storageBook = new Map(items.savedProfiles);
});

function persist() {
    chrome.storage.sync.set({ savedProfiles: [...storageBook] }, function() {});
}

function saveFavorite(profileId, data) {
    storageBook.set(profileId, data);
    persist();
}

function unSaveFavorite(profileId) {
    storageBook.delete(profileId);
    persist();
}

function toggleFavorite(profileId, data) {
    if (storageBook.has(profileId)) {
        unSaveFavorite(profileId);
    } else {
        saveFavorite(profileId, data);
    }
}

function getFavorites() {
    return new Promise(resolve => {
        chrome.storage.sync.get(null, function(items) {
            storageBook = new Map(items.savedProfiles);
            let result = [];

            storageBook.forEach((value, key) => {
                const newObj = Object.assign({}, { key }, value);
                result = result.concat([newObj]);
            });

            resolve(result);
        });
    });
}

function getFavorite(profileId) {
    return storageBook.get(profileId);
}

module.exports = {
    saveFavorite,
    unSaveFavorite,
    toggleFavorite,
    getFavorites,
    persist,
    getFavorite
};
