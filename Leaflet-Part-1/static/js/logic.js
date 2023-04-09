d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(function (data) {
  //Get the earthquake data
  spotify(data.features);
});


// Function for all the marker and legend colors by Depth
function markerColor(depth) {
  if (depth <= 0) {
      return "brown"
  } else if (depth <= 10) {
      return "red"
    } else if (depth <= 20) {
      return "yellow"
    } else if (depth <= 30) {
      return "orange"
    } else if (depth <= 40) {
      return "pink"
    } else if (depth <= 50) {
      return "purple"
    } else if (depth <= 60) {
      return "Cyan"
  } else if (depth <= 70) {
      return "aqua"
  } else if (depth <= 80) {
      return "steelblue"
  } else if (depth <= 90) {
      return "blue"
  } else {
      return "magenta"
  }
};

function spotify(shakeAndBake) {

 // For each feature set the popup information 
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + 
    "<h3><h3>Magnitude: " + feature.properties.mag + 
    "<h3><h3>Depth: " + feature.geometry.coordinates[2] + 
    "<h3><h3>Tsunami's Created: " + feature.properties.tsunami +
    "<h3><h3>Date of Quake: " + new Date(feature.properties.time ).toDateString() + "</h3>");
  }

 // Set the marker options
 
  
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

// Create the map with the markers
createMap(jelloJigglers);
}
// Function to create the map layers
function createMap(jelloJigglers) {

  // Create the default layer
  let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
  });
  // Create alternative layers
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    
});
let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
  });


// Create a baseMaps 
let baseMaps = {
"Google Satelite": googleSat,
"Street Map": streetmap,
"Google Map": googleStreets,

};

  // Create the overlay maps
  let overlayMaps = {
    "30 day Quake Spots": jelloJigglers
  };

 
  // Create the loading map
  let myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5,
    layers: [googleSat, jelloJigglers]
  });
    
  // Create a layer control.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
// Create the map legend 
  let legend = L.control({ position: "bottomleft",
  basesize: 10});
  legend.onAdd = function(map) {
      let div = L.DomUtil.create("div", "info legend");
      depths= [ -100,1,10,20,30,40,50,60,70,80,90];
      labels = [];
      bgcolor = "white",
      legendInfo = "<h4>Quake Depth</h4>";
      div.innerHTML = legendInfo;
      // Append the information to the empty labels array
      for (let i = 0; i < depths.length; i++) {
          labels.push('<i style="background-color:' + markerColor(depths[i] + 1) + '"></i>' + depths[i] + (depths[i + 1]
               ? '&ndash;' + depths[i + 1] + '<br>' : '+')) ;
      }
      // add label items to the div 
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
  };
  // Add legend to the map
  legend.addTo(myMap);

};