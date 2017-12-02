'use strict';

// Append hook for Vue instance
const menuNode = document.querySelector('.chrome-chrome');
const div = document.createElement('div');
div.className = 'reviewer-suggester';
menuNode.appendChild(div, menuNode.firstChild);

var Vue = require('vue');
var App = require('./app.vue');

// const title = document.querySelector('[data-marker="profilePublic/name"]');
// const button = document.createElement('button');
// button.innerText = 'избр';
// title.appendChild(button);

Vue.config.devtools = true;
new Vue({
    el: '.reviewer-suggester',
    render(createElement) {
        return createElement(App);
    }
});

// Append vue script
// const vuescript = document.createElement('script');
// vuescript.src = 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.2/vue.min.js';
// const head = document.querySelector('head');
// head.appendChild(vuescript);
