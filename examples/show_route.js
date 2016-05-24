me.removeAllOverlays();

me.data.db.get(me.currentRun, {attachments: true}).then(function(doc) {
  var data = me.getRun(doc);
  var filtered = me.defaultFilter(data);
  var coords = me.getCoordinates(filtered);

  var path = new google.maps.Polyline({
    path: coords,
    geodesic: true,
    strokeColor: "#ff0000",
    strokeOpacity: 0.6,
    strokeWeight: 2
  });

  me.addOverlay(path);
  me.setBoundaries(coords);
});
