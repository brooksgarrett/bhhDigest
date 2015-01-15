var reportBody = '';

function addArticle() {
  var site = {};
  var meta = {};

  meta['title'] = title;
  meta['added'] = today.toLocaleDateString();
  site[url] = meta;
  if (typeof snippet != 'undefined') { 
    meta['snippet'] = snippet; 
  } else {
    meta['snippet'] = null;
  }


  chrome.storage.local.set(site, confirmSave);
}

function confirmSave(){
  console.log("Saved " + url);
  setState(true);
}

function confirmRemove(){
  console.log("Removed " + url);
  setState(undefined);
}

function confirmReport(){
  console.log("Report generated. Storage cleared.");
  setState(undefined);
}

function removeArticle() {
  chrome.storage.local.remove(url, confirmRemove);
}

function blockUI(){
  remove.className = "pure-button button-error pure-button-disabled";
  add.className = "pure-button button-success pure-button-disabled";
  report.className = "pure-button button-primary pure-button-disabled";
}

function buildClicked() {
  chrome.storage.local.get(null, function(items) {
    reportBody += 'data:text/html;charset=utf-8,<br />';
    reportBody += '---<br />'
    reportBody += 'layout: default<br />'
    reportBody += 'title: 01/01/2015<br />'
    reportBody += 'categories: [Discovered]<br />'
    reportBody += 'tags: [discovered]<br />'
    reportBody += 'status: published<br />'
    reportBody += 'type: article<br />'
    reportBody += 'published: true<br />'
    reportBody += 'meta:<br />'
    reportBody += '  _edit_last: 1<br />'
    reportBody += '---<br />'
        
    for (var key in items){
      reportBody += '##&nbsp;&nbsp;[' + items[key]['title'] + '](' + key + ')<br /><br />';
      if (items[key]['snippet']){
        reportBody += '&nbsp;&nbsp;>&nbsp;&nbsp;' + items[key]['snippet'] + '<br /><br />';
      }
    }

   window.open(reportBody);
    
  });
}

function confirmClear() {
  console.log('Storage cleared.');
  alert('Storage cleared.');
}

function clearData() {
  var r = confirm("Are you sure you want to delete all saved items?");
  if (r == true) {
       chrome.storage.local.clear(confirmClear);
  } else {
      alert('Aborted!');
  }
  
}

function setState(url) {
  remove.className = "pure-button button-error";
  add.className = "pure-button button-success";
  report.className = "pure-button button-primary";

  if (typeof url == 'undefined') {
      remove.className += " pure-button-disabled";
  } else {
    add.className += " pure-button-disabled";
  }
}

function init() {
  var remove = document.getElementById('remove');
  var add = document.getElementById('add');  
  var report = document.getElementById('report');
  var clear = document.getElementById('clear');
  today = new Date();
  add.addEventListener('click', addArticle);
  remove.addEventListener('click', removeArticle);
  report.addEventListener('click', buildClicked);
  clear.addEventListener('click', clearData);

  chrome.tabs.query({active: true}, function(tabs) {
    title = tabs[0].title;
    url = tabs[0].url;
    chrome.tabs.executeScript( {code: "window.getSelection().toString();"}, function(selection) {
	 if (chrome.runtime.lastError) {
	   /* Report any error */
	   console.log('bhhDigest can\'t be used here');
	 } 
	 else {
	   snippet = selection;
	 }
    });
    chrome.storage.local.get(url, function(obj){
      setState(obj[url]);
    })
  });

  if(typeof(Storage) !== "undefined") {
      // Code for localStorage/sessionStorage.
  } else {
      // Sorry! No Web Storage support..
      alert('No storage available!')
  }
}

document.addEventListener('DOMContentLoaded', function () {
  init();
});
