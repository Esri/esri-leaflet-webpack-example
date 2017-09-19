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

// since leaflet is bundled it won't be able to detect where the images are automatically
// solution is to point it to where you host the the leaflet images yourself
L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.2.0/dist/images/';
var token;
L.esri.post('https://www.arcgis.com/sharing/rest/oauth2/token/',
	{
	    json: true,
		'f': 'json',
		'client_id': 'XrLmKIBw5p7IgdR0',
		'client_secret': '927825522e864878a98e42373c5b3fa4',
		'grant_type': 'client_credentials',
		'expiration': '1440'
  	},
	function(error, response){
		if (error) throw error;
		console.log('esri app access token', response)
		token = response.access_token;
		buildMap();
	}
)

function buildMap(){

	// create map
	var map = L.map('map').setView([44.05, -121.3], 11);

	// add basemap
	L.esri.basemapLayer('Imagery', {}).addTo(map);

	// optional labels layer
	L.esri.basemapLayer('ImageryTransportation').addTo(map);
	L.esri.basemapLayer('ImageryLabels').addTo(map);
	var searchControl = L.esri.geocoding.geosearch().addTo(map);

	var elevationService = L.esri.GP.service({
	    url: "https://elevation.arcgis.com/arcgis/rest/services/Tools/Elevation/GPServer/SummarizeElevation",
		// userCors: false,
		async: true,
		path: 'submitJob'
	});

	var markerGroup = L.featureGroup().addTo(map);
	markerGroup.on('layeradd', function(e){
		// console.log('e', e.layer);
		getElevation(e.layer, this.getLayerId(e.layer));
		markerList.update();
	})

	var markerList = new L.Control({position: 'topright'});
	markerList.onAdd = function(map){
		this._div = L.DomUtil.create('div', 'info');
		L.DomEvent.disableClickPropagation(this._div);
		var header = document.createElement('h4');
		var headInstructions = document.createElement('span');
		this._loadingIndicator = document.createElement('span');
		headInstructions.innerHTML = 'Click to add points';
		header.appendChild(headInstructions);
		header.appendChild(this._loadingIndicator);
		var table = document.createElement('table');
		var tableHeader = document.createElement('thead');
		var tableHeaderRow = document.createElement('tr');
		var column1 = document.createElement('th');
		column1.innerHTML = '#';
		var column2 = document.createElement('th');
		column2.innerHTML = 'X (Longitude)';
		var column3 = document.createElement('th');
		column3.innerHTML = 'Y (Latitude)';
		var column4 = document.createElement('th');
		column4.innerHTML = 'Elevation (meters)';
		this._tableBody = document.createElement('tbody');
		tableHeaderRow.appendChild(column1);
		tableHeaderRow.appendChild(column2);
		tableHeaderRow.appendChild(column3);
		tableHeaderRow.appendChild(column4);
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
		this._div.append(header);
		this._div.append(table);
		this._div.append(clearButton);
		this._div.append(exportButton);
		return this._div;
	}

	markerList.update = function(){
		// console.log('marker', marker);
		this.clearMarkers();
		var markers = markerGroup.getLayers();

		for (var i=0;i<markers.length;i++){
			// console.log('marker id', markerGroup.getLayerId(markers[0]))
			// console.log('marker', markers[i])
			var newRow = document.createElement('tr');
			newRow.setAttribute('id', 'marker_' + markerGroup.getLayerId(markers[i]))
			var column1 = document.createElement('td');
			column1.innerHTML = this._tableBody.children.length + 1;
			var column2 = document.createElement('td');
			column2.innerHTML = markers[i].toGeoJSON().geometry.coordinates[0];
			var column3 = document.createElement('td');
			column3.innerHTML = markers[i].toGeoJSON().geometry.coordinates[1];
			var column4 = document.createElement('td');
			column4.setAttribute('id', 'elevation');
			column4.innerHTML = markers[i].elevation ? markers[i].elevation : 'Fetching...';
			newRow.appendChild(column1);
			newRow.appendChild(column2);
			newRow.appendChild(column3);
			newRow.appendChild(column4);
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
	}

	function exportAsCsv(rows){
		var csv = [];
		for(var i=0;i < rows.length;i++) {
		    var cells = rows[i].querySelectorAll('td,th');
		    var csv_row = [];
		    for (var j=0;j<cells.length;j++) {
		        var txt = cells[j].innerText;
		        csv_row.push(txt.replace(",", "-"));
		    }
		    csv.push(csv_row.join(","));
		}
		var output = csv.join("\n")
		output = 'data:text/csv;charset=utf-8,' + output;
		// console.log('csv output', output)
		var encodedUri = encodeURI(output);
		window.open(encodedUri);
	}

	var addToList = function(marker){
		getElevation(marker);
	}

	var getElevation = function(marker, id){
		// console.log('layer', marker, 'id', id);
		var elevationTask = elevationService.createTask();
		elevationTask.setParam('DEMResolution', 'FINEST');
		elevationTask.setParam('InputFeatures', marker.toGeoJSON());
		elevationTask.setParam('IncludeSlopeAspect', false);
		elevationTask.setOutputParam('OutputSummary');
		elevationTask.token(token)
		elevationTask.run(function(error, response, raw){
			// Gonna need an if statement in here to handle multiple features
			if (response.OutputSummary.features.length > 1){
				// Gots multiples
			} else {
				markerList._tableBody.querySelectorAll('tr#' + 'marker_' + id + ' #elevation')[0].innerHTML = response.OutputSummary.features[0].properties.MeanElevation;
				marker.elevation = response.OutputSummary.features[0].properties.MeanElevation;
			}
		})
	}

	map.on('click', function(e){
		// console.log('event', e);
		var marker = L.marker(e.latlng, {draggable: true});
		markerGroup.addLayer(marker);
		marker.on('dragend', function(e){
			var thisId = markerGroup.getLayerId(marker);
			markerList._tableBody.querySelectorAll('tr#' + 'marker_' + thisId + ' #elevation')[0].innerHTML = 'Fetching...';
			getElevation(marker, thisId);
		});
	});
}
