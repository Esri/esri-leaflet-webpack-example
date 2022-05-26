if (typeof WebAssembly != "object"){
	alert("Internet Explorer Not Supported. This page uses advanced browser features that are not supported by IE 11. Please use a recent version of Google Chrome, Mozilla Firefox or Microsoft Edge.")
} else {

	require([
			"esri/Map",
			"esri/views/MapView",
			"esri/views/SceneView",
			"esri/Basemap",
			"esri/Graphic",
			"esri/geometry/Point",
			"esri/layers/FeatureLayer",
			"esri/widgets/ScaleBar",
			"dojo/_base/declare",
			"esri/core/Collection",
			"esri/geometry/SpatialReference",
			"esri/geometry/projection",
			"dstore/Memory",
			// "dstore/Observable",
			"dgrid/Editor",
			"dgrid/Keyboard",
			"dgrid/Selection",
			"dgrid/OnDemandGrid",
			"dojo/html",
			// "esri/views/ui/UI"
			"esri/geometry/Extent",
			"esri/widgets/BasemapGallery",
			"esri/widgets/Expand"
		], function(Map, MapView, SceneView, Basemap, Graphic, Point, FeatureLayer, ScaleBar, declare, Collection, SpatialReference, Projection, Memory, Editor, Keyboard, Selection, OnDemandGrid, html, Extent, BasemapGallery, Expand) {
			// console.log('zones', zones)


			// // console.log('zones', zones)
			// console.log('window', window)
			var map = new Map({
				basemap: "topo",
				ground: "world-topobathymetry"
			});

			var view = new MapView({
				map: map,
				container: "viewDiv",
				center: [-100, 40],
				zoom: 4,
			});

			var basemapGallery = new BasemapGallery({
				view: view,
				container: document.createElement('div')
			})

			var bgExpand = new Expand({
				view: view,
				content: basemapGallery
			})

			view.ui.add(bgExpand, {
				position: "top-left"
			})

			view.when( function() {

				var columns = [{
						label: 'Name',
						field: 'name',
						editor: 'text',
						editOn: 'dblclick'
					},
					{
						label: 'Northing',
						field: 'n'
					},
					{
						label: 'Easting',
						field: 'e'
					},
					{
						label: 'Latitude',
						field: 'y'
					},
					{
						label: 'Longitude',
						field: 'x'
					},
					{
						label: 'Elevation (ft)',
						field: 'zf',
						className: 'dgrid-column-zf'
					},
					{
						label: 'Elevation (m)',
						field: 'z',
						className: 'dgrid-column-z'
					},
					{
						label: 'Horizontal Datum',
						field: 'h',
						className: 'dgrid-column-h'
					},
					{
						label: 'DEM Source',
						field: 'dems',
						className: 'dgrid-column-dems'
					},
					{
						label: 'DEM Resolution (m)',
						field: 'demr',
						className: 'dgrid-column-demr'
					}
				];

				function addGeojson(result){
					// console.log('result', result)
					var notPoints = [];
					var pointPromises = [];
					result.features.forEach(f => {
						if (f.geometry.type === 'Point'){
							var newPoint = new Point({
								latitude: f.geometry.coordinates[1],
								longitude: f.geometry.coordinates[0]
							})
							newPoint.name = f.properties.name;
							// console.log('newPoint', newPoint)
							pointPromises.push(addPoint(newPoint))
						} else {
							notPoints.push(f);
						}
					})
					if (notPoints.length){
						alert(notPoints.length + " non-point features were not added to the map.")
					}
					return Promise.all(pointPromises);
				}

				// function zoomToLocation(args){
				// 	// console.log('args', args)
				// 	// console.log('view', view)
				// 	var ext = new Extent({
				// 		xmin: args[0].bounds.j.j,
				// 		ymin: args[0].bounds.l.j,
				// 		xmax: args[0].bounds.j.l,
				// 		ymax: args[0].bounds.l.l,
				// 		// spatialReference: new SpatialReference({wkid:3857})
				// 	})
				// 	console.log('extent', ext)
				// 	view.goTo(ext)
				// 	// console.log('args', args)
				// }

				var kmzInput = document.getElementById('kmzInput')

				kmzInput.addEventListener('change', processInput, false)

				function processInput(e){
					console.log('e', e)
					var file = e.target.files[0];
					console.log("file", file);
					new Promise((resolve, reject) => {
						if (file.type === "application/vnd.google-earth.kml+xml") {
							geojson = parseKml(reader.result)
							var reader = new FileReader();
							reader.onload = function(){
								var json = parseKml(reader.result);
								resolve(json);
							}
							reader.readAsText(file);
						} else if (file.type === "application/vnd.google-earth.kmz") {
							unzipKmz(file)
								.then(kml => {
									// console.log('kml', kml)
									return parseKml(kml)
								})
								.then(json => {
									// console.log('json', json)
									resolve(json)
								})
									
						} else {
							// alert("Parser error");
							reject('Parser error');
						}
					})
					.then(geojson => {
						console.log('geojson', geojson)
						return addGeojson(geojson)
					})
					.then(addGeojsonResponse => {
						console.log('addGeojsonResponse', addGeojsonResponse)
						console.log('layer', layer)
						return layer.queryExtent();
					})
					.then(extentResponse => {
						console.log('extentResponse', extentResponse)
						var extent = extentResponse.extent;
						extent = extent.expand(1.2);
						view.goTo(extent, {
							duration: 2000,
						})
					})
					.catch(err => console.log('error!', err))
				}

				async function parseKml(kml){
					// console.log('kml', kml)
					// var parser = new KmlReader();
					// parser.parseMarkers(kml, function(m){
					// 	console.log('m', m)
					// })
					// let cleanKml = kml.replace(/(\w+):(\w+\=\"\w+")/g, '')
					let cleanKml = kml.replace(/(\w+)\:(\w+\=\"[A-Za-z0-9_,]+\")/g, '');

					// console.log('fixed kml', cleanKml)
					var domparser = new DOMParser();
					try {
						return new Promise((resolve, reject) => {
							var parsedXml = domparser.parseFromString(cleanKml, 'application/xml');
							if (parsedXml.getElementsByTagName('parsererror').length > 0) {
								alert("Error while parsing KML")
								reject('Error while parsing KML');
							} else {
								var json = toGeoJSON.kml(parsedXml);
								// console.log('json', json);
								resolve(json);
							}
						}).catch(err => console.log('err', err));
					} catch (err) {
						console.log('error', err);
					}
				}

				function unzipKmz(kmz){
					// console.log('kmz', kmz)
					return JSZip.loadAsync(kmz)
						.then(function(zip){
							// console.log('zip', zip)
							var docPromises = [];
							zip.forEach(function( relativePath, zipEntry){
								// console.log('relativePath', relativePath)
								// console.log('zipEntry', zipEntry)
								docPromises.push(zipEntry.async('string'));
							})
							return Promise.all(docPromises);
						})
						// maybe eventually there will be more files?
						.then(result => result[0])
				}

				var newMemory = declare(Memory, {
					fieldNames: null,
					delimiter: ',',
					newline: '\r\n',
					trim: false,
					toCsv: function (options) {
						var quoteRx = /^\s*"([\S\s]*)"\s*$/;
						var doubleQuoteRx = /""/g;
						var singleQuoteRx = /"/g;
						// summary:
						//		Returns data re-exported to CSV format.
						// options: Object?
						//		Optional object specifying options affecting the CSV output.
						//		* alwaysQuote: if true (default), all values will be quoted;
						//			if false, values will be quoted only if they need to be.
						//		* trailingNewline: if true, a newline will be included at the end
						//			of the string (after the last record).  Default is false.

						// jshint maxcomplexity: 15
						// console.log('this', this)
						options = options || {};

						var alwaysQuote = options.alwaysQuote;
						var fieldNames = this.fieldNames;
						var data = this.data;
						// console.log('datastore data', data)
						var delimiter = this.delimiter;
						var newline = this.newline;
						var output = '';

						// Process header row first (-1 case), then all data rows.
						for (var i = -1; i < data.length; i++) {
							if (i > -1) {
								output += newline;
							}
							for (var j = 0; j < fieldNames.length; j++) {
								var value = i < 0 ? fieldNames[j].label : data[i][fieldNames[j].field];
								console.log('value', value)
								if (value){
									var needsQuotes = alwaysQuote ||
										value && value.toString().indexOf('"') >= 0 || value && value.toString().indexOf(delimiter) >= 0;
										output += (j > 0 ? delimiter : '') +
											(needsQuotes ? '"' + value.toString().replace(singleQuoteRx, '""') + '"' : value);
								}
							}
						}

						if (options.trailingNewline) {
							output += newline;
						}
						console.log('output', output)
						return output;
			}
				})

				var dataStore = new newMemory({
					idProperty: "ObjectID",
					fieldNames: columns
				});

				function initiate_user_download (file_name, mime_type, text) {
				    // Anything but IE works here
				    if (undefined === window.navigator.msSaveOrOpenBlob) {
				        var e = document.createElement('a');
				        var href = 'data:' + mime_type + ';charset=utf-8,' + encodeURIComponent(text);
				        e.setAttribute('href', href);
				        e.setAttribute('download', file_name);
				        document.body.appendChild(e);
				        e.click();
				        document.body.removeChild(e);
				    }
				    // IE-specific code
				    else {
				        var charCodeArr = new Array(text.length);
				        for (var i = 0; i < text.length; ++i) {
				            var charCode = text.charCodeAt(i);
				            charCodeArr[i] = charCode;
				        }
				        var blob = new Blob([new Uint8Array(charCodeArr)], {type: mime_type});
				        window.navigator.msSaveOrOpenBlob(blob, file_name);
				    }
				}

				var downloadCsv = function(){
					// console.log('clicked')
					var data = dataStore.toCsv();
					// var encodedUri = encodeURI(output);
					var now = new Date().toLocaleString();
					initiate_user_download('elevations_' + now + '.csv', 'text/csv', data);
					// console.log('data to download eventually', data)
				}

				var exportCsvButton = document.getElementById('exportCsv')

				exportCsvButton.addEventListener('click', downloadCsv, false)

				// console.log('exportCsvButton', exportCsvButton)

				// console.log('dataStore', dataStore)

				var layer = new FeatureLayer({
					fields: [{
							name: "ObjectID",
							alias: "ObjectID",
							type: "oid"
						},
						// {
						//   name: "type",
						//   alias: "Type",
						//   type: "string"
						// },
						{
							name: "Name",
							alias: "Name",
							type: "string"
						},
					],
					objectIdField: "ObjectID",
					geometryType: "point",
					source: [],
					renderer: {
						type: 'simple',
						symbol: {
							type: 'simple-marker',
							size: 10,
							color: '#ff4000',
							outline: {
								color: [255, 64, 0, 0.4],
								width: 7
							}
						}
					},
					popupTemplate: {
						content: "{name}"
					}
					// labelingInfo: {
					// 	symbol: {
					// 		type: 'text',
					// 		color: 'black',
					// 		font: {
					// 			family: 'Playfair Display',
					// 			size: 12,
					// 			weight: 'bold'
					// 		}
					// 	},
					// 	labelPlacement: 'above-right',
					// 	labelExpressionInfo: {
					// 		expression: 'Test'
					// 	}
					// }
				});


				var importDivElement = document.getElementById('importDiv')
				// console.log(importDivElement)
				// var importDiv = new UI({
				// 	container: importDivElement,
				// 	padding: 10
				// })
				view.ui.add(importDivElement, "top-right")

				map.layers.add(layer);

				var statePlaneLayer = new FeatureLayer({
					url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_State_Plane_Zones_NAD83/FeatureServer/0',
				})

				map.layers.add(statePlaneLayer);

				var gridColumns = columns

				gridColumns.push({
					label: '',
					field: 'delete',
					className: 'dgrid-column-delete',
					renderCell: function(object, value, node, options) {
						// console.log('object', object)
						// return "Hello world"
						html.set(node, "<button class='deleteButton'>✖︎</button>");
				    }
				})

				var grid = new(declare([OnDemandGrid, Keyboard, Selection, Editor]))({
					collection: dataStore,
					columns: gridColumns,
				}, 'grid');

				grid.on("dgrid-datachange", function(event) {
					// console.log('event', event)
					var change = Object.assign({}, event.cell.row.data)
					change[event.cell.column.field] = event.value;
					// console.log('change', change)
					dataStore.put(change)
						.then(function(result) {
							// console.log('change result', result)
							// console.log('ObjectID ' + row.data.ObjectID + ' deleted? ' + result)
							// console.log('result again', r)
							const query = layer.createQuery();
							query.where = 'ObjectID = ' + change.ObjectID;
							return layer.queryFeatures(query);
						})
						.then(function(queryResult){
							// console.log('queryResult', queryResult.features)
							let updatedFeature = queryResult.features[0];
							updatedFeature.setAttribute('Name', change.name);
							return layer.applyEdits({updateFeatures: [updatedFeature]})
						})
						.then(function(updateResult){
							// console.log('updateResult', updateResult)
							layer.refresh()
							grid.refresh();
						})
						.catch(function(err){ console.log('error updating item', err)})
				})

				grid.on('.dgrid-column-delete > button:click', function(e){
					var row = grid.row(e)
					// console.log('row', row.data)
					// delete the item from the dgrid memory
					dataStore.remove(row.data.ObjectID)
						.then(function(result) {
							// console.log('ObjectID ' + row.data.ObjectID + ' deleted? ' + result)
							// console.log('result again', r)
							const query = layer.createQuery();
							query.where = 'ObjectID = ' + row.data.ObjectID;
							return layer.source.queryFeatures(query);
						})
						.then(function(queryResult){
							return layer.source.applyEdits({deleteFeatures: queryResult.toJSON().features})
						})
						.then(function(deleteResult){
							// console.log('deleteResult', deleteResult)
							layer.refresh()
							grid.refresh();
						})
						.catch(function(err){ console.log('error deleting item', err)})
					// delete it from the featurelayer source
						// console.log('layer.source', layer.source)
						// console.log(layer.source.remove(row.data))
						// layer.refresh()

				})

				grid.startup();
				var counter = 0;

				var addPoint = function(input) {
					// console.log('input', input)
					const point = {
						attributes: {}
					}
					return map.ground.queryElevation(input, {
							returnSampleInfo: true,
							demResolution: 'finest-contiguous'
						})
						.then(function(elevationResult) {
							var s = elevationResult.sampleInfo[0];
							var g = elevationResult.geometry;
							// console.log('elevationResult.sampleInfo', s)
							// console.log('elevationResult.geometry', g)
							point.geometry = g;
							point.x = g.longitude.toFixed(4),
							point.y = g.latitude.toFixed(4),
							point.z = Math.floor(g.z);
							point.zf = Math.floor(3.28084 * g.z);
							point.demr = s.demResolution > -1 ? s.demResolution.toFixed(2) : 'n/a';
							point.dems = s.demResolution > -1 ? s.source.sourceJSON.name : 'No data available';
							point.attributes.Name = input.name ? input.name : "New Point " + counter;
							counter++

							var query = statePlaneLayer.createQuery();
							// query.where = "STATE_NAME = 'Washington'";
							query.geometry = point.geometry;
							query.returnGeometry = false;
							query.outFields = ["ZONE", "ZONENAME", "FIPSZONE"];
							return statePlaneLayer.queryFeatures(query);
						})
						.then(function(statePlaneResults) {
							// console.log('statePlaneResults', statePlaneResults)
							var sp = statePlaneResults.get('features')[0];
							// console.log('sp result', sp)
							if (sp) {
								var thisFips = sp.get('attributes').FIPSZONE;
								var testFips = thisFips.length < 4 ? "0".concat(thisFips.toString()) : thisFips;
								// console.log('attributes', statePlaneResults.get('features')[0].get('attributes'))
								// console.log('testFips', testFips)
								var thisWkid = zones.find(function(z){
									return z.fips.toString() === testFips.toString()
								})
								// console.log('thisWkid', thisWkid)
								var thisSpatialReference = new SpatialReference(thisWkid)
								// console.log('thisSpatialReference', thisSpatialReference)
								var thisProjectedGeometry = Projection.project(point.geometry, thisSpatialReference)
								// console.log('thisProjectedGeometry', thisProjectedGeometry)
								point.h = 'NAD83(ft) ' + sp.get('attributes').ZONENAME;
								point.e = Math.floor(thisProjectedGeometry.get('x'));
								point.n = Math.floor(thisProjectedGeometry.get('y'));
								return point;
							} else {
								point.h = 'No State Plane Reference Found';
								point.e = 'n/a';
								point.n = 'n/a';
								return point;
							}
						})
						.then(function(point){
							// console.log('completed point', point)
							// point.ObjectID = layer.source.length + 1;
							// const addFeature = new Graphic(point)
							return layer.source.applyEdits({addFeatures: [point]})
						})
						.then(function(layerAddResults){
							// console.log('addResults', layerAddResults.addFeatureResults[0].objectId)
							const query = layer.createQuery();
							query.where = 'ObjectID = ' + layerAddResults.addFeatureResults[0].objectId;
							return layer.queryFeatures(query);
						})
						.then(function(queryResult){
							// console.log('queryResult', queryResult.toJSON())
							point.ObjectID = queryResult.toJSON().features[0].attributes.ObjectID;
							point.name = queryResult.toJSON().features[0].attributes.Name
							return dataStore.add(point)
						})
						.then(function(dataStoreAddResults){
							// console.log('dataStoreAddResults', dataStoreAddResults)
							layer.refresh();
							grid.refresh();
							return point;
							// view.goTo(layer);
						})
						.catch(err => console.log('addPoint err', err));
				}

				Projection.load().then(function() {
					view.on('immediate-click', function(event) {
						view.hitTest(event)
						.then(function(response){
							// console.log('response', response)
							if (response.results.length){
								var existingGraphic = response.results.filter(function(result){
									// console.log('result', result)
									return result.graphic.layer === layer;
								})
								// console.log('existingGraphic', existingGraphic)
								if (existingGraphic.length < 1){
									addPoint(event.mapPoint)
								}
							} else {
								addPoint(event.mapPoint)
							}
						})
						// console.log('map.ground', map.ground.queryElevation(event.mapPoint))
					})
				})
			})


		});
}
