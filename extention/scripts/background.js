

chrome.runtime.onMessage.addListener(function(msg, sender) {
    if (msg.from === 'content' && msg.subject === 'showPageAction') {
        chrome.pageAction.show(sender.tab.id);
    }

    if (msg.from === 'popup' && msg.subject === 'newInfo') {
        setPageActionIcon(sender.tab.id, msg.data);
    }
});

function setPageActionIcon(tabId, number) {
    var canvas = document.createElement('canvas');
    var img = document.createElement('img');
    const width = 19;
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
            tabId
        });
    };
    img.src = "images/icon-19.png";
}