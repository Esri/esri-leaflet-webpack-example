module.exports = {
    entry: './main.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
              test: function(path){
                var reg = new RegExp(/esri-leaflet\/src/);
                console.log(reg.test(path), path);
                return reg.test(path);
              },
              loader: 'babel-loader?whitelist[]=es6.modules&loose[]=es6.modules'
            },
            {
              test: function(path){
                var reg = new RegExp(/esri-leaflet-geocoder\/src/);
                console.log(reg.test(path), path);
                return reg.test(path);
              },
              loader: 'babel-loader?whitelist[]=es6.modules&loose[]=es6.modules'
            }
        ]
    }
};
