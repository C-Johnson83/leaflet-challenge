d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(function (data) {
  //Get the earthquake data
  spotify(data.features);
});

// Function for all the marker and legend colors by Depth
function markerColor(depth) {
  if (depth <= 0) {
      return "#5b0c69"
  } else if (depth <= 10) {
      return "#562e86"
    } else if (depth <= 20) {
      return "#4948a2 "
    } else if (depth <= 30) {
      return "#3160ba"
    } else if (depth <= 40) {
      return "#0076ce"
    } else if (depth <= 50) {
      return "#008ddf"
    } else if (depth <= 60) {
      return "#00a3eb"
  } else if (depth <= 70) {
      return "#00b8f4"
  } else if (depth <= 80) {
      return "#00cdfa"
  } else if (depth <= 640) {
      return "#00e2fd"
  } else {
      return "#05f6ff"
  }
};

function spotify(shakeAndBake) {

 // For each feature set the popup information 
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + 
    "<h3><h3>Magnitude: " + feature.properties.mag + " Mw"+
    "<h3><h3>Depth: " + feature.geometry.coordinates[2]+ " Km"+ 
    "<h3><h3>Tsunami's Created: " + feature.properties.tsunami +
    "<h3><h3>Date of Quake: " + new Date(feature.properties.time ).toDateString() + "</h3>");
  }

 // Set the marker options
 
  
let jelloJigglers = L.geoJSON(shakeAndBake, {
  onEachFeature: onEachFeature,
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: feature.properties.mag * 3,
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "Black",
        weight: 1,
        opacity: 0.75,
        fillOpacity: 1
    });
},

});

// Create the map with the markers
createMap(jelloJigglers);
}

 


// Function to create the map layers
function createMap(jelloJigglers) {

  // Create the default layer

 let CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});
  // Create alternative layers
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    
});
let Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

let OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
let NASAGIBS_ViirsEarthAtNight2012 = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
	attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
	bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
	minZoom: 1,
	maxZoom: 8,
	format: 'jpg',
	time: '',
	tilematrixset: 'GoogleMapsCompatible_Level'
});
 // Read in the data ane create a geoJSON layer for the plate boundaries
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json").then(function (platesData) {
 
  let plates = L.geoJSON(platesData, {
    fillColor: "orange",
    fillOpacity: 0,
    interactive: false,
    color: "magenta",
    weight: 2
  });
// console.log(plates) // checking the data

// Create a baseMaps 
let baseMaps = {
"Dark Matter": CartoDB_DarkMatter,
"Street Map": streetmap,
"Topographical": OpenTopoMap,
"World Map": Esri_WorldImagery,
"NASA at Night": NASAGIBS_ViirsEarthAtNight2012
};

// Create my Home Town Marker/Layer and popup info
let myLocation = L.circleMarker([31.4505, -83.5085], {
  fillColor: "orange",
  color: "red",
  fillOpacity:.5,
  weight: 1
}).bindPopup(`<h1>My Home Town</h1><h2>Where there is almost nothing for residents to do <br> We are an interstate town with everything accessible<br>
right off of the interstate.</h2><h3> Oh, and we can also have all 4 seasons in 1 week <h3><br><h3>Population: 17,235 (2021)<br> Humidity: 75%<br>
 Temperature: 81° F<br>Elevation: 109 meters above Sea Level<h3> `);
let myLayer = L.layerGroup([myLocation]);

// Create Japan Marker/Layer and popup info
let wishLocation = L.circleMarker([36.2048, 138.2529], {
  radius: 10,
  fillColor: "red",
  color: "white",
  fillOpacity:.5,
  weight: 3
}).bindPopup(`<h1>I Would Love to Live here</h1><h2>Japan has a fascinating and multifaceted culture!</h2><h2> Amazing street foods such as:<h3>- Sushi<br>- Ramen<br>- and Tempura</h3><h2>
Beautiful scenery such as: <h3>- The snow topped Mount Fuji</br>- The "cloud walk" at Unkai Terrace, </br>- And many many beautiful castles!
</h3><h2> Japan consists of a whopping 6,852 islands!<h3>Though most of them are uninhabited<h2>Population: 125.7 million (2021)<br> Humidity: 77%<br>
 Temperature: 70° F<br>Elevation: 438 meters above Sea Level<h2> `);
let wishLayer = L.layerGroup([wishLocation]);

  // Create the overlay maps
  let overlayMaps = {
    "Where I Live:": myLayer,
    "Where I Want to Live": wishLayer,
   "Tectonic plates": plates,
   "30 day Quake Spots": jelloJigglers,
  };
 

 
  // Create the loading map
  let myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4,
    layers: [CartoDB_DarkMatter, jelloJigglers,myLayer, wishLayer]
  });

//Add flyto so the screen moves to the markers lat, lon on click for the where I live
// and where I want to live layers
  myLocation.on('click', function(e) {
    myMap.flyTo(e.latlng, 13);      
  }); 
  wishLocation.on('click', function(e) {
    myMap.flyTo(e.latlng, 9);      
  });   
  

  // Create a layer control.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
    color: "gray"
  }).addTo(myMap);

  // Add the plates layer to the map
  plates.addTo(myMap);

// Create the map legend 
  let legend = L.control({ position: "bottomright",
  basesize: 10});
  legend.onAdd = function(map) {
      let div = L.DomUtil.create("div", "info legend");
      depths= [ -10,1,10,20,30,40,50,60,70,80,90];
      labels = [];
      legendInfo = "<h3>Quake Depth <br> In Kilometers <br> Below Sea Level</h3>";
      div.innerHTML = legendInfo;

      // Append the information to the empty labels array
      for (let i = 0; i < depths.length; i++) {
          labels.push('<i style="background-color:' + markerColor(depths[i] + 1) + '"></i>' + depths[i] + (depths[i + 1]
               ? ' &ndash; ' + depths[i + 1] +'  '+ '<br>' : ' +  ')) ;
      }
      // add label items to the div 
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
  };
  // Add legend to the map
  legend.addTo(myMap);

})
}