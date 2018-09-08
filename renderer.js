// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this pro
var DG = require('2gis-maps');
var Datastore = require('nedb');
var db = new Datastore({filename : 'users'});
db.loadDatabase();

db.insert({name : "Koli Sterno", year: 1950, _id : 1}); 
db.find({}, function (err, docs) {
	console.log(docs);
});





var map = DG.map('map', {
    'center': [54.98, 82.89],
    'zoom': 13,
    fullscreenControl: false,
    zoomControl: false
});
var marker;
DG.marker([54.98, 82.89]).addTo(map).bindPopup('Я попап!');

map.on('click', function (event) {
    
      marker = DG.marker([event.latlng.lat, event.latlng.lng], {
                    draggable: true
                }).addTo(map);

                marker.on('drag', function(e) {
                    var lat = e.target._latlng.lat.toFixed(3),
                        lng = e.target._latlng.lng.toFixed(3);

                    console.log('lat', lat)
                    console.log('lng', lng)
                });
    
  });
