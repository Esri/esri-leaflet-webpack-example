require([
      "esri/Map",
      "esri/views/MapView",
      "esri/geometry/Extent",
      // "esri/geometry/SpatialReference",
      "dojo/domReady!"
    ], function(Map, MapView, Extent) {

      var map = new Map({
        basemap: "streets",
        ground: "world-elevation"
      });

      var view = new MapView({
        container: "viewDiv",
        map: map,
        // extent: ext
        center: [-100, 40],
		zoom: 4
      });
});
