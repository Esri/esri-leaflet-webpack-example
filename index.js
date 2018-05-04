require([
		"esri/Map",
		"esri/views/MapView",
		"esri/layers/FeatureLayer",
		// "esri/renderers/SimpleRenderer"
		// "esri/geometry/Extent",
		// "esri/geometry/SpatialReference",
		"dojo/domReady!"
  	], function(Map, MapView, FeatureLayer) {

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
		// spatialReference: {wkid: 4152}
      });

	  	view.when(() => {
			let graphics = [
				{
				  	geometry: {
						type: "point",
						x: 12599540,
						y: 4998025,
					},
				  	attribute: {
						ObjectID: 1,
						type: "thing",
						name: "test"
					}
				}
			];

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
			  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/WorldCities/FeatureServer/0",
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

			map.add(layer);

			view.on('click', function(event){
				console.log("event", event.mapPoint.toJSON());
				graphics.push({
					geometry: {
						type: "point",
						x: event.mapPoint.toJSON().x,
						y: event.mapPoint.toJSON().y,
					},
					attribute: {
						ObjectID: 1,
						type: "thing",
						name: "test"
					}
				})
				// layer.load(graphics)
				// console.log('layer', layer)
				// console.log('graphics', graphics)
			})
		});
});
