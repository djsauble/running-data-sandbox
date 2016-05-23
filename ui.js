class UI {
  constructor() {
  }

  /* Initialize the UI */
  init(data) {
    var me = this;
    me.data = data;

    // Configure event handlers
    document.getElementById("input").addEventListener('input', function(cmp) {
      eval(cmp.target.value);
    });

    // Wire up the refresh button
    document.getElementById("nav").innerHTML = "<a href='javascript:App.data.refresh();'>Refresh cache</a>";

    // Refresh the display
    me.refresh();

    // Fetch data and initialize the map
    return new Promise(function(resolve, reject) {
      me.data.db.allDocs({include_docs: true, attachments: true, limit: 1}).then(function(results) {

        /* Calculate the the center of the map */
        var data = JSON.parse(
                     atob(
                       results.rows[0].doc._attachments["data.json"]["data"]
                     )
                   );
        var lat = parseFloat(data[0]["latitude"]);
        var lng = parseFloat(data[0]["longitude"]);

        /* Display the map */
        me.map = new google.maps.Map(document.getElementById('output'), {
          center: {lat: lat, lng: lng},
          zoom: 12,
          disableDefaultUI: true,
          draggable: false
        });
      });
    });
  }

  /* Display data from the local cache */
  refresh() {
    console.log("Refreshing display...");

    var me = this;

    return new Promise(function(resolve, reject) {
      me.data.db.allDocs({include_docs: true}).then(function(results) {
        document.getElementById("title").innerHTML = results.rows.length + " runs";
        resolve();
      });
    });
  }
}
