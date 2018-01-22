function setIcon(tabId, number) {
    var canvas = document.createElement('canvas');
    var img = document.createElement('img');
    const width = 19;
    img.onload = function () {
        if (number) {
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
        }
    };
    img.src = "images/icon-19.png";
}

module.exports = setIcon;