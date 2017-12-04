'use strict';

const storageBook = new Map();

function saveFavorite(profileId, name) {
    storageBook.set(profileId, name);
}

function unSaveFavorite(profileId) {
    storageBook.delete(profileId);
}

function toggleFavorite() {}

function getFavorites() {
    const result = [];
    storageBook.forEach((value, key) => {
        result.concat([{ [key]: { name: value } }]);
    });
    return result;
}

module.exports = { saveFavorite, unSaveFavorite, toggleFavorite, getFavorites };
