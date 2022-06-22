// var fs = require('fs').promises;
var express = require('express');
var router = express.Router();
var elevationQuery = require('./scripts/elevationQuery.js');

/* GET geojson with elevation listing. */
router.post('/', function (req, res, next) {
	let features = [req.body];
	elevationQuery(features)
		.then(el => {
			console.log('el.features', JSON.stringify(el, null, '\t'))
			let collection = {
				"type": "FeatureCollection",
				"features": el.value.features.map(f => ({
					"type": "Feature",
					"properties": f.attributes,
					"geometry": {
						"type": "Point",
						"coordinates": [
							f.geometry.x,
							f.geometry.y,
							f.attributes.MeanElevation
						]
					}
				}))
			}
			// let newMarker = {
			// 	"type": "Feature",
			// 	"properties": {
			// 		elevation_m: el.Elevation,
			// 		elevation_source: el.Data_Source
			// 	},
			// 	"geometry": {
			// 		"type": "Point",
			// 		"coordinates": [
			// 			req.body.lng,
			// 			req.body.lat,
			// 			el.Elevation
			// 		]
			// 	}
			// }
			res.send(collection)
		})
		.catch(err => {
			res.status(500)
			res.send(err);
		})


});

module.exports = router;
