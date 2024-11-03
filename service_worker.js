chrome.windows.onCreated.addListener(
    function (window) {
        setTimeout(function () {
            chrome.storage.sync.get(
                {urls: ''},
                (items) => {
                    let urls = items.urls.split(/\r\n|\r|\n/g);
                    //check global pinned tabs
                    chrome.tabs.query(
                        {
                            pinned: true
                        },
                        function (tab) {
                            if (
                                (tab.length === urls.length && tab[0].windowId === window.id) ||
                                (tab.length > 0 && tab[0].windowId === window.id) ||
                                (tab.length === 0)
                            ) {
                                chrome.tabs.query(
                                    {
                                        pinned: true,
                                        windowId: window.id
                                    },
                                    function (tab) {
                                        var i = 0;
                                        tab.forEach(function (tab) {
                                            if (i > tab.length) {
                                                chrome.tabs.remove(tab.id)
                                            } else {
                                                chrome.tabs.update(tab.id, {url: urls[i]})
                                                i++;
                                            }
                                        });
                                        console.log(i + ' pinned Tabs');
                                        for (; i < urls.length; i++) {
                                            chrome.tabs.create({url: urls[i], pinned: true, windowId: window.id})
                                        }
                                        console.log(urls.length - i + ' new pinned Tabs created!');
                                    }
                                );
                            }
                        }
                    );
                }
            );
        }, 5000);
    }
)

chrome.contextMenus.create({
    id: 'openInSafari',
    title: 'Open in Safari ...',
    contexts: ['page'],
    documentUrlPatterns: ["http://*/*", "https://*/*"]
});
chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'openInSafari') {
        chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        }, function (tabs) {
            // and use that tab to fill in out title and url
            var tab = tabs[0];
            chrome.tabs.create({url: 'x-safari-' + tab.url})
        });
    }
});

chrome.omnibox.setDefaultSuggestion({
    description: "Search via ChatGPT"
});

chrome.omnibox.onInputEntered.addListener((text) => {
    const processedText = encodeURIComponent(text);
    const newURL = `https://chatgpt.com/?hints=search&q=${processedText}`;

    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if (new URL(tab.url).hostname.includes("chatgpt.com") && tab.pinned) {
                chrome.tabs.update(tab.id, {url: newURL, active: true}, () => {
                    chrome.windows.update(tab.windowId, {focused: true});
                });
            }
        });
    });
});