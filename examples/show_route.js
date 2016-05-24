me.removeAllOverlays();

me.data.db.get(me.currentRun, {attachments: true}).then(function(doc) {
  console.log(doc._id);
  var data = me.getRun(doc);
  var coords = me.getCoordinates(data);

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
