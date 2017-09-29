/*
 * Copyright 2017 Esri
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.​
 */
//
// require leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import E from 'esri-leaflet';
L.esri = E;
import LG from 'esri-leaflet-geocoder';
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css'
L.esri.geocoding = LG;
import GP from 'esri-leaflet-gp';
L.esri.GP = GP;
import toGeoJSON from '@mapbox/togeojson';
import 'leaflet.locatecontrol';
// L.control.locate = locationPlugin;
import 'font-awesome/css/font-awesome.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';

// since leaflet is bundled it won't be able to detect where the images are automatically
// solution is to point it to where you host the the leaflet images yourself
L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.2.0/dist/images/';

// create map
var map = L.map('map').setView([39, -98], 5);

// add basemap
L.esri.basemapLayer('Imagery', {}).addTo(map);

// optional labels layer
L.esri.basemapLayer('ImageryTransportation').addTo(map);
L.esri.basemapLayer('ImageryLabels').addTo(map);
var locationControl = L.control.locate({drawMarker: false}).addTo(map);
var searchControl = L.esri.geocoding.geosearch().addTo(map);

var elevationService = L.esri.GP.service({
    url: "http://elevation.arcgis.com/arcgis/rest/services/Tools/Elevation/GPServer/SummarizeElevation/",
	// proxy: "http://localhost:8888/PHP/proxy.php",
	proxy: "http://devgis.geoengineers.com/xyz_proxy/proxy.ashx",
	useCors: true,
	async: true,
	asyncInterval: 1.5,
	path: 'submitJob'
});

var markerGroup = L.featureGroup().addTo(map);
markerGroup.on('layeradd', function(e){
	// console.log('e', e.layer);
	getElevation(e.layer, this.getLayerId(e.layer));
	markerList.update();
})

markerGroup.on('layerremove', function(e){
	markerList.update();
})

var markerList = new L.Control({position: 'topright'});
markerList.onAdd = function(map){
	this._div = document.createElement('div');
	this._div.className = 'info';
	L.DomEvent.disableClickPropagation(this._div);
	L.DomEvent.disableScrollPropagation(this._div);
	var title = document.createElement('h2');
	title.innerHTML = 'XYZ Export Tool';
	var header = document.createElement('h4');
	var headInstructions = document.createElement('span');
	headInstructions.innerHTML = 'Click to add points or import KML: ';
	header.appendChild(headInstructions);
	var table = document.createElement('table');
	// table.className += ' table-scroll-body';
	var tableHeader = document.createElement('thead');
	var tableHeaderRow = document.createElement('tr');
	var column1 = document.createElement('th');
	column1.innerHTML = '#';
	var column2 = document.createElement('th');
	column2.innerHTML = 'Name';
	var column3 = document.createElement('th');
	column3.innerHTML = 'X (Longitude)';
	var column4 = document.createElement('th');
	column4.innerHTML = 'Y (Latitude)';
	var column5 = document.createElement('th');
	column5.innerHTML = 'Elevation (m)';
	var column6 = document.createElement('th');
	column6.innerHTML = 'Elevation (ft)';
	var column7 = document.createElement('th');
	column7.innerHTML = 'X';
	column7.setAttribute('id', 'delete');
	var column8 = document.createElement('th');
	column8.innerHTML = 'DEM Resolution';
	column8.className = 'hidden';
	this._tableBody = document.createElement('tbody');
	tableHeaderRow.appendChild(column1);
	tableHeaderRow.appendChild(column2);
	tableHeaderRow.appendChild(column3);
	tableHeaderRow.appendChild(column4);
	tableHeaderRow.appendChild(column5);
	tableHeaderRow.appendChild(column6);
	tableHeaderRow.appendChild(column7);
	tableHeaderRow.appendChild(column8);
	tableHeader.appendChild(tableHeaderRow);
	table.appendChild(tableHeader);
	table.appendChild(this._tableBody);
	var clearButton = document.createElement('button');
	clearButton.innerHTML = 'Clear markers';
	L.DomEvent.on(clearButton, 'click', function(ev){
		// console.log('test');
		clearEverything();
	});
	var exportButton = document.createElement('button');
	exportButton.innerHTML = 'Export as CSV';
	L.DomEvent.on(exportButton, 'click', function(ev){
		var rows = table.querySelectorAll('tr')
		exportAsCsv(rows)
	});
	exportButton.style.float = 'right';
	this._div.appendChild(title);
	this._div.appendChild(header);
	this._div.appendChild(table);
	this._div.appendChild(clearButton);
	this._div.appendChild(exportButton);
	var footerInfo = document.createElement('p');
	footerInfo.className = 'footerInfo';
	footerInfo.innerHTML = "<small>Horizontal coordinates (X,Y) reported in WGS 1984, decimal degrees. Elevation data obtained from DEMs via <a href='https://developers.arcgis.com/rest/elevation/api-reference/summarize-elevation.htm'>ESRI's Summarize Elevation</a> service. DEM resolution reported in CSV.</small>"
	this._div.appendChild(footerInfo);
	var importButton = document.createElement('input');
	importButton.type = 'file';
	importButton.id = 'fileUpload';
	importButton.accept = '.kml';
	// importButton.innerHTML = 'Upload GeoJSON, KML, GPX';
	importButton.onchange = 'importFile(this.files)';
	L.DomEvent.on(importButton, 'change', importFile, false);
	// importButton.style.float = 'right';
	header.appendChild(importButton);
	return this._div;
}

