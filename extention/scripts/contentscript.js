'use strict';

const title = document.querySelector('[data-marker="profilePublic/name"]') || {};

if (title && title.appendChild) {
    // var a = document.createElement('a');
    // a.innerText = 'Добавить продавца в избранное';
    // a.className = 'button button-origin';
    // a.style = 'margin: 0 10px;';
    // a.addEventListener('click', function(e) {
    //     chrome.runtime.sendMessage({
    //         from: 'contentscript',
    //         subject: 'addToFavorite',
    //         data: { name: title.innerText, url: window.location.href }
    //     });
    //     chrome.runtime.sendMessage({
    //         from: 'content',
    //         subject: 'showPageAction'
    //     });
    // })
    // title.appendChild(a);
}

chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction'
});

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    if (msg.from === 'popup' && msg.subject === 'DOMInfo') {
        response({ name: title.innerText, url: window.location.href });
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

setInterval(updateIcon, 3000);
