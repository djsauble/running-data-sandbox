class UI {
  constructor() {
    this.overlays = [];
    this.timers = [];
    this.currentRun = "27bb62d31b5bfee762d1f4d021e95dc800999f12";
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

    // Display the list of runs (and set the current run to the latest run)
    return new Promise(function(resolve, reject) {
      me.data.db.allDocs({include_docs: true}).then(function(results) {
        
        // Sort runs by timestamp
        var sorted = results.rows.map(function(e) {
          e.doc.timestamp = new Date(e.doc.timestamp);
          return e.doc;
        }).sort(function(a, b) { return b.timestamp - a.timestamp; });

        // Display the runs
        var list = "";
        for (var i in sorted) {
          var ts = sorted[i].timestamp;
          var date = /*ts.getHours() + ":" + ts.getMinutes() + " on " + */ts.getMonth() + "/" + ts.getDate() + "/" + (ts.getYear() + 1900);
          list += "<li><a href=\"javascript:App.ui.setRun('" + sorted[i]._id + "');\">" + date + "</a></li>";
        }
        document.getElementById("runs").innerHTML = "<ul>" + list + "</ul>";

        resolve();
      });
    });
  }

  /* Display data from the local cache */
  refresh() {
    console.log("Refreshing display...");

    var me = this;

    return new Promise(function(resolve, reject) {
      me.data.db.allDocs().then(function(results) {

        /* Show the count of runs */
        document.getElementById("title").innerHTML = results.total_rows + " runs";

        /* Show the list of runs */

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

  // Set the current run to that specified
  setRun(id) {
    console.log("Setting current run to " + id);

    this.currentRun = id;
    this.refresh();
  }
}
