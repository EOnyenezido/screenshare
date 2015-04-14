var IMG_FORMAT = 'jpeg';
var IMG_MIMETYPE = 'image/' + IMG_FORMAT;
var IMG_QUALITY = 80;
var SEND_INTERVAL_MS = 250;
var ws = null;
var intervalId = null;
var VIEWER_TAB_ID = null;

chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 100]});

function captureAndSendTab() {
  // captureVisibleTab only returns a dataURL. Need to convert it to a blob myself
  var opts = {
    format: IMG_FORMAT,
    quality: IMG_QUALITY
  };

  chrome.tabs.captureVisibleTab(null, opts, function(dataUrl) {
    send(convertDataURIToBlob(dataUrl, IMG_MIMETYPE));
  });
}

chrome.browserAction.onClicked.addListener(function(tab) {
  if (!intervalId) {
    ws = connect();

    if (!VIEWER_TAB_ID) {
      chrome.tabs.create({url: 'viewer.html'}, function(tab) {
        VIEWER_TAB_ID = tab.id;
      });
      return;
    }

    chrome.browserAction.setBadgeText({text: 'ON'});

    // Sending the blob every 250ms.
    intervalId = setInterval(function() {
      if (ws.bufferedAmount == 0) {
        captureAndSendTab();
      }
    }, SEND_INTERVAL_MS); // How do I increase this frame rate?
  } else {
    clearInterval(intervalId);
    chrome.browserAction.setBadgeText({text: ''});
    send({cmd: 'DONE'});
    intervalId = null;
    ws = null;
  }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  if (tabId == VIEWER_TAB_ID) {
    VIEWER_TAB_ID = null;
  }
});