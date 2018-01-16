(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var setIcon = require('./set-icon.es6');
var storage = require('./storageChrome.es6');

chrome.runtime.onMessage.addListener(function (msg, sender) {
    if (msg.from === 'content' && msg.subject === 'showPageAction') {
        chrome.pageAction.show(sender.tab.id);
    }

    if (msg.from === 'contentscript' && msg.subject === 'addToFavorite') {
        storage.saveFavorite(msg.data.profileId, { name: msg.data.name, items: [] });
    }

    if (msg.from === 'contentscript' && msg.subject === 'removeFromFavorite') {
        storage.unSaveFavorite(msg.data.profileId);
    }

    if (msg.from === 'popup' && msg.subject === 'newInfo') {
        setIcon(sender.tab.id, msg.data);
    }
});

},{"./set-icon.es6":2,"./storageChrome.es6":3}],2:[function(require,module,exports){
'use strict';

function setIcon(tabId, number) {
    var canvas = document.createElement('canvas');
    var img = document.createElement('img');
    var width = 19;
    img.onload = function () {
        canvas.width = width;
        canvas.height = width;

        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 2);
        context.fillStyle = '#ed1d24';
        context.fillRect(width / 2 - 3, width / 2 - 3, width / 2 + 8, width / 2 + 8);
        context.fillStyle = '#fff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = '12px Arial';
        context.fillText(number, width / 2 + 3, width / 2 + 3);
        chrome.pageAction.setIcon({
            imageData: context.getImageData(0, 0, width, width),
            tabId: tabId
        });
    };
    img.src = "images/icon-19.png";
}

module.exports = setIcon;

},{}],3:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var storageBook = new Map();

chrome.storage.sync.get(null, function (items) {
    storageBook = new Map(items.savedProfiles);
});

function persist() {
    chrome.storage.sync.set({ savedProfiles: [].concat(_toConsumableArray(storageBook)) }, function () {});
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
    return new Promise(function (resolve) {
        chrome.storage.sync.get(null, function (items) {
            storageBook = new Map(items.savedProfiles);
            var result = [];

            storageBook.forEach(function (value, key) {
                var newObj = Object.assign({}, { key: key }, value);
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
    saveFavorite: saveFavorite,
    unSaveFavorite: unSaveFavorite,
    toggleFavorite: toggleFavorite,
    getFavorites: getFavorites,
    persist: persist,
    getFavorite: getFavorite
};

},{}]},{},[1]);
