'use strict';

const title =
    document.querySelector('[data-marker="profilePublic/name"]') || {};
let favoriteButton;

function profileId(url) {
    const profileIdString = url.match(/\/\w+\/profile/g);
    const profileId = profileIdString ? profileIdString[0].replace('profile', '').replace(/\//g, '') : '';
    return profileId;
}

const ADD_TO_FAVORITES = 'Добавить продавца в избранное';
if (title && title.appendChild) {
    const sellerName = title.innerText;
    favoriteButton = document.createElement('a');
    favoriteButton.innerText = ADD_TO_FAVORITES;
    favoriteButton.className = 'button button-origin';
    favoriteButton.style = 'margin: 0 10px;';
    favoriteButton.addEventListener('click', function(e) {
        if (favoriteButton.innerText === ADD_TO_FAVORITES) {
            chrome.runtime.sendMessage({
                from: 'contentscript',
                subject: 'addToFavorite',
                data: {
                    name: sellerName,
                    profileId: profileId(window.location.href)
                }
            });
        } else {
            chrome.runtime.sendMessage({
                from: 'contentscript',
                subject: 'removeFromFavorite',
                data: {
                    profileId: profileId(window.location.href)
                }
            });
        }
    });
    title.appendChild(favoriteButton);
    updateButtonText();
}

chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction'
});

function updateButtonText() {
    chrome.storage.sync.get(null, function(items) {
        const allIds = (items.savedProfiles || []).map(singleArr => singleArr[0]);
        const alreadySaved = allIds.filter(singleId => window.location.href.includes(singleId));
        if (alreadySaved.length) {
            favoriteButton.innerText = 'Удалить продавца из избранного';
        } else {
            favoriteButton.innerText = 'Добавить продавца в избранное';
        }
    });

}

chrome.storage.onChanged.addListener(function(changes, namespace) {
    updateButtonText();
});

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    if (msg.from === 'popup' && msg.subject === 'DOMInfo') {
        response({ name: title, url: window.location.href });
    }
});

// function updateIcon() {
//     chrome.storage.sync.get(null, function(items) {
//         chrome.runtime.sendMessage({
//             from: 'popup',
//             subject: 'newInfo',
//             data: items.newOnes
//         });
//     });
// }

// setInterval(updateIcon, 3000);
