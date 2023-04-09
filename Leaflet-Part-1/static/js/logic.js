d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});



function markerColor(depth) {
  if (depth <= 0) {
      return "#6200EA"
  } else if (depth <= 10) {
      return "#311B92"
    } else if (depth <= 20) {
      return "#283593"
    } else if (depth <= 30) {
      return "#3949AB"
    } else if (depth <= 40) {
      return "#5C6BC0"
    } else if (depth <= 50) {
      return "#9FA8DA"
    } else if (depth <= 60) {
      return "Cyan"
  } else if (depth <= 70) {
      return "#90CAF9"
  } else if (depth <= 80) {
      return "#2196F3"
  } else if (depth <= 90) {
      return "#1565C0"
  } else {
      return "#0D47A1"
  }
};

function createFeatures(shakeAndBake) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + 
    "<h3><h3>Magnitude: " + feature.properties.mag + 
    "<h3><h3>Depth: " + feature.geometry.coordinates[2] + 
    "<h3><h3>Tsunami's Created: " + feature.properties.tsunami +
    "<h3><h3>Date of Quake: " + new Date(feature.properties.time ).toDateString() + "</h3>");
  }

  // Create a GeoJSON layer that contains the features array on the shakeAndBake object.
  // Run the onEachFeature function once for each piece of data in the array.
 
  
let jelloJigglers = L.geoJSON(shakeAndBake, {
  onEachFeature: onEachFeature,
  pointToLayer: function(feature, latlng) {
    return L.circle(latlng, {
        radius: feature.properties.mag * 12345,
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "Black",
        weight: 1,
        opacity: 0.75,
        fillOpacity: 1
    });
},
onEachFeature: onEachFeature
});

// Sending our jelloJigglers layer to the createMap function
createMap(jelloJigglers);
}

function createMap(jelloJigglers) {

  // Create the tile layer that will be the background of our map.
  let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
  });
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    
});
let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
  });


// Create a baseMaps object to hold the streetmap layer.
let baseMaps = {
"Google Satelite": googleSat,
"Street Map": streetmap,
"Google Map": googleStreets,

};

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    "30 day Quake Spots": jelloJigglers
  };
// Function for Circle Color Base on Criteria. The Color Scale is base of the 7 colors of a Rainboy ROY G BIV

 
  // Create our map, giving it the streetmap and jelloJigglers layers to display on load.
  let myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5,
    layers: [googleSat, jelloJigglers]
  });
    
  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  let legend = L.control({ position: "bottomleft",
  basesize: 10});
  legend.onAdd = function(map) {
      let div = L.DomUtil.create("div", "info legend");
      depths= [ -100,1,10,20,30,40,50,60,70,80,90];
      labels = [];
      bgcolor = "white",
      legendInfo = "<h4>Quake Depth</h4>";
      div.innerHTML = legendInfo;
      // push to labels array as list item
      for (let i = 0; i < depths.length; i++) {
          labels.push('<i style="background-color:' + markerColor(depths[i] + 1) + '"></i>' + depths[i] + (depths[i + 1]
               ? '&ndash;' + depths[i + 1] + '<br>' : '+')) ;
      }
      // add label items to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
  };
  // Add legend to the map
  legend.addTo(myMap);

};