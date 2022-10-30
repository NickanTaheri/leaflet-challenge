// GeoJSON url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// get data from url
d3.json(url).then(function (data) {

    createFeatures(data.features);

    function createFeatures(_eqData) {

        function onEachFeature(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3> 
    Time: ${new Date(feature.properties.time)}<br /> 
    Coordinate/Depth: ${feature.geometry.coordinates} <br /> 
    Size: ${feature.properties.mag}`);
        }

        // Define circles based on the earthquake size
        function radiusSize(magnitude) {
            return magnitude * 45000;
        }

        // Define circle color 
        function feartureColor(_depth) {
            if (_depth > 90) {
                return "rgb(99,77,142)";
            } else if (_depth > 70) {
                return "rgb(142,91,145)";
            } else if (_depth > 50) {
                return "rgb(199,107,143)";
            } else if (_depth > 30) {
                return "rgb(220,130,142)";
            } else if (_depth > 10) {
                return "rgb(236,152,142)";
            } else {
                return "rgb(255,204,153)";
            }
        }

        // GeoJSON layer 
        let EQ_Loc = L.geoJSON(_eqData, {
            pointToLayer: function (_eqData, latlng) {
                return L.circle(latlng, {
                    radius: radiusSize(_eqData.properties.mag),
                    fillOpacity: 0.85,
                    fillColor: feartureColor(_eqData.geometry.coordinates[2]),
                    stroke: false,
                });
            },
            onEachFeature: onEachFeature,
        });

        // Call map function with the GeoJSON layer
        createMap(EQ_Loc);
    }

    function createMap(EQ_Loc) {
        // Create the base layers.
        let sattelite = L.tileLayer(

            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }
        );

        // Create basemap
        let baseMaps = {
            "Sattelite": sattelite,
        };

        // Create overlaymap
        let overlayMaps = {
            "Earthquakes": EQ_Loc,
        };

        // create map
        let myMap = L.map("map", {
            center: [0, 20.0],
            zoom: 2.5,
            layers: [sattelite, EQ_Loc],
        });

        // Create a layer control
        L.control
            .layers(baseMaps, overlayMaps, {
                collapsed: false,
            })
            .addTo(myMap);


        // Create Legend
        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function () {
            var div = L.DomUtil.create("div", "info legend"),
                limits = [-10, 10, 30, 50, 70, 90];

            function getColor(d) {
                return d > 90 ? "#7a0177" :
                    d > 70 ? "#E31A1C" :
                    d > 50 ? "#FC4E2A" :
                    d > 30 ? "#FD8D3C" :
                    d > 10 ? "#FEB24C" :
                    d > -10 ? "#FED976" :
                    "#FFEDA0";
            }

            for (var i = 0; i < limits.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(limits[i] + 1) + '"></i>' +
                    limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
            }
            return div;
        };

        // Adding the legend to the map
        legend.addTo(myMap);
    }
});

