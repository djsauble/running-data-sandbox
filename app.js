// Load the app when the page loads
window.onload = function() {
  initApp();
}

var db, remoteDB;

function initApp() {

  // Initialize databases
  initDatabases();

  // Pull changes from the remote database
  db.replicate.from(remoteDB).then(function () {
    return db.allDocs({include_docs: true});
  }).then(function(results) {

    // Sort the results
    var sorted = results.rows.sort(function(a, b) {
      return (new Date(b.doc.timestamp)).getTime() - (new Date(a.doc.timestamp)).getTime();
    }).map(function(e) { return e.doc });

    // Display the results
    document.writeln("<h1>" + sorted.length + " runs</h1>");
    document.writeln("<ul>");
    for (var i in sorted) {
      document.writeln("<li>" + sorted[i].timestamp + "</li>");
    }
    document.writeln("</ul>");
  }).catch(function (err) {
    console.log(err);
  });
}

function initDatabases() {
  var user = "ckinamistiongedenterattl";
  var password = "9047d84b808fe51b65ff94624f80acf8f55fcd63";
  remoteDB = new PouchDB('https://' + user + ':' + password + '@djsauble.cloudant.com/be7b25ca3682ef8a15682f791c6110648152d7e4');
  db = new PouchDB('runs');
}
