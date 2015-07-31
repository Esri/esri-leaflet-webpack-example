# Esri Leaflet WebPack Example

Example of using [Esri Leaflet](http://esri.github.io/esri-leaflet) with [WebPack](http://webpack.github.io/)!

1. Install JSPM `npm install -g webpack`
2. Install a local web server `npm install -g http-server`
2. [Fork and clone this repo](https://help.github.com/articles/fork-a-repo)
3. `cd` into `esri-leaflet-webpack-example`
4. Install dependencies with `npm install`
5. Build the project with `webpack`
6. Start the web server `http-server .`
7. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Smaller Builds Using the Esri Leaflet Bundler

This sample includes 2 modules from [Esri Leaflet](https://github.com/Esri/esri-leaflet):

* `featureLayer`
* `basemapLayer`

and 3 modules from [Esri Leaflet Geocoder](https://github.com/Esri/esri-leaflet-geocoder):

* `geosearch`
* `arcgisOnlineProvider`
* `featureLayerProvider`

You can create a custom build that includes all of these modules with the [Esri Leaflet Bundler](http://github.com/esri/esri-leaflet-bundler). This will reduce the size of your build to from 61.81 kB (gzipped) to 55.17 kB (gzipped), an 11% reduction.

Then create a file called `esri-leaflet-custom-build.js` with the following contents:

```js
import {
  featureLayer,
  basemapLayer
} from 'esri-leaflet';

import {
  geosearch,
  arcgisOnlineProvider,
  featureLayerProvider
} from 'esri-leaflet-geocoder';

export default {
  featureLayer: featureLayer,
  basemapLayer: basemapLayer,
  geosearch: geosearch,
  arcgisOnlineProvider: arcgisOnlineProvider,
  featureLayerProvider: featureLayerProvider
};
```

Note that since will will compile this to ES 6 modules we can export not just the `default` export but exports for each individual module.

Then run `esri-leaflet-bundler esri-leaflet-custom-build.js -o esri-leaflet-custom.js --sourcemap inline --format cjs` to generate your custom build.

Then replace the references to `esri-leaflet` and `esri-leaflet` geocoder in your in `main.js` with references to your custom build:

```js
var esri = require('./esri-leaflet-custom');
var geocoding = require('./esri-leaflet-custom');
```

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/esri-leaflet-browserify-example/blob/master/CONTRIBUTING.md).

## Licensing
Copyright 2013 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](./LICENSE) file.

[](Esri Tags: ArcGIS Web Mapping Leaflet JSPM ES6 ES2015)
[](Esri Language: JavaScript)
