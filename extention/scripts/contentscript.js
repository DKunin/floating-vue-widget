'use strict';

chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction'
});

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    if (msg.from === 'popup' && msg.subject === 'DOMInfo') {
        const title =
            document.querySelector('[data-marker="profilePublic/name"]') || {};
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