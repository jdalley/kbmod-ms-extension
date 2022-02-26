/*  
  All KBMOD MultiStream code reference/influence and icon usage belongs to KBMOD - www.kbmod.com.

  This tool is intended to provide a few shortcuts for those who still use the main Twitch TV 
  website, but would like to quickly and easily switch to KBMOD MultiStream from either a single
  channel (via hyperlink context menu), or up to 6 channels via the Extension button popup.
  
  @jeffdalley
*/

// Run as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  // Set onclick functions for all add/remove/input elements.
  // Have to do it this way due to extension rules against inline onclick code.
  let addStreamerButtons = document.getElementsByClassName('add-streamer-button');
  let removeStreamerButtons = document.getElementsByClassName('remove-streamer-button');
  let streamInputs = document.getElementsByClassName('stream-input');

  // Same number of elements, apply events in one pass.
  let numAddButtons = addStreamerButtons.length;
  for (let i = 0; i < numAddButtons; i++) {
  	addStreamerButtons[i].onclick = setCurrentStreamerName;
  	removeStreamerButtons[i].onclick = clearCurrentStreamerName;
  	streamInputs[i].onkeyup = saveStreams;

  	// Load saved values if any...
    loadStreamValue(i);
  }

  // Set onclick for Open MultiStream button
  let openMultiStreamButton = document.getElementById('openMsButton');
  openMultiStreamButton.onclick = openMultiStream;

  // Hook up more details click open/collapse event
  $('.row .btn').on('click', function(e) {
    e.preventDefault();
    let $this = $(this);
    let $collapse = $this.closest('.collapse-group').find('.collapse');
    $collapse.collapse('toggle');
  });
});

// Sets a given Streamer username from the current tab:
// Only intended to work if current tab is on a streamer's twitch page or profile.
function setCurrentStreamerName(e) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true},
    function(arrayOfTabs) {
  	  let currTab = arrayOfTabs[0];

      if (currTab.url.indexOf("twitch.tv") > -1) {
        let streamId = e.target.id.slice(-1);
        let streamInput = document.getElementById("stream" + streamId);

    	  let twitchUser = currTab.url.replace('/profile', '');
        twitchUser = twitchUser.substr(twitchUser.lastIndexOf('/') + 1);
        streamInput.value = twitchUser;

        saveStreams(e);
      }
    }
  );
}

// Save a given streamer username to storage.
function saveStreams(e) {
  let streamId = "stream" + e.target.id.slice(-1);
  let streamInput = document.getElementById(streamId);

  let obj = {};
  obj[streamId] = streamInput.value;
  chrome.storage.sync.set(obj, function () {
    return false;
  });
}

// Retrieve and set a given streamer username from storage.
function loadStreamValue(streamIndex) {
  let streamId = "stream" + streamIndex;
  let streamInput = document.getElementById(streamId);
  
  chrome.storage.sync.get(streamId, function (data) {
    if (data[streamId]) {
      streamInput.value = data[streamId];
    }
  })
}

// Clear a given streamer username input box.
function clearCurrentStreamerName(e) {
  let streamToClear = document.getElementById("stream" + e.target.id.slice(-1));
  streamToClear.value = '';
  saveStreams(e);
}

// Construct a KBMOD MultiStream link from filled-in streamer usernames.
function openMultiStream() {
  let msUrl = "https://multistre.am/";
  
  let inputs = document.getElementsByClassName('stream-input');
  let numInputs = inputs.length;

  for (let i = 0; i < numInputs; i++) {
  	if (inputs[i].value) {
      msUrl += inputs[i].value + "/";
  	}
  }  

  // Just default to layout0
  msUrl += "layout0";

  // Launch a new chrome tab with the newly constructed KBMOD MS Url.
  chrome.tabs.create({
    url: msUrl
  })
}

