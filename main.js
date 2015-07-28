// require leaflet
var L = require('leaflet');

// require esri-leaflet
var esri = require('esri-leaflet');

// require esri-leaflet-geocoder
var geocoding = require('esri-leaflet-geocoder');

// since leaflet is bundled into the browserify package it won't be able to detect where the images
// solution is to point it to where you host the the leaflet images yourself
L.Icon.Default.imagePath = 'http://cdn.leafletjs.com/leaflet-0.7.3/images';

// create map
var map = L.map('map').setView([51.505, -0.09], 13);

// add basemap
esri.basemapLayer('Topographic').addTo(map);

// add layer
esri.featureLayer({
  url: '//services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/gisday/FeatureServer/0/'
}).addTo(map);

// add search control
geocoding.geosearch({
  providers: [
    geocoding.arcgisOnlineProvider(),
    geocoding.featureLayerProvider({
      url: '//services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/gisday/FeatureServer/0/',
      searchFields: ['Name', 'Organization'],
      label: 'GIS Day Events',
      bufferRadius: 20000,
      formatSuggestion: function (feature) {
        return feature.properties.Name + ' - ' + feature.properties.Organization;
      }
    })
  ]
}).addTo(map);
