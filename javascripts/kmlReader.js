/**
 * Author - Nick Blackwell
 * 
 * License - MIT
 *
 * Description - Defines a class, KmlReader which is a container for static kml parsing methods. 
 * 
 */

/**
 * KmlReader Class parses standard kml documents and returns objects representiong it's data. 
 * the optional transformations define the data within these objects, ie, documentTransform (for Geolive)
 * will create a Layer object from its contents, and pull out the items which will be transformed aswell as MapItems.
 * 
 * 
 * 
 */

'use strict';
class KmlReader {

    constructor(kml) {

        var me = this;

        if ((typeof kml) == 'string') {

            var parseXml;

            if (window.DOMParser) {
                parseXml = function(xmlStr) {
                    return (new window.DOMParser()).parseFromString(xmlStr, 'text/xml');
                };
            } else if (typeof window.ActiveXObject != 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
                parseXml = function(xmlStr) {
                    var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
                    xmlDoc.async = 'false';
                    xmlDoc.loadXML(xmlStr);
                    return xmlDoc;
                };
            } else {
                parseXml = function() {
                    return null;
                };
            }

            kml = parseXml(kml);

        }

        me._kml = kml;



        //replaces console.log which is not supported accross all browsers
        if (!window.JSConsoleWarn) {
            window.JSConsoleWarn = function() {};
        }
        if (!window.JSConsoleError) {
            window.JSConsoleError = function() {};
        }

    }
    parseDocuments(kml, callback) {
        var me = this;
        if (!callback) {
            callback = kml;
            kml = me._kml;
        }

        var documentData = me._filter(KmlReader.ParseDomDocuments(kml));
        Array.each(documentData, function(p, i) {
            callback(p, kml, documentData, i);
        });
        return me;
    } 
    parseFolders(kml, callback) {
        var me = this;
        if (!callback) {
            callback = kml;
            kml = me._kml;
        }
        var folderData = me._filter(KmlReader.ParseDomFolders(kml));
        Array.each(folderData, function(p, i) {
            callback(p, kml, folderData, i);
        });
        return me;
    } 
    parseMarkers(kml, callback) {
        var me = this;
        if (!callback) {
            callback = kml;
            kml = me._kml;
        }
        var markerData = me._filter(KmlReader.ParseDomMarkers(kml));
        Array.each(markerData, function(p, i) {
            callback(p, kml, markerData, i);
        });
        return me;
    }
    parsePolygons(kml, callback) {
        var me = this;
        if (!callback) {
            callback = kml;
            kml = me._kml;
        }
        var polygonData = me._filter(KmlReader.ParseDomPolygons(kml));
        Array.each(polygonData, function(p, i) {
            callback(p, kml, polygonData, i);
        });
        return me;
    }
    parseLines(kml, callback) {
        var me = this;
        if (!callback) {
            callback = kml;
            kml = me._kml;
        }
        var lineData = me._filter(KmlReader.ParseDomLines(kml));
        Array.each(lineData, function(p, i) {
            callback(p, kml, lineData, i);
        });
        return me;
    }
    parseGroundOverlays(kml, callback) {
        var me = this;
        if (!callback) {
            callback = kml;
            kml = me._kml;
        }
        var overlayData = me._filter(KmlReader.ParseDomGroundOverlays(kml));
        Array.each(overlayData, function(o, i) {
            callback(o, kml, overlayData, i);
        });
        return me;
    }
    parseNetworklinks(kml, callback) {
        var me = this;
        if (!callback) {
            callback = kml;
            kml = me._kml;
        }
        var linkData = me._filter(KmlReader.ParseDomLinks(kml));
        Array.each(linkData, function(p, i) {
            callback(p, kml, linkData, i);
        });
        return me;
    }
    _filter(a) {
        var me = this;
        var filtered = [];
        if (me._filters && a && a.length) {
            Array.each(a, function(item) {

                var bool = true;
                Array.each(me._filters, function(f) {
                    if (f(item) === false) {
                        bool = false;
                    }
                });
                if (bool) {
                    filtered.push(item);
                }
            });
            return filtered;
        }
        return a;
    }
    addFilter(filter) {
        var me = this;
        if (!me._filters) {
            me._filters = [];
        }
        me._filters.push(filter);
        return me;
    }

}

// KmlReader.implement(new Options());

