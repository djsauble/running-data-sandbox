class UI {
  constructor() {
    this.overlays = [];
    this.timers = [];
  }

  /* Initialize the UI */
  init(data) {
    var me = this;
    me.data = data;

    // Configure event handlers
    document.getElementById("input").addEventListener('input', function() {
      me.refresh();
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

    var me = this;

    return new Promise(function(resolve, reject) {
      me.data.db.allDocs().then(function(results) {

        /* Show the count of runs */
        document.getElementById("title").innerHTML = results.total_rows + " runs";

        /* Run the custom code */
        eval(document.getElementById("input").value);
      });
    });
  }

  /*******************************************
   * Helper methods for users of the sandbox *
   *******************************************/

  // Add an overlay to the map
  addOverlay(overlay) {
    overlay.setMap(this.map);
    this.overlays.push(overlay);
  }

  // Remove all overlays from the map
  removeAllOverlays() {
    for (var i in this.overlays) {
      this.overlays[i].setMap(null);
    }
    this.overlays = [];
  }

  // Get an array of coordinates
  getCoordinates(data) {
    var coords = [];

    for (var i in data) {
      coords.push(new google.maps.LatLng({
        lat: parseFloat(data[i]["latitude"]),
        lng: parseFloat(data[i]["longitude"])
      }));
    }

    return coords;
  }

  // Set the map to the given path boundaries
  setBoundaries(coords) {
    var bounds = new google.maps.LatLngBounds();

    for (var i in coords) {
      bounds.extend(coords[i]);
    }

    this.map.fitBounds(bounds);
  }

  // Get the run data from the given document (convert from base-64 to JSON)
  getRun(doc) {
    return JSON.parse(
       atob(
         doc._attachments["data.json"]["data"]
       )
     );
  }

  // Animate a function
  startAnimation(expression, interval) {
    var timerId = setInterval(expression, interval);
    this.timers.push(timerId);
    return timerId;
  }

  // Stop a specific animation
  stopAnimation(id) {
    var index = this.timers.indexOf(id);
    if (index >= 0) {
      clearInterval(this.timers[index]);
    }
    this.timers.splice(index, 1);
  }

  // Stop animations
  stopAnimations() {
    for (var i in this.timers) {
      clearInterval(this.timers[i]);
    }
    this.timers = [];
  }
}
