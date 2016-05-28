me.data.db.allDocs({include_docs: true}).then(function(results) {
  var docs = results.rows.map(function(e) {
    e.doc.timestamp = new Date(e.doc.timestamp); return e;
  }).sort(function(a, b) {
    return b.doc.timestamp - a.doc.timestamp;
  });

  // How many runs in the previous fourteen days?
  var i = 0;
  var count = 0;
  var fourteenDaysAgo = new Date(new Date() - (1000 * 60 * 60 * 24 * 14));
  fourteenDaysAgo.setHours(0);
  fourteenDaysAgo.setMinutes(0);
  fourteenDaysAgo.setSeconds(0);
  fourteenDaysAgo.setMilliseconds(0);
  while (docs[i].doc.timestamp > fourteenDaysAgo) {
    ++i;
    ++count;
  }
  console.log(count + " runs in the previous fourteen days");

  // Retrieve the data for all runs in the previous fourteen days
  var args = [];
  for (i = 0; i < count; ++i) {
    args.push({
      id: docs[i].doc._id,
      rev: docs[i].doc._rev
    });
  }
  return me.data.db.bulkGet({docs: args, attachments: true});
}).then(function(results) {
  var runs = results.results.map(function(e) {
    e.docs[0].ok.timestamp = new Date(e.docs[0].ok.timestamp);
    return e.docs[0].ok;
  });

  // Calculate the distance traversed in the last seven days
  var i = 0;
  var distance1 = 0;
  var count = 0;
  var sevenDaysAgo = new Date(new Date() - (1000 * 60 * 60 * 24 * 7));
  sevenDaysAgo.setHours(0);
  sevenDaysAgo.setMinutes(0);
  sevenDaysAgo.setSeconds(0);
  sevenDaysAgo.setMilliseconds(0);
  while (runs[i].timestamp > sevenDaysAgo) {
    var data = me.getRun(runs[i]);
    var filtered = me.defaultFilter(data);
    var coords = me.getCoordinates(filtered);
    distance1 += me.computeDistance(coords);
    ++i;
    ++count;
  }
  console.log(distance1 + " miles in the last seven days (" + count + " runs)");

  // Calculate the distance traversed in the previous seven days
  var distance2 = 0;
  count = 0;
  while (i < runs.length) {
    var data = me.getRun(runs[i]);
    var filtered = me.defaultFilter(data);
    var coords = me.getCoordinates(filtered);
    distance2 += me.computeDistance(coords);
    ++i;
    ++count;
  }
  console.log(distance2 + " miles in the previous seven days (" + count + " runs)");

  // Calculate the increase in mileage week over week
  if (distance1 > distance2) {
    console.log(Math.round(((distance1 / distance2) - 1) * 100) + "% increase in week over week mileage");
  }
  else {
    console.log(Math.round((distance1 / distance2) * 100) + "% decrease in week over week mileage");
  }
});