KmlReader.ParseDomDocuments = function(xmlDom) {
    var docs = [];
    var docsDomNodes = xmlDom.getElementsByTagName('Document');
    var i;
    for (i = 0; i < docsDomNodes.length; i++) {
        var node = docsDomNodes.item(i);
        var docsData = Object.merge({}, KmlReader.ParseDomDoc(node), KmlReader.ParseNonSpatialDomData(node, {}));
        var transform = function(options) {
            return options;
        };
        docs.push(transform(docsData));
    }
    return docs;
};

KmlReader.ParseDomDoc = function(xmlDom) {
    return {};
};

KmlReader.ParseDomFolders = function(xmlDom) {
    var folders = [];
    var folderDomNodes = KmlReader.ParseDomItems(xmlDom, 'Folder');
    var i;
    for (i = 0; i < folderDomNodes.length; i++) {
        var node = folderDomNodes[i];
        var folderData = Object.append({
            type: 'folder'
        }, KmlReader.ParseDomFolder(node), KmlReader.ParseNonSpatialDomData(node, {}));
        var transform = function(options) {
            return options;
        };
        folders.push(transform(folderData));
    }
    return folders;
};

KmlReader.ParseDomDoc = function(xmlDom) {
    return {};
};

KmlReader.ParseDomLinks = function(xmlDom) {
    var links = [];
    var linkDomNodes = xmlDom.getElementsByTagName('NetworkLink');
    var i;
    for (i = 0; i < linkDomNodes.length; i++) {
        var node = linkDomNodes.item(i);
        var linkData = Object.merge({}, KmlReader.ParseDomLink(node), KmlReader.ParseNonSpatialDomData(node, {}));

        var transform = function(options) {
            return options;
        };
        links.push(transform(linkData));
    }
    return links;
};
KmlReader.ParseDomFolder = function(xmlDom) {
    return {};
};
KmlReader.ParseDomLink = function(xmlDom) {

    var urls = xmlDom.getElementsByTagName('href');
    var link = {
        type: 'link'
    };
    if (urls.length > 0) {
        var url = urls.item(0);
        link.url = KmlReader.Value(url);
    }
    return link;
};

KmlReader.ParseDomLines = function(xmlDom) {
    var lines = [];
    var lineDomNodes = KmlReader.ParseDomItems(xmlDom, 'LineString');
    var i;
    for (i = 0; i < lineDomNodes.length; i++) {

        var node = lineDomNodes[i];

        var polygonData = Object.append({
                type: 'line',
                lineColor: '#FF000000', // black
                lineWidth: 1,
                polyColor: '#77000000', //black semitransparent,
                coordinates: KmlReader.ParseDomCoordinates(node) //returns an array of GLatLngs
            },
            Object.append(
                KmlReader.ParseNonSpatialDomData(node, {}),
                KmlReader.ResolveDomStyle(KmlReader.ParseDomStyle(node), xmlDom)
            )
        );

        var rgb = KmlReader.KMLConversions.KMLColorToRGB(polygonData.lineColor);
        polygonData.lineOpacity = rgb.opacity;
        polygonData.lineColor = rgb.color;

        lines.push(polygonData);
    }

    return lines;
};

KmlReader.ParseDomGroundOverlays = function(xmlDom) {
    var lines = [];
    var lineDomNodes = KmlReader.ParseDomItems(xmlDom, 'GroundOverlay');
    var i;
    for (i = 0; i < lineDomNodes.length; i++) {

        var node = lineDomNodes[i];

        var polygonData = Object.append({
                type: 'imageoverlay',
                icon: KmlReader.ParseDomIcon(node),
                bounds: KmlReader.ParseDomBounds(node)
            },
            KmlReader.ParseNonSpatialDomData(node, {})
        );

        lines.push(polygonData);
    }

    return lines;
};

KmlReader.ParseDomPolygons = function(xmlDom) {
    var polygons = [];
    var polygonDomNodes = KmlReader.ParseDomItems(xmlDom, 'Polygon');

    var i;
    for (i = 0; i < polygonDomNodes.length; i++) {

        var node = polygonDomNodes[i];

        var polygonData = Object.append({
                type: 'polygon',
                fill: true,
                lineColor: '#FF000000', // black
                lineWidth: 1,
                polyColor: '#77000000', //black semitransparent,
                coordinates: KmlReader.ParseDomCoordinates(node) //returns an array of google.maps.LatLng
            },
            Object.append(
                KmlReader.ParseNonSpatialDomData(node, {}),
                KmlReader.ResolveDomStyle(KmlReader.ParseDomStyle(node), xmlDom)
            )
        );

        var lineRGB = KmlReader.KMLConversions.KMLColorToRGB(polygonData.lineColor);

        polygonData.lineOpacity = lineRGB.opacity;
        polygonData.lineColor = lineRGB.color;

        var polyRGB = KmlReader.KMLConversions.KMLColorToRGB(polygonData.polyColor);

        polygonData.polyOpacity = (polygonData.fill) ? polyRGB.opacity : 0;
        polygonData.polyColor = polyRGB.color;


        polygons.push(polygonData);
    }
    return polygons;
};

