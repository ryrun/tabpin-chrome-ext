chrome.windows.onCreated.addListener(
    function (window) {
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
    }
)