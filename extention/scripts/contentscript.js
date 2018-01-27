'use strict';

const title =
    document.querySelector('[data-marker="profilePublic/name"]') || {};
const place = document.querySelector('[data-marker="profilePublic/address"]') || {};
const image = document.querySelector('[data-marker="avatar/image"]') || {};
let favoriteButton;

function profileId(url) {
    const profileIdString = url.match(/\/\w+\/profile/g);
    const profileId = profileIdString
        ? profileIdString[0].replace('profile', '').replace(/\//g, '')
        : '';
    return profileId;
}

const ADD_TO_FAVORITES = 'Добавить продавца в избранное';

const EMPTY_STAR = '<svg width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><path stroke="#0AF" stroke-width="7.2%" fill="#fff" d="M6.162 16.876c-.325.194-.45.143-.363-.22l.993-4.588c.038-.153.02-.212-.102-.315l-3.517-3.16c-.289-.243-.206-.317.173-.346l4.692-.566c.16-.012.248-.076.31-.221l1.94-4.202c.145-.344.256-.344.402 0l1.968 4.202c.061.145.15.209.31.221l4.677.566c.379.03.476.06.187.303l-3.517 3.203c-.122.103-.14.162-.102.315l1.042 4.581c.088.363-.102.442-.426.248l-4.155-2.293c-.137-.082-.206-.082-.343 0l-4.17 2.272z"></path></svg>'
const FULL_STAR = '<svg width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><path stroke="#0AF" stroke-width="7.2%" fill="#0AF" d="M6.162 16.876c-.325.194-.45.143-.363-.22l.993-4.588c.038-.153.02-.212-.102-.315l-3.517-3.16c-.289-.243-.206-.317.173-.346l4.692-.566c.16-.012.248-.076.31-.221l1.94-4.202c.145-.344.256-.344.402 0l1.968 4.202c.061.145.15.209.31.221l4.677.566c.379.03.476.06.187.303l-3.517 3.203c-.122.103-.14.162-.102.315l1.042 4.581c.088.363-.102.442-.426.248l-4.155-2.293c-.137-.082-.206-.082-.343 0l-4.17 2.272z"></path></svg>'

if (title && title.appendChild) {
    const sellerName = title.innerText;
    const sellerPlace = place.innerText;
    const avatar = image.style.backgroundImage;
    favoriteButton = document.createElement('a');
    // favoriteButton.innerText = ADD_TO_FAVORITES;
    favoriteButton.innerHTML = EMPTY_STAR;
    favoriteButton.className = '';
    favoriteButton.style = 'margin: 0 10px;';
    favoriteButton.addEventListener('click', function(e) {
        // if (favoriteButton.innerText === ADD_TO_FAVORITES) {
        if (favoriteButton.innerHTML === EMPTY_STAR) {
            chrome.runtime.sendMessage({
                from: 'contentscript',
                subject: 'addToFavorite',
                data: {
                    name: `${sellerName} ${sellerPlace}`,
                    avatar,
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
        const allIds = (items.savedProfiles || []).map(
            singleArr => singleArr[0]
        );
        const alreadySaved = allIds.filter(singleId =>
            window.location.href.includes(singleId)
        );
        if (favoriteButton) {
            if (alreadySaved.length) {
                favoriteButton.innerHTML = FULL_STAR;
            } else {
                favoriteButton.innerHTML = EMPTY_STAR;
            }
        }
    });
}

chrome.storage.onChanged.addListener(updateButtonText);

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    if (msg.from === 'popup' && msg.subject === 'DOMInfo') {
        response({ url: window.location.href });
    }
});

function updateIcon() {
    chrome.storage.sync.get(null, function(items) {
        chrome.runtime.sendMessage({
            from: 'popup',
            subject: 'newInfo',
            data: items.newOnes
        });
    });
}

// setInterval(updateIcon, 3000);