KmlReader.ParseDomMarkers = function(xmlDom) {
    var markers = [];
    var markerDomNodes = KmlReader.ParseDomItems(xmlDom, 'Point');
    var i;
    for (i = 0; i < markerDomNodes.length; i++) {
        var node = markerDomNodes[i];
        var coords = KmlReader.ParseDomCoordinates(node);
        var marker = Object.append({
            type: 'point'
        }, {
            coordinates: coords[0] //returns an array of google.maps.LatLng
        }, KmlReader.ParseNonSpatialDomData(node, {}));
        var icon = KmlReader.ParseDomStyle(node);
        if (icon.charAt(0) == '#') {
            icon = KmlReader.ResolveDomStyle(icon, xmlDom).icon;
        }
        if (icon) {
            marker.icon = icon; //better to not have any hint of an icon (ie: icon:null) so that default can be used by caller
        }
        markers.push(marker);
    }
    return markers;
};


KmlReader.ParseDomCoordinates = function(xmlDom) {
    var coordNodes = xmlDom.getElementsByTagName('coordinates');
    if (!coordNodes.length) {
        JSConsoleWarn(['KmlReader. DOM Node did not contain coordinates!', {
            node: xmlDom
        }]);
        return null;
    }
    var node = coordNodes.item(0);
    var s = KmlReader.Value(node);
    s = s.trim();
    var coordStrings = s.split(' ');
    var coordinates = [];
    Object.each(coordStrings, function(coord) {
        var c = coord.split(',');
        if (c.length > 1) {

            //JSConsole([c[1],c[0]]);
            coordinates.push([c[1], c[0]]);
        }

    });


    return coordinates;
};
KmlReader.ParseDomBounds = function(xmlDom) {
    var coordNodes = xmlDom.getElementsByTagName('LatLonBox');
    if (!coordNodes.length) {
        JSConsoleWarn(['KmlReader. DOM Node did not contain coordinates!', {
            node: xmlDom
        }]);
        return null;
    }
    var node = coordNodes.item(0);
    var norths = node.getElementsByTagName('north');
    var souths = node.getElementsByTagName('south');
    var easts = node.getElementsByTagName('east');
    var wests = node.getElementsByTagName('west');

    var north = null;
    var south = null;
    var east = null;
    var west = null;

    if (!norths.length) {
        JSConsoleWarn(['KmlReader. DOM LatLngBox Node did not contain north!', {
            node: xmlDom
        }]);
    } else {
        north = parseFloat(KmlReader.Value(norths.item(0)));
    }
    if (!souths.length) {
        JSConsoleWarn(['KmlReader. DOM LatLngBox Node did not contain south!', {
            node: xmlDom
        }]);
    } else {
        south = parseFloat(KmlReader.Value(souths.item(0)));
    }
    if (!easts.length) {
        JSConsoleWarn(['KmlReader. DOM LatLngBox Node did not contain east!', {
            node: xmlDom
        }]);
    } else {
        east = parseFloat(KmlReader.Value(easts.item(0)));
    }
    if (!wests.length) {
        JSConsoleWarn(['KmlReader. DOM LatLngBox Node did not contain west!', {
            node: xmlDom
        }]);
    } else {
        west = parseFloat(KmlReader.Value(wests.item(0)));
    }
    return {
        north: north,
        south: south,
        east: east,
        west: west
    };

};

