function createMap(shakeAndBake) {

    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        
    });
    let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      });
    let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      });
    
  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = {
    "Street Map": streetmap,
    "Google Map": googleStreets,
    "Google Satelite": googleSat
  };

  // Create an overlayMaps object to hold the quakefeatures layer.
  let overlayMaps = {
    "30 day Quake Spots": shakeAndBake
    // "7 day Quake Spots": jelloJigglers
  };
   // Create the map object with options.
   let map = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5,
    layers: [streetmap, shakeAndBake]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}
function createMarkers(response) {
console.log(`Checking the Response data`,response)
// Pull the "features" property from response.data.
let features = response.features;
console.log (`Checking the Feature data`,features)

// Create an array to hold the quake markers.
let quakeMarkers = [];

// Loop through the features array.
for (let index = 0; index < features.length; index++) {
    let feature = features[index];
    // let qtime = feature.properties.time
    // let date = qtime.toString
    
      // Define a color scale for the depth of the earthquake.
      let depthColorScale = d3.scaleLinear()
      .domain([0, 1, 3, 5, 7, 9])
      .range(["#053f9c", "#05539c", "#05719c", "#05929c", "#059c88", "#059c50"]);

    let spotify = {
        radius: feature.properties.mag * 20000, // use magnitude for circle radius
        fillColor: depthColorScale(feature.geometry.coordinates[2]), // use depth for fill color
        color: 'Lime', // use black for stroke color
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.8
      };
      var dateify = {
        timeZone: 'UTC',
        hour12: false,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      };


      let quakeMarker = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], spotify)
    .bindPopup("<h3>" + feature.properties.place + 
    "<h3><h3>Magnitude: " + feature.properties.mag + 
    "<h3><h3>Depth: " + feature.geometry.coordinates[2] + 
    "<h3><h3>Tsunami's Created: " + feature.properties.tsunami +
    "<h3><h3>Date of Quake: " + new Date(feature.properties.time ).toLocaleDateString() + "</h3>");


   

    // Add the marker to the quakeMarkers array.
    quakeMarkers.push(quakeMarker);
    
}

// Create a layer group that's made from the quake markers array, and pass it to the createMap function.
createMap(L.layerGroup(quakeMarkers));
  }
    
    
 
     
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(createMarkers);

