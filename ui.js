var map;

/* Initialize the data-sensitive pieces of the UI */
function initUI() {
  // Configure event handlers
  document.getElementById("input").addEventListener('input', function(cmp) {
    eval(cmp.target.value);
  });

  // Wire up the refresh button
  document.getElementById("nav").innerHTML = "<a href='javascript:refreshData();'>Refresh cache</a>";

  // Initialize the map
  initMap();
}

/* Show the map */
function initMap() {

  return new Promise(function(resolve, reject) {
    db.allDocs({include_docs: true, attachments: true, limit: 1}).then(function(results) {

      /* Calculate the the center of the map */
      var data = JSON.parse(
                   atob(
                     results.rows[0].doc._attachments["data.json"]["data"]
                   )
                 );
      var lat = parseFloat(data[0]["latitude"]);
      var lng = parseFloat(data[0]["longitude"]);

      /* Display the map */
      map = new google.maps.Map(document.getElementById('output'), {
        center: {lat: lat, lng: lng},
        zoom: 12,
        disableDefaultUI: true,
        draggable: false
      });

      resolve();
    });
  });
}
