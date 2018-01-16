'use strict';

const setIcon = require('./set-icon.es6');
const storage = require('./storageChrome.es6');

chrome.runtime.onMessage.addListener(function(msg, sender) {
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


