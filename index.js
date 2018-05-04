require([
		"esri/Map",
		"esri/views/MapView",
		"esri/layers/FeatureLayer",
		"esri/geometry/Point",
		// "esri/renderers/SimpleRenderer"
		// "esri/geometry/Extent",
		// "esri/geometry/SpatialReference",
		"dojo/domReady!"
  	], function(Map, MapView, FeatureLayer, Point) {

      var map = new Map({
        basemap: "streets",
        ground: "world-elevation",
      });

      var view = new MapView({
        container: "viewDiv",
        map: map,
        // extent: ext
        center: [-100, 40],
		zoom: 4,
		// spatialReference: {wkid: 4326}
      });

	  	view.when(() => {
			let graphics = [];

			const layer = new FeatureLayer({
			  fields: [
				  {
					  name: "ObjectID",
					  alias: "ObjectID",
					  type: "oid"
				  },
				  {
					  name: "type",
					  alias: "Type",
					  type: "string"
				  },
				  {
					  name: "Name",
					  alias: "Name",
					  type: "string"
				  },
			  ],
			  objectIdField: "ObjectID",
			  geometryType: "point",
			  source: graphics,
			  spatialReference: {
				  wkid: 4326
			  },
			  // url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/WorldCities/FeatureServer/0",
			  renderer: {
				  type: 'simple',
				  symbol: {
					  type: 'simple-marker',
					  size: 10,
					  color: '#ff4000',
					  outline: {
						  color: [255,64,0,0.4],
						  width: 7
					  }
				  }
			  }
			});
			console.log('layer', layer)

			map.add(layer);

			view.on('click', function(event){
				// console.log("latitude", event.mapPoint.latitude);
				// console.log("longitude", event.mapPoint.longitude);
				let point = {
					geometry: new Point({
						x: event.mapPoint.longitude,
						y: event.mapPoint.latitude,
					}),
					attributes: {
						ObjectID: graphics.length + 1,
						type: "thing " + (graphics.length + 1),
						name: "test " + (graphics.length + 1)
					}
				};
				layer.source.add(point)
				// graphics.push()
				// layer.source
				// console.log('graphics', graphics)
				// console.log('layer.source', layer.source.add(point))
			})
		});
});
