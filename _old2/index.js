require([
		"esri/Map",
		"esri/views/MapView",
		"esri/layers/FeatureLayer",
		"esri/geometry/Point",
		"esri/widgets/ScaleBar",
		'esri/widgets/Widget',
		'dijit/_WidgetBase',
		// "esri/renderers/SimpleRenderer"
		// "esri/geometry/Extent",
		// "esri/geometry/SpatialReference",
		"dojo/domReady!"
  	], function(Map, MapView, FeatureLayer, Point, ScaleBar, Widget, _WidgetBase) {

		console.log('_WidgetBase', _WidgetBase)
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

			map.add(layer);

			view.on('click', function(event){
				// console.log('map.ground', map.ground.queryElevation(event.mapPoint))
				map.ground.queryElevation(event.mapPoint, {
					returnSampleInfo: true,
					demResolution: 'finest-contiguous'
				})
					.then(function(result){
						// console.log('result.geometry', result.geometry)
						// console.log('result.sampleInfo', result.sampleInfo)
						let point = {
							geometry: new Point({
								x: event.mapPoint.longitude,
								y: event.mapPoint.latitude,
								z: result.geometry.z
							}),
							attributes: {
								ObjectID: graphics.length + 1,
								type: "thing " + (graphics.length + 1),
								name: "test " + (graphics.length + 1)
							}
						};
						layer.source.add(point)
						console.log('point', point);
					});
				// console.log('mapPoint', event.mapPoint)
				// console.log("latitude", event.mapPoint.latitude);
				// console.log("longitude", event.mapPoint.longitude);

				// graphics.push()
				// layer.source
				// console.log('graphics', graphics)
				// console.log('layer.source', layer.source.add(point))
			})

			var scaleBar = new ScaleBar({
				view: view,
				unit: 'dual'
			});
			view.ui.add(scaleBar, {
				position: "bottom-left"
			})
		});
});
