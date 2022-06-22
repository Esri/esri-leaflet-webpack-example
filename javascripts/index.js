import * as utils from "https://unpkg.com/leaflet-kmz@latest/src/utils.js"
import zones from "/javascripts/wkid.js"

const apiKey = "AAPKd36b03ce156d4c4480cb57f5cf9b492c7OcggZdLVitdlIx7gq6Joq8VTpGdFGeApQkOUMkKv7teFbwPn3IccZhb9i9Yz1EY";
const basemapEnum = "ArcGIS:Streets";
const statePlaneLayer = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_State_Plane_Zones_NAD83/FeatureServer/0'

const map = L.map('map').setView([40, -95], 4);

const hash = new L.Hash(map);
const tableBodyContainer = document.getElementById('tableBody')
var statusContainer = L.DomUtil.create('p', 'alert alert-info mt-2 mb-0 p-2')

setStatus('Idle...')

var idd = 1;

function setStatus(status){
	statusContainer.innerText = status;
}

L.esri.Vector.vectorBasemapLayer(basemapEnum, {
	apiKey: apiKey
}).addTo(map);

// create the geocoding control and add it to the map
L.esri.Geocoding.geosearch({
	providers: [
		L.esri.Geocoding.arcgisOnlineProvider({
			// API Key to be passed to the ArcGIS Online Geocoding Service
			apikey: apiKey
		})
	]
}).addTo(map);

const geoJsonLayer = L.geoJSON(null, {
	onEachFeature: (feature, layer) => {
		console.log('layer', layer)
		// is this where the magic happens?
		feature.id = idd;
		if (!feature.properties.name) {
			feature.properties.name = `Point ${idd}`;
		}
		if (feature.geometry.type === 'Point'){
			setStatus('Calculating status plane coordinates...')

			getStatePlane(feature)
				.then(statePlaneResp => {
					feature.properties = {...feature.properties, ...statePlaneResp}
					geoJsonLayer.fire('featuresUpdated');
					setStatus('Fetching elevation...')
					return feature;
				})
				.then(getElevation)
				.then(elevationResp => {
					feature.properties = {...feature.properties, ...elevationResp.OutputSummary.features[0].properties}
					return feature;
				})
				.catch(err => console.log('error getting elevation', err))
				.finally(function () {
					geoJsonLayer.fire('featuresUpdated');
					
				})
		}
		idd++
	}
})
.bindPopup(layer => {
	let container = L.DomUtil.create('div', 'popContainer');
	Object.entries(layer.feature.properties).forEach(entry => {
		// console.log('entry', entry)
		let par = L.DomUtil.create('p', 'mt-0 mb-0')
		par.innerHTML = `<strong>${entry[0]}:</strong> ${entry[1]}`;
		container.append(par)
	})
	return container;
})
.addTo(map);

function addGeojson(geoJson) {
	// console.log('geoJson', geoJson);
	geoJsonLayer.addData(geoJson);
	map.fitBounds(geoJsonLayer.getBounds());
}

geoJsonLayer.on('featuresUpdated', (e) => {
	setStatus('Updating table...')
	let json = geoJsonLayer.toGeoJSON();
	
	// console.log('features updated', json)
	populateTable(json);
	setStatus('Idle...')
})

function populateTable(featureCollection){
	while(tableBodyContainer.firstChild) { tableBodyContainer.removeChild(tableBodyContainer.firstChild)}
	if (featureCollection.features.length){
		featureCollection.features.filter(f => f.geometry.type === 'Point').forEach((feat, i) => {
			let row = createRow(feat, i);
			tableBodyContainer.append(row);
		})
	}
}

function clearTable(){
	let clearRow = L.DomUtil.create('tr');
	let clearCell = L.DomUtil.create('td');
	clearCell.setAttribute('colspan', '10');
	clearCell.innerText = "No features";
	clearRow.append(clearCell)
	while(tableBodyContainer.firstChild) { tableBodyContainer.removeChild(tableBodyContainer.firstChild)}
	tableBodyContainer.append(clearRow)
}

function createRow(feature){
	function createCell(text, classes){
		let cell = L.DomUtil.create('td', classes);
		cell.innerText = text;
		return cell
	}

	let featureValues = getTableValues(feature)
	
	let row = L.DomUtil.create('tr');

	featureValues.forEach((val, i) => {
		// console.log('typeof val', typeof val, val)
		if (i === 0){
			let headerCell = L.DomUtil.create('th', 'text-start')
			headerCell.setAttribute('scope', 'row')
			headerCell.innerText = val;
			row.append(headerCell)
		} else {
			// If value is a number, align right, else align left
			row.append(createCell(val, typeof val === 'number' ? 'text-end' : 'text-start'))
		}
	})

	return row;
}

