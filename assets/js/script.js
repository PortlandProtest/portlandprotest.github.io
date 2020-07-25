const lat = 45.515106;
const long = -122.676691;

var actualGroup = L.featureGroup().addLayer( 
        new L.circle([ lat, long ], {
            color: 'transparent',
            fillColor: '#D81B60',
            fillOpacity: 0.35,
            radius: 150
        })
    ),
    perceivedGroup = L.featureGroup().addLayer( 
        new L.circle([ lat, long ], {
            color: 'transparent',
            fillColor: '#D81B60',
            fillOpacity: 0.35,
            radius: 35000
        })
    ),
    map = L.map('map', {
        center: [ lat, long ],
        zoom: 9,
        layers: [ perceivedGroup ]
    });

L.tileLayer("https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// configure the layer controls
L.control.layers( 
    {
        "Perceived affected area": perceivedGroup,
        "Actual affected area": actualGroup
    },
    null, 
    { 
        collapsed: false,
        position: "topleft"
    }
).addTo(map);

// Add header to controlLayers
if( document.querySelector(".leaflet-control-layers-base") ) {
    var header = document.createElement("h4"),
        layersBase = document.querySelector(".leaflet-control-layers-base");

    header.innerHTML = "Portland Protests";
    layersBase.insertBefore( header, layersBase.childNodes[0]);
}

// Adjust the position of the Zoom Controls
map.zoomControl.setPosition( 'bottomleft' );

//reusable function for calculating the bounds of a layer
function getLayerBounds() {
    var bounds = new L.LatLngBounds();
    map.eachLayer(function (layer) {
        if ( layer instanceof L.FeatureGroup ) {
            bounds.extend( layer.getBounds() );
        }
    });
    return bounds;
}

// Zoom the map to fit the bounds of the layer when a layer is selected
map.on('layeradd', function () {
    bounds = getLayerBounds();
    if (bounds.isValid()) {
        map.flyToBounds(
            bounds, 
            {
                padding: [100, 100]
            }
        );
    } else {
        map.fitWorld();
    }
});