markerList.update = function(){
	// console.log('marker', marker);
	this.clearMarkers();
	var markers = markerGroup.getLayers();
	// console.log("markers", markers)
	for (var i=0;i<markers.length;i++){
		// console.log('marker id', markerGroup.getLayerId(markers[0]))
		// console.log('marker', markers[i])
		var newRow = document.createElement('tr');
		newRow.setAttribute('id', 'marker_' + markerGroup.getLayerId(markers[i]))
		var column1 = document.createElement('td');
		column1.innerHTML = this._tableBody.children.length + 1;
		var column2 = document.createElement('td');
		column2.setAttribute('id', 'name');
		var column2input = document.createElement('input');
		column2input.setAttribute('value', markers[i].name ? markers[i].name : '');
		column2input.setAttribute('placeholder', 'Optional name');
		column2input.setAttribute('tabindex', this._tableBody.children.length + 1);
		column2input.setAttribute('type', 'text');
		column2input.setAttribute('id', markerGroup.getLayerId(markers[i]));
		L.DomEvent.on(column2input, 'keyup', function(ev){
			updateName(this.id, this.value)
		}, false);
		column2.appendChild(column2input);
		var column3 = document.createElement('td');
		column3.innerHTML = markers[i].toGeoJSON().geometry.coordinates[0];
		var column4 = document.createElement('td');
		column4.innerHTML = markers[i].toGeoJSON().geometry.coordinates[1];
		var column5 = document.createElement('td');
		column5.setAttribute('id', 'elevation');
		column5.innerHTML = markers[i].elevation ? markers[i].elevation : 'Fetching...';
		var column6 = document.createElement('td');
		column6.setAttribute('id', 'elevation_ft');
		column6.innerHTML = markers[i].elevation_ft ? markers[i].elevation_ft : 'Fetching...';
		var column7 = document.createElement('td');
		column7.setAttribute('id', 'delete');
		var deleteButton = document.createElement('button');
		deleteButton.innerHTML = 'X';
		deleteButton.setAttribute('id', markerGroup.getLayerId(markers[i]));
		column7.appendChild(deleteButton);
		L.DomEvent.on(deleteButton, 'click', function(ev){
			deleteMarker(this.id);
		});
		var column8 = document.createElement('td');
		column8.className = 'hidden';
		column8.setAttribute('id', 'res');
		column8.innerHTML = markers[i].DEMResolution ? markers[i].DEMResolution : '';
		newRow.appendChild(column1);
		newRow.appendChild(column2);
		newRow.appendChild(column3);
		newRow.appendChild(column4);
		newRow.appendChild(column5);
		newRow.appendChild(column6);
		newRow.appendChild(column7);
		newRow.appendChild(column8);
		this._tableBody.appendChild(newRow);
	}
	// Add a marker to the table
}

markerList.clearMarkers = function(){
	this._tableBody.innerHTML = '';
	// Clear all markers from the table
}

markerList.uploadMarkers = function(){
	// Upload a file containing markers
}

markerList.addTo(map);

function clearEverything(){
	markerGroup.clearLayers();
	markerList.clearMarkers();
	markerList._div.querySelectorAll('#fileUpload')[0].setAttribute('value', '')
}

