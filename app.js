// Load the app when the page loads
window.onload = function() {
  initApp();
}

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
