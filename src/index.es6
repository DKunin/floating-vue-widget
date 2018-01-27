'use strict';

const menuNode = document.querySelector('body');
const div = document.createElement('div');
div.className = 'favorite-profiles';
menuNode.appendChild(div, menuNode.firstChild);
const Vue = require('vue');
const App = require('./app.vue');

function loadTab(href) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, { url: href });
    });
}

function getCurrentUrl() {
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { from: 'popup', subject: 'DOMInfo' },
            function({ url } = { url: '' }) {
                mainApp.$set(mainApp, 'url', url);
            }
        );
    });
}

const mainApp = new Vue({
    el: '.favorite-profiles',
    data() {
        return {
            url: '',
            loadTab,
            getCurrentUrl,
            profileName: ''
        };
    },
    render(createElement) {
        return createElement(App);
    }
});