function deleteMarker(id){
	console.log('removing id', id);
	markerGroup.removeLayer(id);
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


function exportAsCsv(rows){
	var csv = [];
	for(var i=0;i < rows.length;i++) {
	    var cells = rows[i].querySelectorAll('td,th');
	    var csv_row = [];
	    for (var j=0;j<cells.length ;j++) { // - 1 to ignore delete cell
	        var txt;
			if (cells[j].getAttribute('id') !== 'delete'){
				if ((cells[j].nodeName == 'TD') && (cells[j].getAttribute('id') == 'name')) {
					txt = cells[j].querySelectorAll('input')[0].value;
				} else {
					txt = cells[j].innerText
				}
				csv_row.push(txt.replace(",", "-"));
			}
	    }
	    csv.push(csv_row.join(","));
	}
	var output = csv.join("\n")
	// output = 'data:text/csv;charset=utf-8,' + output;
	// console.log('csv output', output)
	var encodedUri = encodeURI(output);

	// Example:
	var now = new Date().toLocaleString();
	initiate_user_download('elevations_' + now + '.csv', 'text/csv', output);
	// window.open(encodedUri, 'Download');
}

function importFile(){
	var reader = new FileReader()
	reader.onload = (function(file) { processImport(file.target.result) });
	reader.readAsText(this.files[0]);
}

function processImport(result){
	var kml = (new DOMParser()).parseFromString(result, 'application/xml')
	var geoJson = toGeoJSON.kml(kml);
	geoJson.features.forEach(function(feature){
		// console.log("feature", feature)
		var latlng = L.latLng(feature.geometry.coordinates[1],feature.geometry.coordinates[0])
		var marker = L.marker(latlng, {draggable: true});
		marker.name = feature.properties.name;
		// console.log('marker', marker)
		marker.on('dragend', function(e){
			var thisId = markerGroup.getLayerId(marker);
			markerList._tableBody.querySelectorAll('tr#' + 'marker_' + thisId + ' #elevation')[0].innerHTML = 'Fetching...';
			markerList._tableBody.querySelectorAll('tr#' + 'marker_' + thisId + ' #elevation_ft')[0].innerHTML = 'Fetching...';
			getElevation(marker, thisId);
		});
		markerGroup.addLayer(marker);
	});

}

var addToList = function(marker){
	getElevation(marker);
}

function updateName(marker, value){
	var marker = markerGroup.getLayer(marker);
	marker.name = value;
}

var getElevation = function(marker, id){
	// console.log('layer', marker.toGeoJSON(), 'id', id);
	var elevationTask = elevationService.createTask();
	elevationTask.setParam('DEMResolution', 'FINEST');
	elevationTask.setParam('InputFeatures', marker.toGeoJSON());
	elevationTask.setParam('IncludeSlopeAspect', false);
	elevationTask.setOutputParam('OutputSummary');
	// elevationTask.token(token)
	elevationTask.run(elevationTaskCallback);

	function elevationTaskCallback(error, response){
		if (error) {
			getElevation(marker, id);
		} else {
			console.log('final esri response', response);
			// Gonna need an if statement in here to handle multiple features
			if (response.OutputSummary.features.length > 1){
				// Gots multiples
			} else {
				markerList._tableBody.querySelectorAll('tr#' + 'marker_' + id + ' #elevation')[0].innerHTML = response.OutputSummary.features[0].properties.MeanElevation;
				marker.elevation = response.OutputSummary.features[0].properties.MeanElevation;
				markerList._tableBody.querySelectorAll('tr#' + 'marker_' + id + ' #res')[0].innerHTML = response.OutputSummary.features[0].properties.DEMResolution;
				marker.DEMResolution = response.OutputSummary.features[0].properties.DEMResolution;
				markerList._tableBody.querySelectorAll('tr#' + 'marker_' + id + ' #elevation_ft')[0].innerHTML = (response.OutputSummary.features[0].properties.MeanElevation * 3.28084).toFixed(4);
				marker.elevation_ft = (response.OutputSummary.features[0].properties.MeanElevation * 3.28084).toFixed(4);
			}
		}
	}
}

map.on('click', function(e){
	// console.log('event', e);
	var marker = L.marker(e.latlng, {draggable: true});
	markerGroup.addLayer(marker);
	marker.on('dragend', function(e){
		var thisId = markerGroup.getLayerId(marker);
		markerList._tableBody.querySelectorAll('tr#' + 'marker_' + thisId + ' #elevation')[0].innerHTML = 'Fetching...';
		markerList._tableBody.querySelectorAll('tr#' + 'marker_' + thisId + ' #elevation_ft')[0].innerHTML = 'Fetching...';
		getElevation(marker, thisId);
	});
});
