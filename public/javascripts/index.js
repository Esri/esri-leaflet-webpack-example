const apiKey = "AAPKd36b03ce156d4c4480cb57f5cf9b492c7OcggZdLVitdlIx7gq6Joq8VTpGdFGeApQkOUMkKv7teFbwPn3IccZhb9i9Yz1EY";
const basemapEnum = "ArcGIS:Streets";

var map = L.map('map').setView([40, -95], 4);

L.esri.Vector.vectorBasemapLayer(basemapEnum, {
	apiKey: apiKey
}).addTo(map);

var geoJsonLayer = L.geoJSON()
	.bindPopup(layer => JSON.stringify(layer.feature.properties, null, '\t'))
	.addTo(map);

function addGeojson(geoJson){
	// console.log('geoJson', geoJson);
	geoJsonLayer.addData(geoJson);
	map.fitBounds(geoJsonLayer.getBounds());
}

var inputElement = document.createElement('input')
inputElement.setAttribute('type', 'file');
// inputElement.setAttribute('')
// var uploadForm = document.createElement('form');
inputElement.addEventListener('input', function(e){
	console.log(e.target.files);
	const formData = new FormData();
	// formData.append('file', e.target.files[0])
	fetch('kmztogeojson', {
		method: 'POST', 
		body: formData
	}).then(resp => resp.json())
	.then(addGeojson);
})

var uploadControl = L.control({position: 'topright'});

uploadControl.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'upload');
	div.append(inputElement)
	return div;
}

uploadControl.addTo(map)