function getTableValues(f){
	return [
		f.id,
		f.properties.name ? f.properties.name : '',
		f.properties.northing ? parseInt(f.properties.northing) : '',
		f.properties.easting ? parseInt(f.properties.easting) : '',
		f.geometry.coordinates[0] ? Math.round(f.geometry.coordinates[0] * 1e4) / 1e4 : '',
		f.geometry.coordinates[1] ? Math.round(f.geometry.coordinates[1] * 1e4) / 1e4 : '',
		f.properties.MeanElevation ? parseInt(f.properties.MeanElevation * 3.28084) : '',
		f.properties.MeanElevation ? parseInt(f.properties.MeanElevation) : '',
		f.properties.zone ? `NAD83(ft) ${f.properties.zone}` : '',
		f.properties.Source ? f.properties.Source : '',
		f.properties.DEMResolution ? f.properties.DEMResolution : ''
	]
}

var inputElement = document.createElement('input')
inputElement.setAttribute('type', 'file');
inputElement.setAttribute('accept', '.kml,.kmz')
inputElement.classList.add('form-control', 'form-control-sm', 'mb-2')
// inputElement.setAttribute('')
// var uploadForm = document.createElement('form');
inputElement.addEventListener('input', function (e) {
	// console.log(e.target.files);
	parseFile(e.target.files[0]).then(json => {
		geoJsonLayer.addData(json);
		map.fitBounds(geoJsonLayer.getBounds());
		geoJsonLayer.fire('featuresUpdated');
	})
})

var clearButton = document.createElement('button')
clearButton.innerText = 'Clear all markers';
clearButton.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'col', 'ms-2')
clearButton.addEventListener('click', function (e) {
	geoJsonLayer.clearLayers();
	clearTable();
	inputElement.value = '';
});

// var inputElementGroup = document.createElement('div');
// inputElementGroup.classList.add('input-group', 'mb-2');
// inputElementGroup.append(inputElement, clearButton);

var addButton = document.createElement('button')
addButton.innerText = 'Add marker';
addButton.classList.add('btn', 'btn-primary', 'btn-sm', 'col')
addButton.addEventListener('click', function (e) {
	e.stopPropagation();
	enableEditMode();
})

function parseFile(file){
	// console.log('file', file.arrayBuffer())
	return file.arrayBuffer()
		.then(buf => {
			// console.log(buf)
			let str = String.fromCharCode(new Uint8Array(buf, 0, 1), new Uint8Array(buf, 1, 1));
			// console.log('str', str)
			if (str === 'PK'){
				return parseKmz(file)
			} else {
				return file.text().then(parseKml);
			}
		})
}

function parseKmz(file){
	// console.log("file", file)
	return utils.unzip(file).then(unzippedFiles => {
		// console.log('unzippedFiles', unzippedFiles)
		var kmlDoc = utils.getKmlDoc(unzippedFiles);
		var images = utils.getImageFiles(Object.keys(unzippedFiles));

		var kmlString = unzippedFiles[kmlDoc];
		// cache all images with their base64 encoding
		var props = {
			icons: images.reduce((obj, item) => {
				obj[item] = unzippedFiles[item];
				return obj;
			}, {})
		}

		return parseKml(kmlString, props)
	})
}

function parseKml(kmlString, props){
	// console.log("kmlString", kmlString)
	var xml = utils.toXML(kmlString)
	var geojson = utils.toGeoJSON(xml, props)
	// console.log('geojson', geojson)
	return geojson
}

function getElevation(feature) {
	const gpService = L.esri.GP.service({
		url: 'https://elevation.arcgis.com/arcgis/rest/services/Tools/Elevation/GPServer/SummarizeElevation',
		async: true,
		asyncInterval: 1,
		token: apiKey

	})
	// let inputFeature = L.marker(e.latlng).toGeoJSON();
	const gpTask = gpService.createTask();
	gpTask.setParam("DEMResolution", "FINEST")
	// gpTask.setParam("token", apiKey)
	gpTask.setOutputParam("OutputSummary")
	// gpTask.gpAsyncResultParam("token", apiKey)
	// gpTask.setParam("FeatureIDField", "Id")
	gpTask.setParam("InputFeatures", feature)
	return new Promise((resolve, reject) => {
		gpTask.run(function (error, response, raw) {
			// console.log('raw', raw)
			if (response) {
				resolve(response)
			} else if (error) {
				reject(error)
			}
		})
	})
}

