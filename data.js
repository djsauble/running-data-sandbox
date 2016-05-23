var db, remoteDB;

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
