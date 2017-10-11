// Background console logger
var bkg = chrome.extension.getBackgroundPage();

// Intended to be used from a single context menu on selected text or hyperlink of a Twitch User.
// It will construct a single user url for KBMOD's Multistream tool using the first/default layout.
function openInMultiStream(info, tab) {
  var msUrl = "https://multistre.am/";

  if (info.selectionText) {
    msUrl += info.selectionText;
  }
  else if (info.linkUrl) {
    // We're usually expecting the link to be the streamer's twitch url, but lets remove /profile in case.
  	var twitchUser = info.linkUrl.replace('/profile', '');
    twitchUser = twitchUser.substr(twitchUser.lastIndexOf('/') + 1);

  	msUrl += twitchUser;
  }
    
  msUrl += "/layout0";

  chrome.tabs.create({
    url: msUrl
  })
}

// Add the context menu for selections and links.
chrome.contextMenus.create({
  title: "Open in MultiStream",
  contexts: ["selection","link"],
  onclick: openInMultiStream
})