const queryZone = (feature) => new Promise((resolve, reject) => {
	const query = L.esri.query({url: statePlaneLayer})
	query.contains(feature).run(function(error, featureCollection, response){
		if (error) {
			reject(error)
		}
		// console.log('query featureCollection', featureCollection)
		let props = featureCollection?.features?.[0]?.properties;
		let fipsFragment = props?.FIPSZONE
		// console.log('fipsFragment', !fipsFragment)
		if (!fipsFragment) { 
			resolve(false) 
		} else {
			let fips = fipsFragment.length < 4 ? "0".concat(fipsFragment.toString()) : fipsFragment;
			let wkid = zones.find(function(z){
				return z.fips.toString() === fips.toString()
			})
			props.wkid = wkid.wkid;
			resolve(props)
		}
	})
})

async function reproject(inWkid, outWkid, coordinates){
	try {
		let base = 'https://epsg.io'
		let inProjResp = await fetch(`${base}/${inWkid}.proj4`)
		// console.log('inProjResp', inProjResp)
		let inProj = await inProjResp.text();
		let outProjResp = await fetch(`${base}/${outWkid}.proj4`)
		let outProj = await outProjResp.text();
		// console.log(inProj, outProj, coordinates)
		let outCoords = proj4(inProj, outProj, coordinates)
		return outCoords;
	} catch (err){
		console.log('err', err)
	}
	
}

async function getStatePlane(feature) {
	const props = await queryZone(feature);
	if (props.wkid) {
		let newCoords = await reproject('4326', props.wkid, feature.geometry.coordinates);
		// console.log('newCoords', newCoords)
		return { northing: newCoords[1], easting: newCoords[0], zone: props.ZONENAME, wkid: props.wkid}
	} else {
		return false;
	}
}

function enableEditMode() {
	addButton.setAttribute('disabled', true);
	L.DomUtil.addClass(map._container, 'crosshair-cursor-enabled');
	map.on('click', function (e) {
		geoJsonLayer.addData(L.marker(e.latlng).toGeoJSON())
		geoJsonLayer.fire('featuresUpdated')
		// geoJsonLayer.addData(L.marker(e.latlng).toGeoJSON())
		disableEditMode()
	})
}

function disableEditMode() {
	addButton.removeAttribute('disabled');
	L.DomUtil.removeClass(map._container, 'crosshair-cursor-enabled');
	map.off('click')
}

var uploadControl = L.control({ position: 'topright' });

uploadControl.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'upload');
	div.append(inputElement)
	var buttonContainer = L.DomUtil.create('div', 'container')
	var buttonRow = L.DomUtil.create('div', 'row')
	buttonRow.append(addButton, clearButton)
	buttonContainer.append(buttonRow)
	div.append(buttonContainer)
	div.append(statusContainer)
	return div;
}

uploadControl.addTo(map)

function jsonToCsv(json){
	const csvRows = [];
	const headerRow = ['#', 'Name', 'Northing', 'Easting', 'Longitude', 'Latitude', 'Elevation (ft)', 'Elevation (m)', 'Horizontal Datum', 'DEM Source', 'DEM Resolution (m)']
 
    // As for making csv format, headers
    // must be separated by comma and
    // pushing it into array
    csvRows.push(headerRow.join(','));
	const rows = json.features.filter(f => f.geometry.type === 'Point').map(f => {
		return getTableValues(f).join(',');
	})
 
    csvRows.push(...rows)

    // Returning the array joining with new line
    return csvRows.join('\n')
}

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
	let json = geoJsonLayer.toGeoJSON()
	var csv = jsonToCsv(json);
	// var encodedUri = encodeURI(output);
	var now = new Date().toLocaleString();
	initiate_user_download('elevations_' + now + '.csv', 'text/csv', csv);
	// console.log('data to download eventually', data)
}


var downloadControl = L.control({position: 'topright'});
downloadControl.onAdd = function(map){
	var downloadButton = L.DomUtil.create('button', 'btn btn-secondary btn-sm');
	downloadButton.innerText = 'Download CSV';
	downloadButton.addEventListener('click', downloadCsv)
	return downloadButton;
}

downloadControl.addTo(map);