me.stopAnimations();

me.data.db.get(me.currentRun, {attachments: true}).then(function(doc) {
  console.log(doc._id);
  var data = me.getRun(doc);
  var coords = me.getCoordinates(data);

  // Set the map boundaries
  me.setBoundaries(coords);

  // Animate the route
  var draw = [];
  var timer = me.startAnimation(function() {
    if (coords.length == 0) {
      me.stopAnimation(timer);
      return;
    }

    // Add a point to the draw array
    draw.push(coords.shift());

    // Clear any existing overlays
    me.removeAllOverlays();

    // Construct the path
    var path = new google.maps.Polyline({
      path: draw,
      geodesic: true,
      strokeColor: "#ff0000",
      strokeOpacity: 0.6,
      strokeWeight: 2
    });

    // Draw the route thus far
    me.addOverlay(path);
  }, 5);
});
