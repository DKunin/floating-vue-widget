"use strict";chrome.runtime.onInstalled.addListener(function(o){console.log("previousVersion",o.previousVersion)}),chrome.tabs.onUpdated.addListener(function(o){chrome.pageAction.show(o)}),console.log("'Allo 'Allo! Event Page for Page Action");
//# sourceMappingURL=background.js.map
