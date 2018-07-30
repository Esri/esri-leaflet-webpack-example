/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "dgrid/Grid", "esri/widgets/support/widget"], function (require, exports, __extends, __decorate, decorators_1, Widget, Grid, widget_1) {
    "use strict";
    var CSS = {
    // base: "esri-hello-world",
    // emphasis: "esri-hello-world--emphasis",
    // xyzTable: "xyzTable",
    // widgetDiv: "widgetDiv"
    };
    var XYZ = /** @class */ (function (_super) {
        __extends(XYZ, _super);
        function XYZ() {
            //----------------------------------
            //  layer
            //----------------------------------
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.layer = {};
            return _this;
        }
        // Public method
        XYZ.prototype.render = function () {
            var columns = {
                name: 'Name',
                y: 'Latitude',
                x: 'Longitude',
                z: 'Elevation (m)',
                zf: 'Elevation (ft)',
                e: 'Easting',
                n: 'Northing',
                dems: 'DEM Source',
                demr: 'DEM Resolution'
            };
            // const dataStore = new StoreAdapter({
            // 	objectStore: new Memory({
            // 		// objectId: '_OBJECTID',
            // 		data: this._generateGridData(this.layer.source)
            // 	})
            // })
            //
            // https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=highlight-features-by-geometry
            var grid = new Grid({
                columns: columns,
            }, 'grid');
            var columns = {
                name: 'Name',
                y: 'Latitude',
                x: 'Longitude',
                z: 'Elevation (m)',
                zf: 'Elevation (ft)',
                e: 'Easting',
                n: 'Northing',
                dems: 'DEM Source',
                demr: 'DEM Resolution'
            };
            var that = this;
            this.layer.source.on('change', function (e) {
                // grid.set('store', new Memory({
                // 	data: that._generateGridData(this.layer.source)
                // }))
                // console.log('event', e)
                // console.log("generated grid data", that._generateGridData(this.layer.source)
                // console.log('grid', grid)
                grid.refresh();
                grid.renderArray(that._generateGridData(this.layer.source));
            });
            return (widget_1.tsx("div", { class: "widgetContainer" },
                widget_1.tsx("div", { id: "grid" })));
        };
        XYZ.prototype._generateGridData = function (source) {
            // let dataArray = [];
            // console.log('source', source)
            return source.get('items').map(function (feature) {
                // let statePlaneCoords = this._getNorthingAndEasting(feature);
                // console.log('statePlaneCoords', statePlaneCoords)
                // console.log('feature', feature)
                return {
                    name: feature.get('attributes').name,
                    y: feature.get('geometry').get('y').toFixed(4),
                    x: feature.get('geometry').get('x').toFixed(4),
                    z: Math.floor(feature.get('geometry').get('z')),
                    zf: Math.floor(3.28084 * (feature.get('geometry').get('z'))),
                    e: feature.get('attributes').easting,
                    n: feature.get('attributes').northing,
                    dems: 'DEM Source',
                    demr: 'DEM Resolution'
                };
                // return featureObject
            });
        };
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], XYZ.prototype, "layer", void 0);
        XYZ = __decorate([
            decorators_1.subclass("esri.widgets.HelloWorld")
        ], XYZ);
        return XYZ;
    }(decorators_1.declared(Widget)));
    return XYZ;
});
//# sourceMappingURL=xyzWidget.js.map