module.exports = {
    entry: './main.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
              test: /node_modules\/esri-leaflet/,
              loader: 'babel-loader?whitelist[]=es6.modules&loose[]=es6.modules'
            },
            {
              test: /node_modules\/esri-leaflet-geocoder/,
              loader: 'babel-loader?whitelist[]=es6.modules&loose[]=es6.modules'
            }
        ]
    }
};
