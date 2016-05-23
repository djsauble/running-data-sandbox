class Data {
  constructor(ui) {
    this.ui = ui;
  }

  /* Initialize the local database and populate with data if empty */
  init() {
    var me = this;
    var user = "ckinamistiongedenterattl";
    var password = "9047d84b808fe51b65ff94624f80acf8f55fcd63";
    me.remoteDB = new PouchDB('https://' + user + ':' + password + '@djsauble.cloudant.com/be7b25ca3682ef8a15682f791c6110648152d7e4');
    me.db = new PouchDB('runs');

    return new Promise(function(resolve, reject) {
      me.db.allDocs().then(function(results) {
        // Only refresh if the cache is empty
        if (results.total_rows == 0) {
          me.refresh().then(function() {
            resolve();
          });
        }
        else {
          resolve();
        }
      });
    });
  }

  /* Refresh the local cache and display new data */
  refresh() {
    console.log("Refreshing cache...");

    var me = this;

    return new Promise(function(resolve, reject) {
      me.db.replicate.from(me.remoteDB).then(function() {
        return me.ui.refresh();
      }).then(function() {
        resolve();
      });
    });
  }
}
