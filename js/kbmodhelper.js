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
  var addStreamerButtons = document.getElementsByClassName('addStreamerButton');
  var removeStreamerButtons = document.getElementsByClassName('removeStreamerButton');
  var streamInputs = document.getElementsByClassName('streamInput');

  // Same number of elements, apply events in one pass.
  var numAddButtons = addStreamerButtons.length;
  for (var i = 0; i < numAddButtons; i++) {
  	addStreamerButtons[i].onclick = setCurrentStreamerName;
  	removeStreamerButtons[i].onclick = clearCurrentStreamerName;
  	streamInputs[i].onkeyup = saveStreams;

  	// Load saved values if any...
    loadStreamValue(i);
  }

  // Set onclick for Open MultiStream button
  var openMultiStreamButton = document.getElementById('openMsButton');
  openMultiStreamButton.onclick = openMultiStream;

  // Hook up more details click open/collapse event
  $('.row .btn').on('click', function(e) {
    e.preventDefault();
    var $this = $(this);
    var $collapse = $this.closest('.collapse-group').find('.collapse');
    $collapse.collapse('toggle');
  });
});

// Sets a given Streamer username from the current tab:
// Only intended to work if current tab is on a streamer's twitch page or profile.
function setCurrentStreamerName(e) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true},
    function(arrayOfTabs) {
  	  var currTab = arrayOfTabs[0];

      if (currTab.url.indexOf("twitch.tv") > -1) {
        var streamId = e.target.id.slice(-1);
        var streamInput = document.getElementById("stream" + streamId);

    	  var twitchUser = currTab.url.replace('/profile', '');
        twitchUser = twitchUser.substr(twitchUser.lastIndexOf('/') + 1);
        streamInput.value = twitchUser;

        saveStreams(e);
      }
    }
  );
}

// Save a given streamer username to storage.
function saveStreams(e) {
  var streamId = "stream" + e.target.id.slice(-1);
  var streamInput = document.getElementById(streamId);

  var obj = {};
  obj[streamId] = streamInput.value;
  chrome.storage.sync.set(obj, function () {
    return false;
  });
}

// Retrieve and set a given streamer username from storage.
function loadStreamValue(streamIndex) {
  var streamId = "stream" + streamIndex;
  var streamInput = document.getElementById(streamId);
  
  chrome.storage.sync.get(streamId, function (data) {
    if (data[streamId]) {
      streamInput.value = data[streamId];
    }
  })
}

// Clear a given streamer username input box.
function clearCurrentStreamerName(e) {
  var streamToClear = document.getElementById("stream" + e.target.id.slice(-1));
  streamToClear.value = '';
  saveStreams(e);
}

// Construct a KBMOD MultiStream link from filled-in streamer usernames.
function openMultiStream() {
  var msUrl = "https://multistre.am/";
  
  var inputs = document.getElementsByClassName('streamInput');
  var numInputs = inputs.length;

  for (var i = 0; i < numInputs; i++) {
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

