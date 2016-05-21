// Load the app when the page loads
window.onload = function() {
  initApp();
}

var db, remoteDB;

function initApp() {

  // Initialize databases
  initDatabases().then(function() {
    console.log("Ready to go!");

    // Initialize the bits of the UI that should not be active until there's data
    initUI();
  });

  // Pull changes from the remote database
  /*db.replicate.from(remoteDB).then(function () {
    return db.allDocs({include_docs: true});
  }).then(function(results) {

    // Sort the results
    var sorted = results.rows.sort(function(a, b) {
      return (new Date(b.doc.timestamp)).getTime() - (new Date(a.doc.timestamp)).getTime();
    }).map(function(e) { return e.doc });

    // Display the results
    document.writeln("<ul>");
    for (var i in sorted) {
      document.writeln("<li>" + sorted[i].timestamp + "</li>");
    }
    document.writeln("</ul>");
  }).catch(function (err) {
    console.log(err);
  });*/
}

/* Initialize the local database and populate with data if empty */
function initDatabases() {
  var user = "ckinamistiongedenterattl";
  var password = "9047d84b808fe51b65ff94624f80acf8f55fcd63";
  remoteDB = new PouchDB('https://' + user + ':' + password + '@djsauble.cloudant.com/be7b25ca3682ef8a15682f791c6110648152d7e4');
  db = new PouchDB('runs');

  return new Promise(function(resolve, reject) {
    db.allDocs().then(function(results) {
      // If there's data in the local cache, don't fetch new stuff
      if (results.total_rows > 0) {
        refreshDisplay().then(function() {
          resolve();
        });
      }
      else {
        refreshData().then(function() {
          resolve();
        });
      }
    });
  });
}

/* Refresh the local cache and display new data */
function refreshData() {
  console.log("Refreshing cache...");
  return new Promise(function(resolve, reject) {
    db.replicate.from(remoteDB).then(function() {
      return refreshDisplay();
    }).then(function() {
      resolve();
    });
  });
}

/* Display data from the local cache */
function refreshDisplay() {
  console.log("Refreshing display...");
  return new Promise(function(resolve, reject) {
    db.allDocs({include_docs: true}).then(function(results) {
      document.getElementById("title").innerHTML = results.rows.length + " runs";
      resolve();
    });
  });
}

/* Initialize the data-sensitive pieces of the UI */
function initUI() {
  // Wire up the refresh button
  document.getElementById("nav").innerHTML = "<a href='javascript:refreshData();'>Refresh cache</a>";
}
