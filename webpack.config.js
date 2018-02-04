var path = require('path'),
    webpack = require('webpack'),
    uglify = require('uglifyjs-webpack-plugin');
/**
 * 常用变量
 */
const projectPath = __dirname;
const appPath = path.join(projectPath, "app");
const assetsPath = path.join(appPath, "assets");

 module.exports = {
    entry: path.join(projectPath, "js", "index.js"),
    output: {    
        path: assetsPath,
        filename: "js/tools.js"
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
                use: 'url-loader?limit=8000&name=[name]-[hash].[ext]&outputPath=img/&publicPath=assets/'
            }, 
        ]
    },   
    plugins: [
        // 打包内容里面全局jquery
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": 'jquery'
        }),
        // 压缩
        //new uglify()
    ]
};