define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/geometry/Point", "esri/layers/FeatureLayer", "dojo/_base/declare", "esri/geometry/SpatialReference", "esri/geometry/projection", "dstore/Memory", "dgrid/Editor", "dgrid/Keyboard", "dgrid/Selection", "dgrid/OnDemandGrid"], function (require, exports, EsriMap, MapView, Point, FeatureLayer, declare, SpatialReference, Projection, Memory, Editor, Keyboard, Selection, OnDemandGrid) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var zones = [{ "wkid": 2225, "fips": "0401" }, { "wkid": 2226, "fips": "0402" }, { "wkid": 2227, "fips": "0403" }, { "wkid": 2228, "fips": "0404" }, { "wkid": 2229, "fips": "0405" }, { "wkid": 2230, "fips": "0406" }, { "wkid": 2231, "fips": "0501" }, { "wkid": 2232, "fips": "0502" }, { "wkid": 2233, "fips": "0503" }, { "wkid": 2234, "fips": "0600" }, { "wkid": 2235, "fips": "0700" }, { "wkid": 2236, "fips": "0901" }, { "wkid": 2237, "fips": "0902" }, { "wkid": 2238, "fips": "0903" }, { "wkid": 2239, "fips": 1001 }, { "wkid": 2240, "fips": 1002 }, { "wkid": 2241, "fips": 1101 }, { "wkid": 2242, "fips": 1102 }, { "wkid": 2243, "fips": 1103 }, { "wkid": 2246, "fips": 1601 }, { "wkid": 2247, "fips": 1602 }, { "wkid": 2248, "fips": 1900 }, { "wkid": 2249, "fips": 2001 }, { "wkid": 2250, "fips": 2002 }, { "wkid": 2254, "fips": 2301 }, { "wkid": 2255, "fips": 2302 }, { "wkid": 2257, "fips": 3001 }, { "wkid": 2258, "fips": 3002 }, { "wkid": 2259, "fips": 3003 }, { "wkid": 2260, "fips": 3101 }, { "wkid": 2261, "fips": 3102 }, { "wkid": 2262, "fips": 3103 }, { "wkid": 2263, "fips": 3104 }, { "wkid": 2264, "fips": 3200 }, { "wkid": 2267, "fips": 3501 }, { "wkid": 2268, "fips": 3502 }, { "wkid": 2271, "fips": 3701 }, { "wkid": 2272, "fips": 3702 }, { "wkid": 2274, "fips": 4100 }, { "wkid": 2275, "fips": 4201 }, { "wkid": 2276, "fips": 4202 }, { "wkid": 2277, "fips": 4203 }, { "wkid": 2278, "fips": 4204 }, { "wkid": 2279, "fips": 4205 }, { "wkid": 2283, "fips": 4501 }, { "wkid": 2284, "fips": 4502 }, { "wkid": 2285, "fips": 4601 }, { "wkid": 2286, "fips": 4602 }, { "wkid": 2287, "fips": 4801 }, { "wkid": 2288, "fips": 4802 }, { "wkid": 2289, "fips": 4803 }, { "wkid": 2965, "fips": 1301 }, { "wkid": 2966, "fips": 1302 }, { "wkid": 3089, "fips": 1600 }, { "wkid": 3417, "fips": 1401 }, { "wkid": 3418, "fips": 1402 }, { "wkid": 3419, "fips": 1501 }, { "wkid": 3420, "fips": 1502 }, { "wkid": 3421, "fips": 2701 }, { "wkid": 3422, "fips": 2702 }, { "wkid": 3423, "fips": 2703 }, { "wkid": 3424, "fips": 2900 }, { "wkid": 3433, "fips": "0301" }, { "wkid": 3434, "fips": "0302" }, { "wkid": 3435, "fips": 1201 }, { "wkid": 3436, "fips": 1202 }, { "wkid": 3437, "fips": 2800 }, { "wkid": 3438, "fips": 3800 }, { "wkid": 3451, "fips": 1701 }, { "wkid": 3452, "fips": 1702 }, { "wkid": 3453, "fips": 1703 }, { "wkid": 3455, "fips": 4002 }, { "wkid": 3560, "fips": 4301 }, { "wkid": 3566, "fips": 4302 }, { "wkid": 3567, "fips": 4303 }, { "wkid": 3734, "fips": 3401 }, { "wkid": 3735, "fips": 3402 }, { "wkid": 3736, "fips": 4901 }, { "wkid": 3737, "fips": 4902 }, { "wkid": 3738, "fips": 4903 }, { "wkid": 3739, "fips": 4904 }, { "wkid": 3759, "fips": 5103 }, { "wkid": 4457, "fips": 4001 }, { "wkid": 5646, "fips": 4400 }, { "wkid": 26847, "fips": 1801 }, { "wkid": 26848, "fips": 1802 }, { "wkid": 26849, "fips": 2201 }, { "wkid": 26850, "fips": 2202 }, { "wkid": 26851, "fips": 2203 }, { "wkid": 26852, "fips": 2600 }, { "wkid": 26853, "fips": 4701 }, { "wkid": 26854, "fips": 4702 }, { "wkid": 102629, "fips": "0101" }, { "wkid": 102630, "fips": "0102" }, { "wkid": 102631, "fips": 5001 }, { "wkid": 102632, "fips": 5002 }, { "wkid": 102633, "fips": 5003 }, { "wkid": 102634, "fips": 5004 }, { "wkid": 102635, "fips": 5005 }, { "wkid": 102636, "fips": 5006 }, { "wkid": 102637, "fips": 5007 }, { "wkid": 102638, "fips": 5008 }, { "wkid": 102639, "fips": 5009 }, { "wkid": 102640, "fips": 5010 }, { "wkid": 102648, "fips": "0201" }, { "wkid": 102649, "fips": "0202" }, { "wkid": 102650, "fips": "0203" }, { "wkid": 102661, "fips": 5101 }, { "wkid": 102662, "fips": 5102 }, { "wkid": 102664, "fips": 5104 }, { "wkid": 102665, "fips": 5105 }, { "wkid": 102688, "fips": 2111 }, { "wkid": 102689, "fips": 2112 }, { "wkid": 102690, "fips": 2113 }, { "wkid": 102696, "fips": 2401 }, { "wkid": 102697, "fips": 2402 }, { "wkid": 102698, "fips": 2403 }, { "wkid": 102700, "fips": 2500 }, { "wkid": 102720, "fips": 3301 }, { "wkid": 102721, "fips": 3302 }, { "wkid": 102726, "fips": 3601 }, { "wkid": 102727, "fips": 3602 }, { "wkid": 102733, "fips": 3900 }, { "wkid": 102761, "fips": 5200 }, { "wkid": 102766, "fips": 5400 }];
    // console.log('zones', zones)
    var map = new EsriMap({
        basemap: "streets",
        ground: "world-elevation"
    });
    var view = new MapView({
        map: map,
        container: "viewDiv",
        center: [-100, 40],
        zoom: 4,
    });
    view.when(function () {
        var dataStore = new Memory({
            idProperty: "ObjectID"
        });
        var layer = new FeatureLayer({
            fields: [
                {
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
                        color: [255, 64, 0, 0.4],
                        width: 7
                    }
                }
            }
        });
        map.add(layer);
        var statePlaneLayer = new FeatureLayer({
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_State_Plane_Zones_NAD83/FeatureServer/0',
        });
        map.add(statePlaneLayer);
        var columns = [
            {
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
        var grid = new (declare([OnDemandGrid, Keyboard, Selection, Editor]))({
            collection: dataStore,
            columns: columns,
        }, 'grid');
        grid.on("dgrid-datachange", function (event) {
            // console.log('event', event)
            var change = Object.assign({}, event.cell.row.data);
            change[event.cell.column.field] = event.value;
            // console.log('change', change)
            dataStore.put(change)
                .then(function (object) {
                // layer.source.put(object)
                console.log('updated ', object);
                // console.log('dataStore', dataStore)
                grid.refresh();
            });
        });
        // console.log('grid', grid)
        grid.startup();
        //
        var kmzInput = document.getElementById('kmzInput');
        // console.log('kmzInput', kmzInput)
        kmzInput.addEventListener('change', processKmz, false);
        function processKmz() {
            console.log('this', this.files[0]);
            // read the kmz
            // identify point features
            // for each point feature, pass to addPoint()
        }
        var addPoint = function (input) {
            map.ground.queryElevation(input, {
                returnSampleInfo: true,
                demResolution: 'finest-contiguous'
            })
                .then(function (elevationResult) {
                // console.log('elevationResult', elevationResult)
                // console.log('elevationResult.geomety', elevationResult.geometry)
                var query = statePlaneLayer.createQuery();
                // query.where = "STATE_NAME = 'Washington'";
                query.geometry = elevationResult.geometry;
                query.returnGeometry = false;
                query.outFields = ["ZONE", "ZONENAME", "FIPSZONE"];
                statePlaneLayer.queryFeatures(query).then(function (statePlaneResults) {
                    // console.log('statePlaneResults', statePlaneResults.get('features')[0].get('attributes'))
                    var thisFips = statePlaneResults.get('features')[0].get('attributes').FIPSZONE;
                    var testFips = thisFips.length < 4 ? "0".concat(thisFips.toString()) : thisFips;
                    // console.log('attributes', statePlaneResults.get('features')[0].get('attributes'))
                    // console.log('testFips', testFips)
                    var thisWkid = zones.find(function (z) { return z.fips.toString() === testFips.toString(); });
                    // console.log('thisWkid', thisWkid)
                    var thisSpatialReference = new SpatialReference(thisWkid);
                    // console.log('thisSpatialReference', thisSpatialReference)
                    var thisProjectedGeometry = Projection.project(elevationResult.geometry, thisSpatialReference);
                    // console.log('input', input)
                    var point = {
                        geometry: new Point({
                            x: input.get('longitude'),
                            y: input.get('latitude'),
                            z: elevationResult.geometry.z
                        }),
                        ObjectID: layer.source.length + 1,
                        name: "test " + (layer.source.length + 1),
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
                    layer.source.add(point);
                    dataStore.add(point);
                    console.log('dataStore', dataStore);
                    grid.refresh();
                    // grid.set("collection", dataStore)
                });
            });
        };
        Projection.load().then(function () {
            view.on('click', function (event) {
                // console.log('map.ground', map.ground.queryElevation(event.mapPoint))
                addPoint(event.mapPoint);
            });
        });
        // const scaleBar = new ScaleBar({
        // 	view: view,
        // 	unit: 'dual'
        // });
        // view.ui.add(scaleBar, {
        // 	position: "bottom-left"
        // })
    });
});
//# sourceMappingURL=main.js.map