KmlReader.ParseNonSpatialDomData = function(xmlDom, options) {
    var config = Object.merge({}, {
        maxOffset: 2
    }, options);

    var data = {
        name: '',
        description: null,
        tags: {}
    };
    var names = xmlDom.getElementsByTagName('name');
    var i;
    for (i = 0; i < names.length; i++) {
        if (KmlReader.WithinOffsetDom(xmlDom, names.item(i), config.maxOffset)) {
            data.name = (KmlReader.Value(names.item(i)));
            break;
        }
    }
    var descriptions = xmlDom.getElementsByTagName('description');
    for (i = 0; i < descriptions.length; i++) {
        if (KmlReader.WithinOffsetDom(xmlDom, descriptions.item(i), config.maxOffset)) {
            data.description = (KmlReader.Value(descriptions.item(i)));
            break;
        }
    }

    if (xmlDom.hasAttribute('id')) {
        data.id = parseInt(xmlDom.getAttribute('id'), 10);
    }

    var tags = {};
    var extendedDatas = xmlDom.getElementsByTagName('ExtendedData');
    for (i = 0; i < extendedDatas.length; i++) {
        if (KmlReader.WithinOffsetDom(xmlDom, extendedDatas.item(i), config.maxOffset)) {
            var j;
            for (j = 0; j < extendedDatas.item(i).childNodes.length; j++) {
                var c = extendedDatas.item(i).childNodes.item(j);
                var t = KmlReader.ParseTag(c);
                if (t.name != '#text') {
                    data.tags[t.name] = t.value;
                }
            }
        }
    }
    return data;
};

KmlReader.ParseTag = function(xmlDom) {
    var tags = {
        name: null,
        value: {}
    };
    switch (xmlDom.nodeName) {

        case 'Data': //TODO: add data tags...
        case 'data':
            break;
        case 'ID':
            tags.name = 'ID';
            tags.value = KmlReader.Value(xmlDom);
            break;
        default:
            tags.name = xmlDom.nodeName;
            tags.value = KmlReader.Value(xmlDom);
            break;
    }
    return tags;
};

KmlReader.WithinOffsetDom = function(parent, child, max) {
    var current = child.parentNode;
    for (var i = 0; i < max; i++) {
        if (current.nodeName == (typeof(parent) == 'string' ? parent : parent.nodeName)) {
            return true;
        }
        current = current.parentNode;
    }
    JSConsoleError(['KmlReader. Could not find parent node within expected bounds.', {
        parentNode: parent,
        childNode: child,
        bounds: max
    }]);
    return false;
};
KmlReader.ParseDomStyle = function(xmlDom, options) {

    var config = Object.merge({}, {
        defaultStyle: 'default'
    }, options);



    var styles = xmlDom.getElementsByTagName('styleUrl');
    var style = config.defaultStyle;
    if (styles.length == 0) {
        JSConsoleWarn(['KmlReader. DOM Node did not contain styleUrl!', {
            node: xmlDom,
            options: config
        }]);
    } else {
        var node = styles.item(0);
        style = (KmlReader.Value(node));
    }
    return style;
};
KmlReader.ParseDomIcon = function(xmlDom, options) {

    var config = Object.merge({}, {
        defaultIcon: false,
        defaultScale: 1.0
    }, options);



    var icons = xmlDom.getElementsByTagName('Icon');
    var icon = config.defaultStyle;
    var scale = config.defaultScale;
    if (icons.length == 0) {
        JSConsoleWarn(['KmlReader. DOM Node did not contain Icon!', {
            node: xmlDom,
            options: config
        }]);
    } else {
        var node = icons.item(0);
        var urls = node.getElementsByTagName('href');
        if (urls.length == 0) {
            JSConsoleWarn(['KmlReader. DOM Icon Node did not contain href!', {
                node: xmlDom,
                options: config
            }]);
        } else {
            var hrefNode = urls.item(0);
            icon = (KmlReader.Value(hrefNode));
        }

        var scales = node.getElementsByTagName('viewBoundScale');
        if (scales.length == 0) {
            JSConsoleWarn(['KmlReader. DOM Icon Node did not contain viewBoundScale!', {
                node: xmlDom,
                options: config
            }]);

        } else {
            var scaleNode = scales.item(0);
            scale = parseFloat(KmlReader.Value(scaleNode));
        }


    }
    return {
        url: icon,
        scale: scale
    };
};
KmlReader.ResolveDomStyle = function(style, xmlDom) {
    var data = {};
    var name = (style.charAt(0) == '#' ? style.substring(1, style.length) : style);
    var styles = xmlDom.getElementsByTagName("Style");
    var i;
    for (i = 0; i < styles.length; i++) {

        var node = styles.item(i);
        var id = node.getAttribute("id");
        if (id == name) {
            var lineStyles = node.getElementsByTagName('LineStyle');
            var polyStyles = node.getElementsByTagName('PolyStyle');
            var iconStyles = node.getElementsByTagName('href');
            if (lineStyles.length > 0) {
                var lineStyle = lineStyles.item(0);
                var colors = lineStyle.getElementsByTagName('color');
                if (colors.length > 0) {
                    var color = colors.item(0);
                    data.lineColor = KmlReader.Value(color);
                }
                var widths = lineStyle.getElementsByTagName('width');
                if (widths.length > 0) {
                    var width = widths.item(0);
                    data.lineWidth = KmlReader.Value(width);
                }
            }
            if (polyStyles.length > 0) {
                var polyStyle = polyStyles.item(0);
                var colors = polyStyle.getElementsByTagName('color');
                if (colors.length > 0) {
                    var color = colors.item(0);
                    data.polyColor = KmlReader.Value(color);
                }
                var outlines = polyStyle.getElementsByTagName('outline');
                if (outlines.length > 0) {
                    var outline = outlines.item(0);
                    var o = KmlReader.Value(outline);
                    data.outline = (o ? true : false);
                }
            }
            if (iconStyles.length > 0) {
                var iconStyle = iconStyles.item(0);
                var icon = KmlReader.Value(iconStyle);
                data.icon = icon;
            }
        }
    }
    return data;
};
KmlReader.ParseDomItems = function(xmlDom, tag) {
    var tagName = tag || 'Point';
    var items = [];
    var markerDomNodes = xmlDom.getElementsByTagName(tagName);
    var i;
    for (i = 0; i < markerDomNodes.length; i++) {
        var node = markerDomNodes.item(i);
        if (tag == "GroundOverlay") {
            items.push(node);
            continue;
        }
        var parent = (node.parentNode.nodeName == 'Placemark' ? node.parentNode : (node.parentNode.parentNode.nodeName == 'Placemark' ? node.parentNode.parentNode : null));
        if (parent == null) {
            JSConsoleError(['Failed to find ParentNode for Element - ' + tagName, {
                node: xmlDom
            }]);
            mm_trace();
        } else {
            items.push(parent);
        }
    }
    return items;
};

