'use strict';

const storageBook = new Map(
    JSON.parse(localStorage.getItem('savedProfiles') || '[]')
);

function persist() {
    localStorage.setItem('savedProfiles', JSON.stringify([...storageBook]));
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
    let result = [];
    storageBook.forEach((value, key) => {
        result = result.concat([{ key, ...value }]);
    });

    return result;
}

module.exports = { saveFavorite, unSaveFavorite, toggleFavorite, getFavorites, persist };
