class UI {
  constructor() {
    this.overlays = [];
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

  /* Helper methods for users of the sandbox */

  addOverlay(overlay) {
    overlay.setMap(this.map);
    this.overlays.push(overlay);
  }

  removeAllOverlays() {
    for (var i in this.overlays) {
      this.overlays[i].setMap(null);
    }
    this.overlays = [];
  }
}