KmlReader.KMLConversions = {


    // KML Color is defined similar to RGB except it is in the opposite order and starts with opacity, 
    // #OOBBGGRR
    KMLColorToRGB: function(colorString) {
        var colorStr = colorString.replace('#', '');
        while (colorStr.length < 6) {
            colorStr = '0' + colorStr;
        } //make sure line is dark!
        while (colorStr.length < 8) {
            colorStr = 'F' + colorStr;
        } //make sure opacity is a large fraction
        if (colorStr.length > 8) {
            colorStr = colorStr.substring(0, 8);
        }
        var color = colorStr.substring(6, 8) + colorStr.substring(4, 6) + colorStr.substring(2, 4);
        var opacity = ((parseInt(colorStr.substring(0, 2), 16)) * 1.000) / (parseInt("FF", 16));

        var rgbVal = {
            color: '#' + color,
            opacity: opacity
        };

        return rgbVal;
    },
    RGBColorToKML: function(rgb, opacity) {

        var colorStr = rgb.replace('#', '');
        while (colorStr.length < 6) {
            colorStr = '0' + colorStr;
        } //make sure line is dark!
        if (colorStr.length > 6) {
            colorStr = colorStr.substring(0, 6);
        }

        if ((opacity != null)) {
            if (opacity >= 0.0 && opacity <= 1.0) {
                var opacityNum = opacity;
            } else if (parseInt(opacity) >= 0.0 && parseInt(opacity) <= 1.0) {
                var opacityNum = parseInt(opacity);
            }
        }
        if ((opacityNum == null)) {
            var opacityNum = 1.0;
        }

        var opacityNum = (opacityNum * 255.0);
        var opacityStr = opacityNum.toString(16);

        var kmlStr = opacityStr.substring(0, 2) + "" + colorStr.substring(4, 6) + colorStr.substring(2, 4) + colorStr.substring(0, 2);

        return kmlStr;
    }

};
KmlReader.Value = function(node) {
    var value = node.nodeValue;
    if (value) return value;
    var str = "";
    try {
        if (node.childNodes && node.childNodes.length) Object.each(KmlReader.ChildNodesArray(node), function(c) {
            str += KmlReader.Value(c);
        });
    } catch (e) {
        JSConsoleError(['SimpleKML Parser Exception', e]);
    }
    return str;
};

KmlReader.ChildNodesArray = function(node) {
    var array = [];
    if (node.childNodes && node.childNodes.length > 0) {
        var i = 0;
        for (i = 0; i < node.childNodes.length; i++) {
            array.push(node.childNodes.item(i));
        }

    }
    return array;
};