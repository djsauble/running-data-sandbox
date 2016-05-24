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

    /* Display the map */
    me.map = new google.maps.Map(document.getElementById('output'), {
      disableDefaultUI: true,
      draggable: false
    });

    // Refresh the display
    me.refresh();
  }

  /* Display data from the local cache */
  refresh() {
    console.log("Refreshing display...");

    var runId = "e4f83f6cbbeaa72e3e27da94824d416a74bb5953";
    var me = this;

    return new Promise(function(resolve, reject) {
      me.data.db.allDocs().then(function(results) {

        /* Show the count of runs */
        document.getElementById("title").innerHTML = results.total_rows + " runs";

        return me.data.db.get(runId, {attachments: true});
      }).then(function(doc) {

        /* Convert the data to a usable format */
        var data = JSON.parse(
             atob(
               doc._attachments["data.json"]["data"]
             )
           );

        /* Construct the run route */
        var coords = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i in data) {
          var coord = new google.maps.LatLng({
            lat: parseFloat(data[i]["latitude"]),
            lng: parseFloat(data[i]["longitude"])
          });
          coords.push(coord);
          bounds.extend(coord);
        }

        /* Create a path */
        var path = new google.maps.Polyline({
          path: coords,
          geodesic: true,
          strokeColor: '#ff0000',
          strokeOpacity: 0.7,
          strokeWeight: 2
        });

        /* Show the path */
        path.setMap(me.map);
        me.map.fitBounds(bounds);

        resolve();
      });
    });
  }
}
