require([
      "esri/Map",
      "esri/views/MapView",
      "esri/geometry/Extent",
      "esri/geometry/SpatialReference",
      "dojo/domReady!"
    ], function(Map, MapView, Extent, SpatialReference) {

      var map = new Map({
        basemap: "streets",
        ground: "world-elevation"
      });

      var ext = new Extent({
          xmin: -13056650,
          ymin: 6077558,
          xmax: -13055709,
          ymax: 6077938,
          spatialReference: new SpatialReference({wkid:3857})
      });

      var view = new MapView({
        container: "viewDiv",
        map: map,
        extent: ext
        
      });
});
