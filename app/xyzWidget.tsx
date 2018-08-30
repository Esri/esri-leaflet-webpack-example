/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import {subclass, declared, property} from "esri/core/accessorSupport/decorators";

import Widget = require("esri/widgets/Widget");
// import Collection = require("esri/core/Collection"):
import StoreAdapter = require("dstore/legacy/StoreAdapter");
import Memory = require("dojo/store/Memory");

import OnDemandGrid = require("dgrid/OnDemandGrid");
// import ColumnHider = require("dgrid/extensions/ColumnHider");
// import Selection = require("dgrid/Selection");
// import declare = require("dojo/_base/declare");

import Grid = require('dgrid/Grid');
import { renderable, tsx } from "esri/widgets/support/widget";

// console.log('OnDemandGrid', OnDemandGrid)

const CSS = {
  // base: "esri-hello-world",
  // emphasis: "esri-hello-world--emphasis",
  // xyzTable: "xyzTable",
  // widgetDiv: "widgetDiv"
};

@subclass("esri.widgets.HelloWorld")
class XYZ extends declared(Widget) {

	//----------------------------------
	//  dataStore
	//----------------------------------

	@property()
	@renderable()
	dataStore: object = {};

	@property()
	@renderable()
	layer: object = {};

	// Public method
	render() {
		console.log('this', this)
		let columns = {
			name: 'Name',
			y: 'Latitude',
			x: 'Longitude',
			z: 'Elevation (m)',
			zf: 'Elevation (ft)',
			e:	'Easting',
			n: 'Northing',
			h: 'Horizontal Datum',
			dems: 'DEM Source',
			demr: 'DEM Resolution (m)'
		};

		const grid = new OnDemandGrid({
			collection: this.dataStore,
			columns: columns,
		}, 'grid');

		let that = this;
		// this.dataStore.on('add', function(e){
		// 	// console.log('the store updated')
		// 	grid.set("collection", that.dataStore)
		// 	// grid.refresh();
		//
		// 	// grid.renderArray(that._generateGridData(this.layer.source));
		// })

	  	return (
			<div class="widgetContainer">
				<div id="grid"></div>
			</div>
		);
	}

	// private _generateGridData(source): object {
	// 	// let dataArray = [];
	// 	// console.log('source', source)
	// 	return source.get('items').map(function(feature){
	// 		// let statePlaneCoords = this._getNorthingAndEasting(feature);
	// 		// console.log('statePlaneCoords', statePlaneCoords)
	// 		// console.log('feature', feature)
	// 		return {
	// 			name: feature.get('attributes').name,
	// 		    y: feature.get('geometry').get('y').toFixed(4),
	// 		    x: feature.get('geometry').get('x').toFixed(4),
	// 		    z: Math.floor(feature.get('geometry').get('z')),
	// 			zf: Math.floor(3.28084 * (feature.get('geometry').get('z'))),
	// 			e: Math.floor(feature.get('attributes').easting),
	// 			n: Math.floor(feature.get('attributes').northing),
	// 			h: feature.get('attributes').statePlaneCoordSystem.name,
	// 			dems: feature.get('attributes').demSource,
	// 			demr: Math.round(feature.get('attributes').demResolution)
	// 		}
	// 		// return featureObject
	// 	})
	// }
}

export = XYZ;
