'use strict';
// Append hook for Vue instance
const menuNode = document.querySelector('.pull-request-description');
const div = document.createElement('div');
div.className = 'reviewer-suggester';
menuNode.appendChild(div, menuNode.firstChild);

var Vue = require('vue');
var App = require('./app.vue');
Vue.config.devtools = true;
new Vue({
    el: '.reviewer-suggester',
    render: function(createElement) {
        return createElement(App);
    }
});

// Append vue script
// const vuescript = document.createElement('script');
// vuescript.src = 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.2/vue.min.js';
// head.appendChild(vuescript); 