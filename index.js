require([
			"esri/Map",
			"esri/views/MapView",
			"esri/views/SceneView",
			"esri/Basemap",
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
			"esri/geometry/Extent"
		], function(Map, MapView, SceneView, Basemap, Point, FeatureLayer, ScaleBar, declare, Collection, SpatialReference, Projection, Memory, Editor, Keyboard, Selection, OnDemandGrid, html, Extent) {
			// console.log('zones', zones)


			// // console.log('zones', zones)
			// console.log('window', window)
			var map = new Map({
				basemap: "streets",
				ground: "world-elevation"
			});

			// var view = new SceneView({
			// 	map: map,
			// 	container: "viewDiv",
			// 	center: [-100, 40],
			// 	zoom: 4,
			// });


			var view = new MapView({
				map: map,
				container: "viewDiv",
				center: [-100, 40],
				zoom: 4,
			});

			view.when(() => {

				var columns = [{
						label: 'Name',
						field: 'name',
						editor: 'text',
						editOn: 'dblclick'
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
						label: 'Elevation (m)',
						field: 'z',
						className: 'dgrid-column-z'
					},
					{
						label: 'Elevation (ft)',
						field: 'zf',
						className: 'dgrid-column-zf'
					},
					{
						label: 'Easting',
						field: 'e'
					},
					{
						label: 'Northing',
						field: 'n'
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

				function dealWithKml(result){
					// console.log('result', result)
						var newKmlPoint = new Point({
							latitude: result.latlng.lat(),
							longitude: result.latlng.lng()
						})
						newKmlPoint.name = result.name
						addPoint(newKmlPoint)
				}

				function zoomToLocation(args){
					console.log('args', args)
					// console.log('view', view)
					var ext = new Extent({
						xmin: args[0].bounds.j.j,
						ymin: args[0].bounds.l.j,
						xmax: args[0].bounds.j.l,
						ymax: args[0].bounds.l.l,
						// spatialReference: new SpatialReference({wkid:3857})
					})
					console.log('extent', ext)
					view.goTo(ext)
					// console.log('args', args)
				}

				var myParser = new geoXML3.parser({createMarker: dealWithKml, afterParse: zoomToLocation, createOverlay: function(){ alert("Overlays not supported")}})
				// console.log('myParser', myParser)
				var kmzInput = document.getElementById('kmzInput')

				kmzInput.addEventListener('change', processKmz, false)

				// console.log('window.geoXML3', window.geoXML3)
				function processKmz(e){
					var file = e.target.files[0];
					// console.log("file", file);
					var reader = new FileReader()
					reader.onload = function(){
						// console.log('reader.result', reader.result)
						if (file.type === "application/vnd.google-earth.kml+xml") {
							myParser.parseKmlString(reader.result)
						} else if (file.type === "application/vnd.google-earth.kmz") {
							myParser.parse(reader.result)
						} else {
							alert("Parser error");
						}
					};
					if (file.type === "application/vnd.google-earth.kml+xml") {
						reader.readAsText(file);
					} else if (file.type === "application/vnd.google-earth.kmz") {
						reader.readAsDataURL(file);
					} else {
						alert("Incorrect file type");
					}

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
								var needsQuotes = alwaysQuote ||
									value.toString().indexOf('"') >= 0 || value.toString().indexOf(delimiter) >= 0;
								output += (j > 0 ? delimiter : '') +
									(needsQuotes ? '"' + value.toString().replace(singleQuoteRx, '""') + '"' : value);
							}
						}

						if (options.trailingNewline) {
							output += newline;
						}

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
					}
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

				var gridColumns = [...columns]

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

				grid.on("dgrid-datachange", event => {
					// console.log('event', event)
					var change = Object.assign({}, event.cell.row.data)
					change[event.cell.column.field] = event.value;
					// console.log('change', change)
					dataStore.put(change)
						.then(object => {
							// layer.source.put(object)
							console.log('updated ', object)
							// console.log('dataStore', dataStore)
							grid.refresh()
						})
					// update the featurelayer store
				})

				grid.on('.dgrid-column-delete > button:click', function(e){
					var row = grid.row(e)
					console.log('row', row.data)
					// delete the item from the dgrid memory
					dataStore.remove(row.data.ObjectID)
						.then(result => {
							console.log('ObjectID ' + row.data.ObjectID + ' deleted? ' + result)
							grid.refresh();
							return result
						})
						.then(r => {
							// console.log('result again', r)
							// console.log('layer.source', layer.source)
							// find the item
							var item = layer.source.find(function(item) {
								return item.ObjectID === row.data.ObjectID
							})
							// console.log('item', item)
							layer.source.remove(item)
							// console.log('layer.source after', layer.source)
							// layer.refresh()
						})
					// delete it from the featurelayer source
						// console.log('layer.source', layer.source)
						// console.log(layer.source.remove(row.data))
						// layer.refresh()

				})

				grid.startup();

				var addPoint = function(input) {
					// console.log('input', input)
					map.ground.queryElevation(input, {
							returnSampleInfo: true,
							demResolution: 'finest-contiguous'
						})
						.then(function(elevationResult) {
							// console.log('elevationResult', elevationResult)
							// console.log('elevationResult.geomety', elevationResult.geometry)
							var query = statePlaneLayer.createQuery();
							// query.where = "STATE_NAME = 'Washington'";
							query.geometry = elevationResult.geometry;
							query.returnGeometry = false;
							query.outFields = ["ZONE", "ZONENAME", "FIPSZONE"];
							statePlaneLayer.queryFeatures(query).then(function(statePlaneResults) {
								// console.log('statePlaneResults', statePlaneResults.get('features')[0].get('attributes'))
								var thisFips = statePlaneResults.get('features')[0].get('attributes').FIPSZONE;
								var testFips = thisFips.length < 4 ? "0".concat(thisFips.toString()) : thisFips;
								// console.log('attributes', statePlaneResults.get('features')[0].get('attributes'))
								// console.log('testFips', testFips)
								var thisWkid = zones.find(z => z.fips.toString() === testFips.toString())
								// console.log('thisWkid', thisWkid)
								var thisSpatialReference = new SpatialReference(thisWkid)
								// console.log('thisSpatialReference', thisSpatialReference)
								var thisProjectedGeometry = Projection.project(elevationResult.geometry, thisSpatialReference)
								// console.log('input', input)
								var point = {
									geometry: new Point({
										x: input.get('longitude'),
										y: input.get('latitude'),
										z: elevationResult.geometry.z
									}),
									ObjectID: layer.source.length + 1,
									name: input.name ? input.name : "New Point " + (layer.source.length + 1),
									x: input.get('longitude').toFixed(4),
									y: input.get('latitude').toFixed(4),
									z: Math.floor(elevationResult.geometry.z),
									zf: Math.floor(3.28084 * elevationResult.geometry.z),
									h: 'NAD83(ft) ' + statePlaneResults.get('features')[0].get('attributes').ZONENAME,
									e: Math.floor(thisProjectedGeometry.get('x')),
									n: Math.floor(thisProjectedGeometry.get('y')),
									demr: elevationResult.sampleInfo[0].demResolution.toFixed(2),
									dems: 'ESRI WorldElevation Service'
								};
								// console.log('point', point)
								layer.source.add(point)
								// view.goTo(layer)
								layer.refresh()
								// console.log('layer', layer.get('source').get('items'))
								dataStore.add(point)
								// console.log('dataStore', dataStore)
								grid.refresh()
								// grid.set("collection", dataStore)
							});
						});
				}

				Projection.load().then(() => {
					view.on('click', function(event) {
						// console.log('map.ground', map.ground.queryElevation(event.mapPoint))
						addPoint(event.mapPoint)
					})
				})
			})


		});
